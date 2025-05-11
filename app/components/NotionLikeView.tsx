'use client';

import React from 'react';

interface NotionLikeViewProps {
  error?: string;
}

const NotionLikeView: React.FC<NotionLikeViewProps> = ({ error }) => {
  if (error) {
    return (
      <div className="p-4 text-red-500 bg-[#161b22] rounded-lg border border-[#30363d]">
        {error}
      </div>
    );
  }

  return null; // Component no longer displays sections
};

export default NotionLikeView;
