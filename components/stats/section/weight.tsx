import { useEffect, useMemo, useState } from "react";
import DropdownPeriod from "../dropdown";
import { periodGetter } from "@/lib/period-memo";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import Chart, { ChartOptions } from "chart.js/auto";
import { WeightForm } from "../weight-form";
import { Weight } from "@/lib/types";
import { useUser } from "@/service/auth";

interface WeightChart {
  weight: number;
  bmi: number;
  date: string;
  change_from_start: number;
}
export default function WeightSection() {
  const [period, setPeriod] = useState<"week" | "month" | "3months">("week");
  const { dateFrom, dateTo } = periodGetter(period);

  const { data: user } = useUser();
  const currentHeight = user?.height_cm || 0;

  const { data: weightCahrt = [] } = useQuery<WeightChart[]>({
    queryKey: ["weight-chart", period, dateFrom, dateTo],
    queryFn: async () => {
      const res = await apiClient<{
        data: { chart_data: WeightChart[] };
      }>(
        `/weights/chart?period=${period}&start_date=${dateFrom}&end_date=${dateTo}`
      );
      return res.data.chart_data;
    },
  });

  const {
    data: weightData,
    isLoading,
    error,
  } = useQuery<Weight[], Error>({
    queryKey: ["weight-data", dateFrom, dateTo, period],
    queryFn: async () => {
      try {
        const limit = 100;
        const api = await apiClient<{
          data: { items: Weight[] };
          message: string;
        }>(
          `/weights?period=${period}&date_from=${dateFrom}&date_to=${dateTo}&limit=${limit}`
        );

        return api.data.items;
      } catch (e) {
        throw new Error("Gagal mengambil data riwayat berat badan.");
      }
    },
    refetchOnWindowFocus: false,
  });

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

    // -----------------------------------------------------
    // WEIGHT GRAPH
    // -----------------------------------------------------
    chartLabel = "Berat Badan (kg)";

    if (weightCahrt.length > 0) {
      chartLabels = weightCahrt.map((i) => i.date);
      chartData = weightCahrt.map((i) => i.weight);
    } else {
      chartLabels = defaultLabels;
      chartData = defaultData;
    }

    // -----------------------------------------------------
    // SCALE OPTIONS (type-safe)
    // -----------------------------------------------------
    const scales: ChartOptions<"line">["scales"] = {
      x: { grid: { display: false } },
      y: { grid: { display: false }, beginAtZero: true, suggestedMin: 0 },
    };

    // Axis Y untuk kalori (dibulatkan ke kelipatan 50)

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
            borderColor: "#1CB0F6",
            backgroundColor: "#1CB0F620",
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
  }, [weightCahrt]);

  const isAlreadyInput = useMemo(() => {
    if (!weightCahrt || weightCahrt.length === 0) return false;
    const todayStr = new Date().toDateString();
    return weightCahrt.some(
      (entry) => new Date(entry.date).toDateString() === todayStr
    );
  }, [weightCahrt]);

  return (
    <>
      <DropdownPeriod onChange={(val) => setPeriod(val)} />
      {/* calories */}
      <div className="bg-white dark:bg-darkCard p-4 rounded-4xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 mt-5">
        <div className="relative w-full h-[250px]">
          <canvas id="mainChart" style={{ width: "80%" }}></canvas>
        </div>
      </div>

      <div className="bg-white dark:bg-darkCard py-5 px-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
        <h3 className="font-bold text-sm mb-3 text-gray-500 uppercase">
          Input Berat Badan Harian
        </h3>

        <WeightForm isAlreadyLogged={isAlreadyInput} />
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
                  Tinggi: {currentHeight || 0} cm
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-secondary">{item.weight_kg} kg</p>
                <p className="text-xs text-gray-500">BMI: {item.bmi}</p>
              </div>
            </div>
          );
        })}

        {weightData?.length === 0 && (
          <p className="text-gray-500 text-sm">Belum ada riwayat.</p>
        )}
      </div>
    </>
  );
}
