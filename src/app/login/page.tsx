"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Shield, Loader } from "lucide-react";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        setIsDark(mediaQuery.matches);
        const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError(result.error);
            } else {
                router.push(callbackUrl);
                router.refresh();
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    const theme = {
        textPrimary: isDark ? "#f8fafc" : "#111827",
        textSecondary: isDark ? "#94a3b8" : "#4b5563",
        inputBg: isDark ? "#1e293b" : "#f9fafb",
        inputBorder: isDark ? "#334155" : "#e5e7eb",
        cardBg: isDark ? "rgba(30, 41, 59, 0.7)" : "rgba(255, 255, 255, 0.7)",
        errorBg: isDark ? "rgba(127, 29, 29, 0.2)" : "#fef2f2",
        errorBorder: isDark ? "#7f1d1d" : "#fecaca",
        errorText: isDark ? "#fca5a5" : "#dc2626",
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "clamp(16px, 4vw, 20px)",
            }}
        >
            {/* Email Input */}
            <div style={{ width: "100%" }}>
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
                <div style={{ position: "relative" }}>
                    <div
                        style={{
                            position: "absolute",
                            left: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: theme.textSecondary,
                            pointerEvents: "none",
                        }}
                    >
                        <Mail style={{ width: "20px", height: "20px" }} />
                    </div>
                    <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            padding: "clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)",
                            paddingLeft: "44px",
                            borderRadius: "12px",
                            border: `1px solid ${theme.inputBorder}`,
                            backgroundColor: theme.inputBg,
                            color: theme.textPrimary,
                            fontSize: "clamp(14px, 3.5vw, 16px)",
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
            </div>

            {/* Password Input */}
            <div style={{ width: "100%" }}>
                <label
                    style={{
                        display: "block",
                        fontSize: "clamp(13px, 3.2vw, 14px)",
                        fontWeight: "500",
                        color: theme.textSecondary,
                        marginBottom: "8px",
                    }}
                >
                    Password
                </label>
                <div style={{ position: "relative" }}>
                    <div
                        style={{
                            position: "absolute",
                            left: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: theme.textSecondary,
                            pointerEvents: "none",
                        }}
                    >
                        <Lock style={{ width: "20px", height: "20px" }} />
                    </div>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            padding: "clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)",
                            paddingLeft: "44px",
                            borderRadius: "12px",
                            border: `1px solid ${theme.inputBorder}`,
                            backgroundColor: theme.inputBg,
                            color: theme.textPrimary,
                            fontSize: "clamp(14px, 3.5vw, 16px)",
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
            </div>

            {/* Error Message */}
            {error && (
                <div
                    style={{
                        padding: "clamp(10px, 2.5vw, 12px)",
                        borderRadius: "12px",
                        backgroundColor: theme.errorBg,
                        border: `1px solid ${theme.errorBorder}`,
                    }}
                >
                    <p
                        style={{
                            fontSize: "clamp(13px, 3.2vw, 14px)",
                            color: theme.errorText,
                        }}
                    >
                        {error}
                    </p>
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="btn-hover"
                style={{
                    width: "100%",
                    padding: "clamp(12px, 3vw, 14px) clamp(20px, 5vw, 24px)",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    color: "white",
                    fontWeight: "700",
                    fontSize: "clamp(15px, 3.7vw, 17px)",
                    border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.7 : 1,
                    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                }}
            >
                {loading && (
                    <Loader style={{ width: "16px", height: "16px" }} className="animate-spin" />
                )}
                Sign In
            </button>
        </form>
    );
}

export default function LoginPage() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        setIsDark(mediaQuery.matches);
        const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    const theme = {
        bg: isDark
            ? "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)"
            : "linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #eef2ff 100%)",
        textPrimary: isDark ? "#f8fafc" : "#111827",
        textSecondary: isDark ? "#94a3b8" : "#4b5563",
        textMuted: isDark ? "#64748b" : "#9ca3af",
        cardBg: isDark ? "rgba(30, 41, 59, 0.7)" : "rgba(255, 255, 255, 0.7)",
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "clamp(16px, 4vw, 32px)",
                background: theme.bg,
                position: "relative",
            }}
        >
            {/* Background decorations */}
            <div
                style={{
                    position: "absolute",
                    inset: "0",
                    overflow: "hidden",
                    pointerEvents: "none",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: "-20%",
                        right: "-10%",
                        width: "clamp(200px, 40vw, 400px)",
                        height: "clamp(200px, 40vw, 400px)",
                        background: "#a78bfa",
                        borderRadius: "50%",
                        filter: "blur(80px)",
                        opacity: "0.2",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: "-20%",
                        left: "-10%",
                        width: "clamp(200px, 40vw, 400px)",
                        height: "clamp(200px, 40vw, 400px)",
                        background: "#6366f1",
                        borderRadius: "50%",
                        filter: "blur(80px)",
                        opacity: "0.2",
                    }}
                />
            </div>

            <div
                style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "450px",
                }}
            >
                {/* Logo Section */}
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "clamp(24px, 6vw, 32px)",
                    }}
                >
                    <div
                        style={{
                            width: "clamp(56px, 14vw, 64px)",
                            height: "clamp(56px, 14vw, 64px)",
                            borderRadius: "16px",
                            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: "clamp(12px, 3vw, 16px)",
                            boxShadow: "0 8px 24px rgba(99, 102, 241, 0.3)",
                        }}
                    >
                        <Shield
                            style={{
                                width: "clamp(28px, 7vw, 32px)",
                                height: "clamp(28px, 7vw, 32px)",
                                color: "white",
                            }}
                        />
                    </div>
                    <h1
                        style={{
                            fontSize: "clamp(20px, 5vw, 24px)",
                            fontWeight: "700",
                            color: theme.textPrimary,
                            marginBottom: "4px",
                        }}
                    >
                        Legacy Planning
                    </h1>
                    <p
                        style={{
                            fontSize: "clamp(13px, 3.2vw, 15px)",
                            color: theme.textSecondary,
                        }}
                    >
                        Secure your digital legacy
                    </p>
                </div>

                {/* Card */}
                <div
                    style={{
                        backgroundColor: theme.cardBg,
                        backdropFilter: "blur(12px)",
                        borderRadius: "clamp(16px, 4vw, 24px)",
                        padding: "clamp(20px, 5vw, 32px)",
                        boxShadow: isDark
                            ? "0 20px 60px rgba(0, 0, 0, 0.5)"
                            : "0 20px 60px rgba(0, 0, 0, 0.1)",
                        border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"}`,
                    }}
                >
                    {/* Card Header */}
                    <div style={{ marginBottom: "clamp(20px, 5vw, 24px)" }}>
                        <h2
                            style={{
                                fontSize: "clamp(20px, 5vw, 24px)",
                                fontWeight: "700",
                                color: theme.textPrimary,
                                marginBottom: "8px",
                            }}
                        >
                            Welcome back
                        </h2>
                        <p
                            style={{
                                fontSize: "clamp(13px, 3.2vw, 14px)",
                                color: theme.textSecondary,
                            }}
                        >
                            Sign in to access your vault
                        </p>
                    </div>

                    {/* Form */}
                    <Suspense
                        fallback={
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "32px",
                                }}
                            >
                                <Loader
                                    style={{ width: "24px", height: "24px", color: "#6366f1" }}
                                    className="animate-spin"
                                />
                            </div>
                        }
                    >
                        <LoginForm />
                    </Suspense>

                    {/* Footer Link */}
                    <div
                        style={{
                            marginTop: "clamp(20px, 5vw, 24px)",
                            textAlign: "center",
                        }}
                    >
                        <p
                            style={{
                                fontSize: "clamp(13px, 3.2vw, 14px)",
                                color: theme.textSecondary,
                            }}
                        >
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/register"
                                style={{
                                    color: "#6366f1",
                                    fontWeight: "600",
                                    textDecoration: "none",
                                    transition: "color 0.2s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "#8b5cf6")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "#6366f1")}
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Bottom Text */}
                <p
                    style={{
                        marginTop: "clamp(16px, 4vw, 24px)",
                        textAlign: "center",
                        fontSize: "clamp(11px, 2.7vw, 12px)",
                        color: theme.textMuted,
                    }}
                >
                    Your data is encrypted and secure
                </p>
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
