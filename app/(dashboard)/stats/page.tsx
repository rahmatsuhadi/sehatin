"use client";

import { useEffect, useState } from "react";
import Chart from "chart.js/auto";

export default function StatsPage() {
  const [activeTab, setActiveTab] = useState<"calorie" | "weight">("calorie");
  const [period, setPeriod] = useState("daily");

  const [weightInput, setWeightInput] = useState("");
  const [heightInput, setHeightInput] = useState("");
  const [history, setHistory] = useState<
    { date: string; height: number; weight: number; bmi: number }[]
  >([]);

  // ======================
  //  CHART.JS INIT
  // ======================
  useEffect(() => {
    const ctx = document.getElementById("mainChart") as HTMLCanvasElement;
    if (!ctx) return;

    // Destroy previous chart instance
    if (Chart.getChart("mainChart")) {
      Chart.getChart("mainChart")?.destroy();
    }

    new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
        datasets: [
          {
            label: activeTab === "calorie" ? "Kalori" : "Berat Badan",
            data:
              activeTab === "calorie"
                ? [1800, 2000, 1750, 1900, 2100, 1600, 2200]
                : [70, 69.8, 69.5, 69.2, 69.1, 69, 68.9],
            borderWidth: 3,
            borderColor: "#58CC02",
            tension: 0.4,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }, [activeTab, period]);

  // ===============================
  //  SIMPAN RIWAYAT (Tinggi + Berat)
  // ===============================
  const saveHistory = () => {
    if (!heightInput || !weightInput) return;

    const h = Number(heightInput);
    const w = Number(weightInput);

    const bmi = w / Math.pow(h / 100, 2);

    setHistory((prev) => [
      ...prev,
      {
        date: "Hari Ini",
        height: h,
        weight: w,
        bmi: Number(bmi.toFixed(1)),
      },
    ]);

    setHeightInput("");
    setWeightInput("");
  };

  return (
    <div id="page-stats" className="page-section fade-in pb-20">
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

        {/* PERIOD SELECT */}
        <div className="flex justify-end">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-white dark:bg-darkCard border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1 text-xs font-bold"
          >
            <option value="daily">Harian</option>
            <option value="weekly">Mingguan</option>
            <option value="monthly">Bulanan</option>
          </select>
        </div>
      </div>

      {/* ============= CHART CONTAINER ============= */}
      <div className="bg-white dark:bg-darkCard p-4 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
        <div style={{ position: "relative", height: "250px", width: "100%" }}>
          <canvas id="mainChart"></canvas>
        </div>
      </div>

      {/* ============= INPUT BERAT BADAN ============= */}
      <div className="bg-white dark:bg-darkCard p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
        <h3 className="font-bold text-sm mb-3 text-gray-500 uppercase">
          Input Berat Badan
        </h3>

        <div className="flex flex-col gap-3">
          <input
            type="number"
            placeholder="Tinggi (cm)"
            value={heightInput}
            onChange={(e) => setHeightInput(e.target.value)}
            className="input-style border border-gray-200 px-3 py-2 rounded-lg"
          />

          <input
            type="number"
            placeholder="Berat (kg)"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            className="input-style border border-gray-200 px-3 py-2 rounded-lg"
          />

          <button
            onClick={saveHistory}
            className="bg-secondary text-white px-5 py-2 rounded-xl font-bold shadow-lg shadow-blue-500/30"
          >
            Simpan
          </button>
        </div>
      </div>

      {/* ============= HISTORY ============= */}
      <h3 className="font-bold text-lg mb-3" id="history-title">
        Riwayat
      </h3>

      <div id="history-list" className="space-y-2">
        {history.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-white dark:bg-darkCard border border-gray-200 dark:border-gray-700"
          >
            <p className="font-bold">{item.date}</p>
            <p className="text-sm">Tinggi: {item.height} cm</p>
            <p className="text-sm">{item.weight} kg</p>
            <p className="text-sm">BMI: {item.bmi}</p>
          </div>
        ))}

        {history.length === 0 && (
          <p className="text-gray-500 text-sm">Belum ada riwayat.</p>
        )}
      </div>
    </div>
  );
}
