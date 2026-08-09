import React from "react";
import { Loader2 } from "lucide-react";

export const Loader = ({ text = "Loading...", fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-zinc-50 p-6">
        <div className="border border-zinc-300 bg-white p-8 shadow-sm flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-zinc-950 animate-spin" />
          <p className="text-xs uppercase tracking-widest font-mono text-zinc-600 font-semibold">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-12 gap-3 w-full">
      <Loader2 className="w-7 h-7 text-zinc-950 animate-spin" />
      <p className="text-xs uppercase tracking-widest font-mono text-zinc-500 font-semibold">{text}</p>
    </div>
  );
};

export const Skeleton = ({ className = "h-4 w-full" }) => {
  return (
    <div
      style={{ borderRadius: "0px" }}
      className={`bg-zinc-200 animate-pulse ${className}`}
    />
  );
};

export default Loader;
