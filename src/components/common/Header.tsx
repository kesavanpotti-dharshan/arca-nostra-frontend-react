// src/components/common/Header.tsx
import { DarkModeToggle } from "./DarkModeToggle";
import { useTheme } from "@/hooks/useTheme";

export function Header() {
    const { darkMode } = useTheme();
    return (
        <header className={`sticky top-0 z-50 backdrop-blur border-b ${darkMode ? "bg-base-100/80 border-base-300" : "bg-white/90 border-gray-200"
            }`}>
            <div className="navbar px-6 min-h-16">
                {/* Logo */}
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                            <span className="text-xl font-bold text-white">AN</span>
                        </div>
                        <h1 className="text-2xl font-heading bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Arca Nostra
                        </h1>
                    </div>
                </div>

                {/* Right Side — Avatar + Theme Toggle */}
                <div className="flex items-center gap-4">
                    {/* Theme Toggle */}
                    <DarkModeToggle />

                    {/* User Avatar */}
                    <div className="avatar placeholder">
                        <div className="bg-gradient-to-br from-primary to-accent text-white rounded-full w-10 ring ring-white/20 ring-offset-2 ring-offset-base-100 flex items-center justify-center">
                            {/* <span className="text-sm font-bold">HN</span> */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}