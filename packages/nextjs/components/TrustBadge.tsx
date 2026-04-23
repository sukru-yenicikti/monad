"use client";

import React, { useEffect, useState } from "react";

type TrustBadgeProps = {
  score: number;
  label?: string;
};

export const TrustBadge: React.FC<TrustBadgeProps> = ({ score, label = "Trust Score" }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Animate score from 0 to target
    const duration = 1000;
    const steps = 60;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setAnimatedScore(Math.min(Math.round((score * currentStep) / steps), score));
      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // Determine color based on score
  let colorClass = "text-success stroke-success";
  let glowClass = "shadow-[0_0_15px_rgba(52,238,182,0.6)]";
  if (score < 50) {
    colorClass = "text-error stroke-error";
    glowClass = "shadow-[0_0_15px_rgba(255,136,99,0.6)]";
  } else if (score < 80) {
    colorClass = "text-warning stroke-warning";
    glowClass = "shadow-[0_0_15px_rgba(255,207,114,0.6)]";
  }

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div
        className={`relative flex items-center justify-center w-24 h-24 rounded-full bg-base-300 ${glowClass} transition-shadow duration-500`}
      >
        <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} className="stroke-base-100" strokeWidth="8" fill="transparent" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            className={`${colorClass} transition-all duration-1000 ease-out`}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${colorClass.split(" ")[0]}`}>{animatedScore}</span>
        </div>
      </div>
      {label && (
        <span className="mt-4 text-sm font-semibold tracking-wider text-base-content/70 uppercase">{label}</span>
      )}
    </div>
  );
};
