'use client';

import React from 'react';

interface HaikeiBackgroundProps {
  variant?: 'waves' | 'blobs' | 'polygon' | 'mesh';
  className?: string;
  opacity?: number;
}

export function HaikeiBackground({
  variant = 'waves',
  className = '',
  opacity = 0.6,
}: HaikeiBackgroundProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none -z-10 transition-opacity duration-700 ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      {variant === 'waves' && (
        <svg
          className="absolute bottom-0 left-0 w-full h-[65%] min-h-[300px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 600"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="hk-w1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="hk-w2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.06" />
            </linearGradient>
            <linearGradient id="hk-w3" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.04" />
            </linearGradient>
          </defs>
          <path
            fill="url(#hk-w3)"
            d="M0,250 C320,350 420,160 720,240 C1020,320 1120,200 1440,280 L1440,600 L0,600 Z"
          />
          <path
            fill="url(#hk-w2)"
            d="M0,330 C280,240 500,410 780,300 C1060,190 1200,380 1440,340 L1440,600 L0,600 Z"
          />
          <path
            fill="url(#hk-w1)"
            d="M0,420 C240,360 480,480 720,410 C960,340 1200,450 1440,400 L1440,600 L0,600 Z"
          />
        </svg>
      )}

      {variant === 'blobs' && (
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-[450px] h-[450px] rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/10 blur-[120px] animate-pulse-glow" />
          <div className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-cyan-500/20 to-indigo-600/10 blur-[140px]" />
          <div className="absolute top-1/2 left-1/3 w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-purple-500/15 to-pink-500/5 blur-[100px]" />
        </div>
      )}

      {variant === 'polygon' && (
        <svg
          className="absolute inset-0 w-full h-full object-cover"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="hk-p1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="hk-p2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#4c1d95" stopOpacity="0.01" />
            </linearGradient>
          </defs>
          <g stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1">
            <polygon fill="url(#hk-p1)" points="0,0 240,120 180,320 0,250" />
            <polygon fill="url(#hk-p2)" points="240,120 540,80 480,290 180,320" />
            <polygon fill="url(#hk-p1)" points="540,80 840,150 780,360 480,290" />
            <polygon fill="url(#hk-p2)" points="840,150 1140,90 1080,310 780,360" />
            <polygon fill="url(#hk-p1)" points="1140,90 1440,160 1440,380 1080,310" />
            <polygon fill="url(#hk-p2)" points="0,250 180,320 120,540 0,580" />
            <polygon fill="url(#hk-p1)" points="180,320 480,290 420,560 120,540" />
            <polygon fill="url(#hk-p2)" points="480,290 780,360 720,600 420,560" />
            <polygon fill="url(#hk-p1)" points="780,360 1080,310 1020,580 720,600" />
            <polygon fill="url(#hk-p2)" points="1080,310 1440,380 1440,640 1020,580" />
          </g>
        </svg>
      )}

      {variant === 'mesh' && (
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
      )}
    </div>
  );
}
