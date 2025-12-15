// src/app/obligations/ObligationsPage.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchObligations, createObligation, updateObligation, deleteObligation, type CreateObligationDto, type ObligationResponse } from "@/lib/api/obligations";
import { Search, Plus, Edit2, Trash2, TrendingUp, X, TrendingDown, Calendar, Heart, GraduationCap, Cross } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// Common obligation types for dropdown
const OBLIGATION_TYPES = [
    "Kids Education",
    "Family Medical",
    "Parents Support",
    "Charity Pledge",
    "Studies",
    "Other"
];

export default function ObligationsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingObligation, setEditingObligation] = useState<ObligationResponse | null>(null);

    const queryClient = useQueryClient();

    const { data: obligations, isLoading, isError, error } = useQuery({
        queryKey: ["obligations"],
        queryFn: () => fetchObligations().then(res => res.data),
    });

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateObligationDto>();

    const createMutation = useMutation({
        mutationFn: createObligation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["obligations"] });
            toast.success("Obligation added successfully");
            closeModal();
        },
        onError: () => {
            toast.error("Failed to add obligation");
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: CreateObligationDto }) => updateObligation(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["obligations"] });
            toast.success("Obligation updated successfully");
            closeModal();
        },
        onError: () => {
            toast.error("Failed to update obligation");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteObligation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["obligations"] });
            toast.success("Obligation deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete obligation");
        }
    });

    const openAddModal = () => {
        setEditingObligation(null);
        reset({
            name: "",
            type: "Other",
            monthlyAmount: 0,
            beneficiary: "",
            endDate: null
        });
        setIsModalOpen(true);
    };

    const openEditModal = (item: ObligationResponse) => {
        setEditingObligation(item);
        setValue("name", item.name);
        setValue("type", item.type);
        setValue("monthlyAmount", item.monthlyAmount);
        setValue("beneficiary", item.beneficiary);
        setValue("endDate", item.endDate ? item.endDate.split('T')[0] : "");
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingObligation(null);
        reset();
    };

    const onSubmit = (data: CreateObligationDto) => {
        const formattedData: CreateObligationDto = {
            ...data,
            monthlyAmount: Number(data.monthlyAmount),
        };

        if (editingObligation) {
            updateMutation.mutate({ id: editingObligation.id, data: formattedData });
        } else {
            createMutation.mutate(formattedData);
        }
    };

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this obligation?")) {
            deleteMutation.mutate(id);
        }
    };

    const filteredObligations = obligations?.filter((item: ObligationResponse) => {
        const name = item.name || "";
        const beneficiary = item.beneficiary || "";
        const type = item.type || "";
        const search = searchTerm.toLowerCase();
        return name.toLowerCase().includes(search) ||
            beneficiary.toLowerCase().includes(search) ||
            type.toLowerCase().includes(search);
    });

    const totalMonthlyObligations = obligations?.reduce((sum, item) => sum + (item.monthlyAmount || 0), 0) || 0;

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
                        Unable to load obligations
                    </h2>
                    <p className="text-base-content/60">
                        {error instanceof Error ? error.message : "We couldn't connect to the server to fetch your obligations. Please try again later."}
                    </p>
                </div>
                <button
                    onClick={() => queryClient.invalidateQueries({ queryKey: ["obligations"] })}
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
                <h1 className="text-5xl font-heading bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 bg-clip-text text-transparent animate-pulse">
                    Your Duty
                </h1>
                <div className="mt-4 flex flex-col items-center">
                    <span className="text-4xl font-bold text-base-content">
                        ${totalMonthlyObligations.toLocaleString()}<span className="text-lg text-base-content/50">/mo</span>
                    </span>
                    <p className="text-lg text-base-content/70 mt-1">
                        Committed to <b>{obligations?.length || 0}</b> beneficiaries
                    </p>
                </div>
            </div>

            {/* Search + Add Button */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="relative max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search your obligations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input input-bordered w-full pl-12 glass border-base-300/50 focus:border-primary/50 transition-all"
                    />
                </div>

                <button
                    onClick={openAddModal}
                    className="btn btn-primary btn-lg shadow-2xl hover:shadow-primary/50 transition-all duration-300 flex items-center gap-3 group"
                >
                    <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
                    <span className="font-semibold">Add Obligation</span>
                </button>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredObligations?.map((item: ObligationResponse) => {
                    const typeColor = item.type === "Kids Education" ? "#F59E0B" :
                        item.type === "Parents Support" ? "#8B5CF6" :
                            item.type === "Family Medical" ? "#EF4444" :
                                "#3B82F6";

                    const getIcon = () => {
                        if (item.type === "Kids Education") return <GraduationCap className="w-5 h-5" />;
                        if (item.type === "Family Medical") return <Cross className="w-5 h-5" />;
                        if (item.type === "Parents Support") return <Heart className="w-5 h-5" />;
                        return null;
                    };

                    return (
                        <div key={item.id} className="relative group">
                            {/* Animated Gradient Border */}
                            <div
                                className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 animate-tilt"
                                style={{
                                    background: `linear-gradient(135deg, ${typeColor}, #6366F1)`,
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
                                        className="badge badge-lg text-white font-bold shadow-lg mx-auto gap-2"
                                        style={{ backgroundColor: typeColor }}
                                    >
                                        {getIcon()}
                                        {item.type}
                                    </div>
                                </div>

                                {/* Name */}
                                <h3 className="text-2xl font-heading mb-2 line-clamp-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    {item.name || "Unnamed Obligation"}
                                </h3>

                                <div className="flex items-center justify-center gap-2 text-base-content/60 mb-4 text-sm font-medium">
                                    For: {item.beneficiary}
                                </div>

                                {/* Amount */}
                                <div className="mb-6">
                                    <p className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                        ${Number(item.monthlyAmount).toLocaleString()}
                                    </p>
                                    <div className="text-xs text-base-content/50 mt-1">
                                        / month
                                    </div>
                                </div>

                                {/* End Date */}
                                {item.endDate && (
                                    <div className="mt-4 text-xs text-base-content/40 flex items-center justify-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        Ends {new Date(item.endDate).toLocaleDateString()}
                                    </div>
                                )}
                                {!item.endDate && (
                                    <div className="mt-4 text-xs text-base-content/40 flex items-center justify-center gap-1">
                                        <TrendingUp className="w-3 h-3" />
                                        Ongoing
                                    </div>
                                )}

                                {/* Hover Actions */}
                                <div className="flex justify-center gap-4 mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button
                                        onClick={() => openEditModal(item)}
                                        className="btn btn-ghost btn-circle"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
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
                                {editingObligation ? "Edit Obligation" : "Add Obligation"}
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
                                    placeholder="e.g. Grandma's Care"
                                    className="input input-bordered w-full"
                                    {...register("name", { required: true })}
                                />
                                {errors.name && <span className="text-error text-sm mt-1">Name is required</span>}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Beneficiary</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Mary Smith"
                                    className="input input-bordered w-full"
                                    {...register("beneficiary", { required: true })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">Type</span>
                                    </label>
                                    <select className="select select-bordered w-full" {...register("type", { required: true })}>
                                        {OBLIGATION_TYPES.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">Monthly Amount</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        className="input input-bordered w-full"
                                        {...register("monthlyAmount", { required: true, min: 0 })}
                                    />
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">End Date (Optional)</span>
                                </label>
                                <input
                                    type="date"
                                    className="input input-bordered w-full"
                                    {...register("endDate")}
                                />
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
                                        editingObligation ? "Update" : "Create"
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
