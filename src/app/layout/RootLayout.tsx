// src/app/layout/RootLayout.tsx
import { Route, Routes } from "react-router-dom";
import { Header } from "@/components/common/Header";
import { Sidebar } from "@/components/common/Sidebar";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Toaster } from "sonner";
import SummaryPage from "../summary/SummaryPage";

export default function RootLayout() {
    return (
        <ThemeProvider>
            <div className="min-h-screen bg-base-100 text-base-content flex flex-col">
                {/* Header */}
                <Header />

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar - Hidden on mobile, always visible on lg+ */}
                    <Sidebar />

                    {/* Main Content Area */}
                    <main className="flex-1 overflow-y-auto bg-base-200/30">
                        <div className="container mx-auto px-4 py-8 max-w-7xl">
                            <Routes>
                                <Route path="/" element={<SummaryPage />} />
                                <Route path="*" element={<div>404 - Not Found</div>} />
                            </Routes>
                        </div>
                    </main>
                </div>

                {/* Toast Notifications */}
                <Toaster
                    position="top-right"
                    richColors
                    closeButton
                    toastOptions={{
                        classNames: {
                            toast: "glass border border-base-300 shadow-2xl",
                            title: "font-heading text-lg",
                            success: "bg-success/90 text-success-content",
                            error: "bg-error/90 text-error-content",
                            info: "bg-info/90 text-info-content",
                        },
                    }}
                />
            </div>
        </ThemeProvider>
    );
}