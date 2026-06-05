"use client";

/**
 * DEV ONLY — renders a floating button to force-open the ExitIntentModal.
 * Clears sessionStorage dedup key so the modal always shows.
 * Only included when NODE_ENV === 'development'.
 */

import { useState } from "react";
import { ExitIntentModal } from "./exit-intent-modal";

export function DevTestModalButton() {
  const [key, setKey] = useState(0);

  const openModal = () => {
    sessionStorage.removeItem("exit-intent-shown");
    // Re-mount ExitIntentModal by changing its key so hooks re-run
    setKey((k) => k + 1);
  };

  return (
    <>
      <button
        onClick={openModal}
        className="fixed bottom-6 right-6 z-[200] flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2.5 text-xs font-bold text-amber-900 shadow-xl transition-all hover:bg-amber-300 hover:scale-105"
        title="DEV: Test Exit Intent Modal + Google Sheets"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.07A1 1 0 0121 8.87V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-3.87a1 1 0 00-.447-.832L15 14M9 12h6" />
        </svg>
        DEV: Test Modal
      </button>
      {key > 0 && <ExitIntentModal key={key} forceOpen />}
    </>
  );
}
