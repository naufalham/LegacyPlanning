"use client";

import { useState } from "react";
import { Wand2, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  relationship: string;
  onGenerated: (message: string) => void;
  isDark: boolean;
}

export default function MessageGenerator({ relationship, onGenerated, isDark }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState("warm");
  const [purpose, setPurpose] = useState("instruksi akses");

  const handleGenerate = async () => {
    if (!relationship) {
      toast.error("Pilih relationship terlebih dahulu");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ relationship, tone, purpose }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      onGenerated(data.message);
      toast.success("✨ Pesan berhasil digenerate!");
      setIsOpen(false);
    } catch (error: any) {
      toast.error("Gagal generate pesan: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const theme = {
    text: isDark ? "#f8fafc" : "#111827",
    textSecondary: isDark ? "#94a3b8" : "#64748b",
    bg: isDark ? "#0f172a" : "#ffffff",
    border: isDark ? "#1e293b" : "#e2e8f0",
    inputBg: isDark ? "#1e293b" : "#f9fafb",
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 12px",
          borderRadius: "8px",
          backgroundColor: isDark ? "#1e293b" : "#f1f5f9",
          border: "1px solid #8b5cf6",
          color: "#8b5cf6",
          fontSize: "12px",
          fontWeight: "500",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#8b5cf6";
          e.currentTarget.style.color = "white";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = isDark ? "#1e293b" : "#f1f5f9";
          e.currentTarget.style.color = "#8b5cf6";
        }}
      >
        <Wand2 style={{ width: "14px", height: "14px" }} />
        Generate Pesan dengan AI
      </button>
    );
  }

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
        onClick={() => !loading && setIsOpen(false)}
      >
        {/* Modal */}
        <div
          style={{
            backgroundColor: theme.bg,
            borderRadius: "16px",
            width: "100%",
            maxWidth: "450px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              padding: "20px",
              borderBottom: `1px solid ${theme.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: theme.text, margin: 0 }}>
              Generate Pesan AI
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              disabled={loading}
              style={{
                padding: "6px",
                background: "none",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                color: theme.textSecondary,
              }}
            >
              <X style={{ width: "20px", height: "20px" }} />
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: theme.textSecondary, marginBottom: "8px" }}>
                Relationship
              </label>
              <input
                type="text"
                value={relationship}
                disabled
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: `1px solid ${theme.border}`,
                  backgroundColor: theme.inputBg,
                  color: theme.textSecondary,
                  fontSize: "14px",
                  opacity: 0.6,
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: theme.textSecondary, marginBottom: "8px" }}>
                Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: `1px solid ${theme.border}`,
                  backgroundColor: theme.inputBg,
                  color: theme.text,
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                <option value="warm">Warm & Caring</option>
                <option value="formal">Formal</option>
                <option value="casual">Casual</option>
                <option value="emotional">Emotional</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: theme.textSecondary, marginBottom: "8px" }}>
                Tujuan Pesan
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: `1px solid ${theme.border}`,
                  backgroundColor: theme.inputBg,
                  color: theme.text,
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                <option value="instruksi akses">Instruksi Akses Warisan</option>
                <option value="pesan pribadi">Pesan Pribadi</option>
                <option value="panduan">Panduan & Tips</option>
                <option value="ucapan">Ucapan & Harapan</option>
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                background: loading ? "#94a3b8" : "linear-gradient(135deg, #8b5cf6, #a855f7)",
                color: "white",
                fontSize: "14px",
                fontWeight: "600",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {loading ? (
                <>
                  <Loader2 style={{ width: "18px", height: "18px" }} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 style={{ width: "18px", height: "18px" }} />
                  Generate Pesan
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </>
  );
}
