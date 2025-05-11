"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown } from "lucide-react";

import Header from "./components/header";
import Profile from "./components/profile";
import RepositoryCard from "./components/repositoryCard";
import ReadmeViewer from "./components/ReadmeViewer";
import ContributionsGraph from "./components/contributionsGraph";
import ActivityFeed from "./components/activityFeed";
import Footer from "./components/footer";
import Avatar from "./components/Avatar";

const FILTER_BUTTONS = [
  { label: "Type", value: "All" },
  { label: "Language", value: "Any" },
  { label: "Sort", value: "Last updated" },
];

const RepositorySection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoadmap, setSelectedRoadmap] = useState<any | null>(null);

  useEffect(() => {
    async function fetchRoadmaps() {
      setLoading(true);
      try {
        const res = await fetch("/api/roadmaps");
        const data = await res.json();
        setRoadmaps(data.roadmaps || []);
      } catch (err) {
        setRoadmaps([]);
      } finally {
        setLoading(false);
      }
    }
    fetchRoadmaps();
  }, []);

  const filteredRoadmaps = roadmaps.filter(rm =>
    rm.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find a roadmap..."
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-slate-900/40 backdrop-blur-sm
                     border border-slate-700/50 text-slate-100 placeholder-slate-400
                     focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20
                     transition-all duration-200"
          />
        </div>

        {FILTER_BUTTONS.map(({ label, value }) => (
          <button
            key={label}
            className="h-10 px-4 rounded-lg text-sm font-medium whitespace-nowrap
                     inline-flex items-center gap-2 bg-slate-900/40 backdrop-blur-sm
                     border border-slate-700/50 text-slate-300 hover:text-slate-100
                     hover:bg-slate-800/40 hover:border-slate-600/50
                     focus:outline-none focus:ring-2 focus:ring-blue-500/20
                     transition-all duration-200"
          >
            {label}: {value}
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-slate-400 py-8">Loading roadmaps...</div>
      ) : filteredRoadmaps.length === 0 ? (
        <div className="text-center text-slate-400 py-8">
          No roadmaps found. Create your first roadmap!
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRoadmaps.map((roadmap) => (
            <div key={roadmap._id} className="bg-slate-900/40 rounded-lg p-4 border border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold text-slate-100">{roadmap.name}</div>
                  <div className="text-xs text-slate-400">{new Date(roadmap.createdAt).toLocaleString()}</div>
                </div>
                <button
                  className="text-blue-400 hover:underline text-sm"
                  onClick={() => setSelectedRoadmap(selectedRoadmap?._id === roadmap._id ? null : roadmap)}
                >
                  {selectedRoadmap?._id === roadmap._id ? 'Hide' : 'View'}
                </button>
              </div>
              {selectedRoadmap?._id === roadmap._id && (
                <div className="mt-4">
                  <ReadmeViewer content={roadmap.content} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const OverviewSection = () => (
  <div className="space-y-8">
    <div className="bg-slate-900/40 rounded-lg p-6 border border-slate-700/50">
      <h2 className="text-xl font-semibold mb-4">Welcome to AI Roadmap Builder</h2>
      <p className="text-slate-300">
        Create personalized learning paths with our AI-powered roadmap builder.
        Get started by exploring different technologies and frameworks.
      </p>
    </div>
    
    <ContributionsGraph />
    
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Your Roadmaps</h2>
      <div className="text-center text-slate-400 py-8">
        No roadmaps yet. Create your first one!
      </div>
    </div>
    <ActivityFeed />
  </div>
);

export default function Home() {
  const [activeTab, setActiveTab] = useState("overview");
  const { status } = useSession();
  const router = useRouter();

  if (status === "unauthenticated") {
    router.push("/auth");
    return null;
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 max-w-[1280px] mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-8">
          <Profile />
          <div className="flex-1">
            {activeTab === "skills" ? (
              <RepositorySection />
            ) : (
              <OverviewSection />
            )}
          </div>
        </div>
      </main>

      <Footer />

      <style jsx global>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-up {
          animation: fadeUp 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
