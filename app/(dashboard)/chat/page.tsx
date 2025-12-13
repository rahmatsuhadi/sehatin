"use client";

import { Icon } from "@/components/ui/icon";
import { useState, useRef, useEffect } from "react";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

interface Message {
  sender: "ai" | "user";
  text: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Halo! Saya Alvi. Ada yang bisa saya bantu terkait target berat badanmu?",
    },
  ]);

  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  // Auto scroll
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
    <div className="h-[100dvh] flex justify-center bg-gray-50 dark:bg-darkBg">
      {/* Container (Desktop Centered) */}
      <div className="w-full max-w-2xl flex flex-col">
        {/* Header */}
        <div className="sticky  top-0 z-20 bg-gradient-to-r from-secondary to-blue-600 p-5 rounded-b-[2rem] shadow-lg text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 rounded-full w-11 h-11 flex items-center justify-center backdrop-blur-md text-xl">
              🤖
            </div>
            <div>
              <h3 className="font-bold text-base">Alvi Assistant</h3>
              <p className="text-xs opacity-90">Konsultan Diet Pribadi</p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${
                msg.sender === "user" ? "justify-end" : ""
              }`}
            >
              {msg.sender === "ai" && (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                  AI
                </div>
              )}

              <div
                className={`
                  p-3 rounded-2xl text-sm shadow-sm border max-w-[80%] leading-relaxed
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
        <div className="sticky bottom-0 bg-white dark:bg-darkCard border-t border-gray-200 dark:border-gray-700 p-3">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
            <input
              type="text"
              placeholder="Tulis pesan..."
              className="
                bg-transparent flex-1 px-3 outline-none text-sm 
                dark:text-white placeholder:text-gray-400
              "
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button
              onClick={sendMessage}
              className="
                w-10 h-10 bg-secondary rounded-full text-white 
                flex items-center justify-center 
                shadow-lg active:scale-95 transition
              "
            >
              <Icon icon={faPaperPlane} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
