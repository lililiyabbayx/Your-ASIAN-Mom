"use client";

import React from "react";
import { useState, useEffect } from "react";

export default function SleepTracker() {
  const [sleepTime, setSleepTime] = useState<Date | null>(null);
  const [wakeTime, setWakeTime] = useState<Date | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      if (now.getHours() >= 22 || now.getHours() < 6) {
        setMessage("It's late! You're ruining your health by staying up!");
      } else {
        setMessage("");
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const handleSleep = () => {
    setSleepTime(new Date());
    setWakeTime(null);
  };

  const handleWake = () => {
    setWakeTime(new Date());
  };

  const getSleepDuration = () => {
    if (sleepTime && wakeTime) {
      const duration =
        (wakeTime.getTime() - sleepTime.getTime()) / (1000 * 60 * 60);
      return duration.toFixed(1);
    }
    return null;
  };

  const getSleepMessage = () => {
    const duration = getSleepDuration();
    if (duration) {
      if (parseFloat(duration) < 7) {
        return "You didn't sleep enough! How will you focus on your studies?";
      } else if (parseFloat(duration) > 9) {
        return "You slept too much! There's so much to do, don't waste time!";
      } else {
        return "Good job getting enough sleep. Now go study!";
      }
    }
    return null;
  };

  return (
    <div className="card mb-8">
      <h2 className="text-2xl font-bold mb-4">Sleep Tracker</h2>
      <div className="space-y-4">
        <button
          onClick={handleSleep}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors w-full"
        >
          Going to Sleep
        </button>
        <button
          onClick={handleWake}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors w-full"
        >
          Waking Up
        </button>
        {sleepTime && <p>Sleep time: {sleepTime.toLocaleTimeString()}</p>}
        {wakeTime && <p>Wake time: {wakeTime.toLocaleTimeString()}</p>}
        {getSleepDuration() && <p>You slept for {getSleepDuration()} hours</p>}
        {getSleepMessage() && (
          <p className="font-bold text-purple-600">{getSleepMessage()}</p>
        )}
        {message && <p className="text-red-500 font-bold">{message}</p>}
      </div>
    </div>
  );
}
