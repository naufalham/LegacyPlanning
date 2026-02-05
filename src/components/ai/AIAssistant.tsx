"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, AlertTriangle, Sparkles, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: "👋 Hello! I'm your AI Assistant for Legacy Planning.\n\nI can help you with:\n• Questions about features\n• How to use the application\n• Security tips\n• Asset organization advice\n\nHow can I help you today?",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Clean messages - remove timestamp before sending to API
      const cleanHistory = messages.slice(-6).map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: cleanHistory, // Last 3 exchanges for context
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      if (data.warnings && data.warnings.length > 0) {
        toast("🔒 " + data.warnings.join(", "), { duration: 4000 });
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      toast.error(error.message);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, an error occurred. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const theme = {
    bg: isDark ? "#0f172a" : "#ffffff",
    text: isDark ? "#f8fafc" : "#111827",
    textSecondary: isDark ? "#94a3b8" : "#64748b",
    border: isDark ? "#1e293b" : "#e2e8f0",
    inputBg: isDark ? "#1e293b" : "#f9fafb",
    userBubble: "#6366f1",
    assistantBubble: isDark ? "#1e293b" : "#f1f5f9",
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="ai-fab"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          border: "none",
          boxShadow: "0 8px 24px rgba(99, 102, 241, 0.4)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999,
          transition: "all 0.3s ease",
        }}
        title="AI Assistant"
      >
        <Sparkles style={{ width: "28px", height: "28px", color: "white" }} />
        <style jsx>{`
          .ai-fab:hover {
            transform: scale(1.1);
            box-shadow: 0 12px 32px rgba(99, 102, 241, 0.5);
          }
        `}</style>
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        width: "clamp(320px, 90vw, 420px)",
        height: "clamp(450px, 70vh, 650px)",
        backgroundColor: theme.bg,
        borderRadius: "20px",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        border: `1px solid ${theme.border}`,
        display: "flex",
        flexDirection: "column",
        zIndex: 999,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Sparkles style={{ width: "22px", height: "22px" }} />
          </div>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: "600", margin: 0 }}>
              AI Assistant
            </h3>
            <p style={{ fontSize: "12px", opacity: 0.9, margin: 0 }}>
              Powered by Groq
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            padding: "8px",
            background: "rgba(255, 255, 255, 0.2)",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            color: "white",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)")
          }
        >
          <X style={{ width: "20px", height: "20px" }} />
        </button>
      </div>

      {/* Privacy Notice */}
      <div
        style={{
          padding: "12px 16px",
          backgroundColor: isDark ? "rgba(251, 146, 60, 0.1)" : "#fffbeb",
          borderBottom: `1px solid ${theme.border}`,
          display: "flex",
          gap: "10px",
          alignItems: "flex-start",
        }}
      >
        <AlertTriangle
          style={{
            width: "16px",
            height: "16px",
            color: "#f59e0b",
            flexShrink: 0,
            marginTop: "2px",
          }}
        />
        <p
          style={{
            fontSize: "11px",
            color: "#f59e0b",
            margin: 0,
            lineHeight: "1.4",
          }}
        >
          🔒 Never share passwords, encryption keys, or sensitive data
        </p>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "85%",
                padding: "12px 16px",
                borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                backgroundColor:
                  msg.role === "user" ? theme.userBubble : theme.assistantBubble,
                color: msg.role === "user" ? "white" : theme.text,
                fontSize: "14px",
                lineHeight: "1.5",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "18px 18px 18px 4px",
                backgroundColor: theme.assistantBubble,
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
            >
              <Loader2
                style={{ width: "16px", height: "16px", color: "#6366f1" }}
                className="animate-spin"
              />
              <span style={{ fontSize: "14px", color: theme.textSecondary }}>
                Mengetik...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: "16px",
          borderTop: `1px solid ${theme.border}`,
          backgroundColor: theme.bg,
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Ketik pertanyaan Anda..."
            disabled={loading}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: "12px",
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.inputBg,
              color: theme.text,
              fontSize: "14px",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#6366f1")}
            onBlur={(e) => (e.currentTarget.style.borderColor = theme.border)}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              padding: "12px 16px",
              borderRadius: "12px",
              background:
                loading || !input.trim()
                  ? "#94a3b8"
                  : "linear-gradient(135deg, #6366f1, #8b5cf6)",
              border: "none",
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {loading ? (
              <Loader2
                style={{ width: "20px", height: "20px", color: "white" }}
                className="animate-spin"
              />
            ) : (
              <Send style={{ width: "20px", height: "20px", color: "white" }} />
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
