"use client";

import { useState, useCallback, useEffect } from "react";

export interface WordEntry {
  word: string;
  meaning: string;
  example: string;
  difficulty: "medium" | "hard";
}

interface FlashcardProps {
  words: WordEntry[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onKnown: (index: number) => void;
  onUnknown: (index: number) => void;
  knownSet: Set<number>;
  unknownSet: Set<number>;
}

export function Flashcard({
  words,
  currentIndex,
  onNext,
  onPrev,
  onKnown,
  onUnknown,
  knownSet,
  unknownSet,
}: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);
  const word = words[currentIndex];

  useEffect(() => {
    setFlipped(false);
  }, [currentIndex]);

  const handleFlip = useCallback(() => {
    setFlipped((f) => !f);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") onNext();
      else if (e.key === "ArrowLeft") onPrev();
      else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleFlip();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onNext, onPrev, handleFlip]);

  if (!word) return null;

  const isKnown = knownSet.has(currentIndex);
  const isUnknown = unknownSet.has(currentIndex);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Card */}
      <button
        onClick={handleFlip}
        className="group relative h-72 w-full max-w-lg cursor-pointer perspective-[1000px] sm:h-80"
        aria-label={flipped ? "Flip to front" : "Flip to reveal meaning"}
      >
        <div
          className={`absolute inset-0 rounded-2xl transition-transform duration-500 [transform-style:preserve-3d] ${
            flipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* Front */}
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-amber-900/10 bg-white p-8 shadow-lg shadow-amber-900/5 [backface-visibility:hidden]">
            <span
              className={`mb-3 inline-block rounded-full px-3 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                word.difficulty === "hard"
                  ? "bg-red-100 text-red-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {word.difficulty}
            </span>
            <span className="text-3xl font-semibold text-stone-800 sm:text-4xl">
              {word.word}
            </span>
            <span className="mt-4 text-sm text-stone-400">tap to reveal</span>
          </div>

          {/* Back */}
          <div className="absolute inset-0 flex flex-col justify-center rounded-2xl border border-amber-900/10 bg-amber-50 p-8 shadow-lg shadow-amber-900/5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span className="mb-1 text-lg font-bold text-stone-800">
              {word.word}
            </span>
            <span className="mb-4 block h-px w-12 bg-amber-300" />
            <span className="mb-4 text-base leading-relaxed text-stone-700">
              {word.meaning}
            </span>
            <span className="text-sm italic leading-relaxed text-stone-500">
              &ldquo;{word.example}&rdquo;
            </span>
            <span className="mt-4 text-sm text-stone-400">tap to flip back</span>
          </div>
        </div>
      </button>

      {/* Navigation */}
      <div className="flex items-center gap-4">
        <button
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 transition hover:bg-stone-50 disabled:opacity-30"
          aria-label="Previous word"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="min-w-[5rem] text-center text-sm font-medium text-stone-500">
          {currentIndex + 1} / {words.length}
        </span>
        <button
          onClick={onNext}
          disabled={currentIndex === words.length - 1}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 transition hover:bg-stone-50 disabled:opacity-30"
          aria-label="Next word"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Known / Unknown buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => onUnknown(currentIndex)}
          className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
            isUnknown
              ? "bg-red-100 text-red-700 ring-2 ring-red-300"
              : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
          }`}
        >
          {isUnknown ? "Marked Unknown" : "Unknown"}
        </button>
        <button
          onClick={() => onKnown(currentIndex)}
          className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
            isKnown
              ? "bg-emerald-100 text-emerald-700 ring-2 ring-emerald-300"
              : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
          }`}
        >
          {isKnown ? "Marked Known" : "Known"}
        </button>
      </div>
    </div>
  );
}
