"use client";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import "./chef.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import { InfinitySpin } from "react-loader-spinner";

const RecipiesAI: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipeResponse, setRecipeResponse] = useState<string>("");
  const [showRecipeResponse, setShowRecipeResponse] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInput(e.target.value);
  };

  const handleButtonClick = async (): Promise<void> => {
    const trimmedInput = input.trim();
    if (trimmedInput !== "") {
      if (ingredients.includes(trimmedInput)) {
        toast.warn(`${trimmedInput} is already in your list.`);
        setInput("");
      } else {
        setIngredients([...ingredients, trimmedInput]);
        setInput("");
        console.log("Gemini started");
      }
    }
  };

  const handleRemoveIngredient = (index: number): void => {
    const updatedIngredients = [...ingredients];
    updatedIngredients.splice(index, 1);
    setIngredients(updatedIngredients);
  };

  const handleGenerateRecipe = async (): Promise<void> => {
    console.log("Ingredients:", ingredients);
    setLoading(true);

    // Run Gemini LangChain code
    const model = new ChatGoogleGenerativeAI({
      modelName: "gemini-pro",
      maxOutputTokens: 2048,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
      ],
      apiKey: "AIzaSyAUbUbnbJfXue2xovcpGaWrZIve07EetAk", // Replace with your actual API key
    });

    const prompt = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Recipe Prompt</title>
          <style>
            /* Add your CSS styling here */
            body {
              font-family: Arial, sans-serif;
              color
            }
            .recipe-container {
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
              background-color: #f9f9f9;
            }
            h2 {
              color: #333;
            }
            p {
              margin-bottom: 10px;
            }
            /* Add more styles as needed */
          </style>
        </head>
        <body>
          <div class="recipe-container">
            <h2>Recipe Prompt</h2>
            <p><b>Ingredients:</b> ${ingredients.join(", ")}</p>
            <p>you are restricted to use only given ingredients only do not include by your self.Don't include any other messages just related to work because that can harm my designing.  Please provide a vegetarian recipe using only these ingredients. Include the dish name, cooking time, instructions on how to cook, and any additional information, such as where the dish is famous (if applicable). If there are any non-vegetarian ingredients in the list, please exclude them and provide a recipe using only the vegetarian ingredients. Also, please format the response in HTML for display on a website.</p>
          </div>
        </body>
        </html>
      `;

    try {
      const res = await model.invoke([["human", prompt]]);
      // setRecipeResponse(res.content);
      let recipeText = "";

  if (Array.isArray(res.content)) {
    const firstMessage = res.content[0];

    // Use a type guard to check for MessageContentText
    if (typeof firstMessage === "string") {
      recipeText = firstMessage;
    } else {
      // Handle other potential types within the array
      console.warn("Unexpected message type in array:", firstMessage);
    }
  } else if (typeof res.content === "string") {
    recipeText = res.content;
  } else {
    console.warn("Unexpected response format:", res.content);
  }

  setRecipeResponse(recipeText);
      setShowRecipeResponse(true);
      setIngredients([]); // Clear the ingredients list
    } catch (error) {
      console.error("Error fetching recipe:", error);
      toast.error("An error occurred while fetching the recipe.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddIngredients = (): void => {
    setShowRecipeResponse(false);
    setRecipeResponse("");
  };

  const router = useRouter();
  const handleLogout = async () => {
    // Implement your logout logic here
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      router.push("/login");
      router.refresh(); // Refresh the page to trigger redirection
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="full-screen-container">
      <div className="logout-button" onClick={handleLogout}>
        Logout
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-backdrop"></div>
          <div className="loading-spinner">
            <InfinitySpin width="400" color="#1f2937" />
          </div>
        </div>
      )}

      <main className="app">
        <div className="container">
          {!showRecipeResponse && (
            <div className="input-container">
              <input
                type="text"
                placeholder="Enter your available ingredients..."
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleButtonClick();
                  }
                }}
                disabled={loading}
              />
              <button onClick={handleButtonClick} disabled={loading}>
                {loading ? "Loading..." : "Add Ingredient"}
              </button>
            </div>
          )}
          <div className="ingredients-list">
            {ingredients.map((ingredient, index) => (
              <div className="ingredient-item" key={index}>
                <label>{ingredient}</label>
                <button
                  onClick={() => handleRemoveIngredient(index)}
                  disabled={loading}
                >
                  &#10005;
                </button>
              </div>
            ))}
          </div>
          {ingredients.length > 0 && !showRecipeResponse && (
            <>
              <button
                className="generate-recipe-btn"
                onClick={handleGenerateRecipe}
                disabled={loading}
              >
                {loading ? "Loading..." : "Generate Recipe"}
              </button>
            </>
          )}
          {showRecipeResponse && (
            <div className="recipe-response-container">
              <div className="recipe-response-wrapper">
                <div
                  className="recipe-response"
                  dangerouslySetInnerHTML={{ __html: recipeResponse }}
                />
              </div>
              <button
                className="add-ingredients-btn"
                onClick={handleAddIngredients}
                disabled={loading}
              >
                Make more recipes
              </button>
            </div>
          )}
        </div>
        <ToastContainer />
      </main>
    </div>
  );
};

export default RecipiesAI;
