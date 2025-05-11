"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Menu, X, Github, Plus } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Avatar from './Avatar';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { name: "Overview", slug: "overview" },
  { name: "Repositories", slug: "skills" },
];

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b border-gray-700 backdrop-blur-md bg-black/40"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left section */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2">
              <Github className="h-8 w-8 text-white" />
              <span className="hidden text-xl font-semibold text-white sm:inline-block">
                Ascend
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.slug}
                  onClick={() => onTabChange(item.slug)}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === item.slug
                      ? "bg-gradient-to-br from-slate-700/10 via-blue-500/20 to-slate-700/10 text-white"
                      : "text-gray-300 hover:bg-gradient-to-tr from-slate-700/10 via-blue-500/20 to-slate-700/10 hover:text-white"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/create')}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                       bg-blue-600 text-white hover:bg-blue-500
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900
                       transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              Create Roadmap
            </motion.button>

            {session?.user && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                <Avatar />
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-1 rounded-md hover:bg-gray-700"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-300" />
              ) : (
                <Menu className="h-6 w-6 text-gray-300" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-2 space-y-2"
          >
            {navItems.map((item) => (
              <button
                key={item.slug}
                onClick={() => {
                  onTabChange(item.slug);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  activeTab === item.slug
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {item.name}
              </button>
            ))}
            <button
              onClick={() => {
                router.push('/create');
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium
                       bg-blue-600 text-white hover:bg-blue-500"
            >
              <Plus className="w-4 h-4" />
              Create Roadmap
            </button>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
