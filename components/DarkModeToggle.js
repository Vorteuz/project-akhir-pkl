"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function DarkModeToggle() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Check localStorage and system preference
        const savedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);
        setIsDark(shouldBeDark);
        document.documentElement.setAttribute("data-theme", shouldBeDark ? "dark" : "corporate");
    }, []);

    const toggleDarkMode = () => {
        const newTheme = !isDark ? "dark" : "corporate";
        setIsDark(!isDark);
        localStorage.setItem("theme", newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    };

    return (
        <label className="swap swap-rotate btn btn-ghost btn-circle btn-sm">
            <input
                type="checkbox"
                checked={isDark}
                onChange={toggleDarkMode}
                className="hidden"
            />

            {/* Sun icon */}
            <Sun className={`swap-off fill-current ${!isDark ? 'block' : 'hidden'}`} size={18} />

            {/* Moon icon */}
            <Moon className={`swap-on fill-current ${isDark ? 'block' : 'hidden'}`} size={18} />
        </label>
    );
}
