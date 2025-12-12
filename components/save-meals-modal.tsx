"use client";

import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { customToast } from "@/lib/custom-toast";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "./ui/icon";

interface SaveMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  servings?: number;
  recipeId: string;
  defaultLabel?: string;
}

const getAutoMealType = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return "breakfast";
  if (hour >= 11 && hour < 16) return "lunch";
  if (hour >= 16 && hour < 21) return "dinner";
  return "snack";
};

const getDateTimeLocalNow = () => {
  const n = new Date();
  const p = (v: number) => (v < 10 ? "0" + v : v);
  return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}T${p(
    n.getHours()
  )}:${p(n.getMinutes())}`;
};
interface SaveMealForm {
  meal_type: "breakfast" | "lunch" | "dinner" | "snack";
  label: string;
  eaten_at: string;
  servings_made: number;
  notes?: string;
}
export default function SaveMealModal({
  isOpen,
  onClose,
  onSuccess,
  recipeId,
  defaultLabel = "",
  servings = 1,
}: SaveMealModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SaveMealForm>({
    defaultValues: {
      meal_type: "lunch",
      label: defaultLabel,
      eaten_at: "",
      servings_made: servings,
      notes: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        meal_type: getAutoMealType(),
        label: defaultLabel,
        eaten_at: getDateTimeLocalNow(),
        servings_made: servings,
        notes: "",
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  const mutation = useMutation({
    mutationFn: async (data: SaveMealForm) => {
      return apiClient(`/recipes/${recipeId}/add-to-meal`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      customToast("Berhasil disimpan ke catatan makan!", "success");
      queryClient.invalidateQueries({ queryKey: ["calorie-history"] });
      queryClient.invalidateQueries({ queryKey: ["calorie-chart"] });
      onSuccess();
    },
    onError: () => {
      customToast("Gagal menyimpan data.", "error");
    },
  });

  const onSubmit: SubmitHandler<SaveMealForm> = (data) => mutation.mutate(data);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-darkCard rounded-[2rem] w-full max-w-sm shadow-2xl relative animate-bounce-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400"
        >
          <Icon icon={faTimes} className="text-xl" />
        </button>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <h2 className="text-xl font-bold mb-4 dark:text-white">Simpan</h2>
          <p className="text-xs text-gray-500">
            Simpan resep ini sebgai catatan makanan.
          </p>

          {/* Meal Type */}
          <div className="mb-3 input-group">
            <label className="text-xs font-bold text-gray-500">
              Tipe Makan
            </label>
            <select
              disabled={isSubmitting}
              {...register("meal_type", { required: "Tipe makan wajib diisi" })}
              className="w-full mt-1 p-2 rounded-lg border"
            >
              <option value="breakfast">Sarapan</option>
              <option value="lunch">Makan Siang</option>
              <option value="dinner">Makan Malam</option>
              <option value="snack">Snack</option>
            </select>
            {errors.meal_type && (
              <span className="text-red-500 text-xs">
                {errors.meal_type.message as string}
              </span>
            )}
          </div>

          {/* Label */}
          <div className="mb-3 input-group">
            <label className="text-xs font-bold text-gray-500">Nama Menu</label>
            <input
              disabled={isSubmitting}
              type="text"
              {...register("label", {
                required: "Nama menu wajib diisi",
                minLength: { value: 3, message: "Minimal 3 karakter" },
              })}
              className="w-full mt-1 p-2 border rounded-lg"
            />
            {errors.label && (
              <span className="text-red-500 text-xs">
                {errors.label.message as string}
              </span>
            )}
          </div>

          {/* Eaten At */}
          <div className="mb-3 input-group">
            <label className="text-xs font-bold text-gray-500">
              Waktu Makan
            </label>
            <input
              disabled={isSubmitting}
              type="datetime-local"
              {...register("eaten_at", {
                required: "Waktu makan wajib diisi",
              })}
              className="w-full mt-1 p-2 border rounded-lg"
            />
            {errors.eaten_at && (
              <span className="text-red-500 text-xs">
                {errors.eaten_at.message as string}
              </span>
            )}
          </div>

          {/* Servings */}
          <div className="mb-3 input-group">
            <label className="text-xs font-bold text-gray-500">
              Jumlah Porsi
            </label>
            <input
              type="number"
              min={1}
              disabled={isSubmitting}
              {...register("servings_made", {
                required: "Jumlah porsi wajib diisi",
                min: { value: 1, message: "Minimal 1 porsi" },
                valueAsNumber: true,
              })}
              className="w-full mt-1 p-2 border rounded-lg"
            />
            {errors.servings_made && (
              <span className="text-red-500 text-xs">
                {errors.servings_made.message as string}
              </span>
            )}
          </div>

          {/* Notes */}
          <div className="mb-4 input-group">
            <label className="text-xs font-bold text-gray-500">Catatan</label>
            <textarea
              disabled={isSubmitting}
              {...register("notes", {
                minLength: { value: 5, message: "Minimal 5 karakter" },
              })}
              className="w-full mt-1 p-2 border rounded-lg min-h-20"
              placeholder="Opsional (misal: tambah sambal, kurang asin, dsb)"
            ></textarea>
            {errors.notes && (
              <span className="text-red-500 text-xs">
                {errors.notes.message as string}
              </span>
            )}
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white font-bold py-3 rounded-xl shadow-lg btn-press disabled:opacity-50"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </button>
        </form>
      </div>
    </div>
  );
}
