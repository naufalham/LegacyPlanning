"use client";

import { useState, useEffect } from "react";
import {
    UserPlus,
    Users,
    Mail,
    Trash2,
    Copy,
    Check,
    Clock,
    CheckCircle,
    XCircle,
    X,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

interface Beneficiary {
    id: string;
    name: string;
    email: string;
    relationship: string;
    accessKey: string;
    verificationStatus: string;
    createdAt: string;
}

const relationships = [
    "Spouse",
    "Child",
    "Parent",
    "Sibling",
    "Friend",
    "Business Partner",
    "Lawyer",
    "Other",
];

export default function BeneficiariesPage() {
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const [isDark, setIsDark] = useState(false);

    // Form state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [relationship, setRelationship] = useState("");

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        setIsDark(mediaQuery.matches);
        const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    useEffect(() => {
        fetchBeneficiaries();
    }, []);

    const fetchBeneficiaries = async () => {
        try {
            const res = await fetch("/api/beneficiaries");
            if (res.ok) {
                const data = await res.json();
                setBeneficiaries(data.beneficiaries);
            }
        } catch (error) {
            console.error("Failed to fetch beneficiaries:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddBeneficiary = async () => {
        if (!name || !email || !relationship) {
            toast.error("Please fill in all fields");
            return;
        }

        setSaving(true);
        try {
            const res = await fetch("/api/beneficiaries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, relationship }),
            });

            if (res.ok) {
                toast.success("Beneficiary added! They will be notified by email.");
                fetchBeneficiaries();
                closeAndReset();
            } else {
                const data = await res.json();
                throw new Error(data.error || "Failed to add beneficiary");
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteBeneficiary = async (id: string) => {
        if (!confirm("Are you sure you want to remove this beneficiary?")) return;

        try {
            const res = await fetch(`/api/beneficiaries?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Beneficiary removed");
                fetchBeneficiaries();
            }
        } catch (error) {
            toast.error("Failed to remove beneficiary");
        }
    };

    const closeAndReset = () => {
        setShowAddModal(false);
        setName("");
        setEmail("");
        setRelationship("");
    };

    const copyAccessKey = (key: string) => {
        navigator.clipboard.writeText(key);
        setCopiedKey(key);
        toast.success("Access key copied!");
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "VERIFIED":
                return <CheckCircle style={{ width: "16px", height: "16px", color: "#10b981" }} />;
            case "FAILED":
                return <XCircle style={{ width: "16px", height: "16px", color: "#ef4444" }} />;
            default:
                return <Clock style={{ width: "16px", height: "16px", color: "#f59e0b" }} />;
        }
    };

    const getStatusBadgeColors = (status: string) => {
        switch (status) {
            case "VERIFIED":
                return { bg: "#d1fae5", color: "#047857" };
            case "FAILED":
                return { bg: "#fee2e2", color: "#dc2626" };
            default:
                return { bg: "#fef3c7", color: "#d97706" };
        }
    };

    const theme = {
        textPrimary: isDark ? "#f8fafc" : "#111827",
        textSecondary: isDark ? "#94a3b8" : "#64748b",
        textMuted: isDark ? "#64748b" : "#9ca3af",
        cardBg: isDark ? "rgba(30, 41, 59, 0.7)" : "rgba(255, 255, 255, 0.7)",
        cardBorder: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
        inputBg: isDark ? "#1e293b" : "#f9fafb",
        inputBorder: isDark ? "#334155" : "#e5e7eb",
        hoverBg: isDark ? "#1e293b" : "#f1f5f9",
        dangerBg: isDark ? "rgba(239, 68, 68, 0.1)" : "#fef2f2",
        dangerText: isDark ? "#fca5a5" : "#dc2626",
        infoBg: isDark ? "rgba(59, 130, 246, 0.1)" : "#eff6ff",
        infoText: isDark ? "#93c5fd" : "#1e40af",
    };

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "400px",
                }}
            >
                <div
                    style={{
                        width: "32px",
                        height: "32px",
                        border: "4px solid #6366f1",
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                    }}
                    className="animate-spin"
                />
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "clamp(12px, 3vw, 16px)",
                    marginBottom: "clamp(24px, 6vw, 32px)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                    }}
                    className="header-wrapper"
                >
                    <div>
                        <h1
                            style={{
                                fontSize: "clamp(24px, 6vw, 32px)",
                                fontWeight: "700",
                                color: theme.textPrimary,
                            }}
                        >
                            Beneficiaries
                        </h1>
                        <p
                            style={{
                                fontSize: "clamp(13px, 3.2vw, 15px)",
                                color: theme.textSecondary,
                                marginTop: "4px",
                            }}
                        >
                            Manage who can access your digital legacy
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            padding: "clamp(10px, 2.5vw, 12px) clamp(16px, 4vw, 20px)",
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                            color: "white",
                            fontSize: "clamp(14px, 3.5vw, 15px)",
                            fontWeight: "600",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)",
                            transition: "all 0.2s",
                            width: "100%",
                        }}
                        className="add-btn"
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 6px 16px rgba(99, 102, 241, 0.35)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(99, 102, 241, 0.25)";
                        }}
                    >
                        <UserPlus style={{ width: "20px", height: "20px" }} />
                        Add Beneficiary
                    </button>
                </div>
            </div>

            {/* Beneficiaries List */}
            {beneficiaries.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "clamp(12px, 3vw, 16px)" }}>
                    {beneficiaries.map((beneficiary) => (
                        <div
                            key={beneficiary.id}
                            style={{
                                backgroundColor: theme.cardBg,
                                backdropFilter: "blur(12px)",
                                borderRadius: "16px",
                                padding: "clamp(16px, 4vw, 24px)",
                                border: `1px solid ${theme.cardBorder}`,
                                boxShadow: isDark
                                    ? "0 4px 12px rgba(0, 0, 0, 0.3)"
                                    : "0 4px 12px rgba(0, 0, 0, 0.08)",
                                transition: "all 0.2s",
                            }}
                            className="beneficiary-card"
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "16px",
                                }}
                                className="beneficiary-content"
                            >
                                {/* Main info */}
                                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                    <div
                                        style={{
                                            width: "clamp(48px, 12vw, 56px)",
                                            height: "clamp(48px, 12vw, 56px)",
                                            borderRadius: "16px",
                                            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "white",
                                            fontSize: "clamp(18px, 4.5vw, 24px)",
                                            fontWeight: "700",
                                            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {beneficiary.name[0].toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <h3
                                            style={{
                                                fontSize: "clamp(16px, 4vw, 18px)",
                                                fontWeight: "600",
                                                color: theme.textPrimary,
                                                marginBottom: "4px",
                                            }}
                                        >
                                            {beneficiary.name}
                                        </h3>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "6px",
                                                fontSize: "clamp(12px, 3vw, 13px)",
                                                color: theme.textSecondary,
                                            }}
                                        >
                                            <Mail style={{ width: "14px", height: "14px", flexShrink: 0 }} />
                                            <span
                                                style={{
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {beneficiary.email}
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px",
                                                marginTop: "8px",
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    padding: "4px 12px",
                                                    borderRadius: "8px",
                                                    fontSize: "clamp(11px, 2.7vw, 12px)",
                                                    fontWeight: "600",
                                                    backgroundColor: "#dbeafe",
                                                    color: "#1e40af",
                                                }}
                                            >
                                                {beneficiary.relationship}
                                            </span>
                                            <span
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "4px",
                                                    padding: "4px 12px",
                                                    borderRadius: "8px",
                                                    fontSize: "clamp(11px, 2.7vw, 12px)",
                                                    fontWeight: "600",
                                                    backgroundColor: getStatusBadgeColors(beneficiary.verificationStatus).bg,
                                                    color: getStatusBadgeColors(beneficiary.verificationStatus).color,
                                                }}
                                            >
                                                {getStatusIcon(beneficiary.verificationStatus)}
                                                <span>{beneficiary.verificationStatus}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: "12px",
                                        paddingTop: "12px",
                                        borderTop: `1px solid ${isDark ? "#1e293b" : "#e2e8f0"}`,
                                    }}
                                    className="beneficiary-actions"
                                >
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p
                                            style={{
                                                fontSize: "clamp(11px, 2.7vw, 12px)",
                                                color: theme.textSecondary,
                                                marginBottom: "4px",
                                            }}
                                        >
                                            Access Key
                                        </p>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <code
                                                style={{
                                                    fontSize: "clamp(11px, 2.7vw, 12px)",
                                                    backgroundColor: isDark ? "#1e293b" : "#f1f5f9",
                                                    padding: "4px 8px",
                                                    borderRadius: "6px",
                                                    fontFamily: "monospace",
                                                    color: theme.textPrimary,
                                                }}
                                            >
                                                {beneficiary.accessKey.substring(0, 8)}...
                                            </code>
                                            <button
                                                onClick={() => copyAccessKey(beneficiary.accessKey)}
                                                style={{
                                                    padding: "6px",
                                                    borderRadius: "6px",
                                                    background: "none",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    color: theme.textSecondary,
                                                    transition: "all 0.2s",
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = theme.hoverBg;
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = "transparent";
                                                }}
                                            >
                                                {copiedKey === beneficiary.accessKey ? (
                                                    <Check style={{ width: "16px", height: "16px", color: "#10b981" }} />
                                                ) : (
                                                    <Copy style={{ width: "16px", height: "16px" }} />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteBeneficiary(beneficiary.id)}
                                        style={{
                                            padding: "8px",
                                            borderRadius: "8px",
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            color: theme.textSecondary,
                                            transition: "all 0.2s",
                                            flexShrink: 0,
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = theme.dangerBg;
                                            e.currentTarget.style.color = theme.dangerText;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = "transparent";
                                            e.currentTarget.style.color = theme.textSecondary;
                                        }}
                                    >
                                        <Trash2 style={{ width: "18px", height: "18px" }} />
                                    </button>
                                </div>

                                {/* Timestamp */}
                                <div
                                    style={{
                                        fontSize: "clamp(11px, 2.7vw, 12px)",
                                        color: theme.textMuted,
                                    }}
                                >
                                    Added {formatDistanceToNow(new Date(beneficiary.createdAt), { addSuffix: true })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div
                    style={{
                        backgroundColor: theme.cardBg,
                        backdropFilter: "blur(12px)",
                        borderRadius: "16px",
                        padding: "clamp(32px, 8vw, 48px)",
                        border: `1px solid ${theme.cardBorder}`,
                        textAlign: "center",
                    }}
                >
                    <Users
                        style={{
                            width: "clamp(40px, 10vw, 48px)",
                            height: "clamp(40px, 10vw, 48px)",
                            color: theme.textMuted,
                            margin: "0 auto clamp(12px, 3vw, 16px)",
                        }}
                    />
                    <h3
                        style={{
                            fontSize: "clamp(16px, 4vw, 18px)",
                            fontWeight: "600",
                            color: theme.textPrimary,
                        }}
                    >
                        No beneficiaries yet
                    </h3>
                    <p
                        style={{
                            fontSize: "clamp(13px, 3.2vw, 14px)",
                            color: theme.textSecondary,
                            marginTop: "4px",
                            marginBottom: "clamp(16px, 4vw, 20px)",
                        }}
                    >
                        Add someone you trust to access your digital legacy
                    </p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            padding: "clamp(10px, 2.5vw, 12px) clamp(16px, 4vw, 20px)",
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                            color: "white",
                            fontSize: "clamp(14px, 3.5vw, 15px)",
                            fontWeight: "600",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)",
                        }}
                    >
                        <UserPlus style={{ width: "20px", height: "20px" }} />
                        Add Beneficiary
                    </button>
                </div>
            )}

            {/* Add Beneficiary Modal */}
            {showAddModal && (
                <>
                    {/* Overlay */}
                    <div
                        style={{
                            position: "fixed",
                            inset: "0",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            backdropFilter: "blur(4px)",
                            zIndex: "50",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "clamp(16px, 4vw, 24px)",
                        }}
                        onClick={closeAndReset}
                    >
                        {/* Modal */}
                        <div
                            style={{
                                backgroundColor: isDark ? "#0f172a" : "#ffffff",
                                borderRadius: "16px",
                                width: "100%",
                                maxWidth: "500px",
                                maxHeight: "90vh",
                                overflow: "auto",
                                boxShadow: isDark
                                    ? "0 20px 60px rgba(0, 0, 0, 0.5)"
                                    : "0 20px 60px rgba(0, 0, 0, 0.15)",
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "clamp(16px, 4vw, 24px)",
                                    borderBottom: `1px solid ${isDark ? "#1e293b" : "#e2e8f0"}`,
                                }}
                            >
                                <h2
                                    style={{
                                        fontSize: "clamp(18px, 4.5vw, 20px)",
                                        fontWeight: "700",
                                        color: theme.textPrimary,
                                    }}
                                >
                                    Add Beneficiary
                                </h2>
                                <button
                                    onClick={closeAndReset}
                                    style={{
                                        padding: "8px",
                                        borderRadius: "8px",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        color: theme.textSecondary,
                                        transition: "background 0.2s",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.hoverBg)}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                                >
                                    <X style={{ width: "20px", height: "20px" }} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div style={{ padding: "clamp(16px, 4vw, 24px)" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                    {/* Full Name */}
                                    <div>
                                        <label
                                            style={{
                                                display: "block",
                                                fontSize: "clamp(13px, 3.2vw, 14px)",
                                                fontWeight: "500",
                                                color: theme.textSecondary,
                                                marginBottom: "8px",
                                            }}
                                        >
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            style={{
                                                width: "100%",
                                                padding: "clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)",
                                                borderRadius: "12px",
                                                border: `1px solid ${theme.inputBorder}`,
                                                backgroundColor: theme.inputBg,
                                                color: theme.textPrimary,
                                                fontSize: "clamp(14px, 3.5vw, 15px)",
                                                outline: "none",
                                                transition: "all 0.2s",
                                            }}
                                            onFocus={(e) => {
                                                e.currentTarget.style.borderColor = "#6366f1";
                                                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.1)";
                                            }}
                                            onBlur={(e) => {
                                                e.currentTarget.style.borderColor = theme.inputBorder;
                                                e.currentTarget.style.boxShadow = "none";
                                            }}
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label
                                            style={{
                                                display: "block",
                                                fontSize: "clamp(13px, 3.2vw, 14px)",
                                                fontWeight: "500",
                                                color: theme.textSecondary,
                                                marginBottom: "8px",
                                            }}
                                        >
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="john@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            style={{
                                                width: "100%",
                                                padding: "clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)",
                                                borderRadius: "12px",
                                                border: `1px solid ${theme.inputBorder}`,
                                                backgroundColor: theme.inputBg,
                                                color: theme.textPrimary,
                                                fontSize: "clamp(14px, 3.5vw, 15px)",
                                                outline: "none",
                                                transition: "all 0.2s",
                                            }}
                                            onFocus={(e) => {
                                                e.currentTarget.style.borderColor = "#6366f1";
                                                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.1)";
                                            }}
                                            onBlur={(e) => {
                                                e.currentTarget.style.borderColor = theme.inputBorder;
                                                e.currentTarget.style.boxShadow = "none";
                                            }}
                                        />
                                    </div>

                                    {/* Relationship */}
                                    <div>
                                        <label
                                            style={{
                                                display: "block",
                                                fontSize: "clamp(13px, 3.2vw, 14px)",
                                                fontWeight: "500",
                                                color: theme.textSecondary,
                                                marginBottom: "8px",
                                            }}
                                        >
                                            Relationship
                                        </label>
                                        <select
                                            value={relationship}
                                            onChange={(e) => setRelationship(e.target.value)}
                                            style={{
                                                width: "100%",
                                                padding: "clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)",
                                                borderRadius: "12px",
                                                border: `1px solid ${theme.inputBorder}`,
                                                backgroundColor: theme.inputBg,
                                                color: theme.textPrimary,
                                                fontSize: "clamp(14px, 3.5vw, 15px)",
                                                outline: "none",
                                                transition: "all 0.2s",
                                            }}
                                            onFocus={(e) => {
                                                e.currentTarget.style.borderColor = "#6366f1";
                                                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.1)";
                                            }}
                                            onBlur={(e) => {
                                                e.currentTarget.style.borderColor = theme.inputBorder;
                                                e.currentTarget.style.boxShadow = "none";
                                            }}
                                        >
                                            <option value="">Select relationship</option>
                                            {relationships.map((rel) => (
                                                <option key={rel} value={rel}>
                                                    {rel}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Info */}
                                    <div
                                        style={{
                                            padding: "clamp(12px, 3vw, 16px)",
                                            borderRadius: "12px",
                                            backgroundColor: theme.infoBg,
                                            border: `1px solid ${isDark ? "#1e40af" : "#bfdbfe"}`,
                                        }}
                                    >
                                        <p style={{ fontSize: "clamp(12px, 3vw, 13px)", color: theme.infoText }}>
                                            The beneficiary will receive an email notification when added. When your DMS is
                                            triggered, they&apos;ll receive access instructions and their unique access key.
                                        </p>
                                    </div>

                                    {/* Buttons */}
                                    <div style={{ display: "flex", gap: "12px" }}>
                                        <button
                                            onClick={closeAndReset}
                                            style={{
                                                flex: "1",
                                                padding: "clamp(10px, 2.5vw, 12px)",
                                                borderRadius: "12px",
                                                border: `1px solid ${theme.inputBorder}`,
                                                backgroundColor: "transparent",
                                                color: theme.textPrimary,
                                                fontSize: "clamp(14px, 3.5vw, 15px)",
                                                fontWeight: "600",
                                                cursor: "pointer",
                                                transition: "all 0.2s",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = theme.hoverBg;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = "transparent";
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAddBeneficiary}
                                            disabled={saving}
                                            style={{
                                                flex: "1",
                                                padding: "clamp(10px, 2.5vw, 12px)",
                                                borderRadius: "12px",
                                                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                                color: "white",
                                                fontSize: "clamp(14px, 3.5vw, 15px)",
                                                fontWeight: "600",
                                                border: "none",
                                                cursor: saving ? "not-allowed" : "pointer",
                                                opacity: saving ? 0.7 : 1,
                                                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)",
                                                transition: "all 0.2s",
                                            }}
                                        >
                                            {saving ? "Adding..." : "Add Beneficiary"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <style jsx>{`
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
                @media (min-width: 640px) {
                    .header-wrapper {
                        flex-direction: row;
                        align-items: center;
                        justify-content: space-between;
                    }
                    .add-btn {
                        width: auto;
                    }
                    .beneficiary-content {
                        flex-direction: row;
                        align-items: flex-start;
                    }
                    .beneficiary-actions {
                        border-top: none;
                        border-left: 1px solid ${isDark ? "#1e293b" : "#e2e8f0"};
                        padding-top: 0;
                        padding-left: 16px;
                        flex-direction: row;
                    }
                }
                .beneficiary-card:hover {
                    box-shadow: ${isDark ? "0 8px 24px rgba(0, 0, 0, 0.4)" : "0 8px 24px rgba(0, 0, 0, 0.12)"};
                }
            `}</style>
        </div>
    );
}
