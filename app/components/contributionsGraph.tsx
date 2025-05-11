'use client';

import React, { useState, useEffect } from 'react';

const generateMockData = (): number[][] => {
  const data = [];
  for (let i = 0; i < 52; i++) {
    const week = [];
    for (let j = 0; j < 7; j++) {
      week.push(Math.floor(Math.random() * 4));
    }
    data.push(week);
  }
  return data;
};

export default function ContributionsGraph() {
  const [contributionsData, setContributionsData] = useState<number[][]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = generateMockData();
    setContributionsData(data);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="font-semibold text-lg mb-4">Contributions</h2>
      <div className="overflow-x-auto w-full">
        <div className="grid" style={{ gridTemplateColumns: 'repeat(52, minmax(12px, 1fr))', gap: '4px' }}>
          {contributionsData.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-rows-7 gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`w-3 h-3 rounded-sm ${
                    day === 0 ? 'bg-gray-900' :
                    day === 1 ? 'bg-red-200' :
                    day === 2 ? 'bg-red-500' :
                    'bg-red-700'
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}