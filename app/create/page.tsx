"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, Loader2, ArrowLeft, Sparkles } from "lucide-react";
import dynamic from 'next/dynamic';
import EditDialog from '../components/EditDialog';
import SaveDialog from '../components/SaveDialog';
import { generatePDF } from "@/utils/pdfGenerator";
import Header from "../components/header";

const ReadmeViewer = dynamic(() => import('../components/ReadmeViewer'), {
  ssr: false
});

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface RoadmapVersion {
  content: string;
  timestamp: Date;
  prompt?: string;
}

const ChatBot: React.FC = () => {
  const { status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [roadmap, setRoadmap] = useState<{
    content: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [versions, setVersions] = useState<RoadmapVersion[]>([]);
  const [currentVersionIndex, setCurrentVersionIndex] = useState(0);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfMessage, setPdfMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <>
      <Header activeTab="Create" onTabChange={() => {}} />
      <div className="min-h-screen bg-gradient-to-b from-[#0d1117] to-[#161b22] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#8b949e]">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
      </>
    );
  }

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsTyping(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.message);
      } else {
        const newVersion: RoadmapVersion = {
          content: data,
          timestamp: new Date(),
          prompt: input
        };
        setVersions([newVersion]);
        setCurrentVersionIndex(0);
        setRoadmap({
          content: data.markdown
        });
      }
    } catch (err) {
      setError(
        `Failed to generate roadmap: ${
          err instanceof Error ? err.message : "Please try again."
        }`
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEditSubmit = async (editPrompt: string) => {
    try {
      const response = await fetch("/api/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: roadmap?.content,
          userPrompt: editPrompt
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.message);
      } else {
        const newVersion: RoadmapVersion = {
          content: data.response,
          timestamp: new Date(),
          prompt: editPrompt
        };
        setVersions([...versions, newVersion]);
        setCurrentVersionIndex(versions.length);
        setRoadmap({ content: data.response });
      }
    } catch (err) {
      setError(`Failed to edit roadmap: ${err instanceof Error ? err.message : "Please try again."}`);
    }
    setIsDialogOpen(false);
  };

  const handleVersionChange = (index: number) => {
    setCurrentVersionIndex(index);
    setRoadmap({ content: versions[index].content });
  };

  const handleSaveToDB = async (name: string) => {
    if (!roadmap?.content) return;
    setSaveLoading(true);
    setSaveMessage(null);
    try {
      const res = await fetch('/api/roadmaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, content: roadmap.content }),
      });
      if (res.ok) {
        setSaveMessage('Roadmap saved!');
      } else {
        setSaveMessage('Failed to save roadmap.');
      }
    } catch (err) {
      setSaveMessage('Failed to save roadmap.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSavePDF = async (name: string) => {
    if (roadmap?.content) {
      setPdfLoading(true);
      setPdfMessage(null);
      try {
        const pdf = generatePDF(roadmap.content, name);
        pdf.save(`${name.toLowerCase().replace(/\s+/g, '-')}-roadmap.pdf`);
        setPdfMessage('PDF downloaded!');
      } catch (err) {
        setPdfMessage('Failed to download PDF.');
      } finally {
        setPdfLoading(false);
        setTimeout(() => setPdfModalOpen(false), 1000);
      }
    }
  };

  return (
    <>
    <Header activeTab="Create" onTabChange={() => {}} />
    <div className="min-h-screen bg-gradient-to-b from-[#0d1117] to-[#161b22] overflow-auto">
      <AnimatePresence mode="wait">
        {roadmap ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-6xl mx-auto p-4 space-y-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRoadmap(null)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
                           text-[#c9d1d9] rounded-lg bg-[#21262d] hover:bg-[#30363d]
                           border border-[#30363d] transition-all duration-200 hover:scale-105"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Chat
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <select
                  value={currentVersionIndex}
                  onChange={(e) => handleVersionChange(Number(e.target.value))}
                  className="bg-[#21262d] text-[#c9d1d9] border border-[#30363d] 
                           rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 
                           focus:ring-blue-500 focus:border-transparent"
                >
                  {versions.map((version, index) => (
                    <option key={version.timestamp.toISOString()} value={index}>
                      Version {index + 1} - {version.timestamp.toLocaleString()}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setIsDialogOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
                           rounded-lg border transition-all duration-200 hover:scale-105
                           text-[#c9d1d9] bg-[#21262d] border-[#30363d] hover:bg-[#30363d]"
                >
                  Edit Roadmap
                </button>
                <button
                  onClick={() => setSaveModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
                           text-white rounded-lg bg-blue-600 hover:bg-blue-500
                           border border-blue-600 transition-all duration-200 hover:scale-105"
                >
                  Save
                </button>
                <button
                  onClick={() => setPdfModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
                           text-white rounded-lg bg-[#238636] hover:bg-[#2ea043]
                           border border-[#238636] transition-all duration-200 hover:scale-105"
                >
                  Download PDF
                </button>
              </div>
            </div>

            <div className="grid gap-6">
              <ReadmeViewer content={roadmap.content} />
            </div>

            <EditDialog
              isOpen={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
              onSubmit={handleEditSubmit}
              currentContent={roadmap.content}
              isLoading={isTyping}
            />

            <SaveDialog
              isOpen={saveModalOpen}
              onClose={() => { setSaveModalOpen(false); setSaveMessage(null); }}
              onSave={handleSaveToDB}
              content={roadmap?.content || ''}
              mode="db"
              loading={saveLoading}
              message={saveMessage}
              buttonLabel="Save"
            />
            <SaveDialog
              isOpen={pdfModalOpen}
              onClose={() => { setPdfModalOpen(false); setPdfMessage(null); }}
              onSave={handleSavePDF}
              content={roadmap?.content || ''}
              mode="pdf"
              loading={pdfLoading}
              message={pdfMessage}
              buttonLabel="Download PDF"
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center shadow-lg"
              >
                {error}
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto p-4"
          >
            <div className="bg-[#161b22] rounded-xl border border-[#30363d] shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-[#30363d] bg-gradient-to-r from-[#161b22] to-[#1c2128]">
                <div className="flex items-center justify-center gap-4">
                  <div className="relative">
                    <Bot className="w-10 h-10 text-[#58a6ff]" />
                    <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" />
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-[#58a6ff] to-[#79c0ff] bg-clip-text text-transparent">
                    AI Roadmap Generator
                  </h1>
                </div>
                <p className="mt-2 text-center text-[#8b949e] text-sm">
                  Describe your learning goals and get a personalized roadmap
                </p>
              </div>

              <div className="p-6 h-[60vh] flex flex-col">
                <div className="flex-1 overflow-auto space-y-4 mb-4 scrollbar-thin scrollbar-thumb-[#30363d] scrollbar-track-transparent">
                  {messages.length === 0 && (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-[#8b949e]">
                        <Bot className="w-12 h-12 mx-auto mb-4 text-[#58a6ff]" />
                        <p className="text-lg font-medium">Start a conversation</p>
                        <p className="text-sm mt-2">Describe your learning goals and timeline</p>
                      </div>
                    </div>
                  )}
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-2xl ${
                          message.sender === "user"
                            ? "bg-gradient-to-r from-[#238636] to-[#2ea043] text-white"
                            : "bg-[#21262d] text-[#c9d1d9] border border-[#30363d]"
                        } shadow-lg`}
                      >
                        {message.text}
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-[#21262d] text-[#c9d1d9] p-4 rounded-2xl border border-[#30363d] shadow-lg">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Generating roadmap...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Describe your learning goals and timeline..."
                    className="w-full h-32 bg-[#0d1117] text-[#c9d1d9] placeholder-[#8b949e] 
                             rounded-xl p-4 resize-none focus:outline-none focus:ring-2 
                             focus:ring-[#1f6feb] border border-[#30363d] shadow-lg
                             transition-all duration-200"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSend}
                    disabled={isTyping || !input.trim()}
                    className="absolute bottom-4 right-4 bg-gradient-to-r from-[#238636] to-[#2ea043] 
                             text-white rounded-lg px-6 py-2 flex items-center gap-2 
                             shadow-lg transition-all duration-200 disabled:opacity-50 
                             disabled:cursor-not-allowed hover:shadow-xl"
                  >
                    {isTyping ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center shadow-lg"
              >
                {error}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
};

export default ChatBot;
