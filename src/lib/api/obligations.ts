import api from "./client";

export interface ObligationResponse {
    id: number;
    name: string;
    type: string;
    monthlyAmount: number;
    beneficiary: string;
    endDate: string | null;
}

export interface CreateObligationDto {
    name: string;
    type: string;
    monthlyAmount: number;
    beneficiary: string;
    endDate?: string | null;
}

export interface UpdateObligationDto extends Partial<CreateObligationDto> { }

export const fetchObligations = () =>
    api.get<ObligationResponse[]>("/api/Obligations");

export const fetchObligation = (id: number) =>
    api.get<ObligationResponse>(`/api/Obligations/${id}`);

export const createObligation = (dto: CreateObligationDto) =>
    api.post<ObligationResponse>("/api/Obligations", dto);

export const updateObligation = (id: number, dto: UpdateObligationDto) =>
    api.put(`/api/Obligations/${id}`, dto);

export const deleteObligation = (id: number) =>
    api.delete(`/api/Obligations/${id}`);
