"use client";

import { customToast } from "@/lib/custom-toast";
import { useUpdateProfile, useUser } from "@/service/auth";
import { useQueryClient } from "@tanstack/react-query";
import { use, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type OnboardingInputs = {
  name: string;
  birthDate: string;
  height: number;
  weight: number;
  goal: "lose" | "maintain" | "gain";
};

export default function OnboardingForm() {
  const { data } = useUser();
  const user = data?.data.user;

  const { mutateAsync } = useUpdateProfile();

  const {
    reset,
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<OnboardingInputs>({
    defaultValues: {
      name: "",
      birthDate: "",
      height: undefined,
      weight: undefined,
      goal: "lose",
    },
  });

  useEffect(() => {
    if (user) {
      const birthDate = user.birth_date
        ? user.birth_date.split("T")[0] // ambil bagian sebelum 'T'
        : "";

      reset({
        name: user.name || "",
        birthDate: birthDate || "",
        height: user.height_cm || undefined,
        weight: user.current_weight_kg || undefined,
        goal: user.goal_type,
      });
    }
  }, [user, reset]);

  const goal = watch("goal");

  const queryClient = useQueryClient();

  const onSubmit: SubmitHandler<OnboardingInputs> = async (data) => {
    await mutateAsync(
      {
        credentials: {
          birth_date: data.birthDate,
          current_weight_kg: data.weight,
          name: data.name,
          height_cm: data.height,
          goal_type: data.goal,
        },
      },
      {
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["user"] });
          customToast("Profile data anda berhasil di perbarui !.", "success");
        },
        onError() {
          customToast(
            "Terjadi kesalahan saat memperbarui data profile.",
            "error"
          );
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Nama */}
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Nama
        </label>
        <input
          type="text"
          placeholder="Masukkan nama"
          {...register("name", { required: "Nama wajib diisi" })}
          className="mt-1 w-full px-4 py-3 rounded-xl bg-white dark:bg-darkCard border border-gray-200 dark:border-gray-700 dark:text-white focus:ring-2 ring-primary outline-none"
        />
        {errors.name && (
          <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Tanggal Lahir */}
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Tanggal Lahir
        </label>
        <input
          type="date"
          {...register("birthDate", { required: "Tanggal lahir wajib diisi" })}
          className="mt-1 w-full px-4 py-3 rounded-xl bg-white dark:bg-darkCard border border-gray-200 dark:border-gray-700 dark:text-white focus:ring-2 ring-primary outline-none"
        />
        {errors.birthDate && (
          <p className="text-xs text-red-500 mt-1">
            {errors.birthDate.message}
          </p>
        )}
      </div>

      {/* Tinggi */}
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Tinggi Badan (cm)
        </label>
        <input
          type="number"
          placeholder="Misal: 170"
          {...register("height", {
            required: "Tinggi wajib diisi",
            min: { value: 30, message: "Tinggi minimal 30 cm" },
            valueAsNumber: true,
          })}
          className="mt-1 w-full px-4 py-3 rounded-xl bg-white dark:bg-darkCard border border-gray-200 dark:border-gray-700 dark:text-white focus:ring-2 ring-primary outline-none"
        />
        {errors.height && (
          <p className="text-xs text-red-500 mt-1">{errors.height.message}</p>
        )}
      </div>

      {/* Berat */}
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Berat Badan (kg)
        </label>
        <input
          type="number"
          placeholder="Contoh: 60"
          {...register("weight", {
            required: "Berat wajib diisi",
            min: { value: 1, message: "Berat minimal 1 kg" },
            valueAsNumber: true,
          })}
          className="mt-1 w-full px-4 py-3 rounded-xl bg-white dark:bg-darkCard border border-gray-200 dark:border-gray-700 dark:text-white focus:ring-2 ring-primary outline-none"
        />
        {errors.weight && (
          <p className="text-xs text-red-500 mt-1">{errors.weight.message}</p>
        )}
      </div>

      {/* Goal */}
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Tujuan Kamu
        </label>
        <div className="grid grid-cols-3 gap-3 mt-2">
          {["lose", "maintain", "gain"].map((g) => (
            <button
              type="button"
              key={g}
              onClick={() =>
                setValue("goal", g as "lose" | "maintain" | "gain")
              }
              className={`rounded-xl p-3 border text-sm font-semibold transition ${
                goal === g
                  ? "bg-primary text-white shadow-lg"
                  : "bg-white dark:bg-darkCard border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
              }`}
            >
              {g === "lose"
                ? "Turun BB"
                : g === "maintain"
                ? "Stabil"
                : "Naik BB"}
            </button>
          ))}
        </div>
      </div>

      {/* Tombol Simpan */}
      <button
        type="submit"
        className="mt-10 w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-400/30 active:scale-95 transition"
      >
        Simpan & Lanjutkan
      </button>
    </form>
  );
}
