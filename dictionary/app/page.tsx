"use client";

import { useState, useMemo, useCallback } from "react";
import { Flashcard, type WordEntry } from "./components/flashcard";
import wordData from "../data/words.json";

type Book = (typeof wordData.books)[number];

export default function DictionaryPage() {
  const books = wordData.books;

  const [selectedSlug, setSelectedSlug] = useState<string>(books[0]?.slug ?? "");
  const [difficulty, setDifficulty] = useState<"all" | "medium" | "hard">("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [knownSet, setKnownSet] = useState<Set<number>>(new Set());
  const [unknownSet, setUnknownSet] = useState<Set<number>>(new Set());

  const selectedBook = useMemo(
    () => books.find((b) => b.slug === selectedSlug) ?? books[0],
    [books, selectedSlug],
  );

  const filteredWords: WordEntry[] = useMemo(() => {
    if (!selectedBook) return [];
    const words = difficulty === "all" ? selectedBook.words : selectedBook.words.filter((w) => w.difficulty === difficulty);
    return words as WordEntry[];
  }, [selectedBook, difficulty]);

  const handleBookChange = useCallback((slug: string) => {
    setSelectedSlug(slug);
    setCurrentIndex(0);
    setKnownSet(new Set());
    setUnknownSet(new Set());
  }, []);

  const handleDiffChange = useCallback((d: "all" | "medium" | "hard") => {
    setDifficulty(d);
    setCurrentIndex(0);
    setKnownSet(new Set());
    setUnknownSet(new Set());
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(i + 1, filteredWords.length - 1));
  }, [filteredWords.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }, []);

  const handleKnown = useCallback((idx: number) => {
    setKnownSet((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
    setUnknownSet((prev) => {
      const next = new Set(prev);
      next.delete(idx);
      return next;
    });
  }, []);

  const handleUnknown = useCallback((idx: number) => {
    setUnknownSet((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
    setKnownSet((prev) => {
      const next = new Set(prev);
      next.delete(idx);
      return next;
    });
  }, []);

  const progressPct =
    filteredWords.length > 0
      ? Math.round(((knownSet.size) / filteredWords.length) * 100)
      : 0;

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f2e8]">
      {/* Header */}
      <header className="border-b border-amber-900/10 bg-white/80 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-bold text-stone-800">
            &#x1f4d6; Dictionary
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            {/* Book selector */}
            <select
              value={selectedSlug}
              onChange={(e) => handleBookChange(e.target.value)}
              className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 shadow-sm transition focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
            >
              {books.map((b) => (
                <option key={b.slug} value={b.slug}>
                  {b.title} ({b.words.length})
                </option>
              ))}
            </select>

            {/* Difficulty filter */}
            <select
              value={difficulty}
              onChange={(e) =>
                handleDiffChange(e.target.value as "all" | "medium" | "hard")
              }
              className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 shadow-sm transition focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
            >
              <option value="all">All</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="border-b border-amber-900/5 bg-white/50 px-6 py-2">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-200">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="whitespace-nowrap text-xs font-medium text-stone-500">
            {knownSet.size} / {filteredWords.length} known
          </span>
        </div>
      </div>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-10">
        {filteredWords.length > 0 ? (
          <Flashcard
            words={filteredWords}
            currentIndex={currentIndex}
            onNext={handleNext}
            onPrev={handlePrev}
            onKnown={handleKnown}
            onUnknown={handleUnknown}
            knownSet={knownSet}
            unknownSet={unknownSet}
          />
        ) : (
          <div className="text-center text-stone-500">
            <p className="text-lg">No words found for this filter.</p>
          </div>
        )}
      </main>

      {/* Keyboard hints */}
      <footer className="border-t border-amber-900/5 bg-white/40 px-6 py-3 text-center text-xs text-stone-400">
        <span className="mr-4">&#x2190; Previous</span>
        <span className="mr-4">Space / Enter &mdash; Flip</span>
        <span>&#x2192; Next</span>
      </footer>
    </div>
  );
}
