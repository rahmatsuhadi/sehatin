import { apiClient } from "@/lib/api-client";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { Icon } from "../ui/icon";
import {
  faAppleWhole,
  faBowlRice,
  faCheckCircle,
  faDrumstickBite,
  faExclamationCircle,
  faExclamationTriangle,
  faFireFlameCurved,
  faLightbulb,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";

interface ResponseData {
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  total_fiber: number;

  recommendations: {
    type: "protein" | "carbs" | "fat" | "fiber";
    message: string;
    priority: "low" | "medium" | "high";
  }[];

  health_tips: string[];
  allergen_warnings: string[];
}
const typeIcons: Record<string, IconDefinition> = {
  protein: faDrumstickBite,
  carbs: faBowlRice,
  fat: faFireFlameCurved,
  fiber: faAppleWhole,
  default: faExclamationCircle,
};
const typeLabels: Record<string, string> = {
  protein: "Protein",
  carbs: "Karbohidrat",
  fat: "Lemak",
  fiber: "Serat",
  default: "Nutrisi",
};

const priorityColor = {
  low: "text-green-600",
  medium: "text-yellow-600",
  high: "text-red-600",
};

// ====== ICON PRIORITY ======
const priorityIcons = {
  low: faCheckCircle,
  medium: faExclamationCircle,
  high: faExclamationCircle,
};

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "medium":
      return faExclamationTriangle;
    case "high":
      return faExclamationCircle;
    default:
      return faCheckCircle;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "medium":
      return "text-yellow-500";
    case "high":
      return "text-red-500";
    default:
      return "text-green-600";
  }
};

export default function ModalAnalisis({
  sessionId,
  onClose,
}: {
  sessionId: string;
  onClose?: () => void;
}) {
  const chartRef = useRef<Chart | null>(null);

  const { data: responseData } = useQuery<ResponseData>({
    enabled: !!sessionId,
    queryKey: ["scan-analisis", sessionId],
    queryFn: async () => {
      const api = await apiClient<{ data: ResponseData }>(
        "/scan/" + sessionId + "/analysis"
      );
      return api.data;
    },
  });

  // ------------------ RENDER RADAR ------------------
  useEffect(() => {
    if (!responseData) return;

    const canvas = document.getElementById("radarChart") as HTMLCanvasElement;
    if (!canvas) return;

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvas, {
      type: "radar",
      data: {
        labels: ["Protein", "Karbo", "Lemak", "Serat"],
        datasets: [
          {
            label: "Komposisi Makanan",
            data: [
              responseData.total_protein,
              responseData.total_carbs,
              responseData.total_fat,
              responseData.total_fiber,
              // responseData.total_calories,
            ],
            backgroundColor: "rgba(88, 204, 2, 0.2)",
            borderColor: "#58CC02",
            pointBackgroundColor: "#58CC02",
          },
        ],
      },
      options: {
        elements: { line: { borderWidth: 3 } },
        scales: {
          r: { ticks: { display: false }, grid: { color: "#e5e5e5" } },
        },
      },
    });
  }, [responseData]);

  return (
    <div className="fixed inset-0 bg-black/80 z-[110] flex items-center justify-center p-6 backdrop-blur-md">
      <div className="bg-white dark:bg-darkCard rounded-[2rem] w-full max-w-sm p-6 shadow-2xl animate-bounce-in relative max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-xl dark:text-white">
            Analisis Nutrisi
          </h3>
          <div className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 text-xs font-bold border border-gray-300">
            Grade: <span className="text-green-600">B+</span>
          </div>
        </div>

        {/* RADAR CHART */}
        <div className="mb-4 h-40 w-full relative">
          <canvas id="radarChart"></canvas>
        </div>

        {/* NUTRI-SCORE */}
        <div className="mb-4">
          <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">
            Nutri-Score
          </p>
          <div className="nutri-score-bar">
            <div className="ns-seg ns-a"></div>
            <div className="ns-seg ns-b active"></div>
            <div className="ns-seg ns-c"></div>
            <div className="ns-seg ns-d"></div>
            <div className="ns-seg ns-e"></div>
          </div>
        </div>

        {/* INSIGHT NUTRISI */}
        <div className="bg-blue-50 dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-blue-100 dark:border-slate-700 mb-4">
          <div className="flex items-center gap-2 mb-2 text-blue-600 font-bold text-sm">
            <Icon icon={faLightbulb} /> Insight Nutrisi
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs mb-2">
            {responseData?.recommendations?.map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 ${getPriorityColor(
                  item.priority
                )}`}
              >
                <Icon
                  icon={getPriorityIcon(item.priority)}
                  className="text-xs"
                />
                <span className="text-xs font-medium capitalize">
                  {item.type === "protein"
                    ? "Protein "
                    : item.type === "carbs"
                    ? "Karbohidrat "
                    : item.type === "fat"
                    ? "Lemak "
                    : item.type === "fiber"
                    ? "Serat "
                    : ""}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">
            Rekomedasi
          </p>

          {responseData?.recommendations.map((item, i) => {
            const nutrientIcon = typeIcons[item.type] || typeIcons.default;
            const nutrientLabel = typeLabels[item.type] || typeLabels.default;
            const colorClass = priorityColor[item.priority];
            const priorityIcon = priorityIcons[item.priority];

            return (
              <div
                key={i}
                className="space-y-1 bg-white/50 dark:bg-slate-800/50 p-3 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                {/* BARIS LABEL NUTRISI */}
                <div
                  className={`flex items-center gap-2 font-semibold ${colorClass}`}
                >
                  <Icon icon={nutrientIcon} className="text-xs" />
                  <span>{nutrientLabel}</span>
                  <Icon icon={priorityIcon} className="text-xs" />
                </div>

                {/* PESAN REKOMENDASI */}
                <p className="text-xs text-gray-600 dark:text-gray-300 ml-6">
                  {item.message}
                </p>
              </div>
            );
          })}
        </div>

        {/* HEALTH TIPS */}
        {responseData?.health_tips?.length ? (
          <div className="bg-green-50 dark:bg-slate-800 p-4 rounded-xl border border-green-200 dark:border-green-700 mb-4">
            <div className="flex items-center gap-2 text-green-700 font-bold text-sm mb-2">
              <Icon icon={faLightbulb} /> Health Tips
            </div>

            <div className="space-y-1 text-xs text-green-700 dark:text-green-300">
              {responseData.health_tips.map((tip, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <Icon icon={faCheckCircle} className="pt-0.5" />
                  {tip}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* ALLERGEN WARNING */}
        {responseData?.allergen_warnings?.length ? (
          <div className="bg-red-50 dark:bg-slate-800 p-4 rounded-xl border border-red-200 dark:border-red-700 mb-4">
            <div className="flex items-center gap-2 text-red-600 font-bold text-sm mb-2">
              <Icon icon={faExclamationCircle} /> Alergen
            </div>

            <div className="space-y-1 text-xs text-red-600 dark:text-red-400">
              {responseData.allergen_warnings.map((w, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <Icon icon={faExclamationTriangle} className="pt-0.5" />
                  {w}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* BOTTOM SECTION */}
        <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Total Kalori Makanan:</span>
            <span className="font-bold text-gray-900 dark:text-white">
              {responseData?.total_calories} kkal
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full bg-primary hover:cursor-pointer text-white font-bold py-3 rounded-xl btn-press"
        >
          Simpan ke Jurnal
        </button>
      </div>
    </div>
  );
}
