// src/lib/api/assets.ts
import api from "./client";

export interface AssetResponse {
    id: number;
    assetTypeId: number;
    assetType: string | null;
    assetName: string;
    ticker: string;
    currentValue: number | null;
    quantity: number;
    purchasePricePerUnit: number | null;
    costBasis: number | null;
    annualIncome: number | null;
    yieldPercentage: number | null;
    incomeFrequency: number;
    purchaseDate: string | null;
    lastIncomeDate: string | null;
    nextIncomeDate: string | null;
    lastUpdated: string;
    currency: string;
    country: string | null;
    secondaryCurrency: string | null;
    notes: string | null;
    isActive: boolean;
    unrealizedGainLoss: number | null;
    unrealizedGainLossPercent: number | null;
    monthlyIncome: number | null;
}

export interface CreateAssetDto {
    assetName: string;
    assetTypeId: number;
    ticker?: string;
    quantity?: number;
    purchasePricePerUnit?: number;
    purchaseDate?: string;
    currency?: string;
    notes?: string;
    isActive?: boolean;
}

export interface UpdateAssetDto extends Partial<CreateAssetDto> { }

export const fetchAssets = () =>
    api.get<AssetResponse[]>("/api/Assets");

export const fetchAsset = (id: number) =>
    api.get<AssetResponse>(`/api/Assets/${id}`);

export const createAsset = (dto: CreateAssetDto) =>
    api.post<AssetResponse>("/api/Assets", dto);

export const updateAsset = (id: number, dto: UpdateAssetDto) =>
    api.put(`/api/Assets/${id}`, dto);

export const deleteAsset = (id: number) =>
    api.delete(`/api/Assets/${id}`);