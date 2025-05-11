"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  LocationOn,
  Email,
  GitHub,
  Language,
} from "@mui/icons-material";
import { useSession } from "next-auth/react";
import Avatar from './Avatar';

export default function Profile() {
  const { data: session } = useSession();
  const user = session?.user;

  // Fallback values in case session data is unavailable
  const profileImage = user?.image || "/default-profile.jpg";
  const name = user?.name || "John Doe";
  const username = user?.email?.split("@")[0] || "johndoe";
  const email = user?.email || "johndoe@example.com";

  return (
    <div className="w-full md:w-64 space-y-6">
      <div className="flex flex-col items-center">
        <Avatar />
        <h2 className="mt-4 text-xl font-semibold text-white">
          {name}
        </h2>
        <p className="text-slate-400">{email}</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Roadmaps</span>
          <span className="text-white">0</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Contributions</span>
          <span className="text-white">0</span>
        </div>
      </div>
    </div>
  );
}
