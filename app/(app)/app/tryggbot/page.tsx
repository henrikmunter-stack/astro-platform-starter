"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Bot, User, AlertCircle, ArrowUp } from "lucide-react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function TryggBotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [used, setUsed] = useState(0);
  const [limit, setLimit] = useState<number | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/tryggbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, threadId }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setLimitReached(true);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.error ?? "Kvoten er brukt opp for denne m\xE5neden." },
        ]);
      } else if (res.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
        if (data.threadId) setThreadId(data.threadId);
        if (data.messagesUsed !== undefined) setUsed(data.messagesUsed);
        if (data.messagesLimit !== undefined) setLimit(data.messagesLimit);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.error ?? "Beklager, det oppsto en feil." }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Tilkoblingsfeil. Sjekk internettilkoblingen og prøv igjen." }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-[#1C2833]">TryggBot</h1>
        <p className="text-[#5d6b7a] text-sm mt-1">
          Din personlige beredskapsassistent.
          {limit !== null && isFinite(limit) && (
            <span className="ml-2 text-[#5d6b7a]">
              {used} av {limit} meldinger brukt denne m\xE5neden
            </span>
          )}
        </p>
      </div>

      <div className="flex-1 bg-white rounded-lg border border-[#e5e9ec] shadow-sm overflow-y-auto p-4 space-y-4 mb-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-lg bg-[#1B4F72]/10 flex items-center justify-center mb-3">
              <Bot size={28} className="text-[#1B4F72]" aria-hidden="true" />
            </div>
            <h2 className="font-semibold text-[#1C2833] mb-1">Hei! Jeg er TryggBot</h2>
            <p className="text-[#5d6b7a] text-sm max-w-xs">
              Jeg kan svare p\xE5 sp\xF8rsm\xE5l om hjemmeberedskap, lagring, familieplan og mye mer.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 w-full max-w-sm">
              {[
                "Hva b\xF8r jeg ha i beredskapslageret?",
                "Hvor mye vann trenger vi for en uke?",
                "Hvordan lager jeg en familieplan?",
                "Hva sier DSB om egenberedskap?",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); }}
                  className="text-left text-xs px-3 py-2 rounded-md border border-[#e5e9ec] text-[#5d6b7a] hover:border-[#1B4F72] hover:text-[#1B4F72] transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-[#2E86AB] text-white" : "bg-[#1B4F72]/10 text-[#1B4F72]"}`}>
              {msg.role === "user" ? <User size={14} aria-hidden="true" /> : <Bot size={14} aria-hidden="true" />}
            </div>
            <div className={`max-w-[75%] px-4 py-3 rounded-lg text-sm leading-relaxed ${msg.role === "user" ? "bg-[#2E86AB] text-white" : "bg-[#F4F6F7] text-[#1C2833]"}`}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-md bg-[#1B4F72]/10 flex items-center justify-center flex-shrink-0">
              <Bot size={14} className="text-[#1B4F72]" aria-hidden="true" />
            </div>
            <div className="bg-[#F4F6F7] px-4 py-3 rounded-lg">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-2 h-2 bg-[#1B4F72] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {limitReached && (
        <div className="bg-[#D4AC0D]/10 border border-[#D4AC0D]/30 rounded-lg p-3 mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-[#D4AC0D] flex-shrink-0" aria-hidden="true" />
            <p className="text-sm text-[#1C2833]">Du har n\xE5dd meldingskvoten din for denne m\xE5neden.</p>
          </div>
          <Link href="/priser" className="flex-shrink-0 text-xs font-semibold text-white bg-[#1B4F72] px-3 py-1.5 rounded-md hover:bg-[#16405e] transition-colors">
            Oppgrader
          </Link>
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
          placeholder={limitReached ? "Kvoten er brukt opp..." : "Still et sp\xF8rsm\xE5l om beredskap..."}
          disabled={loading || limitReached}
          className="flex-1 h-11 px-4 rounded-md border border-[#e5e9ec] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4F72] disabled:opacity-50 disabled:bg-[#F4F6F7]"
          aria-label="Skriv en melding til TryggBot"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim() || limitReached}
          className="w-11 h-11 bg-[#1B4F72] text-white rounded-md hover:bg-[#16405e] disabled:opacity-50 flex items-center justify-center transition-colors"
          aria-label="Send melding"
        >
          <Send size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
