"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface CategorizationResult {
  type: string;
  platform: string;
  category: string;
}

interface Props {
  assetName: string;
  onSuggestion: (result: CategorizationResult) => void;
  isDark: boolean;
}

export default function SmartCategorizer({ assetName, onSuggestion, isDark }: Props) {
  const [loading, setLoading] = useState(false);

  const handleCategorize = async () => {
    if (!assetName || assetName.length < 3) {
      toast.error("Nama aset terlalu pendek untuk dikategorikan");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/ai/categorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: assetName }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      onSuggestion(data);
      toast.success("✨ Saran kategorisasi berhasil!");
    } catch (error: any) {
      toast.error("Gagal mendapatkan saran: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const theme = {
    text: isDark ? "#f8fafc" : "#111827",
    bg: isDark ? "#1e293b" : "#f1f5f9",
  };

  return (
    <button
      onClick={handleCategorize}
      disabled={loading || !assetName}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 12px",
        borderRadius: "8px",
        backgroundColor: theme.bg,
        border: "1px solid #6366f1",
        color: "#6366f1",
        fontSize: "12px",
        fontWeight: "500",
        cursor: loading || !assetName ? "not-allowed" : "pointer",
        opacity: loading || !assetName ? 0.5 : 1,
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        if (!loading && assetName) {
          e.currentTarget.style.backgroundColor = "#6366f1";
          e.currentTarget.style.color = "white";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = theme.bg;
        e.currentTarget.style.color = "#6366f1";
      }}
      title="AI akan menyarankan kategori berdasarkan nama aset"
    >
      {loading ? (
        <>
          <Loader2 style={{ width: "14px", height: "14px" }} className="animate-spin" />
          Menganalisis...
        </>
      ) : (
        <>
          <Sparkles style={{ width: "14px", height: "14px" }} />
          Kategorikan dengan AI
        </>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </button>
  );
}
