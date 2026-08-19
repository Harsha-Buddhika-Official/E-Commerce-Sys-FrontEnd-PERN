// src/pages/ChatPage.jsx
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Send,
  SmartToy,
  Person,
  ArrowBack,
  Compare,
} from "@mui/icons-material";
import { useChat } from "../features/chat/hooks/useChat.js";

const formatCurrency = (value) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return "Rs. 0.00";
  return `Rs. ${numeric.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

export default function ChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const comparisonResult = location.state?.comparisonResult || null;

  const { messages, sending, sendMessage, hasComparisonContext } = useChat(comparisonResult);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    sendMessage(input);
    setInput("");
  };

  const suggestedPrompts = hasComparisonContext
    ? [
        "Which one is best for gaming?",
        "What about video editing?",
        "Is there a cheaper alternative?",
      ]
    : [
        "I need a laptop for university work",
        "What's a good budget gaming PC?",
        "Recommend a monitor for coding",
      ];

  return (
    <div
      className="min-h-screen bg-zinc-100 py-6 px-4 md:px-8"
      style={{ fontFamily: "'Sora', 'Segoe UI', sans-serif" }}
    >
      <div className="mx-auto flex h-[calc(100vh-3rem)] max-w-180 flex-col overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
        {/* Header */}
        <div className="flex items-center gap-3 bg-zinc-800 px-5 py-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-md p-1.5 text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
            aria-label="Go back"
          >
            <ArrowBack fontSize="small" />
          </button>

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-600">
            <SmartToy className="text-white" fontSize="small" />
          </div>

          <div className="flex-1">
            <h1 className="m-0 text-sm font-bold uppercase tracking-wide text-white">
              Ozone AI Assistant
            </h1>
            <p className="mt-0.5 text-[11px] text-zinc-400">
              {hasComparisonContext
                ? "Ask me anything about the products you compared"
                : "Ask about specs, prices, or recommendations"}
            </p>
          </div>
        </div>

        {/* Comparison context chip */}
        {hasComparisonContext && (
          <div className="flex items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-5 py-2.5">
            <Compare className="text-zinc-500" style={{ fontSize: 16 }} />
            <p className="text-[11px] font-medium text-zinc-600">
              Comparing {comparisonResult?.products?.length || 0} products:{" "}
              <span className="text-zinc-800">
                {comparisonResult?.products?.map((p) => p.name).join(" · ")}
              </span>
            </p>
          </div>
        )}

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100">
                <SmartToy className="text-zinc-400" fontSize="large" />
              </div>
              <p className="max-w-70 text-[13px] text-zinc-500">
                {hasComparisonContext
                  ? "I've reviewed the comparison — ask me anything about these products."
                  : "Hi! I'm here to help you find the right computer or accessory. What are you looking for?"}
              </p>

              <div className="flex flex-col gap-2 pt-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className="rounded-full border-2 border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-600 transition-colors hover:border-red-600 hover:text-red-600"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-end gap-2 ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                    msg.role === "user" ? "bg-zinc-800" : "bg-red-600"
                  }`}
                >
                  {msg.role === "user" ? (
                    <Person className="text-white" style={{ fontSize: 16 }} />
                  ) : (
                    <SmartToy className="text-white" style={{ fontSize: 16 }} />
                  )}
                </div>

                <div
                  className={`max-w-90 rounded-xl px-4 py-2.5 text-[13px] leading-6 ${
                    msg.role === "user"
                      ? "rounded-br-sm bg-red-600 text-white"
                      : msg.isError
                      ? "rounded-bl-sm bg-red-50 text-red-700"
                      : "rounded-bl-sm bg-zinc-100 text-zinc-800"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex items-end gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-600">
                  <SmartToy className="text-white" style={{ fontSize: 16 }} />
                </div>
                <div className="flex items-center gap-1 rounded-xl rounded-bl-sm bg-zinc-100 px-4 py-3">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border-t border-zinc-200 bg-white px-4 py-3"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            disabled={sending}
            className="flex-1 rounded-md border-2 border-zinc-200 bg-zinc-50 px-4 py-2.5 text-[13px] text-zinc-800 outline-none transition-colors focus:border-zinc-800 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-red-600 text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            aria-label="Send message"
          >
            <Send fontSize="small" />
          </button>
        </form>
      </div>
    </div>
  );
}