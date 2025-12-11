"use client";

import { useEffect, useState, useMemo } from "react";
import Chart from "chart.js/auto";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { WeightForm } from "@/components/stats/weight-form";
import { useUser } from "@/service/auth";
import TabsStatNutrition from "@/components/stats/tabs";
import DropdownPeriod from "@/components/stats/dropdown";
import ChartCanvasNutrition from "@/components/stats/chart-canvas";

interface Weight {
  weight_kg: number;
  bmi: number;
  log_date: string; //"2025-12-03"
  created_at: string;
}

interface HistoryEntry {
  date: string;
  height: number;
  weight: number;
  bmi: number;
}

const getDateRange = () => {
  const today = new Date();
  const dateTo = today.toISOString().split("T")[0]; // Format YYYY-MM-DD for API date_to

  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  const dateFrom = sevenDaysAgo.toISOString().split("T")[0]; // Format YYYY-MM-DD for API date_from

  return { dateFrom, dateTo };
};

export default function StatsPage() {
  const [activeTab, setActiveTab] = useState<"calorie" | "weight">("calorie");
  const [period, setPeriod] = useState<"week" | "month" | "3months">("week");

  const { dateFrom, dateTo } = useMemo(() => getDateRange(), []);

  const { data: user } = useUser();

  const {
    data: weightData,
    isLoading,
    error,
  } = useQuery<Weight[], Error>({
    queryKey: ["weightHistory", dateFrom, dateTo, period],
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

  const isAlreadyInput = useMemo(() => {
    if (!weightData || weightData.length === 0) return false;
    const todayStr = new Date().toDateString();
    return weightData.some(
      (entry) => new Date(entry.log_date).toDateString() === todayStr
    );
  }, [weightData]);

  return (
    <div className=" fade-in pb-20">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Analisis Data
      </h2>

      {/* =================== TABS =================== */}
      <div className="flex flex-col gap-4 mb-6">
        <TabsStatNutrition activeTab={activeTab} setActiveTab={setActiveTab} />

        <DropdownPeriod onChange={(val) => setPeriod(val)} />

        {/* RIWAYAT TANGGAL YANG DIPANGGIL */}
      </div>

      {/* ============= CHART CONTAINER ============= */}

      <ChartCanvasNutrition activeTab={activeTab} period={period} />

      {activeTab === "weight" && (
        <div className="bg-white dark:bg-darkCard py-5 px-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
          <h3 className="font-bold text-sm mb-3 text-gray-500 uppercase">
            InputBerat Badan Harian
          </h3>

          {activeTab === "weight" && (
            <WeightForm onNewLog={() => {}} isAlreadyLogged={isAlreadyInput} />
          )}
        </div>
      )}
      <h3 className="font-bold text-lg mb-3" id="history-title">
        Riwayat {activeTab === "calorie" ? "Kalori" : "Berat Badan"}
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
          );
        })}

        {weightData?.length === 0 && (
          <p className="text-gray-500 text-sm">Belum ada riwayat.</p>
        )}
      </div>
    </div>
  );
}
