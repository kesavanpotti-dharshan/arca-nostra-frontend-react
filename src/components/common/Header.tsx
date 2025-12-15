// src/components/common/Header.tsx
import { DarkModeToggle } from "./DarkModeToggle";
import { useTheme } from "@/hooks/useTheme";

export function Header() {
    const { darkMode } = useTheme();
    return (
        <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${darkMode ? "bg-base-100/60 border-base-300/50 shadow-2xl" : "bg-white/70 border-gray-200/50 shadow-sm"
            }`}>
            <div className="navbar px-6 min-h-20 lg:min-h-24">
                {/* Logo */}
                <div className="flex-1">
                    <div className="flex items-center gap-4 group cursor-pointer">
                        <div className="relative">
                            <div className="absolute -inset-1 blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-xl animate-tilt"></div>
                            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center shadow-xl ring-1 ring-white/10">
                                <span className="text-2xl font-heading font-black text-amber-500">AN</span>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 bg-clip-text text-transparent tracking-widest uppercase shadow-black drop-shadow-sm group-hover:scale-105 transition-transform origin-left">
                                Arca Nostra
                            </h1>
                            <span className="text-xs font-heading tracking-[0.3em] text-base-content/40 uppercase pl-0.5">
                                Wealth Fortress
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Side — Avatar + Theme Toggle */}
                <div className="flex items-center gap-6">
                    {/* Theme Toggle */}
                    <DarkModeToggle />

                    {/* User Avatar */}
                    <div className="avatar placeholder group cursor-pointer">
                        <div className="w-12 rounded-full ring-2 ring-yellow-500/50 ring-offset-2 ring-offset-base-100 transition-all duration-300 group-hover:ring-4 group-hover:ring-yellow-400 group-hover:shadow-[0_0_20px_rgba(250,204,21,0.5)]">
                            <div className="bg-gradient-to-tr from-indigo-900 to-slate-800 w-full h-full flex items-center justify-center text-amber-400">
                                <span className="text-lg font-heading font-bold">DK</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}