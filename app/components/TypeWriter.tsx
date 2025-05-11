'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypeWriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

const TypeWriter: React.FC<TypeWriterProps> = ({ text, speed = 10, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {displayedText}
    </motion.span>
  );
};

export default TypeWriter;
