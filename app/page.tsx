'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { sdk } from '@farcaster/frame-sdk';

export default function Home() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const initApp = async () => {
      try {
        // Get user information from context
        const context = await sdk.context;
        if (context?.user?.username) {
          setUsername(context.user.username);
        }
        
        // Hide splash screen when UI is ready
        await sdk.actions.ready();
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing app:", error);
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gray-900 text-white">
      <main className="flex flex-col gap-[32px] row-start-2 items-center w-full max-w-md">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4 animate-pulse">
            <div className="h-8 w-64 bg-gray-700 rounded-md"></div>
            <div className="h-24 w-full bg-gray-800 rounded-lg"></div>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2 text-[#8A9BA8]">Welcome {username}</h1>
              <p className="text-xl mb-6">Your Farcaster Credibility Score is:</p>
              <div className="text-5xl font-bold text-[#137CBD] mb-4">
                {score}
              </div>
            </div>
            
            <div className="w-full bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
              <h2 className="text-lg font-medium text-[#8A9BA8] mb-4">Tokenholder Breakdown</h2>
            </div>
            
            <button className="mt-4 px-6 py-3 bg-[#137CBD] hover:bg-[#106BA3] rounded-full text-white font-medium transition-colors">
              View Detailed Analysis
            </button>
          </>
        )}
      </main>
      <footer className="row-start-3 text-xs text-gray-500">
        Powered by Palantir-esque Analytics
      </footer>
    </div>
  );
}
