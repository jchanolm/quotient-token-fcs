// components/StatsCard.tsx
"use client";

interface StatsCardProps {
  avgScore: number;
  histogramData: { range: string; count: number }[];
}

export function StatsCard({ avgScore, histogramData }: StatsCardProps) {
  // Calculate total holders
  const totalHolders = histogramData.reduce((sum, item) => sum + item.count, 0);
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded mb-6">
      <div className="flex flex-col md:flex-row">
        {/* Big metric */}
        <div className="flex-1 text-center md:border-r border-gray-200 dark:border-gray-700 p-5">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
            Average FCS Score
          </h3>
          <div className="text-4xl font-light text-purple-600 dark:text-purple-400">
            {avgScore}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Based on {totalHolders} token holders
          </p>
        </div>
        
        {/* Histogram visualization */}
        <div className="flex-1 p-5">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wide text-center">
            Percentile Breakdown
          </h3>
          <div className="flex items-end h-24 gap-1">
            {histogramData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-purple-500 dark:bg-purple-400 transition-all duration-300 ease-in-out opacity-80"
                  style={{ 
                    height: `${Math.max(
                      (item.count / Math.max(...histogramData.map(d => d.count))) * 100, 
                      5
                    )}%` 
                  }}
                ></div>
                <div className="text-xs mt-1 text-gray-600 dark:text-gray-400">{item.range}</div>
                <div className="text-xs text-gray-500">{item.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}