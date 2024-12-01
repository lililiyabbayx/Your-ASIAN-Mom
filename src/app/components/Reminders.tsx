"use client";

import { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  Timestamp,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getAISuggestion } from "../../../lib/groq";
import React from "react";

interface Reminder {
  id: string;
  text: string;
  timestamp: Timestamp;
  naggingLevel: "mild" | "moderate" | "full";
}

export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newReminder, setNewReminder] = useState("");
  const [naggingLevel, setNaggingLevel] = useState<
    "mild" | "moderate" | "full"
  >("mild");
  const [naggingMessage, setNaggingMessage] = useState<string | null>(null); // Allow null as well

  useEffect(() => {
    const q = query(collection(db, "reminders"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReminders(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Reminder[]
      );
    });
    return unsubscribe;
  }, []);

  const addReminder = async () => {
    if (newReminder.trim()) {
      const reminder = {
        text: newReminder,
        timestamp: Timestamp.now(),
        naggingLevel: naggingLevel,
      };
      await addDoc(collection(db, "reminders"), reminder);
      setNewReminder("");
      const message = await getNaggingMessage(reminder);
      setNaggingMessage(message);
    }
  };

  const deleteReminder = async (id: string) => {
    await deleteDoc(doc(db, "reminders", id));
  };

  const getNaggingMessage = async (reminder: Omit<Reminder, "id">) => {
    const prompt = `Generate a nagging message from an Asian mom for the following reminder: "${reminder.text}". The nagging level is ${reminder.naggingLevel}. Make it short and funny.`;
    return await getAISuggestion(prompt);
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Mom&apos;s Reminders</h2>
      <div className="flex mb-4">
        <input
          type="text"
          className="flex-grow border rounded-l px-4 py-2"
          placeholder="Add a new reminder"
          value={newReminder}
          onChange={(e) => setNewReminder(e.target.value)}
          aria-label="New reminder"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition-colors"
          onClick={addReminder}
        >
          Add
        </button>
      </div>
      <div className="mb-4">
        <label htmlFor="naggingLevel" className="block mb-2">
          Nagging Level:
        </label>
        <select
          id="naggingLevel"
          className="border rounded px-4 py-2 w-full"
          value={naggingLevel}
          onChange={(e) =>
            setNaggingLevel(e.target.value as "mild" | "moderate" | "full")
          }
        >
          <option value="mild">Mild</option>
          <option value="moderate">Moderate</option>
          <option value="full">Full-On Mom Mode</option>
        </select>
      </div>
      {naggingMessage && (
        <div className="bg-yellow-100 p-3 rounded mb-4">
          <p>{naggingMessage}</p>
        </div>
      )}
      <ul className="space-y-2">
        {reminders.map((reminder) => (
          <li
            key={reminder.id}
            className="bg-gray-100 p-3 rounded flex justify-between items-center"
          >
            <div>
              <p>{reminder.text}</p>
              <p className="text-sm text-gray-500">
                {reminder.timestamp.toDate().toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => deleteReminder(reminder.id)}
              className="text-red-500 hover:text-red-700 transition-colors"
              aria-label="Delete reminder"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
