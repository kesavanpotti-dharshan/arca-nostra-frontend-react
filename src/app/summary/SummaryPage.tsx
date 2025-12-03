import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";

export default function SummaryPage() {
    const { data, isLoading } = useQuery({
        queryKey: ["summary"],
        queryFn: () => axios.get("/api/assets/summary").then(res => res.data),
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    const summary = data;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl font-heading bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Financial Overview
                </h1>
                <p className="text-base-content/70 mt-2">
                    Updated {format(new Date(summary.generatedAt), "dd MMM yyyy, HH:mm")}
                </p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card bg-base-100 shadow-xl glass">
                    <div className="card-body text-center">
                        <h2 className="card-title text-accent">Net Worth</h2>
                        <p className="text-3xl font-bold text-primary">
                            ${summary.totalNetWorth.toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-xl glass">
                    <div className="card-body text-center">
                        <h2 className="card-title text-success">Monthly Passive Income</h2>
                        <p className="text-3xl font-bold text-success">
                            ${summary.monthlyPassiveIncome.toFixed(0)}/mo
                        </p>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-xl glass">
                    <div className="card-body text-center">
                        <h2 className="card-title">Portfolio Yield</h2>
                        <p className="text-3xl font-bold text-warning">
                            {summary.portfolioYield.toFixed(2)}%
                        </p>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-xl glass">
                    <div className="card-body text-center">
                        <h2 className="card-title">Assets</h2>
                        <p className="text-3xl font-bold">{summary.assetCount}</p>
                    </div>
                </div>
            </div>

            {/* Top Income Generators */}
            {summary.topIncomeGenerators.length > 0 && (
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-xl mb-4">Top Income Generators</h2>
                        <div className="space-y-3">
                            {summary.topIncomeGenerators.map((gen: any) => (
                                <div key={gen.rank} className="flex items-center justify-between p-4 bg-base-200/50 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="text-2xl font-bold text-primary">#{gen.rank}</div>
                                        <div>
                                            <p className="font-semibold">{gen.assetName}</p>
                                            <p className="text-sm text-base-content/70">{gen.assetType}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-success">
                                            ${gen.monthlyIncome.toFixed(0)}/mo
                                        </p>
                                        <p className="text-sm text-base-content/70">
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