import "./globals.css";
import { Suspense } from "react";
import Layout from "../../src/app/components/Layout";
import Reminders from "../../src/app/components/Reminders";
import Advice from "../../src/app/components/Advice";
import DailyCheckIn from "../../src/app/components/DailyCheckIn";
import TaskAssignment from "../../src/app/components/TaskAssignment";
//import SilentMode from "../components/SilentMode";
//import Leaderboard from "../components/Leaderboard";
import GroceryList from "../../src/app/components/GroceryList";
import SleepTracker from "../../src/app/components/SleepTracker";
import MomsWisdom from "../../src/app/components/MomsWisdom";
import Loading from "../../src/app/components/Loading";
import React from "react";

export default function Home() {
  return (
    <Layout>
      <Suspense fallback={<Loading />}>
        <div className="space-y-8">
          <Reminders />
          <Advice />
          <DailyCheckIn />
          <TaskAssignment />
          {/* <SilentMode /> */}
          {/* <Leaderboard /> */}
          <GroceryList />
          <SleepTracker />
          <MomsWisdom />
        </div>
      </Suspense>
    </Layout>
  );
}
