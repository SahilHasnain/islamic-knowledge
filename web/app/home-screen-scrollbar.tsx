"use client";

import { useEffect } from "react";

export default function HomeScreenScrollbar() {
  useEffect(() => {
    const previousValue = document.documentElement.style.scrollbarWidth;
    document.documentElement.style.scrollbarWidth = "none";
    return () => {
      document.documentElement.style.scrollbarWidth = previousValue;
    };
  }, []);

  return null;
}
