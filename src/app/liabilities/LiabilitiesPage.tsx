// src/app/liabilities/LiabilitiesPage.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchLiabilities, createLiability, updateLiability, deleteLiability, type CreateLiabilityDto, type LiabilityResponse } from "@/lib/api/liabilities";
import { Search, Plus, Edit2, Trash2, TrendingDown, X, Building2, Lock, Unlock } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// Common liability types for the dropdown
const LIABILITY_TYPES = [
    "Mortgage",
    "Credit Card",
    "Personal Loan",
    "Car Loan",
    "Student Loan",
    "Other"
];

export default function LiabilitiesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLiability, setEditingLiability] = useState<LiabilityResponse | null>(null);

    const queryClient = useQueryClient();

    const { data: liabilities, isLoading, isError, error } = useQuery({
        queryKey: ["liabilities"],
        queryFn: () => fetchLiabilities().then(res => res.data),
    });

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateLiabilityDto>();

    const createMutation = useMutation({
        mutationFn: createLiability,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["liabilities"] });
            toast.success("Liability added successfully");
            closeModal();
        },
        onError: () => {
            toast.error("Failed to add liability");
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: CreateLiabilityDto }) => updateLiability(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["liabilities"] });
            toast.success("Liability updated successfully");
            closeModal();
        },
        onError: () => {
            toast.error("Failed to update liability");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteLiability,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["liabilities"] });
            toast.success("Liability deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete liability");
        }
    });

    const openAddModal = () => {
        setEditingLiability(null);
        reset({
            name: "",
            type: "Credit Card",
            currentBalance: 0,
            monthlyPayment: 0,
            interestRate: 0,
            creditor: "",
            isSecured: false,
            endDate: null
        });
        setIsModalOpen(true);
    };

    const openEditModal = (liability: LiabilityResponse) => {
        setEditingLiability(liability);
        setValue("name", liability.name);
        setValue("type", liability.type);
        setValue("currentBalance", liability.currentBalance);
        setValue("monthlyPayment", liability.monthlyPayment);
        setValue("interestRate", liability.interestRate);
        setValue("creditor", liability.creditor);
        setValue("isSecured", liability.isSecured);
        setValue("endDate", liability.endDate);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingLiability(null);
        reset();
    };

    const onSubmit = (data: CreateLiabilityDto) => {
        // Ensure numbers are numbers
        const formattedData = {
            ...data,
            currentBalance: Number(data.currentBalance),
            monthlyPayment: Number(data.monthlyPayment),
            interestRate: Number(data.interestRate),
        };

        if (editingLiability) {
            updateMutation.mutate({ id: editingLiability.id, data: formattedData });
        } else {
            createMutation.mutate(formattedData);
        }
    };

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this liability?")) {
            deleteMutation.mutate(id);
        }
    };

    const filteredLiabilities = liabilities?.filter((liability: LiabilityResponse) => {
        const name = liability?.name || "";
        const type = liability?.type || "";
        const creditor = liability?.creditor || "";
        const search = searchTerm.toLowerCase();
        return name.toLowerCase().includes(search) ||
            type.toLowerCase().includes(search) ||
            creditor.toLowerCase().includes(search);
    });

    const totalLiabilities = liabilities?.reduce((sum, item) => sum + (item.currentBalance || 0), 0) || 0;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 space-y-6">
                <div className="bg-error/10 p-6 rounded-full">
                    <TrendingDown className="w-16 h-16 text-error" />
                </div>
                <div className="max-w-md space-y-2">
                    <h2 className="text-3xl font-heading font-bold text-base-content">
                        Unable to load liabilities
                    </h2>
                    <p className="text-base-content/60">
                        {error instanceof Error ? error.message : "We couldn't connect to the server to fetch your liabilities. Please try again later."}
                    </p>
                </div>
                <button
                    onClick={() => queryClient.invalidateQueries({ queryKey: ["liabilities"] })}
                    className="btn btn-outline btn-error gap-2"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Hero Header */}
            <div className="text-center">
                <h1 className="text-5xl font-heading bg-gradient-to-r from-red-500 via-orange-500 to-red-500 bg-clip-text text-transparent animate-pulse">
                    Your Liabilities
                </h1>
                <div className="mt-4 flex flex-col items-center">
                    <span className="text-4xl font-bold text-error">
                        -${totalLiabilities.toLocaleString()}
                    </span>
                    <p className="text-lg text-base-content/70 mt-1">
                        Total across <b>{liabilities?.length || 0}</b> liabilities
                    </p>
                </div>
            </div>

            {/* Search + Add Button */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="relative max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search liabilities..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input input-bordered w-full pl-12 glass border-base-300/50 focus:border-primary/50 transition-all"
                    />
                </div>

                <button
                    onClick={openAddModal}
                    className="btn btn-error btn-lg shadow-2xl hover:shadow-error/50 transition-all duration-300 flex items-center gap-3 group"
                >
                    <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
                    <span className="font-semibold">Add Liability</span>
                </button>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredLiabilities?.map((liability: LiabilityResponse) => {
                    const balance = liability.currentBalance ?? 0;
                    const monthlyPayment = liability.monthlyPayment ?? 0;
                    const typeColor = "#ef4444"; // Default red for liabilities

                    return (
                        <div key={liability.id} className="relative group">
                            {/* Animated Gradient Border */}
                            <div
                                className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-orange-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 animate-tilt"
                                style={{
                                    background: `linear-gradient(135deg, ${typeColor}, #f97316)`,
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
                                        {liability.type || "Debt"}
                                    </div>
                                </div>

                                {/* Liability Name */}
                                <h3 className="text-2xl font-heading mb-2 line-clamp-2 bg-gradient-to-r from-error to-orange-500 bg-clip-text text-transparent">
                                    {liability.name || "Unnamed Liability"}
                                </h3>

                                <div className="flex items-center justify-center gap-2 text-base-content/60 mb-4 text-sm">
                                    <Building2 className="w-4 h-4" />
                                    <span>{liability.creditor}</span>
                                </div>


                                {/* Value */}
                                <div className="mb-6">
                                    <p className="text-4xl font-bold bg-gradient-to-r from-error to-orange-500 bg-clip-text text-transparent">
                                        -${Number(balance).toLocaleString()}
                                    </p>
                                    <div className="text-xs text-base-content/50 mt-1 flex items-center justify-center gap-1">
                                        {liability.isSecured ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                                        {liability.isSecured ? "Secured" : "Unsecured"}
                                    </div>
                                </div>

                                {/* Monthly Payment */}
                                {monthlyPayment > 0 && (
                                    <div className="flex items-center justify-center gap-3 text-error">
                                        <TrendingDown className="w-6 h-6" />
                                        <span className="text-xl font-bold">
                                            -${monthlyPayment.toFixed(0)}/mo
                                        </span>
                                    </div>
                                )}

                                <div className="mt-2 text-sm text-base-content/60">
                                    {liability.interestRate}% APR
                                </div>

                                {/* Hover Actions */}
                                <div className="flex justify-center gap-4 mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button
                                        onClick={() => openEditModal(liability)}
                                        className="btn btn-ghost btn-circle"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(liability.id)}
                                        className="btn btn-ghost btn-circle text-error"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-base-100 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-base-300">
                        <div className="p-6 border-b border-base-300 flex justify-between items-center bg-base-200/50">
                            <h3 className="text-2xl font-heading font-bold">
                                {editingLiability ? "Edit Liability" : "Add Liability"}
                            </h3>
                            <button onClick={closeModal} className="btn btn-ghost btn-circle btn-sm">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Name</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Chase Sapphire Reserve"
                                    className="input input-bordered w-full"
                                    {...register("name", { required: true })}
                                />
                                {errors.name && <span className="text-error text-sm mt-1">Name is required</span>}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Creditor</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Chase Bank"
                                    className="input input-bordered w-full"
                                    {...register("creditor", { required: true })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">Type</span>
                                    </label>
                                    <select className="select select-bordered w-full" {...register("type", { required: true })}>
                                        {LIABILITY_TYPES.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">Current Balance</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        className="input input-bordered w-full"
                                        {...register("currentBalance", { required: true, min: 0 })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">Monthly Payment</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        className="input input-bordered w-full"
                                        {...register("monthlyPayment", { min: 0 })}
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">Interest Rate (%)</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        className="input input-bordered w-full"
                                        {...register("interestRate", { min: 0 })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label cursor-pointer justify-start gap-4">
                                        <span className="label-text font-medium">Secured Loan</span>
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-primary"
                                            {...register("isSecured")}
                                        />
                                    </label>
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">End Date</span>
                                    </label>
                                    <input
                                        type="date"
                                        className="input input-bordered w-full"
                                        {...register("endDate")}
                                    />
                                </div>
                            </div>

                            <div className="modal-action pt-4">
                                <button type="button" onClick={closeModal} className="btn btn-ghost">Cancel</button>
                                <button
                                    type="submit"
                                    className="btn btn-primary px-8"
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                >
                                    {createMutation.isPending || updateMutation.isPending ? (
                                        <span className="loading loading-spinner"></span>
                                    ) : (
                                        editingLiability ? "Update" : "Create"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

