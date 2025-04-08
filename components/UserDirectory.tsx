// components/UserDirectory.tsx
"use client";

import { useState } from "react";

interface User {
  username: string;
  pfpUrl: string;
  fcsScore: number;
  connectedAccounts: number;
  valueHeld: number;
  rewardsEarned: number;
  miniappsCreated: number;
  miniappsMentioned: number;
}

interface UserDirectoryProps {
  users: User[];
}

export function UserDirectory({ users }: UserDirectoryProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleUserClick = (user: User) => {
    setSelectedUser(selectedUser === user ? null : user);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded overflow-hidden">
      <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          Token Holders Directory
        </h3>
      </div>
      
      {/* Table for desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 data-table">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">FCS Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Connected</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Value Held</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rewards</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Apps Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Apps Mentioned</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user, index) => (
              <tr 
                key={index} 
                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                onClick={() => handleUserClick(user)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden mr-3">
                      {/* Use placeholder for now */}
                      <div className="h-full w-full bg-emerald-100 dark:bg-blue-900 flex items-center justify-center text-emerald-800 dark:text-blue-200 font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="text-sm font-medium">@{user.username}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-emerald-600 dark:text-blue-400 font-medium">{user.fcsScore}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{user.connectedAccounts}</td>
                <td className="px-6 py-4 whitespace-nowrap">${user.valueHeld.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">${user.rewardsEarned.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.miniappsCreated}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.miniappsMentioned}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden">
        {users.map((user, index) => (
          <div key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            <div 
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              onClick={() => handleUserClick(user)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden mr-3">
                    <div className="h-full w-full bg-emerald-100 dark:bg-blue-900 flex items-center justify-center text-emerald-800 dark:text-blue-200 font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">@{user.username}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      FCS: <span className="text-emerald-600 dark:text-blue-400 font-medium">{user.fcsScore}</span>
                    </div>
                  </div>
                </div>
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            {/* Expanded card with recent casts */}
            {selectedUser === user && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Connected</div>
                    <div>{user.connectedAccounts}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Value Held</div>
                    <div>${user.valueHeld.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Rewards</div>
                    <div>${user.rewardsEarned.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Apps Created</div>
                    <div>{user.miniappsCreated}</div>
                  </div>
                </div>
                
                <div className="text-sm font-medium mb-2">Recent Casts</div>
                <div className="space-y-2">
                  <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-xs">
                    Just picked up some more $QUOTA! Bullish on this ecosystem.
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-xs">
                    Check out this new mini-app I made with $QUOTA integration: quotient.xyz/apps/{user.username}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}