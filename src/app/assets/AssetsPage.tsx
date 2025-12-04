// src/app/assets/AssetsPage.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAssets } from "@/lib/api/assets";
import { Search, Plus, Edit2, Trash2, TrendingUp } from "lucide-react";

export default function AssetsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const { data: assets, isLoading } = useQuery({
        queryKey: ["assets"],
        queryFn: () => fetchAssets().then(res => res.data),
    });

    const filteredAssets = assets?.filter((asset: any) => {
        const name = asset?.assetName || "";
        const type = asset?.currency || "";
        return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            type.toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Hero Header */}
            <div className="text-center">
                <h1 className="text-5xl font-heading bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
                    Your Empire
                </h1>
                <p className="text-xl text-base-content/70 mt-4">
                    {assets?.length || 0} income-generating assets
                </p>
            </div>

            {/* Search + Add Button */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="relative max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search your empire..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input input-bordered w-full pl-12 glass border-base-300/50 focus:border-primary/50 transition-all"
                    />
                </div>

                <button className="btn btn-primary btn-lg shadow-2xl hover:shadow-primary/50 transition-all duration-300 flex items-center gap-3 group">
                    <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
                    <span className="font-semibold">Add Asset</span>
                </button>
            </div>

            {/* Luxury Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredAssets?.map((asset: any) => {
                    const value = asset.currentValue ?? asset.quantity ?? 0;
                    const monthlyIncome = asset.yieldPercentage
                        ? (value * (asset.yieldPercentage / 100) / 12)
                        : 0;

                    const typeColor = asset.currency === "Bank"
                        ? "#10b981"
                        : asset.currency === "Credit"
                            ? "#ef4444"
                            : "#6366F1";

                    return (
                        <div key={asset.id} className="relative group">
                            {/* Animated Gradient Border */}
                            <div
                                className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 animate-tilt"
                                style={{
                                    background: `linear-gradient(135deg, ${typeColor}, #8B5CF6)`,
                                }}
                            />

                            {/* Glass Card */}
                            <div className="relative glass rounded-3xl p-8 text-center shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-3xl">
                                {/* Inner Glow Border */}
                                <div
                                    className="absolute inset-0 rounded-3xl border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                                    style={{ borderColor: typeColor }}
                                />

                                {/* Type Badge */}
                                <div className="mb-6">
                                    <div
                                        className="badge badge-lg text-white font-bold shadow-lg mx-auto"
                                        style={{ backgroundColor: typeColor }}
                                    >
                                        {asset.currency || "Unknown"}
                                    </div>
                                </div>

                                {/* Asset Name */}
                                <h3 className="text-2xl font-heading mb-4 line-clamp-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                    {asset.assetName || "Unnamed Asset"}
                                </h3>

                                {/* Value */}
                                <div className="mb-6">
                                    <p className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                        ${Number(value).toLocaleString()}
                                    </p>
                                </div>

                                {/* Monthly Income */}
                                {monthlyIncome > 0 && (
                                    <div className="flex items-center justify-center gap-3 text-success">
                                        <TrendingUp className="w-6 h-6" />
                                        <span className="text-xl font-bold">
                                            +${monthlyIncome.toFixed(0)}/mo
                                        </span>
                                    </div>
                                )}

                                {/* Hover Actions */}
                                <div className="flex justify-center gap-4 mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button className="btn btn-ghost btn-circle">
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button className="btn btn-ghost btn-circle text-error">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}