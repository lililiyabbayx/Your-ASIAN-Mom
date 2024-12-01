"use client";

import { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { getAISuggestion } from "../../../lib/groq";
import React from "react";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  timestamp: Timestamp;
}

export default function TaskAssignment() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch tasks from Firebase Firestore on component mount
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
      setTasks(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Task[]
      );
    });

    // Cleanup function to unsubscribe from Firestore on component unmount
    return () => unsubscribe();
  }, []);

  const addTask = async () => {
    if (newTask.trim()) {
      try {
        setIsLoading(true);
        await addDoc(collection(db, "tasks"), {
          text: newTask,
          completed: false,
          timestamp: Timestamp.now(),
        });
        setNewTask(""); // Clear input field after adding
      } catch (error) {
        console.error("Error adding task:", error);
        setMessage("Failed to add task, please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const deleteTask = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, "tasks", id));
      const prompt =
        "Generate a scolding message from an Asian mom for ignoring a task. Make it short and funny.";
      const aiMessage = await getAISuggestion(prompt);
      setMessage(aiMessage || "Please take care of your tasks!"); // Fallback message
    } catch (error) {
      console.error("Error deleting task:", error);
      setMessage("Failed to delete task, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const completeTask = async (id: string, completed: boolean) => {
    setIsLoading(true);
    try {
      await updateDoc(doc(db, "tasks", id), { completed });
      const prompt = completed
        ? "Generate a praising message from an Asian mom for completing a task. Make it short and encouraging, but with high expectations for the next task."
        : "Task incomplete. Please try to finish it!";
      const aiMessage = await getAISuggestion(prompt);
      setMessage(
        aiMessage ||
          (completed
            ? "Good job, but next time, do it even better!"
            : "Please finish your task!")
      );
    } catch (error) {
      console.error("Error updating task:", error);
      setMessage("Failed to update task, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Mom&apos;s Task List</h2>
      <div className="flex mb-4">
        <input
          type="text"
          className="flex-grow border rounded-l px-4 py-2"
          placeholder="Add a new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-r hover:bg-green-600 transition-colors"
          onClick={addTask}
          disabled={isLoading}
        >
          Add Task
        </button>
      </div>
      {message && (
        <div className="bg-yellow-100 p-3 rounded mb-4">
          <p>{message}</p>
        </div>
      )}
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="bg-gray-100 p-3 rounded flex justify-between items-center"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={(e) => completeTask(task.id, e.target.checked)}
                className="mr-2"
                disabled={isLoading}
              />
              <span className={task.completed ? "line-through" : ""}>
                {task.text}
              </span>
            </div>
            <div>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700 transition-colors mr-2"
                disabled={isLoading}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
