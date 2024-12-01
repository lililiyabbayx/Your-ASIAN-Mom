"use client";

import { useState } from "react";
import { db } from "../../../lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { getAISuggestion } from "../../../lib/groq";
import React from "react";

export default function DailyCheckIn() {
  const [activity, setActivity] = useState<string>(""); // Keep this as string, since activity will always be a string
  const [response, setResponse] = useState<string | null>(null); // Allow string or null for response
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activity.trim()) {
      setIsLoading(true);
      const checkIn = {
        activity: activity,
        timestamp: Timestamp.now(),
      };
      await addDoc(collection(db, "dailyCheckIns"), checkIn);
      const aiResponse = await getResponse(activity);
      setResponse(aiResponse ?? ""); // Ensure that null is replaced with an empty string if AI response is null
      setActivity("");
      setIsLoading(false);
    }
  };

  const getResponse = async (activity: string) => {
    const prompt = `Generate a response from an Asian mom to the following daily activity: "${activity}". Make it concise, caring, but with a touch of high expectations.`;
    return await getAISuggestion(prompt);
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Daily Check-In</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <label htmlFor="activity" className="block mb-2">
          What did you do today?
        </label>
        <textarea
          id="activity"
          className="w-full border rounded p-2 mb-2"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          rows={3}
        />
        <button
          type="submit"
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>
      {response && (
        <div className="bg-purple-100 p-3 rounded" role="alert">
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
