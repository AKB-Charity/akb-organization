import React from "react";

const DonorCardOverlay = ({ name }) => (
  <div className="absolute top-3 left-4 w-[150px]">
    <div className="bg-gradient-to-b from-blue-900 to-blue-950 rounded-xl overflow-hidden shadow-lg">
      <div className="bg-blue-800 p-1.5 text-center">
        <h1 className="text-xs font-bold text-white tracking-wide">
          {name || "AKB FOUNDATION"}
        </h1>
      </div>
      <div className="relative p-3">
        <div className="relative mx-auto w-12 h-12 mb-2">
          <div className="absolute inset-0 rounded-full border-2 border-blue-400 shadow-lg overflow-hidden">
            <div className="w-full h-full bg-blue-200/20" />
          </div>
          <div className="absolute -inset-1 border-2 border-blue-300/30 rounded-full animate-spin-slow" />
        </div>
        <div className="space-y-1.5">
          <div className="bg-white/90 text-blue-900 py-0.5 px-2 rounded-md font-bold text-[8px] inline-block">
            FEED A HUNGRY STOMACH
          </div>
          <div className="text-white space-y-1">
            <p className="text-[10px] font-bold text-center">DONOR NAME</p>
            <div className="h-px w-12 mx-auto bg-blue-400/50" />
            <p className="text-[8px] text-blue-200 italic text-center">
              Making Change Together
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default DonorCardOverlay;
