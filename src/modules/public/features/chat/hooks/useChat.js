import { useCallback, useRef, useState } from "react";
import { sendChatMessage } from "../services/chat.service.js";

const MAX_HISTORY = 15;

export const useChat = (initialComparisonResult = null) => {
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const comparisonResultRef = useRef(initialComparisonResult);

  const sendMessage = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setError(null);
    setSending(true);

    const userMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const history = messages.slice(-MAX_HISTORY);

      const reply = await sendChatMessage({
        history,
        message: trimmed,
        comparisonResult: comparisonResultRef.current,
      });

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get a reply");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't process that. Please try again.",
          isError: true,
        },
      ]);
    } finally {
      setSending(false);
    }
  }, [messages, sending]);

  return {
    messages,
    sending,
    error,
    sendMessage,
    hasComparisonContext: !!comparisonResultRef.current,
    comparisonResult: comparisonResultRef.current,
  };
};