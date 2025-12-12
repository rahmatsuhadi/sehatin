import DropdownPeriod from "@/components/stats/dropdown";
import { apiClient } from "@/lib/api-client";
import { Meals, MealsType, User } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import Chart, { ChartOptions } from "chart.js/auto";
import { Icon } from "@/components/ui/icon";
import {
  faChevronLeft,
  faChevronRight,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";

interface CaloriesSectionProps {
  user?: User;
}
interface CaloriesChart {
  calories: number;
  calories_percentage: number;
  date: string;
  nutri_grade: string;
}

const getDateRange = () => {
  const today = new Date();
  const dateTo = today.toISOString().split("T")[0];
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  const dateFrom = sevenDaysAgo.toISOString().split("T")[0];
  return { dateFrom, dateTo };
};

export default function CaloriesSection({}: CaloriesSectionProps) {
  const [period, setPeriod] = useState<"week" | "month" | "3months">("week");
  const [type, setType] = useState<
    "breakfast" | "lunch" | "dinner" | "snack" | ""
  >("");

  const [datefilter, setDateFilter] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const { dateFrom, dateTo } = useMemo(() => getDateRange(), []);

  // GRAPH QUERY
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
  });

  // 🟢 QUERY HISTORY — pakai datefilter
  const { data: mealsData = [] } = useQuery<Meals[]>({
    queryKey: ["calorie-history", datefilter, type],
    queryFn: async () => {
      const api = await apiClient<{
        data: { items: Meals[] };
        message: string;
      }>(`/meals?date=${datefilter}${type ? `&meal_type=${type}` : ""}`);

      return api.data.items;
    },
    refetchOnWindowFocus: false,
  });

  // ================================
  //     RENDER CHART (tidak diubah)
  // ================================
  useEffect(() => {
    const canvas = document.getElementById("mainChart") as HTMLCanvasElement;
    if (!canvas) return;

    const existing = Chart.getChart("mainChart");
    if (existing) existing.destroy();

    let chartLabels = [];
    let chartData = [];

    const defaultLabels = ["", "", "", "", "", "", ""];
    const defaultData = [0, 0, 0, 0, 0, 0, 0];

    if (nutritionData.length > 0) {
      chartLabels = nutritionData.map((i) => i.date);
      chartData = nutritionData.map((i) => i.calories);
    } else {
      chartLabels = defaultLabels;
      chartData = defaultData;
    }

    const scales: ChartOptions<"line">["scales"] = {
      x: { grid: { display: false } },
      y: {
        grid: { display: false },
        beginAtZero: true,
      },
    };

    new Chart(canvas, {
      type: "line",
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: "Kalori (kcal)",
            data: chartData,
            borderWidth: 3,
            borderColor: "#58CC02",
            backgroundColor: "#58CC0220",
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
  }, [nutritionData]);

  return (
    <>
      <DropdownPeriod onChange={(val) => setPeriod(val)} />

      {/* calories */}
      <div className="bg-white dark:bg-darkCard p-4 rounded-4xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 mt-5">
        <div style={{ position: "relative", width: "100%", height: "250px" }}>
          <canvas id="mainChart"></canvas>
        </div>
      </div>

      <h3 className="font-bold text-lg mb-3" id="history-title">
        Riwayat Makanan
      </h3>

      <div className="flex items-center gap-3 mb-4 justify-between">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as MealsType)}
          className="
      px-3 py-2 rounded-xl border text-sm 
      dark:border-gray-700 dark:bg-slate-800 dark:text-white
    "
        >
          <option value="">Semua</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>

        <input
          type="date"
          value={datefilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="
      px-3 py-2 rounded-xl border text-sm 
      dark:border-gray-700 dark:bg-slate-800 dark:text-white
    "
        />

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              const d = new Date(datefilter);
              d.setDate(d.getDate() - 1);
              setDateFilter(d.toISOString().split("T")[0]);
            }}
            className="
      px-2 py-2 rounded-xl text-xs font-bold bg-gray-200 
      dark:bg-slate-700 dark:text-white
    "
          >
            <Icon icon={faChevronLeft} className="text-sm" />
          </button>

          <button
            onClick={() =>
              setDateFilter(new Date().toISOString().split("T")[0])
            }
            className="
      px-2 py-2 rounded-xl text-xs font-bold bg-secondary text-white
    "
          >
            <Icon icon={faCircle} className="text-[10px]" />
          </button>

          <button
            onClick={() => {
              const d = new Date(datefilter);
              d.setDate(d.getDate() + 1);
              setDateFilter(d.toISOString().split("T")[0]);
            }}
            className="
      px-2 py-2 rounded-xl text-xs font-bold bg-gray-200 
      dark:bg-slate-700 dark:text-white
    "
          >
            <Icon icon={faChevronRight} className="text-sm" />
          </button>
        </div>
      </div>

      {/* LIST */}
      <div id="history-list" className="space-y-2">
        {mealsData?.map((item, idx) => {
          const isToday =
            new Date(item.eaten_at).toDateString() ===
            new Date(datefilter).toDateString();

          const timeLabel = isToday
            ? "Hari Ini"
            : new Date(item.eaten_at).toLocaleDateString("id-ID");

          return (
            <div
              key={idx}
              className="
          p-4 rounded-2xl bg-white bg-gray-50
          dark:bg-slate-800 border border-gray-100
          dark:border-gray-700 shadow-sm
          flex justify-between items-center
        "
            >
              {/* LEFT */}
              <div className="space-y-1">
                {/* Tanggal */}
                <p className="font-bold text-sm dark:text-white">{timeLabel}</p>

                {/* Meal Type */}
                <p className="text-xs font-medium text-primary capitalize">
                  {item.meal_type}
                </p>

                {/* Label makanan */}
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {item.label}
                </p>
              </div>

              {/* RIGHT – Kalori */}
              <div className="text-right">
                <p className="text-sm font-bold text-green-600">
                  {item.total_calories_kcal} kkal
                </p>
                <p className="text-[10px] text-gray-400">Total Kalori</p>
              </div>
            </div>
          );
        })}

        {mealsData?.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-4">
            Belum ada riwayat.
          </p>
        )}
      </div>
    </>
  );
}
