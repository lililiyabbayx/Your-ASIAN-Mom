"use client";

import { useState } from "react";
import { getAISuggestion } from "../../../lib/groq"; // Import from lib instead of api

export default function Advice() {
  const [advice, setAdvice] = useState<string | null>("");
  const [encouragement, setEncouragement] = useState<string | null>("");
  const [isLoading, setIsLoading] = useState(false);

  const getRandomAdvice = async () => {
    setIsLoading(true);
    const prompt =
      "Generate a piece of advice within 3 to 4 lines from an Asian mom. Make it short, funny, and slightly exaggerated.";
    try {
      const aiAdvice = await getAISuggestion(prompt);
      setAdvice(aiAdvice ?? "");
    } catch (error) {
      console.error("Error fetching advice:", error);
      setAdvice("Sorry, I couldn't get advice right now.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEncouragement = async () => {
    setIsLoading(true);
    const prompt =
      "Generate an encouraging message from an Asian mom. Make it supportive but with a touch of pressure to do better.";
    try {
      const aiEncouragement = await getAISuggestion(prompt);
      setEncouragement(aiEncouragement ?? "");
    } catch (error) {
      console.error("Error fetching encouragement:", error);
      setEncouragement("Sorry, I couldn't get encouragement right now.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Mom&apos;s Wisdom</h2>
      <div className="flex gap-2 mb-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          onClick={getRandomAdvice}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Get Advice"}
        </button>
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
          onClick={handleEncouragement}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Need Encouragement"}
        </button>
      </div>
      {advice && (
        <div className="bg-yellow-100 p-3 rounded mb-4" role="alert">
          <p>{advice}</p>
        </div>
      )}
      {encouragement && (
        <div className="bg-green-100 p-3 rounded" role="alert">
          <p>{encouragement}</p>
        </div>
      )}
    </div>
  );
}
