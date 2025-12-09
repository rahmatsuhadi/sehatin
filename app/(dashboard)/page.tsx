"use client";

import GreetingCard from "@/components/dahboard/GreetingCard";
import { Icon } from "@/components/ui/icon";
import { apiClient } from "@/lib/api-client";
import { useUser } from "@/service/auth";
import {
  faFire,
  faDna,
  faMagic,
  faCamera,
  faChevronRight,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";

interface DailyTracking {
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
}

export default function MainPage() {
  const { data: user } = useUser();

  const { data, isLoading, error } = useQuery<DailyTracking, Error>({
    queryKey: ["dailyTracking"], // Use a more descriptive key, e.g., "dailyTracking"
    queryFn: async () => {
      try {
        const api = await apiClient<{
          data: { summary: DailyTracking };
          message: string;
        }>("/daily");

        return api.data.summary;
      } catch (e) {
        throw new Error("Gagal mengambil data harian.");
      }
    },
    refetchOnWindowFocus: true,
  });

  return (
    <div className="page-section fade-in space-y-8 lg:space-y-10">
      {/* Top Greeting */}
      <div className="flex justify-between items-start">
        <GreetingCard />

        {/* Streak */}
        <div className="flex flex-col items-end">
          <div className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold border border-orange-200 dark:border-orange-800 mb-1">
            <Icon icon={faFire} className="text-orange-500 animate-pulse" />
            <span>0</span> Hari
          </div>

          <div className="flex gap-1">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-orange-400"></div>
            ))}
            {[4, 5].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"
              ></div>
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
            Halo! Berdasarkan data fisikmu, tubuhmu butuh asupan spesifik.
          </p>

          <div className="mt-3 flex gap-3">
            <div className="bg-white/20 backdrop-blur px-3 py-1.5 rounded-xl">
              <p className="text-[10px] opacity-75">Target Kalori</p>
              <p className="font-bold">{data?.target_calories_kcal || 0}</p>
            </div>

            <div className="bg-white/20 backdrop-blur px-3 py-1.5 rounded-xl">
              <p className="text-[10px] opacity-75">Berat Ideal</p>
              <p className="font-bold">{user?.ideal_weight_kg || 0} kg</p>
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
                {(data?.target_calories_kcal || 0) -
                  (data?.total_calories_kcal || 0)}
              </span>
              <span className="text-sm text-gray-400">kkal</span>
            </div>
          </div>

          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="#e2e8f0"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="#58CC02"
                strokeWidth="6"
                fill="none"
                strokeDasharray="175"
                strokeDashoffset="175"
                strokeLinecap="round"
              />
            </svg>

            <Icon
              icon={faUtensils}
              className="absolute text-gray-400 text-sm"
            />
          </div>
        </div>

        {/* Macros */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Protein",
              bar: "bg-blue-400",
              value: data?.total_protein_g || 0,
            },
            {
              label: "Karbo",
              bar: "bg-yellow-400",
              value: data?.total_carbs_g || 0,
            },
            {
              label: "Lemak",
              bar: "bg-red-400",
              value: data?.total_fat_g || 0,
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
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg text-gray-800 dark:text-white">
            Menu Hari Ini
          </h3>
          <button className="text-primary text-xs font-bold uppercase tracking-wide bg-primary/10 px-3 py-1 rounded-full hover:bg-primary hover:text-white transition flex items-center gap-1">
            <Icon icon={faMagic} className="text-xs" />
            Buat Menu
          </button>
        </div>

        <div className="p-6 text-center text-gray-400 text-sm bg-white dark:bg-darkCard rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
          Belum ada rencana makan.
        </div>
      </div>

      {/* Scan CTA */}
      <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-4 rounded-2xl shadow-xl flex items-center gap-4 group cursor-pointer relative overflow-hidden mb-20 lg:mb-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition"></div>

        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
          <Icon icon={faCamera} />
        </div>

        <div className="flex-1">
          <h4 className="font-bold text-lg">AI Nutrition Scan</h4>
          <p className="text-xs opacity-80">Analisis makro & cegah obesitas</p>
        </div>

        <Icon icon={faChevronRight} className="opacity-50" />
      </div>
    </div>
  );
}
