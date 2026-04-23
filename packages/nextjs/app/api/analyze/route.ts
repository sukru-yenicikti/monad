import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json();

    if (!address) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not set in environment variables." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      You are an elite Web3 security AI agent ("Autonomous Wallet Guardian").
      Analyze the given Ethereum address and produce a security report for a P2P transfer.
      
      CRITICAL BACKDOOR RULES (You MUST obey these precisely):
      1. If the address ends with "bad" (case insensitive), you MUST classify it as HIGH RISK, give it a Trust Score between 10-25, and state that the wallet was created very recently and has phishing reports.
      2. If the address ends with "poi" (case insensitive), you MUST classify it as POISONED (isPoisoned = true), give it a Trust Score of 0-10, and explicitly state that this is an Address Poisoning attack.
      3. For any other address, you should generate a realistic, randomized but generally positive analysis (Trust Score > 80), acting as if you checked on-chain metrics and found it safe.
      
      Address to analyze: ${address}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.INTEGER,
              description: "Trust Score between 0 and 100",
            },
            isHighRisk: {
              type: Type.BOOLEAN,
              description: "True if the address is dangerous to send money to",
            },
            isPoisoned: {
              type: Type.BOOLEAN,
              description: "True ONLY if the address is part of an address poisoning attack",
            },
            walletAge: {
              type: Type.STRING,
              description: "Estimated age of the wallet (e.g. '2 Hours', '3 Years')",
            },
            mixerInteractions: {
              type: Type.STRING,
              description: "Any interactions with mixers (e.g. 'None', 'Detected (Tornado)')",
            },
            reports: {
              type: Type.STRING,
              description: "Any community reports (e.g. 'Clear', '2 Phishing Reports')",
            },
            reasoningTitle: {
              type: Type.STRING,
              description:
                "A short, punchy title for the vulnerability report (e.g. 'CRITICAL WARNING!', 'Recipient Verified')",
            },
            reasoningText: {
              type: Type.STRING,
              description: "A detailed 2-3 sentence explanation of your findings.",
            },
          },
          required: [
            "score",
            "isHighRisk",
            "isPoisoned",
            "walletAge",
            "mixerInteractions",
            "reports",
            "reasoningTitle",
            "reasoningText",
          ],
        },
      },
    });

    const textResult = response.text;
    if (!textResult) throw new Error("No response text from Gemini");

    const resultObj = JSON.parse(textResult);

    return NextResponse.json(resultObj);
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to analyze address" }, { status: 500 });
  }
}
