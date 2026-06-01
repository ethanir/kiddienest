"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("careloop-theme");
    const shouldUseDark = savedTheme === "dark";
    setIsDark(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  function toggleTheme() {
    const nextValue = !isDark;
    setIsDark(nextValue);
    document.documentElement.classList.toggle("dark", nextValue);
    window.localStorage.setItem("careloop-theme", nextValue ? "dark" : "light");
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={toggleTheme}
      className="h-12 rounded-full border-slate-200 bg-white/80 px-5 font-black text-slate-800 shadow-sm hover:bg-white"
    >
      {isDark ? (
        <>
          <Sun className="mr-2 size-4" />
          Light
        </>
      ) : (
        <>
          <Moon className="mr-2 size-4" />
          Dark
        </>
      )}
    </Button>
  );
}
