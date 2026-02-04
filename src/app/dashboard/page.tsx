"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    Wallet,
    Users,
    Clock,
    Activity,
    TrendingUp,
    Shield,
    AlertTriangle,
    CheckCircle,
    Loader,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Stats {
    totalAssets: number;
    totalBeneficiaries: number;
    dmsStatus: string;
    lastActive: string;
    dmsPeriod: number;
}

interface ActivityItem {
    id: string;
    type: string;
    message: string;
    createdAt: string;
}

export default function DashboardPage() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<Stats | null>(null);
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        setIsDark(mediaQuery.matches);
        const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, activityRes] = await Promise.all([
                fetch("/api/dashboard/stats"),
                fetch("/api/activity"),
            ]);

            if (statsRes.ok) {
                const data = await statsRes.json();
                setStats(data);
            }

            if (activityRes.ok) {
                const data = await activityRes.json();
                setActivities(data.activities);
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return { bg: isDark ? "rgba(16, 185, 129, 0.2)" : "#d1fae5", text: isDark ? "#6ee7b7" : "#047857", border: isDark ? "#10b981" : "#6ee7b7" };
            case "PENDING":
                return { bg: isDark ? "rgba(251, 191, 36, 0.2)" : "#fef3c7", text: isDark ? "#fbbf24" : "#b45309", border: isDark ? "#fbbf24" : "#fbbf24" };
            case "TRIGGERED":
                return { bg: isDark ? "rgba(239, 68, 68, 0.2)" : "#fee2e2", text: isDark ? "#f87171" : "#dc2626", border: isDark ? "#ef4444" : "#f87171" };
            default:
                return { bg: isDark ? "rgba(100, 116, 139, 0.2)" : "#f1f5f9", text: isDark ? "#94a3b8" : "#64748b", border: isDark ? "#64748b" : "#94a3b8" };
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case "heartbeat":
                return <Activity style={{ width: "16px", height: "16px", color: "#10b981" }} />;
            case "login":
                return <Shield style={{ width: "16px", height: "16px", color: "#3b82f6" }} />;
            case "asset_added":
                return <Wallet style={{ width: "16px", height: "16px", color: "#8b5cf6" }} />;
            case "beneficiary_added":
                return <Users style={{ width: "16px", height: "16px", color: "#6366f1" }} />;
            case "dms_triggered":
                return <AlertTriangle style={{ width: "16px", height: "16px", color: "#ef4444" }} />;
            default:
                return <CheckCircle style={{ width: "16px", height: "16px", color: "#64748b" }} />;
        }
    };

    const theme = {
        textPrimary: isDark ? "#f8fafc" : "#0f172a",
        textSecondary: isDark ? "#94a3b8" : "#64748b",
        textMuted: isDark ? "#64748b" : "#94a3b8",
        cardBg: isDark ? "rgba(30, 41, 59, 0.7)" : "rgba(255, 255, 255, 0.8)",
        cardBorder: isDark ? "#1e293b" : "#e2e8f0",
        hoverBg: isDark ? "#1e293b" : "#f8fafc",
    };

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "256px",
                }}
            >
                <Loader style={{ width: "32px", height: "32px", color: "#6366f1" }} className="animate-spin" />
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

    const statusColor = getStatusColor(stats?.dmsStatus || "ACTIVE");

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(24px, 6vw, 32px)" }}>
            {/* Header */}
            <div>
                <h1
                    style={{
                        fontSize: "clamp(24px, 6vw, 32px)",
                        fontWeight: "700",
                        color: theme.textPrimary,
                        marginBottom: "4px",
                    }}
                >
                    Welcome back, {session?.user?.name || "User"}
                </h1>
                <p
                    style={{
                        fontSize: "clamp(14px, 3.5vw, 16px)",
                        color: theme.textSecondary,
                    }}
                >
                    Here&apos;s an overview of your digital legacy
                </p>
            </div>

            {/* Stats Grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
                    gap: "clamp(16px, 4vw, 24px)",
                }}
            >
                {/* Total Assets */}
                <div
                    style={{
                        backgroundColor: theme.cardBg,
                        backdropFilter: "blur(12px)",
                        borderRadius: "clamp(12px, 3vw, 16px)",
                        padding: "clamp(16px, 4vw, 20px)",
                        border: `1px solid ${theme.cardBorder}`,
                        boxShadow: isDark ? "0 4px 12px rgba(0, 0, 0, 0.3)" : "0 4px 12px rgba(0, 0, 0, 0.05)",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <p
                                style={{
                                    fontSize: "clamp(12px, 3vw, 13px)",
                                    color: theme.textSecondary,
                                    marginBottom: "4px",
                                }}
                            >
                                Total Assets
                            </p>
                            <p
                                style={{
                                    fontSize: "clamp(28px, 7vw, 36px)",
                                    fontWeight: "700",
                                    color: theme.textPrimary,
                                }}
                            >
                                {stats?.totalAssets || 0}
                            </p>
                        </div>
                        <div
                            style={{
                                width: "clamp(44px, 11vw, 48px)",
                                height: "clamp(44px, 11vw, 48px)",
                                borderRadius: "12px",
                                backgroundColor: isDark ? "rgba(139, 92, 246, 0.2)" : "#f3e8ff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Wallet style={{ width: "clamp(20px, 5vw, 24px)", height: "clamp(20px, 5vw, 24px)", color: "#8b5cf6" }} />
                        </div>
                    </div>
                </div>

                {/* Beneficiaries */}
                <div
                    style={{
                        backgroundColor: theme.cardBg,
                        backdropFilter: "blur(12px)",
                        borderRadius: "clamp(12px, 3vw, 16px)",
                        padding: "clamp(16px, 4vw, 20px)",
                        border: `1px solid ${theme.cardBorder}`,
                        boxShadow: isDark ? "0 4px 12px rgba(0, 0, 0, 0.3)" : "0 4px 12px rgba(0, 0, 0, 0.05)",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <p
                                style={{
                                    fontSize: "clamp(12px, 3vw, 13px)",
                                    color: theme.textSecondary,
                                    marginBottom: "4px",
                                }}
                            >
                                Beneficiaries
                            </p>
                            <p
                                style={{
                                    fontSize: "clamp(28px, 7vw, 36px)",
                                    fontWeight: "700",
                                    color: theme.textPrimary,
                                }}
                            >
                                {stats?.totalBeneficiaries || 0}
                            </p>
                        </div>
                        <div
                            style={{
                                width: "clamp(44px, 11vw, 48px)",
                                height: "clamp(44px, 11vw, 48px)",
                                borderRadius: "12px",
                                backgroundColor: isDark ? "rgba(99, 102, 241, 0.2)" : "#e0e7ff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Users style={{ width: "clamp(20px, 5vw, 24px)", height: "clamp(20px, 5vw, 24px)", color: "#6366f1" }} />
                        </div>
                    </div>
                </div>

                {/* DMS Status */}
                <div
                    style={{
                        backgroundColor: theme.cardBg,
                        backdropFilter: "blur(12px)",
                        borderRadius: "clamp(12px, 3vw, 16px)",
                        padding: "clamp(16px, 4vw, 20px)",
                        border: `1px solid ${theme.cardBorder}`,
                        boxShadow: isDark ? "0 4px 12px rgba(0, 0, 0, 0.3)" : "0 4px 12px rgba(0, 0, 0, 0.05)",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <p
                                style={{
                                    fontSize: "clamp(12px, 3vw, 13px)",
                                    color: theme.textSecondary,
                                    marginBottom: "8px",
                                }}
                            >
                                DMS Status
                            </p>
                            <span
                                style={{
                                    display: "inline-block",
                                    padding: "6px 12px",
                                    borderRadius: "8px",
                                    fontSize: "clamp(12px, 3vw, 14px)",
                                    fontWeight: "600",
                                    backgroundColor: statusColor.bg,
                                    color: statusColor.text,
                                    border: `1px solid ${statusColor.border}`,
                                }}
                            >
                                {stats?.dmsStatus || "ACTIVE"}
                            </span>
                        </div>
                        <div
                            style={{
                                width: "clamp(44px, 11vw, 48px)",
                                height: "clamp(44px, 11vw, 48px)",
                                borderRadius: "12px",
                                backgroundColor: isDark ? "rgba(16, 185, 129, 0.2)" : "#d1fae5",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Shield style={{ width: "clamp(20px, 5vw, 24px)", height: "clamp(20px, 5vw, 24px)", color: "#10b981" }} />
                        </div>
                    </div>
                </div>

                {/* DMS Period */}
                <div
                    style={{
                        backgroundColor: theme.cardBg,
                        backdropFilter: "blur(12px)",
                        borderRadius: "clamp(12px, 3vw, 16px)",
                        padding: "clamp(16px, 4vw, 20px)",
                        border: `1px solid ${theme.cardBorder}`,
                        boxShadow: isDark ? "0 4px 12px rgba(0, 0, 0, 0.3)" : "0 4px 12px rgba(0, 0, 0, 0.05)",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <p
                                style={{
                                    fontSize: "clamp(12px, 3vw, 13px)",
                                    color: theme.textSecondary,
                                    marginBottom: "4px",
                                }}
                            >
                                DMS Period
                            </p>
                            <p
                                style={{
                                    fontSize: "clamp(28px, 7vw, 36px)",
                                    fontWeight: "700",
                                    color: theme.textPrimary,
                                }}
                            >
                                {stats?.dmsPeriod || 30}{" "}
                                <span style={{ fontSize: "clamp(14px, 3.5vw, 16px)" }}>days</span>
                            </p>
                        </div>
                        <div
                            style={{
                                width: "clamp(44px, 11vw, 48px)",
                                height: "clamp(44px, 11vw, 48px)",
                                borderRadius: "12px",
                                backgroundColor: isDark ? "rgba(251, 191, 36, 0.2)" : "#fef3c7",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Clock style={{ width: "clamp(20px, 5vw, 24px)", height: "clamp(20px, 5vw, 24px)", color: "#fbbf24" }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Activity & Info */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
                    gap: "clamp(16px, 4vw, 24px)",
                }}
            >
                {/* Activity Status */}
                <div
                    style={{
                        backgroundColor: theme.cardBg,
                        backdropFilter: "blur(12px)",
                        borderRadius: "clamp(12px, 3vw, 16px)",
                        padding: "clamp(16px, 4vw, 20px)",
                        border: `1px solid ${theme.cardBorder}`,
                        boxShadow: isDark ? "0 4px 12px rgba(0, 0, 0, 0.3)" : "0 4px 12px rgba(0, 0, 0, 0.05)",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                        <TrendingUp style={{ width: "20px", height: "20px", color: "#6366f1" }} />
                        <h3 style={{ fontSize: "clamp(16px, 4vw, 18px)", fontWeight: "700", color: theme.textPrimary }}>
                            Activity Status
                        </h3>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div
                            style={{
                                padding: "clamp(14px, 3.5vw, 16px)",
                                borderRadius: "12px",
                                background: isDark
                                    ? "linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))"
                                    : "linear-gradient(135deg, #e0e7ff, #f3e8ff)",
                            }}
                        >
                            <p style={{ fontSize: "clamp(12px, 3vw, 13px)", color: theme.textSecondary }}>Last Activity</p>
                            <p style={{ fontSize: "clamp(16px, 4vw, 18px)", fontWeight: "600", color: theme.textPrimary, marginTop: "4px" }}>
                                {stats?.lastActive ? formatDistanceToNow(new Date(stats.lastActive), { addSuffix: true }) : "Never"}
                            </p>
                        </div>
                        <div
                            style={{
                                padding: "clamp(14px, 3.5vw, 16px)",
                                borderRadius: "12px",
                                background: isDark
                                    ? "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(52, 211, 153, 0.2))"
                                    : "linear-gradient(135deg, #d1fae5, #a7f3d0)",
                            }}
                        >
                            <p style={{ fontSize: "clamp(12px, 3vw, 13px)", color: theme.textSecondary }}>Timer Status</p>
                            <p style={{ fontSize: "clamp(16px, 4vw, 18px)", fontWeight: "600", color: theme.textPrimary, marginTop: "4px" }}>
                                {stats?.dmsPeriod || 30} days until DMS activation
                            </p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div
                    style={{
                        backgroundColor: theme.cardBg,
                        backdropFilter: "blur(12px)",
                        borderRadius: "clamp(12px, 3vw, 16px)",
                        padding: "clamp(16px, 4vw, 20px)",
                        border: `1px solid ${theme.cardBorder}`,
                        boxShadow: isDark ? "0 4px 12px rgba(0, 0, 0, 0.3)" : "0 4px 12px rgba(0, 0, 0, 0.05)",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                        <Activity style={{ width: "20px", height: "20px", color: "#6366f1" }} />
                        <h3 style={{ fontSize: "clamp(16px, 4vw, 18px)", fontWeight: "700", color: theme.textPrimary }}>
                            Recent Activity
                        </h3>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {activities.length > 0 ? (
                            activities.slice(0, 5).map((activity) => (
                                <div
                                    key={activity.id}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "12px",
                                        padding: "clamp(10px, 2.5vw, 12px)",
                                        borderRadius: "10px",
                                        transition: "background 0.2s",
                                        cursor: "default",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.hoverBg)}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                                >
                                    <div
                                        style={{
                                            width: "32px",
                                            height: "32px",
                                            borderRadius: "8px",
                                            backgroundColor: isDark ? "#1e293b" : "#f1f5f9",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    <div style={{ flex: "1", minWidth: "0" }}>
                                        <p
                                            style={{
                                                fontSize: "clamp(13px, 3.2vw, 14px)",
                                                fontWeight: "500",
                                                color: theme.textPrimary,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {activity.message}
                                        </p>
                                        <p style={{ fontSize: "clamp(11px, 2.7vw, 12px)", color: theme.textSecondary }}>
                                            {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ textAlign: "center", color: theme.textSecondary, padding: "16px", fontSize: "clamp(13px, 3.2vw, 14px)" }}>
                                No activity yet
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
