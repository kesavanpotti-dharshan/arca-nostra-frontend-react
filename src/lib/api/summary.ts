// src/lib/api/summary.ts
import api from "./client";

export interface SummaryResponse {
    totalNetWorth: number;
    monthlyPassiveIncome: number;
    totalAnnualIncome: number;
    portfolioYield: number;
    assetCount: number;
    topIncomeGenerators: Array<{
        rank: number;
        assetId: number;
        assetName: string;
        assetType: string;
        annualIncome: number;
        monthlyIncome: number;
        percentageOfTotal: number;
    }>;
    generatedAt: string;
}

export const fetchSummary = () =>
    api.get<SummaryResponse>("/api/Assets/summary");