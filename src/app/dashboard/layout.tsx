"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
    LayoutDashboard,
    Wallet,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Shield,
    Heart,
} from "lucide-react";
import AIAssistant from "@/components/ai/AIAssistant";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Assets", href: "/dashboard/assets", icon: Wallet },
    { name: "Beneficiaries", href: "/dashboard/beneficiaries", icon: Users },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        setIsDark(mediaQuery.matches);
        const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    const handleHeartbeat = async () => {
        try {
            await fetch("/api/user/heartbeat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: session?.user?.email }),
            });
        } catch (error) {
            console.error("Heartbeat failed:", error);
        }
    };

    const theme = {
        bg: isDark
            ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)"
            : "linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%)",
        sidebarBg: isDark ? "#0f172a" : "#ffffff",
        sidebarBorder: isDark ? "#1e293b" : "#e2e8f0",
        textPrimary: isDark ? "#f8fafc" : "#0f172a",
        textSecondary: isDark ? "#94a3b8" : "#64748b",
        textMuted: isDark ? "#64748b" : "#94a3b8",
        hoverBg: isDark ? "#1e293b" : "#f1f5f9",
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: theme.bg,
            }}
        >
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    style={{
                        position: "fixed",
                        inset: "0",
                        zIndex: "40",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(4px)",
                    }}
                    onClick={() => setSidebarOpen(false)}
                    className="lg-hidden"
                />
            )}

            {/* Sidebar */}
            <aside
                style={{
                    position: "fixed",
                    top: "0",
                    bottom: "0",
                    left: "0",
                    zIndex: "50",
                    width: "clamp(260px, 20vw, 288px)",
                    backgroundColor: theme.sidebarBg,
                    borderRight: `1px solid ${theme.sidebarBorder}`,
                    transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
                    transition: "transform 0.3s ease-in-out",
                    display: "flex",
                    flexDirection: "column",
                }}
                className="sidebar"
            >
                {/* Logo */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "clamp(16px, 4vw, 20px) clamp(20px, 5vw, 24px)",
                        borderBottom: `1px solid ${theme.sidebarBorder}`,
                    }}
                >
                    <div
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
                        }}
                    >
                        <Shield style={{ width: "20px", height: "20px", color: "white" }} />
                    </div>
                    <div style={{ flex: "1" }}>
                        <h1
                            style={{
                                fontSize: "clamp(15px, 3.7vw, 16px)",
                                fontWeight: "700",
                                color: theme.textPrimary,
                            }}
                        >
                            Legacy Planning
                        </h1>
                        <p
                            style={{
                                fontSize: "clamp(11px, 2.7vw, 12px)",
                                color: theme.textSecondary,
                            }}
                        >
                            Secure your future
                        </p>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
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
                        className="close-btn-mobile"
                    >
                        <X style={{ width: "20px", height: "20px" }} />
                    </button>
                </div>

                {/* Navigation */}
                <nav
                    style={{
                        flex: "1",
                        padding: "clamp(16px, 4vw, 24px) clamp(12px, 3vw, 16px)",
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                    }}
                >
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    padding: "clamp(10px, 2.5vw, 12px) clamp(14px, 3.5vw, 16px)",
                                    borderRadius: "12px",
                                    fontSize: "clamp(14px, 3.5vw, 15px)",
                                    fontWeight: "600",
                                    textDecoration: "none",
                                    background: isActive
                                        ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                                        : "transparent",
                                    color: isActive ? "white" : theme.textSecondary,
                                    boxShadow: isActive ? "0 4px 12px rgba(99, 102, 241, 0.25)" : "none",
                                    transition: "all 0.2s",
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.backgroundColor = theme.hoverBg;
                                        e.currentTarget.style.color = theme.textPrimary;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.backgroundColor = "transparent";
                                        e.currentTarget.style.color = theme.textSecondary;
                                    }
                                }}
                            >
                                <item.icon style={{ width: "20px", height: "20px" }} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Heartbeat Button */}
                <div
                    style={{
                        padding: "clamp(12px, 3vw, 16px)",
                        borderTop: `1px solid ${theme.sidebarBorder}`,
                    }}
                >
                    <button
                        onClick={handleHeartbeat}
                        className="btn-hover"
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            padding: "clamp(10px, 2.5vw, 12px)",
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #f43f5e, #ec4899)",
                            color: "white",
                            fontSize: "clamp(14px, 3.5vw, 15px)",
                            fontWeight: "600",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 4px 12px rgba(244, 63, 94, 0.25)",
                        }}
                    >
                        <Heart style={{ width: "18px", height: "18px" }} className="animate-pulse" />
                        I&apos;m Still Here
                    </button>
                    <p
                        style={{
                            fontSize: "clamp(11px, 2.7vw, 12px)",
                            textAlign: "center",
                            color: theme.textMuted,
                            marginTop: "8px",
                        }}
                    >
                        Click to reset your DMS timer
                    </p>
                </div>

                {/* User */}
                <div
                    style={{
                        padding: "clamp(12px, 3vw, 16px)",
                        borderTop: `1px solid ${theme.sidebarBorder}`,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "clamp(10px, 2.5vw, 12px)",
                            borderRadius: "12px",
                            backgroundColor: isDark ? "rgba(30, 41, 59, 0.5)" : "#f8fafc",
                        }}
                    >
                        <div
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontSize: "16px",
                                fontWeight: "700",
                            }}
                        >
                            {session?.user?.name?.[0] || session?.user?.email?.[0] || "U"}
                        </div>
                        <div style={{ flex: "1", minWidth: "0" }}>
                            <p
                                style={{
                                    fontSize: "clamp(13px, 3.2vw, 14px)",
                                    fontWeight: "600",
                                    color: theme.textPrimary,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {session?.user?.name || "User"}
                            </p>
                            <p
                                style={{
                                    fontSize: "clamp(11px, 2.7vw, 12px)",
                                    color: theme.textSecondary,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {session?.user?.email}
                            </p>
                        </div>
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            title="Sign out"
                            style={{
                                padding: "8px",
                                borderRadius: "8px",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: theme.textSecondary,
                                transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = theme.hoverBg;
                                e.currentTarget.style.color = theme.textPrimary;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                                e.currentTarget.style.color = theme.textSecondary;
                            }}
                        >
                            <LogOut style={{ width: "18px", height: "18px" }} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div style={{ paddingLeft: "0" }} className="main-content">
                {/* Mobile header */}
                <header
                    style={{
                        position: "sticky",
                        top: "0",
                        zIndex: "30",
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        padding: "clamp(12px, 3vw, 16px)",
                        backgroundColor: isDark ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
                        backdropFilter: "blur(12px)",
                        borderBottom: `1px solid ${theme.sidebarBorder}`,
                    }}
                    className="mobile-header"
                >
                    <button
                        onClick={() => setSidebarOpen(true)}
                        style={{
                            padding: "8px",
                            borderRadius: "8px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: theme.textPrimary,
                        }}
                    >
                        <Menu style={{ width: "24px", height: "24px" }} />
                    </button>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Shield style={{ width: "24px", height: "24px", color: "#6366f1" }} />
                        <span
                            style={{
                                fontSize: "clamp(15px, 3.7vw, 16px)",
                                fontWeight: "700",
                                color: theme.textPrimary,
                            }}
                        >
                            Legacy Planning
                        </span>
                    </div>
                </header>

                {/* Page content */}
                <main
                    style={{
                        padding: "clamp(16px, 4vw, 32px)",
                    }}
                >
                    {children}
                </main>
            </div>

            {/* AI Assistant */}
            <AIAssistant />

            <style jsx>{`
                @media (min-width: 1024px) {
                    .sidebar {
                        transform: translateX(0) !important;
                    }
                    .main-content {
                        padding-left: clamp(260px, 20vw, 288px) !important;
                    }
                    .mobile-header {
                        display: none !important;
                    }
                    .close-btn-mobile {
                        display: none !important;
                    }
                }
                @media (max-width: 1023px) {
                    .lg-hidden {
                        display: block;
                    }
                }
                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.5;
                    }
                }
            `}</style>
        </div>
    );
}
