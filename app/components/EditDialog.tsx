'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';

interface EditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => Promise<void>;
  currentContent: string;
  isLoading?: boolean;
}

const EditDialog: React.FC<EditDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentContent,
  isLoading = false,
}) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(prompt);
    setPrompt('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg w-full max-w-2xl shadow-xl">
              <div className="flex items-center justify-between p-4 border-b border-[#30363d]">
                <h2 className="text-lg font-semibold text-[#c9d1d9]">Edit Roadmap</h2>
                <button
                  onClick={onClose}
                  className="text-[#8b949e] hover:text-[#c9d1d9] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#8b949e] mb-2">
                    Current Roadmap Preview:
                  </label>
                  <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 h-32 overflow-auto">
                    <pre className="text-xs text-[#8b949e] whitespace-pre-wrap">
                      {currentContent.slice(0, 500)}...
                    </pre>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#8b949e] mb-2">
                    Enter your suggestions for changes:
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the changes you want to make to the roadmap..."
                    className="w-full h-32 bg-[#0d1117] text-[#c9d1d9] placeholder-[#8b949e] 
                             rounded-lg p-3 resize-none focus:outline-none focus:ring-2 
                             focus:ring-[#1f6feb] border border-[#30363d]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-[#30363d]">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-[#c9d1d9] 
                             bg-[#21262d] rounded-lg hover:bg-[#30363d] 
                             border border-[#30363d] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="px-4 py-2 text-sm font-medium text-white rounded-lg
                             bg-[#238636] hover:bg-[#2ea043] border border-[#238636]
                             transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                             flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Update Roadmap'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditDialog;
