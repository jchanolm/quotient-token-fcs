// app/pclanktesting/page.tsx
'use client';

import React from 'react';
import PclankTesting from '@/app/components/PClankTesting';

export default function PclankTestingPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
              PclankTesting Dashboard
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <PclankTesting />
      </main>
    </div>
  );
}