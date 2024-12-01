// pages/api/groq.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getAISuggestion } from "../../lib/groq";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const suggestion = await getAISuggestion(prompt);
      res.status(200).json({ suggestion });
    } catch (error) {
      console.error("Error in API handler:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
