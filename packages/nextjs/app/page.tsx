"use client";

import type { NextPage } from "next";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import { SecureTransferPortal } from "~~/components/SecureTransferPortal";

const Home: NextPage = () => {
  return (
    <div className="flex items-center flex-col grow bg-gradient-to-br from-base-200 via-base-100 to-base-300 relative overflow-hidden min-h-screen">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="flex flex-col items-center justify-center w-full px-4 pt-16 pb-8 z-10">
        <div className="flex items-center gap-3 mb-6 bg-base-100/50 backdrop-blur-md px-6 py-2 rounded-full border border-base-300 shadow-sm animate-fade-in-down">
          <ShieldCheckIcon className="h-6 w-6 text-success" />
          <span className="font-semibold text-sm tracking-widest uppercase text-base-content/80">
            Autonomous Wallet Guardian
          </span>
        </div>

        <h1 className="text-center max-w-4xl animate-fade-in-up">
          <span className="block text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-4">
            Do you really know who you are sending money to?
          </span>
          <span className="block text-lg md:text-xl text-base-content/70 mt-6 font-medium">
            Secure Send Portal analyzes the recipient&apos;s Trust Passport and history before you sign the transaction,
            protecting you from address poisoning and scams.
          </span>
        </h1>

        <div className="w-full mt-12 animate-fade-in">
          <SecureTransferPortal />
        </div>
      </div>
    </div>
  );
};

export default Home;
