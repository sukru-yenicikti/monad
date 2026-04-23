"use client";

import React, { useState } from "react";
import { TrustBadge } from "./TrustBadge";
import { isAddress, parseEther } from "viem";
import { useAccount, useSendTransaction } from "wagmi";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

export const SecureTransferPortal = () => {
  const { isConnected } = useAccount();
  const { sendTransaction, isPending, isSuccess, error: txError } = useSendTransaction();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<"idle" | "analyzing" | "result">("idle");
  const [loadingText, setLoadingText] = useState("");

  const [demoScore, setDemoScore] = useState(0);
  const [isHighRisk, setIsHighRisk] = useState(false);
  const [isPoisoned, setIsPoisoned] = useState(false);
  const [walletAge, setWalletAge] = useState("");
  const [mixerInteractions, setMixerInteractions] = useState("");
  const [reports, setReports] = useState("");
  const [reasoningTitle, setReasoningTitle] = useState("");
  const [reasoningText, setReasoningText] = useState("");
  const [aiError, setAiError] = useState("");

  const startAnalysis = async () => {
    if (!recipient || !amount || !isAddress(recipient)) return;
    setStatus("analyzing");
    setAiError("");

    const steps = [
      "Connecting to Gemini AI Engine...",
      "Analyzing recipient address history...",
      "Checking Wallet Age and ENS records...",
      "Scanning for Tornado Cash interactions...",
      "Generating AI Trust Passport Score...",
    ];

    let currentStep = 0;
    setLoadingText(steps[currentStep]);

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setLoadingText(steps[currentStep]);
      }
    }, 800);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: recipient }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze address");
      }

      setDemoScore(data.score);
      setIsHighRisk(data.isHighRisk);
      setIsPoisoned(data.isPoisoned);
      setWalletAge(data.walletAge);
      setMixerInteractions(data.mixerInteractions);
      setReports(data.reports);
      setReasoningTitle(data.reasoningTitle);
      setReasoningText(data.reasoningText);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message);
    } finally {
      clearInterval(interval);
      setStatus("result");
    }
  };

  const handleSend = () => {
    if (!isAddress(recipient)) return;
    sendTransaction({
      to: recipient,
      value: parseEther(amount),
    });
  };

  const reset = () => {
    setStatus("idle");
    setRecipient("");
    setAmount("");
    setAiError("");
  };

  if (!isConnected) {
    return (
      <div className="bg-base-100/60 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-base-200 text-center">
        <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
        <p className="text-base-content/70">
          Please connect your wallet using the button in the top right to use the Secure Transfer Portal.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      {status === "idle" && (
        <div className="bg-base-100/60 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-base-200">
          <div className="flex items-center gap-3 mb-6 border-b border-base-300 pb-4">
            <ShieldCheckIcon className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold text-base-content">Secure Transfer</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <UserCircleIcon className="h-5 w-5" /> Recipient Address
                </span>
              </label>
              <input
                type="text"
                placeholder="0x... or ENS"
                className={`input input-bordered w-full bg-base-200/50 border-base-300 focus:border-primary focus:ring-1 focus:ring-primary transition-all rounded-xl text-lg ${recipient && !isAddress(recipient) && !(recipient as string).endsWith(".eth") ? "input-error" : ""}`}
                value={recipient}
                onChange={e => setRecipient(e.target.value)}
              />
              {recipient && !isAddress(recipient) && !(recipient as string).endsWith(".eth") && (
                <span className="text-error text-xs mt-1 block">Please enter a valid Ethereum address</span>
              )}
            </div>

            <div>
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <CurrencyDollarIcon className="h-5 w-5" /> Amount (ETH)
                </span>
              </label>
              <input
                type="number"
                placeholder="0.00"
                className="input input-bordered w-full bg-base-200/50 border-base-300 focus:border-primary focus:ring-1 focus:ring-primary transition-all rounded-xl text-lg"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
            </div>

            <button
              className="btn btn-primary w-full rounded-xl text-lg h-14 hover:scale-[1.02] transition-transform shadow-lg shadow-primary/30"
              onClick={startAnalysis}
              disabled={!recipient || !amount || !isAddress(recipient)}
            >
              Review Transfer <ArrowRightIcon className="h-5 w-5 ml-2" />
            </button>
          </div>
          <p className="text-center text-xs text-base-content/50 mt-6 flex justify-center items-center gap-2">
            <ShieldCheckIcon className="h-4 w-4" /> AI Agent (Gemini) will analyze the recipient before Metamask is
            triggered.
          </p>
        </div>
      )}

      {status === "analyzing" && (
        <div className="bg-base-100/60 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-base-200 flex flex-col items-center justify-center min-h-[350px]">
          <span className="loading loading-ring w-20 text-primary mb-6"></span>
          <h3 className="text-xl font-semibold animate-pulse text-center max-w-md">{loadingText}</h3>
        </div>
      )}

      {status === "result" && (
        <div className="bg-base-100/60 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-base-200 animate-fade-in">
          {aiError ? (
            <div className="alert alert-error mb-8 shadow-lg items-start">
              <ShieldExclamationIcon className="h-8 w-8 mt-1" />
              <div>
                <h3 className="font-bold text-lg">AI Analysis Failed</h3>
                <div className="text-sm mt-1">{aiError}</div>
              </div>
            </div>
          ) : isHighRisk ? (
            <div className="alert alert-error mb-8 shadow-lg items-start">
              <ShieldExclamationIcon className="h-8 w-8 mt-1" />
              <div>
                <h3 className="font-bold text-lg">{reasoningTitle || "CRITICAL WARNING!"}</h3>
                <div className="text-sm mt-1">{reasoningText}</div>
              </div>
            </div>
          ) : (
            <div className="alert alert-success mb-8 shadow-lg">
              <CheckCircleIcon className="h-8 w-8" />
              <div>
                <h3 className="font-bold text-lg">{reasoningTitle || "Recipient Verified"}</h3>
                <div className="text-sm mt-1">{reasoningText}</div>
              </div>
            </div>
          )}

          {!aiError && (
            <div className="flex flex-col md:flex-row gap-8 items-stretch">
              {/* Left Col: Trust Score */}
              <div className="w-full md:w-1/3 flex flex-col items-center justify-center bg-base-200/50 rounded-2xl p-6 border border-base-300">
                <h3 className="text-lg font-bold mb-2 text-center">AI Trust Passport</h3>
                <TrustBadge score={demoScore} label="Recipient Trust" />

                <div className="mt-6 w-full space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-base-content/70">Wallet Age</span>
                    <span className={isHighRisk ? "text-error font-semibold" : "font-semibold"}>{walletAge}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-base-content/70">Mixer Interactions</span>
                    <span className={isHighRisk ? "text-error font-bold" : "text-success font-semibold"}>
                      {mixerInteractions}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-base-content/70">Reports</span>
                    <span className={isHighRisk ? "text-error" : "text-success"}>{reports}</span>
                  </div>
                </div>
              </div>

              {/* Right Col: Transfer Summary */}
              <div className="w-full md:w-2/3 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold border-b border-base-300 pb-2 mb-4">Transfer Summary</h3>

                  <div className="bg-base-200/50 p-4 rounded-xl space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-base-content/70">Sending</span>
                      <span className="font-bold text-lg">{amount} ETH</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-base-content/70">To</span>
                      <span className="font-mono text-xs break-all max-w-[200px] text-right">{recipient}</span>
                    </div>
                  </div>

                  {isSuccess && (
                    <div className="text-success font-bold text-center mb-4 flex items-center justify-center gap-2">
                      <CheckCircleIcon className="h-5 w-5" /> Transaction Sent Successfully!
                    </div>
                  )}

                  {txError && (
                    <div className="text-error text-xs text-center mb-4">Error: {txError.message.split("\n")[0]}</div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    className="btn btn-outline flex-1 rounded-xl"
                    onClick={reset}
                    disabled={isPending || isSuccess}
                  >
                    Cancel
                  </button>

                  {(!isHighRisk || isPoisoned === false) && !isSuccess && (
                    <button
                      className={`btn flex-[2] rounded-xl shadow-lg ${isHighRisk ? "btn-error" : "btn-primary"}`}
                      onClick={handleSend}
                      disabled={isPending}
                    >
                      {isPending ? (
                        <span className="loading loading-spinner"></span>
                      ) : isHighRisk ? (
                        "Ignore Risk & Send via Metamask"
                      ) : (
                        "Confirm & Send via Metamask"
                      )}
                    </button>
                  )}

                  {isPoisoned && !isSuccess && (
                    <button className="btn btn-error flex-[2] rounded-xl shadow-lg" disabled>
                      Blocked by Guardian
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {aiError && (
            <div className="flex justify-center mt-6">
              <button className="btn btn-primary rounded-xl" onClick={reset}>
                Try Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
