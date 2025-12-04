// src/app/summary/SummaryPage.tsx
import { useQuery } from "@tanstack/react-query";
import { fetchSummary } from "@/lib/api/summary";

export default function SummaryPage() {
    const { data: summary, isLoading } = useQuery({
        queryKey: ["summary"],
        queryFn: () => fetchSummary().then(res => res.data),
    });

    if (isLoading || !summary) {
        return (
            <div className="flex items-center justify-center h-96">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    const cards = [
        {
            title: "Net Worth",
            value: `$${summary.totalNetWorth.toLocaleString()}`,
            gradient: "from-primary to-accent",
            border: "border-primary/50",
        },
        {
            title: "Monthly Passive Income",
            value: `$${summary.monthlyPassiveIncome.toFixed(0)}/mo`,
            gradient: "from-emerald-500 to-teal-600",
            border: "border-emerald-500/60",
        },
        {
            title: "Portfolio Yield",
            value: `${summary.portfolioYield.toFixed(2)}%`,
            gradient: "from-amber-500 to-orange-600",
            border: "border-amber-500/60",
        },
        {
            title: "Total Assets",
            value: summary.assetCount.toString(),
            gradient: "from-violet-600 to-purple-700",
            border: "border-violet-600/60",
        },
    ];

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-5xl font-heading bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
                    Financial Empire
                </h1>
                <p className="text-base-content/70 mt-3 text-lg">
                    Updated {new Date(summary.generatedAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </p>
            </div>

            {/* Luxury Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {cards.map((card, i) => (
                    <div
                        key={i}
                        className="relative group"
                    >
                        {/* Animated Gradient Border */}
                        <div className={`absolute -inset-0.5 bg-gradient-to-r ${card.gradient} rounded-2xl blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt`} />

                        {/* Glass Card */}
                        <div className="relative bg-base-100/90 backdrop-blur-xl rounded-2xl border border-base-300/50 p-8 text-center shadow-2xl transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-3xl">
                            {/* Glowing Border Effect */}
                            <div className={`absolute inset-0 rounded-2xl border-2 ${card.border} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

                            <h3 className="text-lg font-medium text-base-content/70 mb-3">
                                {card.title}
                            </h3>
                            <p className={`text-4xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                                {card.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Top Income Generators */}
            {summary.topIncomeGenerators.length > 0 && (
                <div className="mt-16 card bg-base-100/90 backdrop-blur-xl shadow-2xl border border-base-300/50">
                    <div className="card-body">
                        <h2 className="card-title text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Top Income Generators
                        </h2>
                        <div className="space-y-4 mt-6">
                            {summary.topIncomeGenerators.map((gen: any) => (
                                <div
                                    key={gen.rank}
                                    className="flex items-center justify-between p-6 bg-gradient-to-r from-base-200/50 to-base-300/30 rounded-2xl border border-base-300/30 hover:border-primary/50 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="text-4xl font-bold text-primary">#{gen.rank}</div>
                                        <div>
                                            <p className="text-xl font-semibold">{gen.assetName}</p>
                                            <p className="text-base-content/70">{gen.assetType}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-success">
                                            ${gen.monthlyIncome.toFixed(0)}/mo
                                        </p>
                                        <p className="text-sm text-base-content/60">
                                            {gen.percentageOfTotal.toFixed(1)}% of income
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}