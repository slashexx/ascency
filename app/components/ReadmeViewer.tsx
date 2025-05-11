'use client';

import React, { useState } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkEmoji from 'remark-emoji';
import { File, ChevronDown, ChevronUp } from 'lucide-react';
import TypeWriter from './TypeWriter';
import { motion, AnimatePresence } from 'framer-motion';
import 'github-markdown-css/github-markdown.css';

interface ReadmeViewerProps {
  content: string;
}

const ReadmeViewer: React.FC<ReadmeViewerProps> = ({ content }) => {
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // Custom components for ReactMarkdown
  const components: Components = {
    // Add checkbox support
    li: ({ children, className, ...props }) => {
      if (className === 'task-list-item') {
        return (
          <li className="flex items-start gap-2 my-1" {...props}>
            <input type="checkbox" className="mt-1" defaultChecked={false} />
            {children}
          </li>
        );
      }
      return <li className="my-1" {...props}>{children}</li>;
    },
    // Enhanced heading styling
    h1: ({ children, ...props }) => (
      <h1 className="text-2xl font-bold mt-8 mb-4 text-[#c9d1d9] border-b border-[#30363d] pb-2" {...props}>{children}</h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className="text-xl font-semibold mt-6 mb-3 text-[#c9d1d9] border-b border-[#30363d] pb-2" {...props}>{children}</h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="text-lg font-medium mt-4 mb-2 text-[#c9d1d9]" {...props}>{children}</h3>
    ),
    // Enhanced link styling
    a: ({ children, href }) => (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-[#58a6ff] hover:underline"
      >
        {children}
      </a>
    ),
    // Code block styling
    //@ts-expect-error hello world world
    code: ({ inline, children, ...props }) => {
      if (inline) {
        return (
          <code className="px-1.5 py-0.5 rounded-md bg-[#21262d] text-[#c9d1d9] font-mono text-sm" {...props}>
            {children}
          </code>
        );
      }
      return (
        <pre className="p-4 rounded-lg bg-[#161b22] border border-[#30363d] overflow-x-auto">
          <code className="text-[#c9d1d9] font-mono text-sm" {...props}>
            {children}
          </code>
        </pre>
      );
    }
  };

  return (
    <div className="bg-[#0d1117] rounded-lg border border-[#30363d] overflow-hidden">
      <div 
        className="border-b border-[#30363d] p-4 flex items-center justify-between bg-[#161b22] cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <File className="w-4 h-4 text-[#8b949e]" />
          <span className="text-sm font-medium text-[#c9d1d9]">README.md</span>
        </div>
        {isExpanded ? 
          <ChevronUp className="w-4 h-4 text-[#8b949e]" /> : 
          <ChevronDown className="w-4 h-4 text-[#8b949e]" />
        }
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-8 markdown-body markdown-body-dark">
              {!isTypingComplete ? (
                <div className="prose prose-invert max-w-none">
                  <TypeWriter 
                    text={content} 
                    speed={1}
                    onComplete={() => setIsTypingComplete(true)}
                  />
                </div>
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkEmoji]}
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  components={components}
                >
                  {content}
                </ReactMarkdown>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReadmeViewer;
