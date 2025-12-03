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
        <aside className="hidden lg:flex w-64 flex-col bg-base-100 border-r border-base-300">
            <nav className="flex-1 px-4 py-6 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                    ? "bg-primary text-white shadow-lg"
                                    : "hover:bg-base-200 text-base-content"
                                }`
                            }
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-base-300">
                <div className="text-xs text-base-content/60 text-center">
                    Arca Nostra — Tua res, nostra cura
                </div>
            </div>
        </aside>
    );
}