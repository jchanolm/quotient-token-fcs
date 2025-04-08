'use client';

import { useEffect, useState } from 'react';

export default function AverageFCS() {
  const [avgScore, setAvgScore] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAverageFCS = async () => {
      try {
        const response = await fetch('/api/average-fcs');
        const data = await response.json();
        setAvgScore(data.avg_score);
      } catch (error) {
        console.error('Error fetching average FCS:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAverageFCS();
  }, []);

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-2xl" 
         style={{ 
           backgroundColor: 'rgba(147, 51, 234, 0.08)', // Cooler, more translucent purple
           backdropFilter: 'blur(12px)',
           boxShadow: '0 4px 30px rgba(147, 51, 234, 0.1)'
         }}>
      <h2 className="text-xl font-semibold mb-4 text-indigo-500">Average FCS Score</h2>
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <div className="text-4xl font-bold text-indigo-600">
          {avgScore.toFixed(2)}
        </div>
      )}
    </div>
  );
} 