"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Shield,
  Lock,
  Users,
  Clock,
  Key,
  CheckCircle,
  ArrowRight,
  Zap,
  Heart,
  FileText,
  Menu,
  X,
} from "lucide-react";

export default function Home() {
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check system preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mediaQuery.matches);

    // Listen for changes
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  // Theme colors
  const theme = {
    bg: isDark
      ? "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)"
      : "linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #eef2ff 100%)",
    navBg: isDark ? "rgba(15, 23, 42, 0.9)" : "rgba(255, 255, 255, 0.9)",
    navBorder: isDark ? "#1e293b" : "#e5e7eb",
    textPrimary: isDark ? "#f8fafc" : "#111827",
    textSecondary: isDark ? "#94a3b8" : "#4b5563",
    textMuted: isDark ? "#64748b" : "#9ca3af",
    cardBg: isDark ? "#1e293b" : "white",
    cardBorder: isDark ? "#334155" : "#f3f4f6",
    problemCardBg: isDark
      ? "linear-gradient(135deg, #450a0a, #431407)"
      : "linear-gradient(135deg, #fef2f2, #fff7ed)",
    problemCardBorder: isDark ? "#7f1d1d" : "#fecaca",
    sectionBg: isDark ? "#0f172a" : "white",
    badgeBg: isDark ? "#312e81" : "#e0e7ff",
    badgeText: isDark ? "#a5b4fc" : "#4338ca",
    heroVisualBg: isDark
      ? "linear-gradient(135deg, #312e81, #581c87)"
      : "linear-gradient(135deg, #e0e7ff, #f3e8ff)",
    footerBorder: isDark ? "#1e293b" : "#e5e7eb",
  };

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      {/* Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backgroundColor: theme.navBg,
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${theme.navBorder}`,
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 clamp(16px, 5vw, 24px)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "64px",
            }}
          >
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)",
                }}
              >
                <Shield style={{ width: "20px", height: "20px", color: "white" }} />
              </div>
              <span
                style={{
                  fontWeight: "700",
                  color: theme.textPrimary,
                  fontSize: "clamp(16px, 4vw, 18px)",
                }}
              >
                Legacy Planning
              </span>
            </div>

            {/* Desktop Navigation */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
              className="desktop-nav"
            >
              <Link
                href="/claim"
                style={{
                  color: theme.textSecondary,
                  fontWeight: "500",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = theme.textPrimary)}
                onMouseLeave={(e) => (e.currentTarget.style.color = theme.textSecondary)}
              >
                Claim Access
              </Link>
              <Link
                href="/login"
                style={{
                  color: theme.textSecondary,
                  fontWeight: "500",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = theme.textPrimary)}
                onMouseLeave={(e) => (e.currentTarget.style.color = theme.textSecondary)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="btn-hover"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px 20px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "white",
                  fontWeight: "600",
                  textDecoration: "none",
                  boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)",
                }}
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: "none",
                padding: "8px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: theme.textPrimary,
              }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}
          style={{
            display: "none",
            position: "fixed",
            top: "64px",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: theme.navBg,
            padding: "24px",
            transform: mobileMenuOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.3s ease",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Link
              href="/claim"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color: theme.textSecondary,
                fontWeight: "500",
                textDecoration: "none",
                padding: "12px 16px",
                borderRadius: "8px",
                backgroundColor: theme.cardBg,
              }}
            >
              Claim Access
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color: theme.textSecondary,
                fontWeight: "500",
                textDecoration: "none",
                padding: "12px 16px",
                borderRadius: "8px",
                backgroundColor: theme.cardBg,
              }}
            >
              Login
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px 16px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "white",
                fontWeight: "600",
                textDecoration: "none",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)",
              }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          paddingTop: "clamp(120px, 20vw, 160px)",
          paddingBottom: "clamp(40px, 10vw, 80px)",
          paddingLeft: "clamp(16px, 5vw, 24px)",
          paddingRight: "clamp(16px, 5vw, 24px)",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: "896px", margin: "0 auto" }}>
            {/* Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "999px",
                backgroundColor: theme.badgeBg,
                color: theme.badgeText,
                fontSize: "clamp(12px, 3vw, 14px)",
                fontWeight: "500",
                marginBottom: "24px",
              }}
            >
              <Zap style={{ width: "16px", height: "16px" }} />
              AI-Powered Digital Legacy Protection
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: "clamp(32px, 8vw, 72px)",
                fontWeight: "800",
                color: theme.textPrimary,
                lineHeight: "1.1",
                marginBottom: "clamp(16px, 4vw, 24px)",
              }}
            >
              Secure Your{" "}
              <span className="gradient-text">Digital Legacy</span>
            </h1>

            {/* Subheadline */}
            <p
              style={{
                fontSize: "clamp(16px, 4vw, 20px)",
                color: theme.textSecondary,
                maxWidth: "640px",
                margin: "0 auto",
                marginBottom: "clamp(24px, 6vw, 40px)",
                lineHeight: "1.6",
              }}
            >
              Protect your digital assets with our intelligent Dead Man&apos;s Switch.
              Ensure your loved ones can access important information when they need it most.
            </p>

            {/* CTA Buttons */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                gap: "clamp(12px, 3vw, 16px)",
              }}
            >
              <Link
                href="/register"
                className="btn-hover"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "clamp(12px, 3vw, 16px) clamp(20px, 5vw, 32px)",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "white",
                  fontWeight: "700",
                  fontSize: "clamp(14px, 3.5vw, 18px)",
                  textDecoration: "none",
                  boxShadow: "0 8px 24px rgba(99, 102, 241, 0.3)",
                  whiteSpace: "nowrap",
                }}
              >
                Start Protecting Now
                <ArrowRight
                  style={{
                    width: "clamp(16px, 4vw, 20px)",
                    height: "clamp(16px, 4vw, 20px)",
                    marginLeft: "8px",
                  }}
                />
              </Link>
              <Link
                href="/claim"
                className="btn-hover"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "clamp(12px, 3vw, 16px) clamp(20px, 5vw, 32px)",
                  borderRadius: "16px",
                  border: `2px solid ${theme.navBorder}`,
                  color: theme.textPrimary,
                  fontWeight: "700",
                  fontSize: "clamp(14px, 3.5vw, 18px)",
                  textDecoration: "none",
                  backgroundColor: isDark ? "transparent" : "white",
                  whiteSpace: "nowrap",
                }}
              >
                <Key
                  style={{
                    width: "clamp(16px, 4vw, 20px)",
                    height: "clamp(16px, 4vw, 20px)",
                    marginRight: "8px",
                  }}
                />
                I Have an Access Key
              </Link>
            </div>
          </div>

          {/* Hero Visual */}
          <div style={{ marginTop: "clamp(32px, 8vw, 64px)", position: "relative" }}>
            <div
              style={{
                position: "absolute",
                inset: "0",
                background: isDark
                  ? "linear-gradient(to top, #0f172a, transparent)"
                  : "linear-gradient(to top, white, transparent)",
                zIndex: "10",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                maxWidth: "960px",
                margin: "0 auto",
                borderRadius: "clamp(16px, 4vw, 24px)",
                overflow: "hidden",
                boxShadow: isDark
                  ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                  : "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                border: `1px solid ${theme.navBorder}`,
              }}
            >
              <div
                style={{
                  aspectRatio: "16/9",
                  background: theme.heroVisualBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ textAlign: "center", padding: "16px" }}>
                  <Shield
                    style={{
                      width: "clamp(48px, 12vw, 96px)",
                      height: "clamp(48px, 12vw, 96px)",
                      color: "#6366f1",
                      margin: "0 auto 16px auto",
                    }}
                  />
                  <p
                    style={{
                      fontSize: "clamp(14px, 3.5vw, 18px)",
                      color: theme.textSecondary,
                    }}
                  >
                    Your Digital Vault Dashboard
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section
        style={{
          padding: "clamp(40px, 10vw, 80px) clamp(16px, 5vw, 24px)",
          backgroundColor: theme.sectionBg,
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div
            style={{
              textAlign: "center",
              maxWidth: "768px",
              margin: "0 auto",
              marginBottom: "clamp(32px, 8vw, 64px)",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(24px, 6vw, 40px)",
                fontWeight: "700",
                color: theme.textPrimary,
                marginBottom: "16px",
              }}
            >
              The Problem We Solve
            </h2>
            <p
              style={{
                fontSize: "clamp(14px, 3.5vw, 18px)",
                color: theme.textSecondary,
              }}
            >
              In today&apos;s digital world, your loved ones face significant challenges
              accessing your important digital assets.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
              gap: "clamp(16px, 4vw, 32px)",
            }}
          >
            {[
              {
                icon: Lock,
                title: "Password Protected",
                description:
                  "2FA, encryption, and complex passwords keep your assets secure - but also inaccessible to family.",
              },
              {
                icon: FileText,
                title: "Scattered Information",
                description:
                  "Subscriptions, investments, crypto, and legal docs spread across dozens of platforms.",
              },
              {
                icon: Clock,
                title: "Time Sensitive",
                description:
                  "Family needs quick access during emergencies, but recovery processes take weeks or months.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="card-hover"
                style={{
                  padding: "clamp(20px, 5vw, 32px)",
                  borderRadius: "clamp(16px, 4vw, 24px)",
                  background: theme.problemCardBg,
                  border: `1px solid ${theme.problemCardBorder}`,
                }}
              >
                <item.icon
                  style={{
                    width: "clamp(32px, 8vw, 48px)",
                    height: "clamp(32px, 8vw, 48px)",
                    color: "#ef4444",
                    marginBottom: "16px",
                  }}
                />
                <h3
                  style={{
                    fontSize: "clamp(16px, 4vw, 20px)",
                    fontWeight: "700",
                    color: theme.textPrimary,
                    marginBottom: "8px",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    color: theme.textSecondary,
                    fontSize: "clamp(14px, 3.5vw, 16px)",
                  }}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution/Features Section */}
      <section
        style={{
          padding: "clamp(40px, 10vw, 80px) clamp(16px, 5vw, 24px)",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div
            style={{
              textAlign: "center",
              maxWidth: "768px",
              margin: "0 auto",
              marginBottom: "clamp(32px, 8vw, 64px)",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(24px, 6vw, 40px)",
                fontWeight: "700",
                color: theme.textPrimary,
                marginBottom: "16px",
              }}
            >
              How It Works
            </h2>
            <p
              style={{
                fontSize: "clamp(14px, 3.5vw, 18px)",
                color: theme.textSecondary,
              }}
            >
              Our intelligent system ensures your digital legacy is protected and
              accessible when needed.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
              gap: "clamp(16px, 4vw, 24px)",
            }}
          >
            {[
              {
                icon: Lock,
                title: "Encrypt & Store",
                description: "Add your assets with client-side encryption. Only you hold the keys.",
                color: "#8b5cf6",
              },
              {
                icon: Users,
                title: "Add Beneficiaries",
                description: "Designate trusted people who should receive access.",
                color: "#6366f1",
              },
              {
                icon: Heart,
                title: "Stay Active",
                description: "Regular check-ins keep the Dead Man's Switch from triggering.",
                color: "#ec4899",
              },
              {
                icon: Key,
                title: "Secure Transfer",
                description: "If inactive, beneficiaries are notified and verified before access.",
                color: "#10b981",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="card-hover"
                style={{
                  padding: "clamp(20px, 5vw, 24px)",
                  borderRadius: "clamp(16px, 4vw, 24px)",
                  backgroundColor: theme.cardBg,
                  boxShadow: isDark
                    ? "0 10px 40px rgba(0, 0, 0, 0.3)"
                    : "0 10px 40px rgba(0, 0, 0, 0.08)",
                  border: `1px solid ${theme.cardBorder}`,
                }}
              >
                <div
                  style={{
                    width: "clamp(40px, 10vw, 56px)",
                    height: "clamp(40px, 10vw, 56px)",
                    borderRadius: "clamp(12px, 3vw, 16px)",
                    backgroundColor: item.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                    boxShadow: `0 4px 12px ${item.color}40`,
                  }}
                >
                  <item.icon
                    style={{
                      width: "clamp(20px, 5vw, 28px)",
                      height: "clamp(20px, 5vw, 28px)",
                      color: "white",
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
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: "clamp(13px, 3.2vw, 14px)",
                    color: theme.textSecondary,
                    lineHeight: "1.5",
                  }}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section
        style={{
          padding: "clamp(40px, 10vw, 80px) clamp(16px, 5vw, 24px)",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div
            style={{
              textAlign: "center",
              maxWidth: "768px",
              margin: "0 auto",
              marginBottom: "clamp(32px, 8vw, 64px)",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(24px, 6vw, 40px)",
                fontWeight: "700",
                color: "white",
                marginBottom: "16px",
              }}
            >
              Enterprise-Grade Security
            </h2>
            <p
              style={{
                fontSize: "clamp(14px, 3.5vw, 18px)",
                color: "#c7d2fe",
              }}
            >
              Your data is protected with the latest security standards
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
              gap: "clamp(12px, 3vw, 24px)",
            }}
          >
            {[
              "AES-256 Client-Side Encryption",
              "Zero-Knowledge Architecture",
              "Stripe Identity Verification",
              "Configurable Dead Man's Switch",
              "AI-Powered Beneficiary Guide",
              "Automated Email Notifications",
            ].map((feature, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "clamp(12px, 3vw, 16px)",
                  borderRadius: "clamp(12px, 3vw, 16px)",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <CheckCircle
                  style={{
                    width: "clamp(20px, 5vw, 24px)",
                    height: "clamp(20px, 5vw, 24px)",
                    color: "#4ade80",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    color: "white",
                    fontWeight: "500",
                    fontSize: "clamp(13px, 3.2vw, 15px)",
                  }}
                >
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: "clamp(40px, 10vw, 80px) clamp(16px, 5vw, 24px)",
        }}
      >
        <div style={{ maxWidth: "896px", margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontSize: "clamp(24px, 6vw, 40px)",
              fontWeight: "700",
              color: theme.textPrimary,
              marginBottom: "16px",
            }}
          >
            Start Protecting Your Digital Legacy Today
          </h2>
          <p
            style={{
              fontSize: "clamp(14px, 3.5vw, 18px)",
              color: theme.textSecondary,
              marginBottom: "clamp(24px, 6vw, 32px)",
            }}
          >
            Join thousands of professionals who trust Legacy Planning to secure their
            digital future.
          </p>
          <Link
            href="/register"
            className="btn-hover"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "clamp(14px, 3.5vw, 20px) clamp(24px, 6vw, 40px)",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "white",
              fontWeight: "700",
              fontSize: "clamp(16px, 4vw, 20px)",
              textDecoration: "none",
              boxShadow: "0 8px 24px rgba(99, 102, 241, 0.3)",
            }}
          >
            Get Started Free
            <ArrowRight
              style={{
                width: "clamp(20px, 5vw, 24px)",
                height: "clamp(20px, 5vw, 24px)",
                marginLeft: "8px",
              }}
            />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "clamp(32px, 8vw, 48px) clamp(16px, 5vw, 24px)",
          borderTop: `1px solid ${theme.footerBorder}`,
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Shield style={{ width: "24px", height: "24px", color: "#6366f1" }} />
              <span
                style={{
                  fontWeight: "700",
                  color: theme.textPrimary,
                  fontSize: "clamp(14px, 3.5vw, 16px)",
                }}
              >
                Legacy Planning
              </span>
            </div>
            <p
              style={{
                color: theme.textMuted,
                fontSize: "clamp(12px, 3vw, 14px)",
              }}
            >
              © 2026 Legacy Planning. Secure your digital future.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
          .mobile-menu {
            display: block !important;
          }
        }

        @media (min-width: 769px) {
          .mobile-menu {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
