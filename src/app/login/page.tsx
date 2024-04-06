"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import LoadingAnimation from "../loading/loading";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [emailError, setEmailError] = React.useState("");

  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      console.log("Login success", response.data);
      toast.success("Login success");
      router.push("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          console.log("Login failed", axiosError.response.data);
          toast.error(
            (axiosError.response.data as { message?: string })?.message ||
              "Login failed."
          );
        } else {
          console.log("Login failed", axiosError.message);
          toast.error(axiosError.message || "Login failed.");
        }
      } else {
        const errorObject = error as Error;
        console.log("Login failed", errorObject.message);
        toast.error(errorObject.message || "Login failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isValidEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
      user.email
    );
    const isValidPassword = user.password.length > 0;

    setButtonDisabled(!isValidEmail || !isValidPassword);

    // Check if email is valid, otherwise set error message
    if (user.email.length > 0 && !isValidEmail) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  }, [user]);

  return (
    <div className="flex w-full items-center justify-center min-h-screen bg-gray-900">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
          <LoadingAnimation />
        </div>
      )}
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-md backdrop-filter backdrop-blur-md z-10">
        <h1 className="text-2xl font-bold mb-6 text-white text-center">
          {loading ? "Processing" : "Login"}
        </h1>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block font-medium text-gray-300 mb-2"
          >
            Email
          </label>
          <input
            className="p-2 border border-gray-600 rounded-lg w-full bg-gray-700 text-white focus:outline-none focus:border-indigo-500"
            id="email"
            type="text"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Enter your email"
          />
          {emailError && <p className="text-red-500 mt-1">{emailError}</p>}
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block font-medium text-gray-300 mb-2"
          >
            Password
          </label>
          <input
            className="p-2 border border-gray-600 rounded-lg w-full bg-gray-700 text-white focus:outline-none focus:border-indigo-500"
            id="password"
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Enter your password"
          />
        </div>
        <button
          onClick={onLogin}
          className={`p-2 rounded-lg w-full focus:outline-none transition-colors duration-300 ${
            buttonDisabled
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-indigo-500 hover:bg-indigo-600 text-white"
          }`}
          disabled={buttonDisabled}
        >
          {buttonDisabled ? "No login" : "Login"}
        </button>
        <div className="mt-4 text-center">
          <Link
            href="/signup"
            className="text-indigo-400 hover:text-indigo-500"
          >
            Visit Signup page
          </Link>
        </div>
      </div>
    </div>
  );
}