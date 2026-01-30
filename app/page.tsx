"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { FaDiscord, FaGithub, FaBriefcase, FaInstagram, FaTwitter } from "react-icons/fa";
import Image from "next/image";

// --- CONFIGURATION ---
const USER_ID = "1329835276020748321"; // Your ID
const AVATAR_URL = `https://cdn.discordapp.com/avatars/${USER_ID}/`;

export default function ZephyrID() {
  // --- STATE ---
  const [data, setData] = useState<any>(null);
  const [time, setTime] = useState<string>("--:--");

  // --- 3D TILT LOGIC (Framer Motion) ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const xPct = (clientX - left) / width - 0.5;
    const yPct = (clientY - top) / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);
  const brightness = useTransform(mouseX, [-0.5, 0.5], [1, 1.2]);

  // --- EFFECTS ---
  useEffect(() => {
    // 1. Clock (Tokyo)
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-US", {
        timeZone: "Asia/Tokyo",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }));
    }, 1000);

    // 2. Lanyard Data
    async function fetchData() {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${USER_ID}`);
        const json = await res.json();
        setData(json.data);
      } catch (e) {
        console.error(e);
      }
    }
    fetchData();
    const lanyardInterval = setInterval(fetchData, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(lanyardInterval);
    };
  }, []);

  // --- DERIVED DATA ---
  const statusColors: Record<string, string> = {
    online: "bg-green-500",
    idle: "bg-yellow-500",
    dnd: "bg-red-500",
    offline: "bg-zinc-500",
  };
  const statusColor = data ? statusColors[data.discord_status] : "bg-zinc-500";
  
  const avatarUrl = data?.discord_user?.avatar
    ? `${AVATAR_URL}${data.discord_user.avatar}.${data.discord_user.avatar.startsWith("a_") ? "gif" : "png"}?size=256`
    : "https://cdn.discordapp.com/embed/avatars/0.png";

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#020202] text-white overflow-hidden relative selection:bg-blue-500/30">
      
      {/* Background FX */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,149,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,149,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(circle_at_center,black_30%,transparent_100%)]" />
        <div className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      {/* 3D CARD CONTAINER */}
      <motion.div
        style={{ rotateX, rotateY, filter: `brightness(${brightness})` }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative z-10 w-[380px] rounded-[30px] bg-zinc-900/80 backdrop-blur-2xl border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_20px_40px_-15px_rgba(0,0,0,1)] preserve-3d group"
      >
        
        {/* Banner */}
        <div className="h-36 rounded-t-[30px] relative overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-black to-zinc-950" />
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          
          {/* Open to Work Badge */}
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-green-400">Open to Work</span>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-8">
          
          {/* Avatar & Status */}
          <div className="flex justify-between items-end -mt-14 mb-5">
            <div className="relative group-hover:scale-105 transition-transform duration-500 ease-out">
              <img 
                src={avatarUrl} 
                alt="Avatar" 
                className="w-28 h-28 rounded-[26px] border-[6px] border-[#0a0a0a] bg-black shadow-2xl object-cover"
              />
              <div className={`absolute bottom-2 -right-1 w-7 h-7 rounded-full border-[5px] border-[#0a0a0a] ${statusColor}`} />
            </div>
            
            <div className="text-right">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Tokyo, JP</p>
              <p className="text-xl font-mono font-bold text-white tabular-nums tracking-tight">{time}</p>
            </div>
          </div>

          {/* Identity */}
          <div className="mb-6 space-y-1">
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
              @zephyr.dev
              <VerifiedBadge />
            </h1>
            <p className="text-sm font-medium text-zinc-200 leading-snug">
              Founder & CEO of <span className="text-blue-400">WebLooM inc.</span> / BuildCore / Vertex Creative
            </p>
            <p className="text-xs text-zinc-500 italic pt-2">Feel free to reach out</p>
          </div>

          {/* Activity Box */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center overflow-hidden shrink-0 relative">
               {data?.listening_to_spotify ? (
                 <img src={data.spotify.album_art_url} className="w-full h-full object-cover" alt="Spotify" />
               ) : (
                 <i className="fa-solid fa-code text-zinc-600" />
               )}
            </div>
            <div className="flex-1 overflow-hidden min-w-0">
              <p className="font-bold text-xs text-white truncate">
                {data?.listening_to_spotify ? data.spotify.song : (data?.activities?.[0]?.name || "Chilling")}
              </p>
              <p className="text-[10px] text-zinc-500 truncate">
                {data?.listening_to_spotify ? `by ${data.spotify.artist}` : (data?.activities?.[0]?.details || "No active session")}
              </p>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shrink-0" />
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-5 gap-3">
            <a 
              href="https://zephyrdevontop.vercel.app" 
              target="_blank" 
              className="col-span-4 h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white hover:text-black hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group/btn"
            >
              <span className="text-xs font-bold tracking-widest uppercase">View Portfolio</span>
              <FaBriefcase className="text-xs group-hover/btn:-rotate-12 transition-transform" />
            </a>

            <a 
              href="https://discord.com/users/1329835276020748321" 
              target="_blank" 
              className="col-span-1 h-12 rounded-xl bg-[#5865F2]/10 border border-[#5865F2]/20 text-[#5865F2] hover:bg-[#5865F2] hover:text-white hover:-translate-y-1 transition-all duration-300 flex items-center justify-center text-lg"
            >
              <FaDiscord />
            </a>
          </div>

        </div>
      </motion.div>
    </main>
  );
}

// SVG Component for clean code
function VerifiedBadge() {
  return (
    <svg className="w-6 h-6 text-[#0095f6] drop-shadow-[0_0_10px_rgba(0,149,246,0.4)]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.5 12.5c0-1.58-.88-2.95-2.18-3.66.54-1.53.2-3.28-.97-4.45s-2.92-1.51-4.45-.97c-.71-1.3-2.08-2.18-3.66-2.18s-2.95.88-3.66 2.18c-1.53-.54-3.28-.2-4.45.97s-1.51 2.92-.97 4.45c-1.3.71-2.18 2.08-2.18 3.66s.88 2.95 2.18 3.66c-.54 1.53-.2 3.28.97 4.45s2.92 1.51 4.45.97c.71 1.3 2.08 2.18 3.66 2.18s2.95-.88 3.66-2.18c1.53.54 3.28.2 4.45-.97s1.51-2.92.97-4.45c1.3-.71 2.18-2.08 2.18-3.66zM10 17l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
    </svg>
  );
}
