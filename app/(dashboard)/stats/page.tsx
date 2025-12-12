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
import CaloriesSection from "@/components/stats/section/calories";
import WeightSection from "@/components/stats/section/weight";

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

  return (
    <div className=" fade-in pb-20">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Analisis Data
      </h2>

      {/* =================== TABS =================== */}
      {/* <div className="flex flex-col gap-4 mb-6"> */}
      <TabsStatNutrition activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* RIWAYAT TANGGAL YANG DIPANGGIL */}
      {/* </div> */}

      {/* ============= CHART CONTAINER ============= */}

      {activeTab == "calorie" ? <CaloriesSection /> : <WeightSection />}
    </div>
  );
}
