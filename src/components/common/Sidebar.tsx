// src/components/common/Sidebar.tsx
import { NavLink } from "react-router-dom";
import {
    HomeIcon,
    WalletIcon,
    CreditCardIcon,
    HeartIcon,
    ChartBarIcon,
    Cog6ToothIcon
} from "@heroicons/react/24/outline";

const navItems = [
    { to: "/", label: "Summary", icon: HomeIcon },
    { to: "/assets", label: "Assets", icon: WalletIcon },
    { to: "/liabilities", label: "Liabilities", icon: CreditCardIcon },
    { to: "/obligations", label: "Obligations", icon: HeartIcon },
    { to: "/reports", label: "Reports", icon: ChartBarIcon },
    { to: "/settings", label: "Settings", icon: Cog6ToothIcon },
];

export function Sidebar() {
    return (
        <aside className="hidden lg:flex w-72 flex-col h-full border-r border-base-300 dark:border-white/10 bg-base-100/50 dark:bg-base-100/80 backdrop-blur-xl relative z-40">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

            <nav className="flex-1 px-4 py-8 space-y-2 relative">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end
                            className={({ isActive }) =>
                                `relative group flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 overflow-hidden ${isActive
                                    ? "text-amber-500 font-heading font-bold shadow-sm bg-base-100"
                                    : "text-base-content/60 hover:text-base-content hover:bg-base-content/5"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {/* Active Background Gradient */}
                                    {isActive && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent dark:from-gray-900 dark:to-slate-800 border-l-4 border-amber-500" />
                                    )}

                                    {/* Hover Glow */}
                                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Active Indicator Line */}
                                    {isActive && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 to-amber-600 shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                                    )}

                                    <div className="relative z-10 flex items-center gap-4">
                                        <Icon className={`w-6 h-6 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" : ""}`} />
                                        <span className={`tracking-wide ${isActive ? "text-lg" : "font-medium"}`}>{item.label}</span>
                                    </div>

                                    {/* Chevron for Active */}
                                    {isActive && (
                                        <div className="absolute right-4 text-amber-500/50 animate-pulse">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-base-content/10 dark:border-white/5 relative">
                <div className="text-center space-y-2">
                    <p className="font-heading text-xs uppercase tracking-[0.2em] text-amber-500 font-bold">
                        Arca Nostra
                    </p>
                    <p className="font-serif italic text-xs text-base-content/40">
                        "Tua res, nostra cura"
                    </p>
                </div>
            </div>
        </aside>
    );
}