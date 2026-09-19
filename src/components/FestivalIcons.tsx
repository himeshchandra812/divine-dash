import React from 'react';

export const GoldenLotusSVG: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="lotusGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fff3b0" />
        <stop offset="40%" stopColor="#ffd700" />
        <stop offset="80%" stopColor="#ff9e00" />
        <stop offset="100%" stopColor="#b8860b" />
      </linearGradient>
      <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    {/* Outer petals */}
    <path
      d="M24 32C15 28 6 22 2 15C1 13 4 11 8 13C13 16 19 22 24 32Z"
      fill="url(#lotusGoldGrad)"
      filter="url(#goldGlow)"
    />
    <path
      d="M24 32C33 28 42 22 46 15C47 13 44 11 40 13C35 16 29 22 24 32Z"
      fill="url(#lotusGoldGrad)"
      filter="url(#goldGlow)"
    />
    {/* Mid petals */}
    <path
      d="M24 32C18 25 12 16 10 9C9 6 12 5 15 8C19 12 22 20 24 32Z"
      fill="url(#lotusGoldGrad)"
    />
    <path
      d="M24 32C30 25 36 16 38 9C39 6 36 5 33 8C29 12 26 20 24 32Z"
      fill="url(#lotusGoldGrad)"
    />
    {/* Center petal */}
    <path
      d="M24 34C20 22 20 12 24 3C28 12 28 22 24 34Z"
      fill="url(#lotusGoldGrad)"
      stroke="#fff3b0"
      strokeWidth="0.75"
    />
    {/* Base pod */}
    <path
      d="M17 31C21 34 27 34 31 31C29 33 19 33 17 31Z"
      fill="#fff3b0"
    />
  </svg>
);

export const GoldenModakSVG: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="modakShine" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="25%" stopColor="#fff275" />
        <stop offset="55%" stopColor="#ffb703" />
        <stop offset="85%" stopColor="#fb8500" />
        <stop offset="100%" stopColor="#b25d00" />
      </radialGradient>
      <radialGradient id="modakGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffe66d" stopOpacity="0.8" />
        <stop offset="70%" stopColor="#ffb703" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#fb8500" stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* Ambient Glow */}
    <circle cx="32" cy="34" r="28" fill="url(#modakGlow)" />
    {/* Base Dumpling Body */}
    <path
      d="M32 6C30 14 14 26 12 40C10 52 20 58 32 58C44 58 54 52 52 40C50 26 34 14 32 6Z"
      fill="url(#modakShine)"
      stroke="#ffd166"
      strokeWidth="1.5"
    />
    {/* Characteristic Vertical Pleat Lines */}
    <path d="M32 6C32 20 32 44 32 58" stroke="#ff9e00" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M32 6C28 20 22 42 22 55" stroke="#ff9e00" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M32 6C36 20 42 42 42 55" stroke="#ff9e00" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M32 8C23 24 16 38 14 47" stroke="#e07a00" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    <path d="M32 8C41 24 48 38 50 47" stroke="#e07a00" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    {/* Golden Apex Swirl Bead */}
    <circle cx="32" cy="6" r="3" fill="#ffffff" />
    <circle cx="32" cy="6" r="2" fill="#ffd700" />
    {/* Specular Highlight */}
    <ellipse cx="27" cy="28" rx="4" ry="9" transform="rotate(-20 27 28)" fill="#ffffff" opacity="0.55" />
  </svg>
);
