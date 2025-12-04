// src/lib/api/assets.ts
import api from "./client";

export interface AssetResponse {
    id: number;
    name: string;
    assetTypeId: number;
    assetType: {
        id: number;
        name: string;
        colorHex?: string;
        iconName?: string;
    };
    currentValue: number;
    monthlyIncome?: number;
    lastUpdated: string;
    ticker?: string;
    quantity?: number;
}

export interface CreateAssetDto {
    assetTypeId: number;
    name: string;
    currentValue?: number;
    quantity?: number;
    ticker?: string;
    annualIncome?: number;
    yieldPercentage?: number;
    currency?: string;
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