"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface VideoHeroProps {
  title: string;
  subtitle: string;
  videoSrc: string;
}

export default function VideoHero({ title, subtitle, videoSrc }: VideoHeroProps) {
  const getYoutubeVideoId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = getYoutubeVideoId(videoSrc);

  return (
    <div className="relative w-full aspect-[4/5] sm:aspect-square md:aspect-video max-h-[85vh] overflow-hidden flex items-center justify-center bg-black">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 bg-black overflow-hidden pointer-events-none">
        {youtubeId ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&disablekb=1&fs=0`}
            className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 scale-[1.05] pointer-events-none"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          ></iframe>
        ) : (
          <video
            key={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            ref={(el) => { if (el) el.defaultMuted = true; }}
            className="absolute inset-0 w-full h-full object-cover opacity-100 pointer-events-none"
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      {/* Content Overlay */}
      <div className="absolute top-0 left-0 w-full p-6 sm:p-12 z-20">
        <Link href="/" className="inline-block text-primary text-xs font-black tracking-widest uppercase hover:underline">
          ← Back to Home
        </Link>
      </div>

      <div className="relative z-10 text-center text-white px-4 sm:px-8 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-4 drop-shadow-2xl"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-base sm:text-lg md:text-2xl font-light max-w-2xl mx-auto drop-shadow-lg"
        >
          {subtitle}
        </motion.p>
      </div>
    </div>
  );
}
