"use client";

import { useEffect, useState, useMemo } from "react";
import Chart from "chart.js/auto";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { WeightForm } from "@/components/stats/weight-form";
import { useUser } from "@/service/auth";

interface Weight {
  weight_kg: number;
  bmi: number;
  log_date: string;
  created_at: string; // The date string from the API
}

interface HistoryEntry {
  date: string;
  height: number;
  weight: number;
  bmi: number;
}

interface MutationBody {
  weight_kg: number;
  log_date: string;
}

const getDateRange = () => {
  const today = new Date();
  const dateTo = today.toISOString().split("T")[0]; // Format YYYY-MM-DD for API date_to

  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  const dateFrom = sevenDaysAgo.toISOString().split("T")[0]; // Format YYYY-MM-DD for API date_from

  return { dateFrom, dateTo };
};

const formatWeightDataForChart = (weightData: Weight[]) => {
  const sortedData = [...weightData].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const labels = sortedData.map((item) => {
    const date = new Date(item.created_at);
    // Use short format: DD/MM
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}`;
  });

  const weights = sortedData.map((item) => item.weight_kg);

  return { labels, weights };
};

export default function StatsPage() {
  const [activeTab, setActiveTab] = useState<"calorie" | "weight">("calorie");

  const { dateFrom, dateTo } = useMemo(() => getDateRange(), []);

  const { data: user } = useUser();

  const {
    data: weightData,
    isLoading,
    error,
  } = useQuery<Weight[], Error>({
    queryKey: ["weightHistory", dateFrom, dateTo],
    queryFn: async () => {
      try {
        const limit = 100;
        const api = await apiClient<{
          data: { items: Weight[] };
          message: string;
        }>(`/weights?date_from=${dateFrom}&date_to=${dateTo}&limit=${limit}`);

        return api.data.items;
      } catch (e) {
        throw new Error("Gagal mengambil data riwayat berat badan.");
      }
    },
    refetchOnWindowFocus: true,
  });

  const [weightInput, setWeightInput] = useState("");
  const [heightInput, setHeightInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const ctx = document.getElementById("mainChart") as HTMLCanvasElement;
    if (!ctx) return;

    if (Chart.getChart("mainChart")) {
      Chart.getChart("mainChart")?.destroy();
    }

    let chartLabels: string[];
    let chartData: number[];
    let chartLabel: string;

    if (activeTab === "calorie") {
      chartLabel = "Kalori";
      // Data hardcoded untuk kalori
      chartLabels = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
      chartData = [1800, 2000, 1750, 1900, 2100, 1600, 2200];
    } else {
      // activeTab === "weight"
      chartLabel = "Berat Badan (kg)";

      // FIX 3: Gunakan weightData yang sudah difetch
      if (weightData && weightData.length > 0) {
        const formatted = formatWeightDataForChart(weightData);
        chartLabels = formatted.labels;
        chartData = formatted.weights;
      } else {
        // Fallback
        chartLabels = ["Tidak Ada Data"];
        chartData = [0];
      }
    }

    new Chart(ctx, {
      type: "line",
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: chartLabel,
            data: chartData,
            borderWidth: 3,
            borderColor: activeTab == "calorie" ? "#58CC02" : "#1CB0F6",
            backgroundColor: activeTab == "calorie" ? "#58CC0220" : "#1CB0F620",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { display: false } },
          x: { grid: { display: false } },
          // x: {
          //   ticks: {
          //     maxRotation: 0,
          //     minRotation: 0,
          //   },
          // },
        },
      },
    });
    // FIX 4: Hapus 'period', tambahkan 'weightData'
  }, [activeTab, weightData]);

  const isAlreadyInput = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return weightData?.some((item) => item.created_at.startsWith(today));
  }, [weightData]);

  return (
    <div className=" fade-in pb-20">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Analisis Data
      </h2>

      {/* =================== TABS =================== */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-xl flex gap-1">
          <button
            id="stat-tab-cal"
            onClick={() => setActiveTab("calorie")}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${
              activeTab === "calorie"
                ? "bg-white text-primary shadow-sm"
                : "text-gray-500"
            }`}
          >
            Kalori
          </button>

          <button
            id="stat-tab-wei"
            onClick={() => setActiveTab("weight")}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${
              activeTab === "weight"
                ? "bg-white text-primary shadow-sm"
                : "text-gray-500"
            }`}
          >
            Berat Badan
          </button>
        </div>

        {/* RIWAYAT TANGGAL YANG DIPANGGIL */}
        <div className="flex justify-end">
          <select
            id="stat-period"
            className="bg-white dark:bg-darkCard border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1 text-xs font-bold"
          >
            <option value="daily">Harian</option>
            <option value="weekly">Mingguan</option>
            <option value="monthly">Bulanan</option>
          </select>
        </div>
      </div>

      {/* ============= CHART CONTAINER ============= */}
      <div className="bg-white dark:bg-darkCard p-4 rounded-4xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
        {isLoading && activeTab === "weight" && (
          <div className="text-center py-10">Memuat Data Berat Badan...</div>
        )}
        {error && activeTab === "weight" && (
          <div className="text-center py-10 text-red-500">
            Error: {error.message}
          </div>
        )}
        <div
          style={{
            position: "relative",
            width: "100%",
            height:
              activeTab === "weight" && (isLoading || error) ? "0" : "250px",
          }}
        >
          <canvas id="mainChart"></canvas>
        </div>
      </div>

      <div className="bg-white dark:bg-darkCard py-5 px-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
        <h3 className="font-bold text-sm mb-3 text-gray-500 uppercase">
          Input Berat Badan
        </h3>

        <WeightForm onNewLog={() => {}} isAlreadyLogged={isAlreadyInput} />
      </div>

      <h3 className="font-bold text-lg mb-3" id="history-title">
        Riwayat Berat Badan
      </h3>

      <div id="history-list" className="space-y-2">
        {weightData?.map((item, idx) => {
          const isToday =
            new Date(item.log_date).toDateString() ===
            new Date().toDateString();
          return (
            <div
              key={idx}
              className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800 rounded-xl"
            >
              <div>
                <p className="font-bold text-sm dark:text-white">
                  {isToday
                    ? "Hari Ini"
                    : new Date(item.log_date).toLocaleDateString("id-ID")}
                </p>
                <p className="text-xs text-gray-500">
                  Tinggi: {user?.height_cm || 0} cm
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-secondary">{item.weight_kg} kg</p>
                <p className="text-xs text-gray-500">BMI: {item.bmi}</p>
              </div>
            </div>
            // <div
            //   key={`api-${idx}`}
            //   className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            // >
            //   <p className="font-bold">
            //     {new Date(item.created_at).toLocaleDateString("id-ID")}
            //   </p>
            //   <p className="text-sm">{item.weight_kg} kg</p>
            //   <p className="text-sm">BMI: {item.bmi}</p>
            // </div>
          );
        })}

        {weightData?.length === 0 && history.length === 0 && (
          <p className="text-gray-500 text-sm">Belum ada riwayat.</p>
        )}
      </div>
    </div>
  );
}
