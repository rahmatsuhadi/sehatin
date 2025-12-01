"use client";

import { useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (value: number) => void;
}

export default function DailyCheckinModal({ open, onClose, onSave }: Props) {
  // Jika modal tidak dibuka → tidak render
  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 bg-black/60 backdrop-blur-sm z-[65]
        flex items-center justify-center p-4
        pointer-events-none
        animate-fadeIn
      "
    >
      <div
        className="
          bg-white dark:bg-darkCard rounded-[2rem] w-full max-w-xs p-6 shadow-2xl text-center 
          pointer-events-auto animate-scaleIn
        "
      >
        {/* Avatar / Mascot */}
        <div className="text-4xl mb-2 select-none">🥑</div>

        {/* Title */}
        <h3 className="font-bold text-lg mb-2 dark:text-white">
          Check-In Harian 📅
        </h3>

        {/* Subtitle */}
        <p className="text-xs text-gray-500 mb-4">
          Sudah nimbang berat badan pagi ini?
        </p>

        {/* Input */}
        <input
          type="number"
          id="daily-weight"
          placeholder="kg"
          className="
            w-full p-3 rounded-xl border text-center text-xl font-bold 
            bg-gray-100 dark:bg-gray-800 dark:text-white outline-none
          "
        />

        {/* Save Button */}
        <button
          onClick={() => {
            const value = Number(
              (document.getElementById("daily-weight") as HTMLInputElement)
                .value
            );
            if (!isNaN(value)) onSave(value);
          }}
          className="
            w-full bg-secondary text-white font-bold py-3 rounded-xl mt-4
            active:scale-95 transition
          "
        >
          Update Data
        </button>

        {/* Skip */}
        <button
          onClick={onClose}
          className="text-xs text-gray-400 mt-3 underline w-full"
        >
          Nanti Saja
        </button>
      </div>
    </div>
  );
}
