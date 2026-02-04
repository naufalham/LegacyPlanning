"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Shield, Key, CheckCircle, AlertTriangle, Loader } from "lucide-react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_mock");

function ClaimContent() {
    const searchParams = useSearchParams();
    const keyFromUrl = searchParams.get("key");

    const [accessKey, setAccessKey] = useState(keyFromUrl || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [clientSecret, setClientSecret] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        setIsDark(mediaQuery.matches);
        const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    useEffect(() => {
        if (keyFromUrl) {
            setAccessKey(keyFromUrl);
        }
    }, [keyFromUrl]);

    const handleVerify = async () => {
        if (!accessKey.trim()) {
            setError("Please enter your access key");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/identify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accessKey: accessKey.trim() }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to start verification");
            }

            setClientSecret(data.clientSecret);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const startStripeFlow = async () => {
        const stripe = await stripePromise;
        if (!stripe || !clientSecret) return;

        setVerifying(true);

        try {
            const { error } = await stripe.verifyIdentity(clientSecret);
            if (error) {
                console.log("[error]", error);
                setError(error.message || "Verification failed");
            } else {
                // Redirect to vault after successful verification
                window.location.href = `/vault/${accessKey}`;
            }
        } catch (err: any) {
            setError(err.message || "Verification failed");
        } finally {
            setVerifying(false);
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
        infoBg: isDark ? "rgba(30, 58, 138, 0.2)" : "#eff6ff",
        infoBorder: isDark ? "#1e3a8a" : "#bfdbfe",
        infoText: isDark ? "#93c5fd" : "#1e40af",
        successBg: isDark ? "rgba(20, 83, 45, 0.3)" : "#f0fdf4",
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
                    maxWidth: "480px",
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
                        Claim your legacy access
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
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                            <Key style={{ width: "20px", height: "20px", color: "#6366f1" }} />
                            <h2
                                style={{
                                    fontSize: "clamp(18px, 4.5vw, 22px)",
                                    fontWeight: "700",
                                    color: theme.textPrimary,
                                }}
                            >
                                {clientSecret ? "Identity Verification" : "Access Your Legacy"}
                            </h2>
                        </div>
                        <p
                            style={{
                                fontSize: "clamp(13px, 3.2vw, 14px)",
                                color: theme.textSecondary,
                            }}
                        >
                            {clientSecret
                                ? "Complete identity verification to access the vault"
                                : "Enter the access key you received via email"}
                        </p>
                    </div>

                    {/* Form Content */}
                    {!clientSecret ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(16px, 4vw, 20px)" }}>
                            {/* Access Key Input */}
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
                                    Access Key
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
                                        <Key style={{ width: "20px", height: "20px" }} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Enter your access key"
                                        value={accessKey}
                                        onChange={(e) => setAccessKey(e.target.value)}
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
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        padding: "clamp(10px, 2.5vw, 12px)",
                                        borderRadius: "12px",
                                        backgroundColor: theme.errorBg,
                                        border: `1px solid ${theme.errorBorder}`,
                                    }}
                                >
                                    <AlertTriangle style={{ width: "16px", height: "16px", color: theme.errorText, flexShrink: 0 }} />
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

                            {/* Verify Button */}
                            <button
                                onClick={handleVerify}
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
                                {loading && <Loader style={{ width: "16px", height: "16px" }} className="animate-spin" />}
                                Start Verification
                            </button>

                            {/* Info Box */}
                            <div
                                style={{
                                    padding: "clamp(12px, 3vw, 16px)",
                                    borderRadius: "12px",
                                    backgroundColor: theme.infoBg,
                                    border: `1px solid ${theme.infoBorder}`,
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: "clamp(12px, 3vw, 13px)",
                                        color: theme.infoText,
                                        lineHeight: "1.5",
                                    }}
                                >
                                    ℹ️ You will need to verify your identity with a government-issued ID and a selfie to
                                    access the vault.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(16px, 4vw, 20px)" }}>
                            {/* Success State */}
                            <div style={{ textAlign: "center", padding: "clamp(12px, 3vw, 16px) 0" }}>
                                <div
                                    style={{
                                        width: "clamp(56px, 14vw, 64px)",
                                        height: "clamp(56px, 14vw, 64px)",
                                        borderRadius: "50%",
                                        backgroundColor: theme.successBg,
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginBottom: "clamp(12px, 3vw, 16px)",
                                    }}
                                >
                                    <CheckCircle
                                        style={{
                                            width: "clamp(28px, 7vw, 32px)",
                                            height: "clamp(28px, 7vw, 32px)",
                                            color: "#10b981",
                                        }}
                                    />
                                </div>
                                <h3
                                    style={{
                                        fontSize: "clamp(16px, 4vw, 18px)",
                                        fontWeight: "700",
                                        color: theme.textPrimary,
                                        marginBottom: "8px",
                                    }}
                                >
                                    Access Key Validated!
                                </h3>
                                <p
                                    style={{
                                        fontSize: "clamp(13px, 3.2vw, 14px)",
                                        color: theme.textSecondary,
                                    }}
                                >
                                    Please verify your identity to unlock the vault.
                                </p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        padding: "clamp(10px, 2.5vw, 12px)",
                                        borderRadius: "12px",
                                        backgroundColor: theme.errorBg,
                                        border: `1px solid ${theme.errorBorder}`,
                                    }}
                                >
                                    <AlertTriangle style={{ width: "16px", height: "16px", color: theme.errorText, flexShrink: 0 }} />
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

                            {/* Stripe Button */}
                            <button
                                onClick={startStripeFlow}
                                disabled={verifying}
                                className="btn-hover"
                                style={{
                                    width: "100%",
                                    padding: "clamp(12px, 3vw, 14px) clamp(20px, 5vw, 24px)",
                                    borderRadius: "12px",
                                    background: "#635BFF",
                                    color: "white",
                                    fontWeight: "700",
                                    fontSize: "clamp(15px, 3.7vw, 17px)",
                                    border: "none",
                                    cursor: verifying ? "not-allowed" : "pointer",
                                    opacity: verifying ? 0.7 : 1,
                                    boxShadow: "0 4px 12px rgba(99, 91, 255, 0.25)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px",
                                    transition: "all 0.2s",
                                }}
                                onMouseEnter={(e) => !verifying && (e.currentTarget.style.background = "#534be0")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "#635BFF")}
                            >
                                {verifying && <Loader style={{ width: "16px", height: "16px" }} className="animate-spin" />}
                                Verify Identity with Stripe
                            </button>

                            {/* Back Button */}
                            <button
                                onClick={() => setClientSecret("")}
                                style={{
                                    width: "100%",
                                    padding: "8px",
                                    background: "none",
                                    border: "none",
                                    color: theme.textSecondary,
                                    fontSize: "clamp(12px, 3vw, 13px)",
                                    cursor: "pointer",
                                    transition: "color 0.2s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = theme.textPrimary)}
                                onMouseLeave={(e) => (e.currentTarget.style.color = theme.textSecondary)}
                            >
                                Use a different access key
                            </button>
                        </div>
                    )}
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
                    Your identity verification is processed securely by Stripe
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

export default function ClaimPage() {
    return (
        <Suspense
            fallback={
                <div
                    style={{
                        minHeight: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Loader style={{ width: "32px", height: "32px", color: "#6366f1" }} className="animate-spin" />
                </div>
            }
        >
            <ClaimContent />
        </Suspense>
    );
}
