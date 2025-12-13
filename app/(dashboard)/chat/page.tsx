"use client";

import { Icon } from "@/components/ui/icon";
import { faPaperPlane, faRobot } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

/* ================= TYPES ================= */

interface Message {
  sender_type: "ai" | "user";
  message: string;
}

interface LocalMessage extends Message {
  temp?: boolean; // untuk bubble loading
}

interface ChatSessionResponse {
  id: string;
}
interface DailyNutrition {
  id: string;
  log_date: string;
  target_calories_kcal: number;
  total_calories_kcal: number;
  total_protein_g: number;
  total_carbs_g: number;
  total_fat_g: number;
  total_fiber_g: number;
  nutri_grade: "A" | "B" | "C" | "D" | "E" | "F";
  calories_remaining: number;
  calories_percentage: number;
}

interface SendMessagePayload {
  message: string;
  context: {
    daily_calories_target: number;
    dietary_restrictions: string[];
  };
}

/* ================= SESSION STORAGE ================= */

const SESSION_KEY = "chat_session";
const SESSION_DURATION = 5 * 60 * 1000; // 5 menit

interface StoredSession {
  sessionId: string;
  expiresAt: number;
}

const getStoredSession = (): StoredSession | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  const parsed: StoredSession = JSON.parse(raw);
  if (Date.now() > parsed.expiresAt) {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
  return parsed;
};

const saveSession = (sessionId: string) => {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      sessionId,
      expiresAt: Date.now() + SESSION_DURATION,
    })
  );
};

const startSession = async (): Promise<ChatSessionResponse> => {
  const res = await apiClient<{ data: { chat_session: { id: string } } }>(
    "/chat/sessions",
    {
      method: "POST",
      body: JSON.stringify({ title: "Chat Alvi" }),
    }
  );
  return res.data.chat_session;
};

export default function ChatPage() {
  const chatRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [localMessages, setLocalMessages] = useState<LocalMessage[]>([]);
  const [isSending, setIsSending] = useState(false);

  const sessionMutation = useMutation({
    mutationFn: startSession,
    onSuccess: (data) => {
      setSessionId(data.id);
      saveSession(data.id);
    },
  });

  useEffect(() => {
    const stored = getStoredSession();
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSessionId(stored.sessionId);
    } else {
      sessionMutation.mutate();
    }
  }, []);

  const { data: messages = [], isLoading: isLoadingMessages } = useQuery({
    queryKey: ["messages", sessionId],
    queryFn: async () => {
      const { data: res } = await apiClient<{
        data: { chat_session: { messages: Message[] } };
      }>(`/chat/sessions/${sessionId}/messages`);
      return res.chat_session.messages;
    },
    enabled: !!sessionId,
  });

  useEffect(() => {
    if (messages.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalMessages(messages || []);
    }
  }, [messages]);

  const { data } = useQuery<DailyNutrition, Error>({
    queryKey: ["dashboard"], // Use a more descriptive key, e.g., "DailyNutrition"
    queryFn: async () => {
      try {
        const api = await apiClient<{
          data: {
            today_summary: DailyNutrition;
          };
          message: string;
        }>("/dashboard");

        return api.data.today_summary;
      } catch (e) {
        throw new Error("Gagal mengambil data harian.");
      }
    },
    refetchOnWindowFocus: true,
  });

  const calories = data?.total_calories_kcal || 0;

  const sendMutation = useMutation({
    mutationFn: async (payload: SendMessagePayload) => {
      const { data: res } = await apiClient<{ data: { messages: Message[] } }>(
        `/chat/sessions/${sessionId}/messages`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );
      return res.messages;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", sessionId],
      });

      if (sessionId) saveSession(sessionId);
    },
    onSettled: () => {
      setIsSending(false);
    },
  });

  const sendMessage = () => {
    if (!input.trim() || !sessionId || isSending) return;

    const userMsg: LocalMessage = {
      sender_type: "user",
      message: input,
    };

    const loadingAiMsg: LocalMessage = {
      sender_type: "ai",
      message: "Alvi sedang mengetik...",
      temp: true,
    };

    setLocalMessages((prev) => [...prev, userMsg, loadingAiMsg]);
    setInput("");
    setIsSending(true);

    sendMutation.mutate({
      message: userMsg.message,
      context: {
        daily_calories_target: calories,
        dietary_restrictions: ["low-sodium"],
      },
    });
  };

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [localMessages]);

  return (
    <div className="h-[89dvh] flex justify-center bg-gray-50 dark:bg-darkBg">
      <div className="w-full max-w-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-secondary to-blue-600 p-5 rounded-b-[2rem] shadow-lg text-white">
          <h3 className="font-bold text-base">Alvi Assistant</h3>
          <p className="text-xs opacity-90">Konsultan Diet Pribadi</p>
        </div>

        {/* Chat Area */}
        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
        >
          {isLoadingMessages && (
            <div className="flex">
              <div className="p-3 rounded-2xl bg-white dark:bg-darkCard text-sm opacity-70">
                Memuat percakapan...
              </div>
            </div>
          )}
          {!isLoadingMessages && localMessages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 dark:text-gray-500 px-6">
              <div className="text-4xl mb-3">
                <Icon icon={faRobot} />
              </div>
              <p className="text-sm font-semibold">Belum ada percakapan</p>
              <p className="text-xs mt-1 leading-relaxed">Mulai Percakapan</p>
            </div>
          )}

          {localMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.sender_type === "user" ? "justify-end" : ""
              }`}
            >
              <div
                className={`p-3 rounded-2xl text-sm max-w-[80%]
                  ${
                    msg.sender_type === "ai"
                      ? "bg-white dark:bg-darkCard"
                      : "bg-primary text-white"
                  }
                  ${msg.temp ? "animate-pulse opacity-70" : ""}
                `}
              >
                {msg.message}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="sticky bottom-0 p-3 border-t bg-white dark:bg-darkCard">
          <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 bg-transparent outline-none text-sm dark:text-white"
              placeholder="Tulis pesan..."
            />
            <button
              onClick={sendMessage}
              disabled={isSending}
              className="w-10 h-10 bg-secondary rounded-full text-white flex items-center justify-center active:scale-95 transition disabled:opacity-50"
            >
              <Icon icon={faPaperPlane} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
