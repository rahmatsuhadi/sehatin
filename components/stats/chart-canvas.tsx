import { useEffect } from "react";
import Chart, { ChartOptions } from "chart.js/auto";
import { apiClient } from "@/lib/api-client";
import { periodGetter } from "@/lib/period-memo";
import { useQuery } from "@tanstack/react-query";

interface ChartCanvasNutritionProps {
  activeTab: "calorie" | "weight";
  period: "week" | "month" | "3months";
}

interface WeightChart {
  weight: number;
  bmi: number;
  date: string;
  change_from_start: number;
}

interface CaloriesChart {
  calories: number;
  calories_percentage: number;
  date: string;
  nutri_grade: string;
}

export default function ChartCanvasNutrition({
  activeTab,
  period,
}: ChartCanvasNutritionProps) {
  const { dateFrom, dateTo } = periodGetter(period);

  // ======================================================
  // React Query — Weight
  // ======================================================
  const { data: weightData = [] } = useQuery<WeightChart[]>({
    queryKey: ["weight-chart", period, dateFrom, dateTo],
    queryFn: async () => {
      const res = await apiClient<{
        data: { chart_data: WeightChart[] };
      }>(
        `/weights/chart?period=${period}&start_date=${dateFrom}&end_date=${dateTo}`
      );
      return res.data.chart_data;
    },
    enabled: activeTab === "weight",
    staleTime: Infinity, // <-- DATA TIDAK DIAMBIL ULANG
  });

  // ======================================================
  // React Query — Calories
  // ======================================================
  const { data: nutritionData = [] } = useQuery<CaloriesChart[]>({
    queryKey: ["calorie-chart", period, dateFrom, dateTo],
    queryFn: async () => {
      const res = await apiClient<{
        data: { chart_data: CaloriesChart[] };
      }>(
        `/nutrition/chart?period=${period}&type=calories&start_date=${dateFrom}&end_date=${dateTo}`
      );
      return res.data.chart_data;
    },
    enabled: activeTab === "calorie",
    staleTime: Infinity,
  });

  // ======================================================
  // RENDER CHART
  // ======================================================
  useEffect(() => {
    const canvas = document.getElementById("mainChart") as HTMLCanvasElement;
    if (!canvas) return;

    const existing = Chart.getChart("mainChart");
    if (existing) existing.destroy();

    let chartLabels: string[] = [];
    let chartData: number[] = [];
    let chartLabel = "";

    const defaultLabels = ["", "", "", "", "", "", ""];
    const defaultData = [0, 0, 0, 0, 0, 0, 0];

    // -----------------------------------------------------
    // CALORIE GRAPH
    // -----------------------------------------------------
    if (activeTab === "calorie") {
      chartLabel = "Kalori (kcal)";

      if (nutritionData.length > 0) {
        chartLabels = nutritionData.map((i) => i.date);
        chartData = nutritionData.map((i) => i.calories);
      } else {
        chartLabels = defaultLabels;
        chartData = defaultData;
      }
    }

    // -----------------------------------------------------
    // WEIGHT GRAPH
    // -----------------------------------------------------
    if (activeTab === "weight") {
      chartLabel = "Berat Badan (kg)";

      if (weightData.length > 0) {
        chartLabels = weightData.map((i) => i.date);
        chartData = weightData.map((i) => i.weight);
      } else {
        chartLabels = defaultLabels;
        chartData = defaultData;
      }
    }

    // -----------------------------------------------------
    // SCALE OPTIONS (type-safe)
    // -----------------------------------------------------
    const scales: ChartOptions<"line">["scales"] = {
      x: { grid: { display: false } },
      y: { grid: { display: false }, beginAtZero: true, suggestedMin: 0 },
    };

    // Axis Y untuk kalori (dibulatkan ke kelipatan 50)
    if (activeTab === "calorie") {
      const step = 50;
      const maxValue = Math.max(...chartData);
      const roundedMax = Math.ceil((maxValue || step) / step) * step;

      scales.y = {
        grid: { display: false },
        suggestedMax: roundedMax,
        ticks: {
          stepSize: step,
          callback: (value) => Number(value),
        },
      };
    }

    // -----------------------------------------------------
    // CREATE CHART
    // -----------------------------------------------------
    new Chart(canvas, {
      type: "line",
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: chartLabel,
            data: chartData,
            borderWidth: 3,
            borderColor: activeTab === "calorie" ? "#58CC02" : "#1CB0F6",
            backgroundColor:
              activeTab === "calorie" ? "#58CC0220" : "#1CB0F620",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales,
      },
    });
  }, [activeTab, weightData, nutritionData]);

  return (
    <div className="bg-white dark:bg-darkCard p-4 rounded-4xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
      <div style={{ position: "relative", width: "100%", height: "250px" }}>
        <canvas id="mainChart"></canvas>
      </div>
    </div>
  );
}
