import { apiClient } from "@/lib/api-client";
import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { Icon } from "../ui/icon";
import {
  faCheckCircle,
  faExclamationCircle,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";

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

export default function ModalAnalisis({
  sesssionId,
  onClose,
}: {
  sesssionId: string;
  onClose?: () => void;
}) {
  const [responseData, setResponseData] = useState<ResponseData | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await apiClient<{ data: ResponseData }>(
          `/api/v1/scan/${sesssionId}/analysis`
        );
        setResponseData(data);
      } catch (error) {
        console.log("Error API, memakai data dummy...");

        setResponseData({
          total_calories: 450,
          total_protein: 25,
          total_carbs: 50,
          total_fat: 15,
          total_fiber: 5,
          recommendations: [
            {
              message:
                "Pilihan yang enak! Karena seratnya agak kurang, gimana kalau nanti malam kita makan buah atau sayur tumis?",
              priority: "low",
              type: "protein",
            },
          ],
          health_tips: [],
          allergen_warnings: [],
        });
      }
    }

    fetchData();
  }, [sesssionId]);

  // ------------ RENDER RADAR CHART ------------
  useEffect(() => {
    if (!responseData) return;

    const canvas = document.getElementById("radarChart") as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // destroy chart jika sebelumnya sudah ada
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvas, {
      type: "radar",
      data: {
        labels: ["Protein", "Karbo", "Lemak", "Serat", "Vitamin"],
        datasets: [
          {
            label: "Komposisi Makanan",
            data: [
              responseData.total_protein,
              responseData.total_carbs,
              responseData.total_fat,
              responseData.total_fiber,
              8, // vitamin dummy
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
          r: {
            ticks: { display: false },
            grid: { color: "#e5e5e5" },
          },
        },
      },
    });
  }, [responseData]);

  return (
    <div
      id="result-modal"
      className="fixed inset-0 bg-black/80 z-[110]  flex items-center justify-center p-6 backdrop-blur-md"
    >
      <div className="bg-white dark:bg-darkCard rounded-[2rem] w-full max-w-sm p-6 shadow-2xl animate-bounce-in relative max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-xl dark:text-white">
            Analisis Nutrisi
          </h3>
          <div className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 text-xs font-bold border border-gray-300">
            Grade: <span className="text-green-600">B+</span>
          </div>
        </div>

        <div className="mb-4 h-40 w-full relative">
          <canvas id="radarChart"></canvas>
        </div>

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

        <div className="bg-blue-50 dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-blue-100 dark:border-slate-700 mb-4">
          <div className="flex items-center gap-2 mb-2 text-blue-600 font-bold text-sm">
            <Icon icon={faLightbulb} />
            Insight Nutrisi
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs mb-2">
            <div className="flex items-center gap-1 text-green-600">
              <Icon icon={faCheckCircle} /> Tinggi Protein
            </div>
            <div className="flex items-center gap-1 text-orange-500">
              <Icon icon={faExclamationCircle} /> Rendah Serat
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs border-t border-blue-200 pt-2">
            <div>
              Gula: <span className="font-bold text-green-600">Rendah</span>
            </div>
            <div>
              Garam: <span className="font-bold text-yellow-600">Sedang</span>
            </div>
          </div>
        </div>

        <div
          id="advice-box"
          className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 mb-4 text-left"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="mascot-avatar text-xl">🥑</div>
            <span className="font-bold text-sm">Saran Alvi:</span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            {responseData?.recommendations.map((r, i) => (
              <div
                key={i}
                className={`flex items-center gap-1 ${
                  r.priority == "high"
                    ? "text-red-500"
                    : r.priority == "medium"
                    ? "text-orange-500"
                    : "text-green-600"
                }`}
              >
                <i className="fas fa-check-circle"></i>
                {r.message}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Sisa Kalori Harian:</span>
            <span
              className="font-bold text-gray-900 dark:text-white"
              id="anl-rem"
            >
              0 kkal
            </span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              id="anl-bar"
              className="bg-primary h-full"
              //   style="width: 0%"
              style={{
                width: "0%",
              }}
            ></div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          //   onclick="finishFlow()"
          className="w-full bg-primary hover:cursor-pointer text-white font-bold py-3 rounded-xl btn-press"
        >
          Simpan ke Jurnal
        </button>
      </div>
    </div>
  );
}
