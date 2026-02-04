"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Shield, Check } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [isDark, setIsDark] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        setIsDark(mediaQuery.matches);
        const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    const passwordRequirements = [
        { label: "At least 8 characters", met: password.length >= 8 },
        { label: "Contains a number", met: /\d/.test(password) },
        { label: "Contains uppercase", met: /[A-Z]/.test(password) },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (!passwordRequirements.every((req) => req.met)) {
            setError("Please meet all password requirements");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Registration failed");
            }

            router.push("/login?registered=true");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const theme = {
        bg: isDark
            ? "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)"
            : "linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #eef2ff 100%)",
        textPrimary: isDark ? "#f8fafc" : "#111827",
        textSecondary: isDark ? "#94a3b8" : "#4b5563",
        textMuted: isDark ? "#64748b" : "#9ca3af",
        cardBg: isDark ? "rgba(30, 41, 59, 0.7)" : "rgba(255, 255, 255, 0.7)",
        inputBg: isDark ? "#1e293b" : "#f9fafb",
        inputBorder: isDark ? "#334155" : "#e5e7eb",
        errorBg: isDark ? "rgba(127, 29, 29, 0.2)" : "#fef2f2",
        errorBorder: isDark ? "#7f1d1d" : "#fecaca",
        errorText: isDark ? "#fca5a5" : "#dc2626",
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
                            Create Account
                        </h2>
                        <p
                            style={{
                                fontSize: "clamp(13px, 3.2vw, 14px)",
                                color: theme.textSecondary,
                            }}
                        >
                            Start protecting your digital assets
                        </p>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "clamp(14px, 3.5vw, 16px)",
                        }}
                    >
                        {/* Name Input */}
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
                                Full Name
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
                                    <User style={{ width: "20px", height: "20px" }} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
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

                        {/* Password Requirements */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                            }}
                        >
                            {passwordRequirements.map((req, i) => (
                                <div
                                    key={i}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "16px",
                                            height: "16px",
                                            borderRadius: "50%",
                                            backgroundColor: req.met ? "#10b981" : (isDark ? "#374151" : "#e5e7eb"),
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                            transition: "all 0.2s",
                                        }}
                                    >
                                        {req.met && (
                                            <Check
                                                style={{
                                                    width: "10px",
                                                    height: "10px",
                                                    color: "white",
                                                }}
                                            />
                                        )}
                                    </div>
                                    <span
                                        style={{
                                            fontSize: "clamp(12px, 3vw, 13px)",
                                            color: req.met ? "#10b981" : theme.textSecondary,
                                            transition: "color 0.2s",
                                        }}
                                    >
                                        {req.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Confirm Password Input */}
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
                                Confirm Password
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
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)",
                                        paddingLeft: "44px",
                                        borderRadius: "12px",
                                        border: `1px solid ${
                                            confirmPassword && password !== confirmPassword
                                                ? "#ef4444"
                                                : theme.inputBorder
                                        }`,
                                        backgroundColor: theme.inputBg,
                                        color: theme.textPrimary,
                                        fontSize: "clamp(14px, 3.5vw, 16px)",
                                        outline: "none",
                                        transition: "all 0.2s",
                                    }}
                                    onFocus={(e) => {
                                        if (!(confirmPassword && password !== confirmPassword)) {
                                            e.currentTarget.style.borderColor = "#6366f1";
                                            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.1)";
                                        }
                                    }}
                                    onBlur={(e) => {
                                        if (!(confirmPassword && password !== confirmPassword)) {
                                            e.currentTarget.style.borderColor = theme.inputBorder;
                                            e.currentTarget.style.boxShadow = "none";
                                        }
                                    }}
                                />
                            </div>
                            {confirmPassword && password !== confirmPassword && (
                                <p
                                    style={{
                                        marginTop: "6px",
                                        fontSize: "clamp(12px, 3vw, 13px)",
                                        color: "#ef4444",
                                    }}
                                >
                                    Passwords don&apos;t match
                                </p>
                            )}
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
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

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
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                style={{
                                    color: "#6366f1",
                                    fontWeight: "600",
                                    textDecoration: "none",
                                    transition: "color 0.2s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "#8b5cf6")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "#6366f1")}
                            >
                                Sign in
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
                    By signing up, you agree to protect your digital legacy
                </p>
            </div>
        </div>
    );
}
