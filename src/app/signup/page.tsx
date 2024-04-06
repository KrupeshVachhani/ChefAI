"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import LoadingAnimation from "@/app/loading/loading";

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
    username: "",
  });
  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const onSignup = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", user);
      console.log("Signup success", response.data);
      toast.success("Account created successfully!");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          console.log("Signup failed", axiosError.response.data);
          toast.error(
            (axiosError.response.data as { message?: string })?.message ||
              "Signup failed."
          );
        } else {
          console.log("Signup failed", axiosError.message);
          toast.error(axiosError.message || "Signup failed.");
        }
      } else {
        const errorObject = error as Error;
        console.log("Signup failed", errorObject.message);
        toast.error(errorObject.message || "Signup failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isValidEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
      user.email
    );
    const isValidUsername = /^[a-zA-Z0-9]+$/.test(user.username);
    const isValidPassword = user.password.length >= 8;

    if (isValidEmail && isValidUsername && isValidPassword) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen py-2 bg-gray-900">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
          <LoadingAnimation />
        </div>
      )}
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-md backdrop-filter backdrop-blur-md z-10">
        <h1 className="text-2xl font-bold mb-6 text-white">
          {loading ? "Processing" : "Signup"}
        </h1>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block font-medium text-gray-300 mb-2"
          >
            Username
          </label>
          <input
            className="p-2 border border-gray-600 rounded-lg w-full bg-gray-700 text-white focus:outline-none focus:border-indigo-500"
            id="username"
            type="text"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            placeholder="Enter your username"
          />
          {user.username.length > 0 &&
            !/^[a-zA-Z0-9]+$/.test(user.username) && (
              <p className="text-red-500 mt-1">
                Username must contain only letters and numbers.
              </p>
            )}
        </div>
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
          {user.email.length > 0 &&
            !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(user.email) && (
              <p className="text-red-500 mt-1">
                Please enter a valid email address.
              </p>
            )}
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
          {user.password.length > 0 && user.password.length < 8 && (
            <p className="text-red-500 mt-1">
              Password must be at least 8 characters long.
            </p>
          )}
        </div>
        <button
          onClick={onSignup}
          className={`p-2 rounded-lg w-full focus:outline-none transition-colors duration-300 ${
            buttonDisabled
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-indigo-500 hover:bg-indigo-600 text-white"
          }`}
          disabled={buttonDisabled}
        >
          {buttonDisabled ? "No signup" : "Signup"}
        </button>
        <div className="mt-4 text-center">
          <Link href="/login" className="text-indigo-400 hover:text-indigo-500">
            Visit login page
          </Link>
        </div>
      </div>
    </div>
  );
}
