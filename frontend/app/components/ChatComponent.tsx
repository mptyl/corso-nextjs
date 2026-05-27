"use client";

import { useState } from "react";
import { useChat } from "../contexts/ChatContext";

export default function ChatComponent() {
  const { messages, sendMessage, loading } = useChat();
  const [input, setInput] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const text = input;
    setInput("");
    await sendMessage(text);
  }

  return (
    <div className="flex h-[500px] flex-col rounded-lg border border-gray-300 bg-white shadow-sm mt-6">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 mt-8">
            Fai una domanda sul ristorante...
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] rounded-lg px-4 py-2 whitespace-pre-line text-sm ${
              msg.role === "user"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <p className="text-center text-gray-400 text-sm">Sta scrivendo...</p>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex border-t border-gray-300">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Scrivi un messaggio..."
          className="flex-1 px-4 py-3 outline-none text-black text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 px-6 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
        >
          Invia
        </button>
      </form>
    </div>
  );
}
