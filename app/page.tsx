// app/page.tsx
// app/page.tsx
'use client';

import { useEffect, useState } from "react";
import { sdk } from '@farcaster/frame-sdk';
import { TokenHeader } from "../components/TokenHeader";
import { StatsCard } from "../components/StatsCard";
import { UserDirectory } from "../components/UserDirectory";

// Mock data for the demo
const mockToken = "QUOTA";
const mockUsers = [
  { username: "alice", pfpUrl: "/placeholder-avatar.png", fcsScore: 87, connectedAccounts: 5, valueHeld: 1200, rewardsEarned: 320, miniappsCreated: 2, miniappsMentioned: 8 },
  { username: "bob", pfpUrl: "/placeholder-avatar.png", fcsScore: 92, connectedAccounts: 7, valueHeld: 2500, rewardsEarned: 450, miniappsCreated: 3, miniappsMentioned: 12 },
  { username: "charlie", pfpUrl: "/placeholder-avatar.png", fcsScore: 78, connectedAccounts: 4, valueHeld: 800, rewardsEarned: 180, miniappsCreated: 1, miniappsMentioned: 5 },
  { username: "dave", pfpUrl: "/placeholder-avatar.png", fcsScore: 95, connectedAccounts: 8, valueHeld: 3200, rewardsEarned: 560, miniappsCreated: 4, miniappsMentioned: 15 },
  { username: "eve", pfpUrl: "/placeholder-avatar.png", fcsScore: 83, connectedAccounts: 6, valueHeld: 1800, rewardsEarned: 400, miniappsCreated: 2, miniappsMentioned: 10 },
];

// Function to generate histogram data based on user scores
function generateHistogramData(users) {
  const bins = [
    { range: "0-20", count: 0 },
    { range: "21-40", count: 0 },
    { range: "41-60", count: 0 },
    { range: "61-80", count: 0 },
    { range: "81-100", count: 0 },
  ];
  
  users.forEach(user => {
    const score = user.fcsScore;
    if (score <= 20) bins[0].count++;
    else if (score <= 40) bins[1].count++;
    else if (score <= 60) bins[2].count++;
    else if (score <= 80) bins[3].count++;
    else bins[4].count++;
  });
  
  return bins;
}

export default function Home() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(mockToken);
  const [users, setUsers] = useState(mockUsers);
  const [avgScore, setAvgScore] = useState(0);
  const [histogramData, setHistogramData] = useState([]);

  // Update the stats when users change
  useEffect(() => {
    const newAvgScore = Math.round(users.reduce((sum, user) => sum + user.fcsScore, 0) / users.length);
    setAvgScore(newAvgScore);
    setHistogramData(generateHistogramData(users));
  }, [users]);

  // Initialize the app
  useEffect(() => {
    const initApp = async () => {
      try {
        // Get user information from context
        const context = await sdk.context;
        if (context?.user?.username) {
          setUsername(context.user.username);
        } else {
          // Fallback for development
          setUsername("dev_user");
        }
        
        // Hide splash screen when UI is ready
        if (sdk.actions && sdk.actions.ready) {
          await sdk.actions.ready();
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing app:", error);
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  // Handle token change
  const handleTokenChange = (newToken) => {
    setToken(newToken);
    // In a real app, we would fetch new data based on the token
    // For demo purposes, we'll just use the existing data
    setUsers([...mockUsers]);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      {/* Header */}
      <TokenHeader token={token} onTokenChange={handleTokenChange} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4 animate-pulse">
            <div className="h-8 w-64 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
            <div className="h-24 w-full bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          </div>
        ) : (
          <>
            {/* Welcome section */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">Welcome {username}</h2>
              <p className="text-lg mt-2">FCS Breakdown for Token: ${token}</p>
            </div>

            {/* Stats section */}
            <StatsCard avgScore={avgScore} histogramData={histogramData} />

            {/* Directory section */}
            <UserDirectory users={users} />
          </>
        )}
      </main>

      <footer className="bg-white dark:bg-gray-800 py-4 mt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-500 dark:text-gray-400">
          Powered by Palantir-esque Analytics
        </div>
      </footer>
    </div>
  );
}
