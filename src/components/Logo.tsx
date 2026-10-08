import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = "", size = 32 }: LogoProps) {
  return (
    <div className={`relative flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
      >
        <defs>
          <linearGradient id="vyronix-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" /> {/* Indigo */}
            <stop offset="50%" stopColor="#a855f7" /> {/* Purple */}
            <stop offset="100%" stopColor="#06b6d4" /> {/* Cyan */}
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Main Hexagonal Structure */}
        <path
          d="M50 5L90 25V75L50 95L10 75V25L50 5Z"
          stroke="url(#vyronix-grad)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-20"
        />
        
        {/* Neural Sync Core */}
        <circle cx="50" cy="50" r="8" fill="url(#vyronix-grad)" />
        
        {/* Velocity Lines */}
        <path
          d="M30 40L50 50L70 40M30 60L50 50L70 60"
          stroke="url(#vyronix-grad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* External Pulses */}
        <path
          d="M50 20L50 10M80 35L90 30M80 65L90 70M50 80L50 90M20 65L10 70M20 35L10 30"
          stroke="url(#vyronix-grad)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <span className="font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
        VYRONIX
      </span>
    </div>
  );
}
