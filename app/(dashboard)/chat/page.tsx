"use client";

import { Icon } from "@/components/ui/icon";
import { useState, useRef, useEffect } from "react";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Halo! Saya Alvi. Ada yang bisa saya bantu terkait target berat badanmu?",
    },
  ]);

  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  // Scroll otomatis ke bawah
  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");

    // Fake AI reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Baik! Saya akan bantu hitungkan nutrisi sesuai kebutuhanmu 😊",
        },
      ]);
    }, 700);
  };

  return (
    <div className="page-section min-h-[75vh] flex flex-col fade-in">
      {/* Header Gradient */}
      <div className="bg-gradient-to-r from-secondary to-blue-600 p-6 rounded-b-[2rem] shadow-lg mb-4 text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center backdrop-blur-md text-2xl">
            🤖
          </div>
          <div>
            <h3 className="font-bold text-lg">Alvi Assistant</h3>
            <p className="text-xs opacity-90">Konsultan Diet Pribadi</p>
          </div>
        </div>
      </div>

      {/* Chat Box */}
      <div ref={chatRef} className="flex-1 overflow-y-auto px-4 space-y-4 pb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${
              msg.sender === "user" ? "justify-end" : ""
            }`}
          >
            {msg.sender === "ai" && (
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white text-xs font-bold">
                AI
              </div>
            )}

            <div
              className={`p-3 rounded-2xl shadow-sm text-sm border max-w-[80%] 
                ${
                  msg.sender === "ai"
                    ? "bg-white dark:bg-darkCard border-gray-100 dark:border-gray-700 rounded-tl-none"
                    : "bg-primary text-white border-primary rounded-tr-none"
                }
              `}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-darkCard border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
          <input
            type="text"
            placeholder="Tulis pesan..."
            className="bg-transparent flex-1 px-3 outline-none text-sm dark:text-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button
            onClick={sendMessage}
            className="w-10 h-10 bg-secondary rounded-full text-white flex items-center justify-center shadow-lg active:scale-95 transition"
          >
            <Icon icon={faPaperPlane} />
          </button>
        </div>
      </div>
    </div>
  );
}
