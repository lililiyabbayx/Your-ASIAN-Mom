"use client";

import { useState, useEffect } from "react";

export default function MomsWisdom() {
  const [wisdom, setWisdom] = useState<string | null>(""); // Allow wisdom to be a string or null
  const [isLoading, setIsLoading] = useState(false);

  const getNewWisdom = async () => {
    setIsLoading(true);
    const prompt =
      "Generate a piece of wisdom concise, short 2-3 line   as a mom from an Asian mom. Make it funny, slightly exaggerated, and related to success, education, or life in general.";

    try {
      const response = await fetch("/api/groq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch wisdom");
      }

      const data = await response.json();
      setWisdom(data.suggestion); // Set the response wisdom
    } catch (error) {
      console.error("Error fetching wisdom:", error);
      setWisdom("Sorry, I couldn't get wisdom right now.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getNewWisdom();
  }, []);

  return (
    <div className="card mb-8">
      <h2 className="text-2xl font-bold mb-4">Mom&apos;s Wisdom</h2>
      <div className="bg-yellow-100 p-4 rounded-lg mb-4">
        <p className="text-lg italic">{wisdom || "Loading mom's wisdom..."}</p>
      </div>
      <button
        onClick={getNewWisdom}
        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors w-full"
        disabled={isLoading}
      >
        {isLoading ? "Getting new wisdom..." : "Get New Wisdom"}
      </button>
    </div>
  );
}
