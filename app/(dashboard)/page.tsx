"use client";

import CircleProgress from "@/components/dahboard/circle-progress";
import GenerateMenuModal from "@/components/dahboard/generate-menu";
import ModalScanContent from "@/components/scan/modal-scan";
import { Icon } from "@/components/ui/icon";
import { apiClient } from "@/lib/api-client";
import { Meals, User } from "@/lib/types";
import {
  faFire,
  faDna,
  faMagic,
  faCamera,
  faChevronRight,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

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

interface Streak {
  current_streak_days: number;
  longest_streak_days: number;
  this_week_logged_days: number;
  this_month_logged_days: number;
}

interface ResponseDashboard {
  user: User;
  today_summary: DailyNutrition;
  meals: Meals[];
  streak: Streak;
}

export default function MainPage() {
  const [isScanOpen, setIsScanOpen] = useState(false);

  const { data, isLoading, error } = useQuery<ResponseDashboard, Error>({
    queryKey: ["dashboard"], // Use a more descriptive key, e.g., "DailyNutrition"
    queryFn: async () => {
      try {
        const api = await apiClient<{
          data: {
            user: User;
            today_summary: DailyNutrition;
            meals: Meals[];
            streak: Streak;
          };
          message: string;
        }>("/dashboard");

        return api.data;
      } catch (e) {
        throw new Error("Gagal mengambil data harian.");
      }
    },
    refetchOnWindowFocus: true,
  });

  const today_summary = data?.today_summary;
  const user = data?.user;
  const streak = data?.streak || {
    current_streak_days: 0,
    longest_streak_days: 0,
    this_week_logged_days: 0,
    this_month_logged_days: 0,
  };

  const loggedDays = Math.min(
    Math.max(streak?.this_week_logged_days ?? 0, 0),
    7
  );

  const remainingDays = 7 - loggedDays;

  return (
    <div className="page-section fade-in space-y-8 lg:space-y-10 px-5 mt-3 pb-28">
      {/* Top Greeting */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Hai,
            <span className="text-gray-900 dark:text-white font-bold">
              {" "}
              {data?.user?.name || "John"}!
            </span>
          </p>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-800 dark:text-white">
            Ayo Sehat! 🥑
          </h2>
        </div>

        {/* Streak */}
        <div className="flex flex-col items-end">
          {/* CURRENT STREAK */}
          <div className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold border border-orange-200 dark:border-orange-800 mb-1">
            <Icon icon={faFire} className="text-orange-500 animate-pulse" />
            <span>{streak.current_streak_days}</span> Hari
          </div>

          {/* WEEKLY DOTS */}
          <div className="flex gap-1">
            {/* Hari yang sudah tercatat */}
            {Array.from({ length: loggedDays }).map((_, i) => (
              <div
                key={`done-${i}`}
                className="w-2 h-2 rounded-full bg-orange-400"
              />
            ))}

            {/* Hari yang belum */}
            {Array.from({ length: remainingDays }).map((_, i) => (
              <div
                key={`pending-${i}`}
                className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Digital Metabolism Card */}
      <div className="mb-6 bg-gradient-to-br from-blue-600 to-indigo-600 p-5 rounded-4xl text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <p className="bg-white/20 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur inline-block">
            DIGITAL METABOLISM
          </p>

          <p className="text-sm opacity-90 mt-2">
            Halo! Berdasarkan TB {user?.height_cm || 0}cm & BB{" "}
            {user?.current_weight_kg || 0}kg, tubuhmu butuh asupan spesifik.
          </p>

          <div className="mt-3 flex gap-3">
            <div className="bg-white/20 backdrop-blur px-3 py-1.5 rounded-xl">
              <p className="text-[10px] opacity-75">Target Kalori</p>
              <p className="font-bold">
                {today_summary?.target_calories_kcal || 0}
              </p>
            </div>

            <div className="bg-white/20 backdrop-blur px-3 py-1.5 rounded-xl">
              <p className="text-[10px] opacity-75">Berat Ideal</p>
              <p className="font-bold">{user?.target_weight_kg || 0} kg</p>
            </div>
          </div>
        </div>

        <Icon
          icon={faDna}
          className="absolute -bottom-4 -right-4 text-8xl text-white/10"
        />
      </div>

      {/* Calories Widget */}
      <div className="bg-white dark:bg-darkCard rounded-4xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-sm text-gray-400">Sisa Kalori Harian</span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-gray-800 dark:text-white">
                {today_summary?.calories_remaining || 0}
              </span>
              <span className="text-sm text-gray-400">kkal</span>
            </div>
          </div>

          <CircleProgress
            percent={today_summary?.calories_percentage || 0}
            icon={faUtensils}
          />
        </div>

        {/* Macros */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Protein",
              bar: "bg-blue-400",
              value: today_summary?.total_protein_g || 0,
            },
            {
              label: "Karbo",
              bar: "bg-yellow-400",
              value: today_summary?.total_carbs_g || 0,
            },
            {
              label: "Lemak",
              bar: "bg-red-400",
              value: today_summary?.total_fat_g || 0,
            },
          ].map(({ label, bar, value }) => (
            <div
              key={label}
              className="bg-gray-50 dark:bg-slate-800 rounded-xl p-2.5"
            >
              <p className="text-[10px] text-gray-400 uppercase font-bold">
                {label}
              </p>
              <p className="font-bold text-base dark:text-white">{value}g</p>

              <div className="w-full bg-gray-200 h-1 rounded-full mt-1">
                <div
                  className={`${bar} h-1 rounded-full`}
                  style={{ width: "0%" }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Meal Plan */}
      <div>
        {today_summary?.calories_remaining == 0 ? (
          <></>
        ) : (
          <GenerateMenuModal
            maxCalories={today_summary?.calories_remaining || 0}
          />
        )}
      </div>

      {/* Scan CTA */}
      <button
        type="button"
        onClick={() => setIsScanOpen(true)}
        className="bg-gray-900 w-full hover:bg-gray-800 dark:bg-white text-white dark:text-gray-900 p-4 rounded-2xl shadow-xl flex items-center gap-4 group cursor-pointer relative overflow-hidden mb-20 lg:mb-10"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition"></div>

        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
          <Icon icon={faCamera} />
        </div>

        <div className="flex-1">
          <h4 className="font-bold text-lg">AI Nutrition Scan</h4>
          <p className="text-xs opacity-80">Analisis makro & cegah obesitas</p>
        </div>

        <Icon icon={faChevronRight} className="opacity-50" />
      </button>

      <ModalScanContent
        isOpen={isScanOpen}
        onClose={() => setIsScanOpen(false)}
      />
    </div>
  );
}
