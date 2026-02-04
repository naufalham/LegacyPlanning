"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    Clock,
    Mail,
    User,
    Save,
    Shield,
    AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isDark, setIsDark] = useState(false);

    // Settings state
    const [dmsPeriod, setDmsPeriod] = useState(30);
    const [notifyEmail, setNotifyEmail] = useState("");
    const [name, setName] = useState("");

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        setIsDark(mediaQuery.matches);
        const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/settings");
            if (res.ok) {
                const data = await res.json();
                setDmsPeriod(data.dmsPeriod);
                setNotifyEmail(data.notifyEmail || "");
                setName(data.name || "");
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dmsPeriod, notifyEmail, name }),
            });

            if (res.ok) {
                toast.success("Settings saved successfully!");
            } else {
                throw new Error("Failed to save settings");
            }
        } catch (error) {
            toast.error("Failed to save settings");
        } finally {
            setSaving(false);
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
        successBg: isDark ? "rgba(34, 197, 94, 0.1)" : "#f0fdf4",
        successText: isDark ? "#86efac" : "#16a34a",
        warningBg: isDark ? "rgba(251, 146, 60, 0.1)" : "#fffbeb",
        warningText: isDark ? "#fdba74" : "#d97706",
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
            <div style={{ marginBottom: "clamp(24px, 6vw, 32px)" }}>
                <h1
                    style={{
                        fontSize: "clamp(24px, 6vw, 32px)",
                        fontWeight: "700",
                        color: theme.textPrimary,
                    }}
                >
                    Settings
                </h1>
                <p
                    style={{
                        fontSize: "clamp(13px, 3.2vw, 15px)",
                        color: theme.textSecondary,
                        marginTop: "4px",
                    }}
                >
                    Configure your account and Dead Man&apos;s Switch preferences
                </p>
            </div>

            {/* Settings Grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
                    gap: "clamp(16px, 4vw, 24px)",
                    marginBottom: "clamp(24px, 6vw, 32px)",
                }}
            >
                {/* Profile Settings */}
                <div
                    style={{
                        backgroundColor: theme.cardBg,
                        backdropFilter: "blur(12px)",
                        borderRadius: "16px",
                        padding: "clamp(16px, 4vw, 24px)",
                        border: `1px solid ${theme.cardBorder}`,
                        boxShadow: isDark
                            ? "0 4px 12px rgba(0, 0, 0, 0.3)"
                            : "0 4px 12px rgba(0, 0, 0, 0.08)",
                    }}
                >
                    <div style={{ marginBottom: "clamp(16px, 4vw, 20px)" }}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginBottom: "4px",
                            }}
                        >
                            <User style={{ width: "20px", height: "20px", color: "#6366f1" }} />
                            <h2
                                style={{
                                    fontSize: "clamp(16px, 4vw, 18px)",
                                    fontWeight: "700",
                                    color: theme.textPrimary,
                                }}
                            >
                                Profile
                            </h2>
                        </div>
                        <p
                            style={{
                                fontSize: "clamp(12px, 3vw, 13px)",
                                color: theme.textSecondary,
                            }}
                        >
                            Your personal information
                        </p>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
                                Display Name
                            </label>
                            <input
                                type="text"
                                placeholder="Your name"
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
                                Email
                            </label>
                            <input
                                type="email"
                                value={session?.user?.email || ""}
                                disabled
                                style={{
                                    width: "100%",
                                    padding: "clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)",
                                    borderRadius: "12px",
                                    border: `1px solid ${theme.inputBorder}`,
                                    backgroundColor: theme.inputBg,
                                    color: theme.textSecondary,
                                    fontSize: "clamp(14px, 3.5vw, 15px)",
                                    outline: "none",
                                    opacity: 0.6,
                                    cursor: "not-allowed",
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* DMS Settings */}
                <div
                    style={{
                        backgroundColor: theme.cardBg,
                        backdropFilter: "blur(12px)",
                        borderRadius: "16px",
                        padding: "clamp(16px, 4vw, 24px)",
                        border: `1px solid ${theme.cardBorder}`,
                        boxShadow: isDark
                            ? "0 4px 12px rgba(0, 0, 0, 0.3)"
                            : "0 4px 12px rgba(0, 0, 0, 0.08)",
                    }}
                >
                    <div style={{ marginBottom: "clamp(16px, 4vw, 20px)" }}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginBottom: "4px",
                            }}
                        >
                            <Clock style={{ width: "20px", height: "20px", color: "#f59e0b" }} />
                            <h2
                                style={{
                                    fontSize: "clamp(16px, 4vw, 18px)",
                                    fontWeight: "700",
                                    color: theme.textPrimary,
                                }}
                            >
                                Dead Man&apos;s Switch
                            </h2>
                        </div>
                        <p
                            style={{
                                fontSize: "clamp(12px, 3vw, 13px)",
                                color: theme.textSecondary,
                            }}
                        >
                            Configure when your beneficiaries get notified
                        </p>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
                                Inactivity Period (days)
                            </label>
                            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                <input
                                    type="range"
                                    min="7"
                                    max="90"
                                    value={dmsPeriod}
                                    onChange={(e) => setDmsPeriod(Number(e.target.value))}
                                    style={{
                                        flex: "1",
                                        height: "8px",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        accentColor: "#6366f1",
                                    }}
                                />
                                <span
                                    style={{
                                        width: "64px",
                                        textAlign: "center",
                                        fontSize: "clamp(16px, 4vw, 18px)",
                                        fontWeight: "700",
                                        color: "#6366f1",
                                    }}
                                >
                                    {dmsPeriod}
                                </span>
                            </div>
                            <p
                                style={{
                                    fontSize: "clamp(11px, 2.7vw, 12px)",
                                    color: theme.textMuted,
                                    marginTop: "8px",
                                }}
                            >
                                Beneficiaries will be notified after {dmsPeriod} days of inactivity
                            </p>
                        </div>

                        <div
                            style={{
                                padding: "clamp(12px, 3vw, 16px)",
                                borderRadius: "12px",
                                backgroundColor: theme.warningBg,
                                border: `1px solid ${isDark ? "#92400e" : "#fcd34d"}`,
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                                <AlertTriangle
                                    style={{
                                        width: "20px",
                                        height: "20px",
                                        color: theme.warningText,
                                        flexShrink: 0,
                                        marginTop: "2px",
                                    }}
                                />
                                <div>
                                    <p
                                        style={{
                                            fontSize: "clamp(12px, 3vw, 13px)",
                                            fontWeight: "600",
                                            color: theme.warningText,
                                        }}
                                    >
                                        Important
                                    </p>
                                    <p
                                        style={{
                                            fontSize: "clamp(11px, 2.7vw, 12px)",
                                            color: theme.warningText,
                                            marginTop: "4px",
                                        }}
                                    >
                                        Make sure to click &quot;I&apos;m Still Here&quot; regularly in the dashboard to
                                        prevent false triggers. Shorter periods require more frequent check-ins.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notification Settings */}
                <div
                    style={{
                        backgroundColor: theme.cardBg,
                        backdropFilter: "blur(12px)",
                        borderRadius: "16px",
                        padding: "clamp(16px, 4vw, 24px)",
                        border: `1px solid ${theme.cardBorder}`,
                        boxShadow: isDark
                            ? "0 4px 12px rgba(0, 0, 0, 0.3)"
                            : "0 4px 12px rgba(0, 0, 0, 0.08)",
                    }}
                >
                    <div style={{ marginBottom: "clamp(16px, 4vw, 20px)" }}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginBottom: "4px",
                            }}
                        >
                            <Mail style={{ width: "20px", height: "20px", color: "#10b981" }} />
                            <h2
                                style={{
                                    fontSize: "clamp(16px, 4vw, 18px)",
                                    fontWeight: "700",
                                    color: theme.textPrimary,
                                }}
                            >
                                Notifications
                            </h2>
                        </div>
                        <p
                            style={{
                                fontSize: "clamp(12px, 3vw, 13px)",
                                color: theme.textSecondary,
                            }}
                        >
                            Emergency contact settings
                        </p>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
                                Emergency Contact Email (Optional)
                            </label>
                            <input
                                type="email"
                                placeholder="backup@example.com"
                                value={notifyEmail}
                                onChange={(e) => setNotifyEmail(e.target.value)}
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
                            <p
                                style={{
                                    fontSize: "clamp(11px, 2.7vw, 12px)",
                                    color: theme.textMuted,
                                    marginTop: "8px",
                                }}
                            >
                                This email will be CC&apos;d on important notifications. Leave blank to only notify
                                beneficiaries.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Security Info */}
                <div
                    style={{
                        backgroundColor: theme.cardBg,
                        backdropFilter: "blur(12px)",
                        borderRadius: "16px",
                        padding: "clamp(16px, 4vw, 24px)",
                        border: `1px solid ${theme.cardBorder}`,
                        boxShadow: isDark
                            ? "0 4px 12px rgba(0, 0, 0, 0.3)"
                            : "0 4px 12px rgba(0, 0, 0, 0.08)",
                    }}
                >
                    <div style={{ marginBottom: "clamp(16px, 4vw, 20px)" }}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginBottom: "4px",
                            }}
                        >
                            <Shield style={{ width: "20px", height: "20px", color: "#a855f7" }} />
                            <h2
                                style={{
                                    fontSize: "clamp(16px, 4vw, 18px)",
                                    fontWeight: "700",
                                    color: theme.textPrimary,
                                }}
                            >
                                Security
                            </h2>
                        </div>
                        <p
                            style={{
                                fontSize: "clamp(12px, 3vw, 13px)",
                                color: theme.textSecondary,
                            }}
                        >
                            Your security status
                        </p>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div
                            style={{
                                padding: "clamp(10px, 2.5vw, 12px)",
                                borderRadius: "12px",
                                backgroundColor: theme.successBg,
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "clamp(12px, 3vw, 13px)",
                                    color: theme.successText,
                                }}
                            >
                                ✓ End-to-end encryption enabled
                            </span>
                        </div>
                        <div
                            style={{
                                padding: "clamp(10px, 2.5vw, 12px)",
                                borderRadius: "12px",
                                backgroundColor: theme.successBg,
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "clamp(12px, 3vw, 13px)",
                                    color: theme.successText,
                                }}
                            >
                                ✓ Beneficiary identity verification required
                            </span>
                        </div>
                        <div
                            style={{
                                padding: "clamp(10px, 2.5vw, 12px)",
                                borderRadius: "12px",
                                backgroundColor: theme.infoBg,
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "clamp(12px, 3vw, 13px)",
                                    color: theme.infoText,
                                }}
                            >
                                ℹ️ Client-side key generation
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        padding: "clamp(12px, 3vw, 14px) clamp(20px, 5vw, 28px)",
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        color: "white",
                        fontSize: "clamp(15px, 3.7vw, 17px)",
                        fontWeight: "600",
                        border: "none",
                        cursor: saving ? "not-allowed" : "pointer",
                        opacity: saving ? 0.7 : 1,
                        boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)",
                        transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                        if (!saving) {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 6px 16px rgba(99, 102, 241, 0.35)";
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(99, 102, 241, 0.25)";
                    }}
                >
                    <Save style={{ width: "20px", height: "20px" }} />
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>

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
            `}</style>
        </div>
    );
}
