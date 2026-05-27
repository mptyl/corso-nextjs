"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Message = { role: "user" | "assistant"; content: string };

type ChatContextType = {
  messages: Message[];
  sendMessage: (text: string) => Promise<void>;
  loading: boolean;
};

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(text: string) {
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // Usiamo 127.0.0.1 per stabilità su macOS
      const res = await fetch("http://127.0.0.1:8000/api/query?q=" + encodeURIComponent(text));
      const data = await res.json();
      
      // Formattiamo i risultati della ricerca in un testo leggibile
      let answer = "";
      if (data.results && data.results.length > 0) {
        answer = data.results
          .map((r: any) => `**Da ${r.file}**:\n${r.text}`)
          .join("\n\n");
      } else {
        answer = `Nessun risultato trovato nei documenti del ristorante per "${text}".`;
      }

      const botMsg: Message = { role: "assistant", content: answer };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errMsg: Message = { role: "assistant", content: "Errore: impossibile contattare il backend." };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ChatContext.Provider value={{ messages, sendMessage, loading }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat deve essere usato dentro ChatProvider");
  return ctx;
}
