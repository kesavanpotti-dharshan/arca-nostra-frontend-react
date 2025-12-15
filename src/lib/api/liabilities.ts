import api from "./client";

export interface LiabilityResponse {
    id: number;
    name: string;
    type: string;
    currentBalance: number;
    monthlyPayment: number;
    interestRate: number;
    creditor: string;
    endDate: string | null;
    isSecured: boolean;
}

export interface CreateLiabilityDto {
    name: string;
    type: string;
    currentBalance: number;
    monthlyPayment: number;
    interestRate: number;
    creditor: string;
    endDate?: string | null;
    isSecured: boolean;
}

export interface UpdateLiabilityDto extends Partial<CreateLiabilityDto> { }

// MOCKED DATA REMOVED - Using Real API

export const fetchLiabilities = () =>
    api.get<LiabilityResponse[]>("/api/Liabilities");

export const fetchLiability = (id: number) =>
    api.get<LiabilityResponse>(`/api/Liabilities/${id}`);

export const createLiability = (dto: CreateLiabilityDto) =>
    api.post<LiabilityResponse>("/api/Liabilities", dto);

export const updateLiability = (id: number, dto: UpdateLiabilityDto) =>
    api.put(`/api/Liabilities/${id}`, dto);

export const deleteLiability = (id: number) =>
    api.delete(`/api/Liabilities/${id}`);

