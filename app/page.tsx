// app/page.tsx
'use client';

import { useEffect, useState } from "react";
import { sdk } from '@farcaster/frame-sdk';
import { TokenHeader } from "../components/TokenHeader";
import FCSMetricsContainer from "@/components/FCSMetricsContainer";

// Default token for initial load
const defaultToken = "QUOTA";
const defaultTokenAddress = "0x1abc02d9635a66adc4d0f5c177931ea69e9ef10";

export default function Home() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(defaultToken);
  const [tokenAddress, setTokenAddress] = useState(defaultTokenAddress);

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
    // In a real app, you would look up the address for the token
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Header */}
      <TokenHeader token={token} onTokenChange={handleTokenChange} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          <div className="animate-pulse text-center">
            <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded mx-auto mb-4"></div>
          </div>
        ) : (
          <>
            {/* Welcome section */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">Welcome {username}</h2>
              <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">FCS Breakdown for Token: ${token}</p>
            </div>

            {/* FCS Metrics - Using separated components */}
            <FCSMetricsContainer tokenAddress={tokenAddress} />
          </>
        )}
      </main>

      <footer className="bg-white dark:bg-gray-800 py-3 mt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-500 dark:text-gray-400">
          Powered by Quotient
        </div>
      </footer>
    </div>
  );
}