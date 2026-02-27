import { useState, useEffect } from "react"
import { Sidebar } from "../components/Sidebar"
import { Outlet } from "react-router-dom"

function RootLayout() {
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("theme");
            if (savedTheme) return savedTheme === "dark";
            return window.matchMedia("(prefers-color-scheme: dark)").matches;
        }
        return true;
    });

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDark]);

    return (
        <div className="flex min-h-screen bg-white dark:bg-black transition-colors duration-500">
            <Sidebar isDark={isDark} setIsDark={setIsDark} />
            <main className="flex-1 overflow-x-hidden">
                <Outlet context={{ isDark, setIsDark }} />
            </main>
        </div>
    )
}

export default RootLayout