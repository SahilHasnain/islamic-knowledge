"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";

type Props = { slug: string; children: ReactNode };
type ReaderSettings = { fontSize: number; lineHeight: number; width: number };
type SavedPosition = { scrollY: number; progress: number };

const defaultSettings: ReaderSettings = { fontSize: 16, lineHeight: 1.95, width: 790 };
const settingsKey = (slug: string) => `dar-al-kutub:reader-settings:${slug}`;
const positionKey = (slug: string) => `dar-al-kutub:reader-position:${slug}`;
const lastReadKey = (slug: string) => `dar-al-kutub:last-read:${slug}`;

export default function ReaderExperience({ slug, children }: Props) {
  const [settings, setSettings] = useState(defaultSettings);
  const [progress, setProgress] = useState(0);
  const [savedPosition, setSavedPosition] = useState<SavedPosition | null>(null);
  const [showResume, setShowResume] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const restoring = useRef(false);
  const allowSaving = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(lastReadKey(slug), JSON.stringify({ updatedAt: Date.now() }));
    } catch {
      // Recent-book history is optional when browser storage is unavailable.
    }

    const timer = window.setTimeout(() => {
      try {
        const storedSettings = localStorage.getItem(settingsKey(slug));
        if (storedSettings) {
          const parsed = JSON.parse(storedSettings) as Partial<ReaderSettings>;
          setSettings({
            fontSize: Math.min(22, Math.max(14, parsed.fontSize ?? defaultSettings.fontSize)),
            lineHeight: parsed.lineHeight === 2.2 ? 2.2 : defaultSettings.lineHeight,
            width: parsed.width === 900 ? 900 : defaultSettings.width,
          });
        }

        const storedPosition = localStorage.getItem(positionKey(slug));
        if (storedPosition) {
          const parsed = JSON.parse(storedPosition) as Partial<SavedPosition>;
          if (typeof parsed.scrollY === "number" && parsed.scrollY > 200) {
            const position = { scrollY: parsed.scrollY, progress: Math.min(100, Math.max(0, parsed.progress ?? 0)) };
            setSavedPosition(position);
            setShowResume(true);
          }
        }
      } catch {
        // Ignore invalid or unavailable browser storage and use the defaults.
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [slug]);

  const updateProgress = useCallback(() => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const currentProgress = scrollableHeight > 0 ? Math.min(100, Math.max(0, Math.round((window.scrollY / scrollableHeight) * 100))) : 0;
    setProgress(currentProgress);

    if (!restoring.current && allowSaving.current) {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        try {
          localStorage.setItem(positionKey(slug), JSON.stringify({ scrollY: window.scrollY, progress: currentProgress }));
        } catch {
          // Reading still works when storage is disabled or full.
        }
      }, 350);
    }
  }, [slug]);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (!restoring.current) allowSaving.current = true;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateProgress);
    };
    frame = requestAnimationFrame(updateProgress);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [updateProgress]);

  function changeSettings(next: ReaderSettings) {
    setSettings(next);
    try {
      localStorage.setItem(settingsKey(slug), JSON.stringify(next));
    } catch {
      // Preferences remain active for this visit even if storage is unavailable.
    }
  }

  function resumeReading() {
    if (!savedPosition) return;
    setShowResume(false);
    restoring.current = true;
    window.scrollTo({ top: savedPosition.scrollY, behavior: "smooth" });
    window.setTimeout(() => {
      restoring.current = false;
      allowSaving.current = true;
      updateProgress();
    }, 900);
  }

  const readerStyle = {
    "--reader-font-size": `${settings.fontSize}px`,
    "--reader-line-height": settings.lineHeight,
    "--reader-max-width": `${settings.width}px`,
  } as CSSProperties;

  return (
    <main className="reader-page min-h-screen bg-background text-foreground" style={readerStyle}>
      <div className="reader-progress-track" role="progressbar" aria-label="Reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-valuetext={`${progress}% read`}>
        <div className="reader-progress-fill" style={{ transform: `scaleX(${progress / 100})` }} />
      </div>
      <header className="site-header reader-header">
        <Link className="brand" href="/"><span className="brand-mark">د</span><span>dar al-kutub</span></Link>
        <div className="reader-settings">
          <button className="reader-settings-trigger" type="button" aria-expanded={settingsOpen} aria-controls="reader-settings-menu" onClick={() => setSettingsOpen((open) => !open)}>
            <span className="settings-type-icon">Aa</span><span>Reading settings</span><span className="settings-chevron">{settingsOpen ? "⌃" : "⌄"}</span>
          </button>
          {settingsOpen && <div className="reader-settings-menu" id="reader-settings-menu" aria-label="Reading settings">
            <div className="font-controls" aria-label="Text size">
              <button type="button" aria-label="Decrease text size" disabled={settings.fontSize <= 14} onClick={() => changeSettings({ ...settings, fontSize: Math.max(14, settings.fontSize - 1) })}>A−</button>
              <span>{settings.fontSize}</span>
              <button type="button" aria-label="Increase text size" disabled={settings.fontSize >= 22} onClick={() => changeSettings({ ...settings, fontSize: Math.min(22, settings.fontSize + 1) })}>A+</button>
            </div>
            <button className="setting-toggle" type="button" aria-pressed={settings.lineHeight === 2.2} onClick={() => changeSettings({ ...settings, lineHeight: settings.lineHeight === 2.2 ? defaultSettings.lineHeight : 2.2 })}>Line spacing <span>{settings.lineHeight === 2.2 ? "Relaxed" : "Comfortable"}</span></button>
            <button className="setting-toggle" type="button" aria-pressed={settings.width === 900} onClick={() => changeSettings({ ...settings, width: settings.width === 900 ? defaultSettings.width : 900 })}>Page width <span>{settings.width === 900 ? "Wide" : "Narrow"}</span></button>
          </div>}
        </div>
        <Link className="header-link back-link" href="/"><span>←</span> Back to library</Link>
      </header>
      {showResume && savedPosition && (
        <div className="resume-prompt" role="status">
          <p><strong>Welcome back.</strong> You were about {savedPosition.progress}% through this book.</p>
          <button type="button" onClick={resumeReading}>Continue reading <span>→</span></button>
          <button className="resume-dismiss" type="button" aria-label="Dismiss continue reading" onClick={() => setShowResume(false)}>×</button>
        </div>
      )}
      {children}
    </main>
  );
}
