import React from "react";
import { Star, GitFork } from "lucide-react";

interface RepositoryCardProps {
  name: string;
  description?: string;
  language?: string;
  languageColor?: string;
  stars: number;
  forks: number;
  updatedAt: string;
}

const RepositoryCard = ({
  name,
  description,
  language,
  languageColor = "#4F46E5",
  stars,
  forks,
  updatedAt,
}: RepositoryCardProps) => {
  return (
    <div className="group">
      <div className="relative p-6 rounded-xl backdrop-blur-sm border border-slate-700/50 transition-all duration-300 hover:-translate-y-1">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-slate-800/50 to-transparent" />

        {/* Glow effects */}
        <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-slate-700/10 via-blue-500/20 to-slate-700/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium text-slate-100 truncate">
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-300"
                >
                  {name}
                </a>
              </h3>
              {description && (
                <p className="mt-2 text-sm text-slate-400 line-clamp-2 group-hover:text-slate-300 transition-colors duration-300">
                  {description}
                </p>
              )}
            </div>
            <button
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 rounded-lg 
                             bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 hover:border-slate-600/50 
                             transition-all duration-300 hover:text-slate-100"
            >
              <Star className="w-4 h-4" />
              Star
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
            {language && (
              <span className="flex items-center gap-1.5 hover:text-slate-300 transition-colors duration-300">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: languageColor }}
                />
                {language}
              </span>
            )}
            {stars > 0 && (
              <a
                href="#"
                className="flex items-center gap-1.5 hover:text-slate-300 transition-colors duration-300"
              >
                <Star className="w-4 h-4" />
                {stars.toLocaleString()}
              </a>
            )}
            {forks > 0 && (
              <a
                href="#"
                className="flex items-center gap-1.5 hover:text-slate-300 transition-colors duration-300"
              >
                <GitFork className="w-4 h-4" />
                {forks.toLocaleString()}
              </a>
            )}
            <span className="hover:text-slate-300 transition-colors duration-300">
              Updated {updatedAt}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepositoryCard;
