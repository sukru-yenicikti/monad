"use client";

import React, { useState } from "react";
import { TrustBadge } from "./TrustBadge";
import {
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";

export const GuardianAnalyzer = () => {
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<"idle" | "analyzing" | "result">("idle");
  const [loadingText, setLoadingText] = useState("");
  const [protectionEnabled, setProtectionEnabled] = useState(true);

  const [demoScore, setDemoScore] = useState(0);
  const [isHighRisk, setIsHighRisk] = useState(false);

  const startAnalysis = () => {
    if (!address) return;
    setStatus("analyzing");

    // Simple logic for demo purposes:
    // If address ends with "0000" it's safe, otherwise it's high risk for demo effect.
    // Let's just make it random but lean towards risky to show the protection.
    const isRisky = !address.endsWith("safe");
    setIsHighRisk(isRisky);
    setDemoScore(isRisky ? Math.floor(Math.random() * 30) + 10 : Math.floor(Math.random() * 20) + 80);

    const steps = [
      "Connecting to Autonomous Node...",
      "Fetching AI Trust Passport...",
      "Simulating Transaction on Fork...",
      "Analyzing Bytecode for Honeypots...",
      "Checking Approval Risks...",
    ];

    let currentStep = 0;
    setLoadingText(steps[currentStep]);

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setLoadingText(steps[currentStep]);
      } else {
        clearInterval(interval);
        setStatus("result");
      }
    }, 800);
  };

  const reset = () => {
    setStatus("idle");
    setAddress("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      {/* Protection Toggle */}
      <div className="flex justify-end mb-4">
        <label className="cursor-pointer label flex items-center space-x-3 bg-base-100/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-base-300 shadow-sm">
          <ShieldCheckIcon className={`h-6 w-6 ${protectionEnabled ? "text-success" : "text-neutral/50"}`} />
          <span className="label-text font-semibold text-base-content/80">Autonomous Protection Mode</span>
          <input
            type="checkbox"
            className="toggle toggle-success"
            checked={protectionEnabled}
            onChange={() => setProtectionEnabled(!protectionEnabled)}
          />
        </label>
      </div>

      {status === "idle" && (
        <div className="bg-base-100/60 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-base-200">
          <h2 className="text-2xl font-bold mb-6 text-center text-base-content">Analyze Smart Contract</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-base-content/50" />
              </div>
              <input
                type="text"
                placeholder="0x..."
                className="input input-bordered w-full pl-10 bg-base-200/50 border-base-300 focus:border-primary focus:ring-1 focus:ring-primary transition-all rounded-xl text-lg"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </div>
            <button
              className="btn btn-primary rounded-xl px-8 hover:scale-105 transition-transform"
              onClick={startAnalysis}
              disabled={!address}
            >
              Analyze
            </button>
          </div>
          <p className="text-center text-sm text-base-content/60 mt-4">
            Tip: Type any address to see a risk analysis. Type an address ending in &quot;safe&quot; to see a good
            score.
          </p>
        </div>
      )}

      {status === "analyzing" && (
        <div className="bg-base-100/60 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-base-200 flex flex-col items-center justify-center min-h-[300px]">
          <span className="loading loading-ring w-20 text-primary mb-6"></span>
          <h3 className="text-xl font-semibold animate-pulse">{loadingText}</h3>
        </div>
      )}

      {status === "result" && (
        <div className="bg-base-100/60 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-base-200 animate-fade-in">
          {protectionEnabled && isHighRisk && (
            <div className="alert alert-error mb-8 shadow-lg">
              <ShieldExclamationIcon className="h-6 w-6" />
              <div>
                <h3 className="font-bold">Transaction Blocked!</h3>
                <div className="text-xs">
                  Autonomous Protection Mode prevented interaction with a highly risky contract.
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Left Col: Trust Score */}
            <div className="w-full md:w-1/3 flex flex-col items-center bg-base-200/50 rounded-2xl p-6 border border-base-300">
              <h3 className="text-lg font-bold mb-2">AI Trust Passport</h3>
              <TrustBadge score={demoScore} label="Reputation Score" />

              <div className="mt-6 w-full space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-base-content/70">Community Verifications</span>
                  <span className="font-semibold">{isHighRisk ? "0" : "1,204"}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-base-content/70">Past Exploits</span>
                  <span className={isHighRisk ? "text-error font-bold" : "text-success font-semibold"}>
                    {isHighRisk ? "2 Detected" : "None"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-base-content/70">Creator Score</span>
                  <span className={isHighRisk ? "text-error" : "text-success"}>
                    {isHighRisk ? "Untrusted" : "Verified"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Col: Analysis Details */}
            <div className="w-full md:w-2/3 space-y-4">
              <h3 className="text-2xl font-bold border-b border-base-300 pb-2">Vulnerability Report</h3>

              <div
                className={`p-4 rounded-xl border ${isHighRisk ? "bg-error/10 border-error/20" : "bg-success/10 border-success/20"}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <ExclamationTriangleIcon className={`h-6 w-6 ${isHighRisk ? "text-error" : "text-success"}`} />
                  <h4 className="font-bold text-lg">Scam / Rugpull Risk</h4>
                </div>
                <p className="text-sm text-base-content/80">
                  {isHighRisk
                    ? "High probability of liquidity drain. Contract contains hidden mint functions allowing the creator to infinitely print tokens."
                    : "No suspicious minting or burning functions detected. Liquidity appears to be locked safely."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  className={`p-4 rounded-xl border ${isHighRisk ? "bg-warning/10 border-warning/20" : "bg-success/10 border-success/20"}`}
                >
                  <h4 className="font-bold mb-1">Approval Analysis</h4>
                  <p className="text-xs text-base-content/70">
                    {isHighRisk
                      ? "Requests UNLIMITED token approval. This allows the contract to drain your entire balance at any time."
                      : "Requests exact amount approval. Safe pattern."}
                  </p>
                </div>
                <div
                  className={`p-4 rounded-xl border ${isHighRisk ? "bg-error/10 border-error/20" : "bg-success/10 border-success/20"}`}
                >
                  <h4 className="font-bold mb-1">Honeypot Detection</h4>
                  <p className="text-xs text-base-content/70">
                    {isHighRisk
                      ? "Sell fee is 99%. You can buy, but you cannot sell. This is a HONEYPOT."
                      : "Buy and sell fees are normal (< 1%). Trading simulated successfully."}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <button className="btn btn-outline flex-1 rounded-xl" onClick={reset}>
                  Analyze Another
                </button>
                {!isHighRisk && <button className="btn btn-primary flex-1 rounded-xl">Proceed with Transaction</button>}
                {isHighRisk && !protectionEnabled && (
                  <button className="btn btn-error flex-1 rounded-xl">Ignore Risk & Proceed</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
