"use client";

import { apiClient } from "@/lib/api-client";
import { customToast } from "@/lib/custom-toast";
import { Weight } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface Props {
  open: boolean;
  onClose: () => void;
  currentWeight: number;
}

interface MutationBody {
  weight_kg: number;
  log_date: string;
}

interface WeightFormInput {
  weight_kg: number;
}

export default function DailyCheckinModal({
  open,
  onClose,
  currentWeight,
}: Props) {
  const queryClient = useQueryClient();

  const mutation = useMutation<Weight, Error, MutationBody>({
    mutationFn: async (newLog) => {
      const response = await apiClient<{ data: Weight }>("/weights", {
        method: "POST",
        body: JSON.stringify(newLog),
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weight-history"] });
      queryClient.invalidateQueries({ queryKey: ["weight-chart"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      customToast("Berat badan berhasil disimpan", "success");
      onClose();
    },
    onError: () => {
      customToast("Gagal menyimpan data", "error");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WeightFormInput>({
    defaultValues: { weight_kg: undefined },
  });

  useEffect(() => {
    if (currentWeight) {
      reset({
        weight_kg: currentWeight,
      });
    }
  }, [currentWeight, reset]);

  // Form submit handler
  const onSubmit: SubmitHandler<WeightFormInput> = (data) => {
    const today = new Date().toISOString().split("T")[0];

    const apiBody: MutationBody = {
      weight_kg: Number(data.weight_kg),
      log_date: today,
    };

    mutation.mutate(apiBody);
  };

  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 bg-black/60 backdrop-blur-sm z-[65]
        flex items-center justify-center p-4 animate-fadeIn
      "
    >
      <div
        className="
          bg-white dark:bg-darkCard rounded-[2rem] w-full max-w-xs p-6 shadow-2xl text-center 
          animate-scaleIn
        "
      >
        {/* Icon */}
        <div className="text-4xl mb-2 select-none">🥑</div>

        <h3 className="font-bold text-lg mb-1 dark:text-white">
          Check-In Harian 📅
        </h3>

        <p className="text-xs text-gray-500 mb-4">
          Sudah cek berat badan hari ini?
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* Input */}
          <input
            id="daily-weight"
            type="number"
            {...register("weight_kg", {
              required: "Berat wajib diisi",
              min: { value: 1, message: "Berat minimal 1 kg" },
              valueAsNumber: true,
            })}
            placeholder="Masukkan berat (kg)"
            className={`w-full p-3 rounded-xl border text-center text-lg font-bold 
              bg-gray-100 dark:bg-gray-800 dark:text-white outline-none 
              ${errors.weight_kg ? "border-red-500" : "border-gray-200"}`}
          />

          {/* Error */}
          {errors.weight_kg && (
            <p className="error-message">{errors.weight_kg.message}</p>
          )}

          {/* Submit */}
          <button
            disabled={mutation.isPending}
            type="submit"
            className="
              w-full bg-secondary text-white hover:cursor-pointer hover:bg-secondary/70 font-bold py-3 rounded-xl 
              active:scale-95 transition
            "
          >
            {mutation.isPending ? "Menyimpan" : "Simpan"}
          </button>
        </form>

        {/* Skip */}
        <button
          onClick={() => {
            reset();
            onClose();
          }}
          className="text-xs text-gray-400 mt-3 underline w-full"
        >
          Nanti Saja
        </button>
      </div>
    </div>
  );
}
