"use client";

import { useState, useEffect } from "react";
import {
    Plus,
    Wallet,
    CreditCard,
    FileText,
    Bitcoin,
    Trash2,
    EyeOff,
    Copy,
    Check,
    X,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

interface Asset {
    id: string;
    name: string;
    type: string;
    platform: string | null;
    createdAt: string;
}

const assetTypes = [
    { value: "subscription", label: "Subscription", icon: CreditCard, color: "#3b82f6" },
    { value: "investment", label: "Investment", icon: Wallet, color: "#10b981" },
    { value: "legal_document", label: "Legal Document", icon: FileText, color: "#f59e0b" },
    { value: "crypto", label: "Crypto Wallet", icon: Bitcoin, color: "#f97316" },
    { value: "text_note", label: "Text Note", icon: FileText, color: "#a855f7" },
];

export default function AssetsPage() {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isDark, setIsDark] = useState(false);

    // Form state
    const [assetName, setAssetName] = useState("");
    const [assetType, setAssetType] = useState("text_note");
    const [platform, setPlatform] = useState("");
    const [sensitiveData, setSensitiveData] = useState("");
    const [encryptionKey, setEncryptionKey] = useState("");
    const [copiedKey, setCopiedKey] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        setIsDark(mediaQuery.matches);
        const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        try {
            const res = await fetch("/api/assets");
            if (res.ok) {
                const data = await res.json();
                setAssets(data.assets);
            }
        } catch (error) {
            console.error("Failed to fetch assets:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAsset = async () => {
        if (!assetName || !sensitiveData) {
            toast.error("Please fill in all required fields");
            return;
        }

        setSaving(true);
        try {
            // Client-side encryption
            const { generateKey, encryptData, exportKey } = await import("@/lib/encryption");
            const key = await generateKey();
            const { ciphertext, iv } = await encryptData({ content: sensitiveData }, key);

            const exportedKey = await exportKey(key);
            setEncryptionKey(exportedKey);

            // Send to server
            const res = await fetch("/api/assets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: assetName,
                    type: assetType,
                    platform,
                    encryptedData: JSON.stringify({ ciphertext, iv }),
                }),
            });

            if (res.ok) {
                toast.success("Asset encrypted and saved!");
                fetchAssets();
                // Don't close modal - show the key first
            } else {
                throw new Error("Failed to save asset");
            }
        } catch (error) {
            console.error("Error saving asset:", error);
            toast.error("Failed to save asset");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAsset = async (id: string) => {
        if (!confirm("Are you sure you want to delete this asset?")) return;

        try {
            const res = await fetch(`/api/assets?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Asset deleted");
                fetchAssets();
            }
        } catch (error) {
            toast.error("Failed to delete asset");
        }
    };

    const closeAndReset = () => {
        setShowAddModal(false);
        setAssetName("");
        setAssetType("text_note");
        setPlatform("");
        setSensitiveData("");
        setEncryptionKey("");
        setCopiedKey(false);
    };

    const copyKey = () => {
        navigator.clipboard.writeText(encryptionKey);
        setCopiedKey(true);
        toast.success("Key copied to clipboard!");
        setTimeout(() => setCopiedKey(false), 2000);
    };

    const getAssetIcon = (type: string) => {
        const assetType = assetTypes.find((t) => t.value === type);
        if (assetType) {
            const Icon = assetType.icon;
            return <Icon style={{ width: "20px", height: "20px", color: assetType.color }} />;
        }
        return <FileText style={{ width: "20px", height: "20px", color: isDark ? "#9ca3af" : "#6b7280" }} />;
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
        successBg: isDark ? "rgba(34, 197, 94, 0.1)" : "#f0fdf4",
        successText: isDark ? "#86efac" : "#16a34a",
        warningBg: isDark ? "rgba(251, 146, 60, 0.1)" : "#fffbeb",
        warningText: isDark ? "#fdba74" : "#d97706",
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
                            Assets
                        </h1>
                        <p
                            style={{
                                fontSize: "clamp(13px, 3.2vw, 15px)",
                                color: theme.textSecondary,
                                marginTop: "4px",
                            }}
                        >
                            Manage your encrypted digital assets
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
                        <Plus style={{ width: "20px", height: "20px" }} />
                        Add Asset
                    </button>
                </div>
            </div>

            {/* Assets Grid */}
            {assets.length > 0 ? (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
                        gap: "clamp(16px, 4vw, 24px)",
                    }}
                >
                    {assets.map((asset) => (
                        <div
                            key={asset.id}
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
                            className="asset-card"
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    justifyContent: "space-between",
                                    marginBottom: "16px",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: "1" }}>
                                    <div
                                        style={{
                                            width: "48px",
                                            height: "48px",
                                            borderRadius: "12px",
                                            backgroundColor: isDark ? "#1e293b" : "#f1f5f9",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {getAssetIcon(asset.type)}
                                    </div>
                                    <div style={{ minWidth: 0, flex: 1 }}>
                                        <h3
                                            style={{
                                                fontSize: "clamp(15px, 3.7vw, 16px)",
                                                fontWeight: "600",
                                                color: theme.textPrimary,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {asset.name}
                                        </h3>
                                        {asset.platform && (
                                            <p
                                                style={{
                                                    fontSize: "clamp(12px, 3vw, 13px)",
                                                    color: theme.textSecondary,
                                                    marginTop: "2px",
                                                }}
                                            >
                                                {asset.platform}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteAsset(asset.id)}
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
                                    <Trash2 style={{ width: "16px", height: "16px" }} />
                                </button>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: "12px",
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
                                    {assetTypes.find((t) => t.value === asset.type)?.label || asset.type}
                                </span>
                                <span
                                    style={{
                                        fontSize: "clamp(11px, 2.7vw, 12px)",
                                        color: theme.textMuted,
                                    }}
                                >
                                    {formatDistanceToNow(new Date(asset.createdAt), { addSuffix: true })}
                                </span>
                            </div>

                            <div
                                style={{
                                    paddingTop: "12px",
                                    borderTop: `1px solid ${isDark ? "#1e293b" : "#e2e8f0"}`,
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        fontSize: "clamp(12px, 3vw, 13px)",
                                        color: theme.textSecondary,
                                    }}
                                >
                                    <EyeOff style={{ width: "16px", height: "16px" }} />
                                    <span>Encrypted & Secure</span>
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
                    <Wallet
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
                        No assets yet
                    </h3>
                    <p
                        style={{
                            fontSize: "clamp(13px, 3.2vw, 14px)",
                            color: theme.textSecondary,
                            marginTop: "4px",
                            marginBottom: "clamp(16px, 4vw, 20px)",
                        }}
                    >
                        Add your first encrypted asset to get started
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
                        <Plus style={{ width: "20px", height: "20px" }} />
                        Add Asset
                    </button>
                </div>
            )}

            {/* Add Asset Modal */}
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
                                maxWidth: "600px",
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
                                    Add New Asset
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
                                {!encryptionKey ? (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                        {/* Asset Name */}
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
                                                Asset Name
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g., Netflix Account, Bitcoin Wallet"
                                                value={assetName}
                                                onChange={(e) => setAssetName(e.target.value)}
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

                                        {/* Asset Type */}
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
                                                Asset Type
                                            </label>
                                            <div
                                                style={{
                                                    display: "grid",
                                                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                                                    gap: "12px",
                                                }}
                                            >
                                                {assetTypes.map((type) => {
                                                    const isSelected = assetType === type.value;
                                                    return (
                                                        <button
                                                            key={type.value}
                                                            onClick={() => setAssetType(type.value)}
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "8px",
                                                                padding: "clamp(10px, 2.5vw, 12px)",
                                                                borderRadius: "12px",
                                                                border: isSelected
                                                                    ? "2px solid #6366f1"
                                                                    : `2px solid ${theme.inputBorder}`,
                                                                backgroundColor: isSelected
                                                                    ? isDark
                                                                        ? "rgba(99, 102, 241, 0.1)"
                                                                        : "#eef2ff"
                                                                    : "transparent",
                                                                cursor: "pointer",
                                                                transition: "all 0.2s",
                                                                fontSize: "clamp(13px, 3.2vw, 14px)",
                                                                fontWeight: "500",
                                                                color: theme.textPrimary,
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                if (!isSelected) {
                                                                    e.currentTarget.style.borderColor = "#94a3b8";
                                                                }
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                if (!isSelected) {
                                                                    e.currentTarget.style.borderColor = theme.inputBorder;
                                                                }
                                                            }}
                                                        >
                                                            <type.icon style={{ width: "20px", height: "20px", color: type.color }} />
                                                            <span>{type.label}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Platform */}
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
                                                Platform (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g., Binance, Google Drive"
                                                value={platform}
                                                onChange={(e) => setPlatform(e.target.value)}
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

                                        {/* Sensitive Data */}
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
                                                Sensitive Data (will be encrypted)
                                            </label>
                                            <textarea
                                                placeholder="Enter passwords, recovery phrases, important notes..."
                                                value={sensitiveData}
                                                onChange={(e) => setSensitiveData(e.target.value)}
                                                style={{
                                                    width: "100%",
                                                    padding: "clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)",
                                                    borderRadius: "12px",
                                                    border: `1px solid ${theme.inputBorder}`,
                                                    backgroundColor: theme.inputBg,
                                                    color: theme.textPrimary,
                                                    fontSize: "clamp(13px, 3.2vw, 14px)",
                                                    fontFamily: "monospace",
                                                    outline: "none",
                                                    transition: "all 0.2s",
                                                    minHeight: "120px",
                                                    resize: "vertical",
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

                                        {/* Warning */}
                                        <div
                                            style={{
                                                padding: "clamp(12px, 3vw, 16px)",
                                                borderRadius: "12px",
                                                backgroundColor: theme.warningBg,
                                                border: `1px solid ${isDark ? "#92400e" : "#fcd34d"}`,
                                            }}
                                        >
                                            <p style={{ fontSize: "clamp(12px, 3vw, 13px)", color: theme.warningText }}>
                                                Your data will be encrypted locally. The encryption key will be shown after
                                                saving.
                                                <strong style={{ display: "block", marginTop: "4px" }}>
                                                    You must save this key securely - we cannot recover it!
                                                </strong>
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
                                                onClick={handleAddAsset}
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
                                                {saving ? "Encrypting..." : "Encrypt & Save"}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                        {/* Success Message */}
                                        <div style={{ textAlign: "center", padding: "clamp(12px, 3vw, 16px) 0" }}>
                                            <div
                                                style={{
                                                    width: "64px",
                                                    height: "64px",
                                                    borderRadius: "50%",
                                                    backgroundColor: theme.successBg,
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    marginBottom: "16px",
                                                }}
                                            >
                                                <Check style={{ width: "32px", height: "32px", color: theme.successText }} />
                                            </div>
                                            <h3
                                                style={{
                                                    fontSize: "clamp(18px, 4.5vw, 20px)",
                                                    fontWeight: "700",
                                                    color: theme.textPrimary,
                                                }}
                                            >
                                                Asset Saved!
                                            </h3>
                                            <p
                                                style={{
                                                    fontSize: "clamp(13px, 3.2vw, 14px)",
                                                    color: theme.textSecondary,
                                                    marginTop: "4px",
                                                }}
                                            >
                                                Your data has been encrypted and stored securely.
                                            </p>
                                        </div>

                                        {/* Encryption Key */}
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
                                                Your Encryption Key
                                            </label>
                                            <div style={{ position: "relative" }}>
                                                <textarea
                                                    readOnly
                                                    value={encryptionKey}
                                                    style={{
                                                        width: "100%",
                                                        padding: "clamp(10px, 2.5vw, 12px)",
                                                        paddingRight: "48px",
                                                        borderRadius: "12px",
                                                        border: `1px solid ${theme.inputBorder}`,
                                                        backgroundColor: theme.inputBg,
                                                        color: theme.textPrimary,
                                                        fontSize: "clamp(11px, 2.7vw, 12px)",
                                                        fontFamily: "monospace",
                                                        minHeight: "100px",
                                                        resize: "none",
                                                    }}
                                                />
                                                <button
                                                    onClick={copyKey}
                                                    style={{
                                                        position: "absolute",
                                                        top: "8px",
                                                        right: "8px",
                                                        padding: "8px",
                                                        borderRadius: "8px",
                                                        backgroundColor: isDark ? "#1e293b" : "#ffffff",
                                                        border: `1px solid ${theme.inputBorder}`,
                                                        cursor: "pointer",
                                                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                                        transition: "all 0.2s",
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = theme.hoverBg;
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = isDark ? "#1e293b" : "#ffffff";
                                                    }}
                                                >
                                                    {copiedKey ? (
                                                        <Check style={{ width: "16px", height: "16px", color: theme.successText }} />
                                                    ) : (
                                                        <Copy style={{ width: "16px", height: "16px", color: theme.textSecondary }} />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Warning */}
                                        <div
                                            style={{
                                                padding: "clamp(12px, 3vw, 16px)",
                                                borderRadius: "12px",
                                                backgroundColor: theme.dangerBg,
                                                border: `1px solid ${isDark ? "#7f1d1d" : "#fecaca"}`,
                                            }}
                                        >
                                            <p style={{ fontSize: "clamp(12px, 3vw, 13px)", color: theme.dangerText }}>
                                                <strong>IMPORTANT:</strong> Save this key somewhere safe (password manager, secure
                                                note). Without this key, your data cannot be decrypted. We do not store this key!
                                            </p>
                                        </div>

                                        {/* Close Button */}
                                        <button
                                            onClick={closeAndReset}
                                            style={{
                                                width: "100%",
                                                padding: "clamp(10px, 2.5vw, 12px)",
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
                                            I&apos;ve Saved My Key
                                        </button>
                                    </div>
                                )}
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
                }
                .asset-card:hover {
                    box-shadow: ${isDark ? "0 8px 24px rgba(0, 0, 0, 0.4)" : "0 8px 24px rgba(0, 0, 0, 0.12)"};
                }
            `}</style>
        </div>
    );
}
