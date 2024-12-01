import Groq from "groq-sdk";
import environment from "dotenv";

// Load environment variables
environment.config();

const apiKey = process.env["GROQ_API_KEY"];

if (!apiKey) {
  throw new Error("The GROQ_API_KEY environment variable is missing or empty.");
}

// Initialize the Groq client
const client = new Groq({
  apiKey: apiKey,
  // Allow Groq usage in the browser only in non-production environments
  dangerouslyAllowBrowser: process.env.NODE_ENV !== "production",
});

export const getAISuggestion = async (prompt: string) => {
  try {
    const chatCompletion = await client.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }],
    });
    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error("Error generating AI suggestion:", error);
    return "Sorry, I couldn't generate a suggestion right now.";
  }
};
