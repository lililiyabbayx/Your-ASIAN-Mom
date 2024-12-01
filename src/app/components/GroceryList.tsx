"use client";

import { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { getAISuggestion } from "../../../lib/groq";
import React from "react";

interface GroceryItem {
  id: string;
  name: string;
  timestamp: Timestamp;
}

export default function GroceryList() {
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [newItem, setNewItem] = useState("");
  const [advice, setAdvice] = useState<string | null>(null); // Updated state to allow string | null
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "groceryList"),
      (snapshot) => {
        setGroceryItems(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as GroceryItem[]
        );
      }
    );
    return unsubscribe;
  }, []);

  const addItem = async () => {
    if (newItem.trim()) {
      setIsLoading(true);
      await addDoc(collection(db, "groceryList"), {
        name: newItem,
        timestamp: Timestamp.now(),
      });
      const aiAdvice = await getItemAdvice(newItem);
      setAdvice(aiAdvice); // This will now accept both string and null
      setNewItem("");
      setIsLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    await deleteDoc(doc(db, "groceryList", id));
  };

  const getItemAdvice = async (item: string) => {
    const prompt = `Generate advice from an Asian mom about the health benefits of ${item} and a simple recipe suggestion. Keep it short and encouraging.`;
    return await getAISuggestion(prompt);
  };

  return (
    <div className="card mb-8">
      <h2 className="text-2xl font-bold mb-4">Mom&apos;s Grocery List</h2>
      <div className="flex mb-4">
        <input
          type="text"
          className="flex-grow border rounded-l px-4 py-2"
          placeholder="Add a grocery item"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-r hover:bg-green-600 transition-colors"
          onClick={addItem}
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add"}
        </button>
      </div>
      {advice && (
        <div className="bg-yellow-100 p-3 rounded mb-4">
          <p>{advice}</p>
        </div>
      )}
      <ul className="space-y-2">
        {groceryItems.map((item) => (
          <li
            key={item.id}
            className="flex justify-between items-center bg-gray-100 p-3 rounded"
          >
            <span>{item.name}</span>
            <button
              onClick={() => deleteItem(item.id)}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
