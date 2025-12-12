"use client";

import { apiClient } from "@/lib/api-client";
import { Meals } from "@/lib/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Icon } from "../ui/icon";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { customToast } from "@/lib/custom-toast";

interface ModalConfirmProps {
  sessionId: string;
  onClose: () => void;
  onConfirm: () => void;
}

interface FormValues {
  meal_type: string;
  label: string;
  eaten_at: string;
  items: {
    scan_item_id: string;
    quantity: string;
    unit: string;
    name_final: string;
    notes: string;
    calories_kcal?: number;
    protein_g?: number;
    carbs_g?: number;
    fat_g?: number;
  }[];
}

interface ResponseScan {
  id: string;
  ai_model: string;
  status: "pending" | "success" | "failed";
  image_path: string;
}

const getAutoMealType = () => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 11) return { label: "Sarapan", value: "breakfast" };
  if (hour >= 11 && hour < 16) return { label: "Makan Siang", value: "lunch" };
  if (hour >= 16 && hour < 21) return { label: "Makan Malam", value: "dinner" };
  return { label: "Makanan ringan", value: "snack" };
};

// Auto generate datetime-local (YYYY-MM-DDTHH:MM)
const getDateTimeLocalNow = () => {
  const now = new Date();
  const pad = (n: number) => (n < 10 ? "0" + n : n);

  return (
    now.getFullYear() +
    "-" +
    pad(now.getMonth() + 1) +
    "-" +
    pad(now.getDate()) +
    "T" +
    pad(now.getHours()) +
    ":" +
    pad(now.getMinutes())
  );
};

const useCreateMeal = (session_id: string) =>
  useMutation({
    onError() {
      customToast("Terjadi kesalahan saat mengirim data", "error");
    },
    mutationFn: async ({ body }: { body: FormValues }) => {
      const response = await apiClient<{ message: string }>(
        `/scan/${session_id}/confirm`,
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      );
      return response;
    },
  });

export default function ModalConfirm({
  sessionId,
  onConfirm,
  onClose,
}: ModalConfirmProps) {
  const { data } = useQuery<
    { scan_session: ResponseScan; items: Meals[] },
    Error
  >({
    enabled: !!sessionId,
    queryKey: ["scan-session", sessionId],
    queryFn: async () => {
      const api = await apiClient<{
        data: {
          scan_session: ResponseScan;
          items: Meals[];
        };
        message: string;
      }>("/scan/" + sessionId);

      return api.data;
    },
  });

  const scanItems = data?.items || [];

  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      meal_type: "lunch",
      label: "Makan siang dari scan",
      eaten_at: new Date().toISOString().slice(0, 16),
      items: scanItems.map((item) => ({
        scan_item_id: item.id,
        quantity: "1",
        unit: "porsi",
        name_final: item.name_final,
        notes: "",
        calories_kcal: item.calories_kcal,
        protein_g: item.protein_g,
        carbs_g: item.carbs_g,
        fat_g: item.fat_g,
      })),
    },
  });

  useEffect(() => {
    if (sessionId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValue("meal_type", getAutoMealType().value);
      setValue("label", `Makan ${getAutoMealType().label} dari scan`);
      setValue("eaten_at", getDateTimeLocalNow());
    }
  }, [sessionId]);

  // Update when API arrives
  useEffect(() => {
    if (scanItems?.length > 0) {
      setValue(
        "items",
        scanItems.map((item) => ({
          scan_item_id: item.id,
          quantity: "1",
          unit: "porsi",
          name_final: item.name_final,
          notes: "",
          calories_kcal: item.calories_kcal,
          protein_g: item.protein_g,
          carbs_g: item.carbs_g,
          fat_g: item.fat_g,
        }))
      );
    }
  }, [scanItems, setValue]);

  const watchedItems = useWatch({ control, name: "items" });
  const totalCalories = watchedItems?.reduce(
    (t, x) => t + Number(x.calories_kcal || 0),
    0
  );

  const createMealMutation = useCreateMeal(sessionId);

  const submitHandler = (values: FormValues) => {
    createMealMutation.mutate(
      { body: values },
      {
        onSuccess(data, variables, onMutateResult, context) {
          onConfirm();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-90 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-darkCard w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
        <form className="p-6 space-y-5" onSubmit={handleSubmit(submitHandler)}>
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="font-bold text-xl dark:text-white">
                Hasil Scan AI
              </h3>
              <p className="text-xs text-green-600 font-bold">
                Terdeteksi 3 Komponen
              </p>
            </div>
            <button type="button" onClick={onClose}>
              <Icon icon={faTimes} className="text-xl text-gray-400" />
            </button>
          </div>

          {/* Meal Type */}
          <div className="input-group">
            <label className="text-xs font-bold text-gray-500">
              Jenis Makan
            </label>
            <select
              {...register("meal_type")}
              className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 dark:text-white mt-1"
            >
              <option value="breakfast">Sarapan</option>
              <option value="lunch">Makan Siang</option>
              <option value="dinner">Makan Malam</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          {/* Label */}
          <div className="input-group">
            <label className="text-xs font-bold text-gray-500">Label</label>
            <input
              {...register("label", {
                disabled: createMealMutation.isPending,
                required: "Label diperlukan",
              })}
              className={`w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 dark:text-white mt-1  ${
                errors.label
                  ? "border-red-400"
                  : "border-gray-300 focus:border-primary"
              }`}
            />
            {errors.label && (
              <span className="error-message">{errors.label.message}</span>
            )}
          </div>

          {/* Eaten At */}
          <div className="input-group">
            <label className="text-xs font-bold text-gray-500">
              Waktu Makan
            </label>
            <input
              type="datetime-local"
              {...register("eaten_at")}
              className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 dark:text-white mt-1"
            />
          </div>

          {/* Items */}
          <div className="space-y-4 mt-4">
            {watchedItems?.map((item, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm mb-3  relative space-y-2"
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1 mr-4">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 block">
                      Nama Makanan
                    </label>
                    <input
                      type="text"
                      {...register(`items.${i}.name_final`, {
                        disabled: createMealMutation.isPending,
                        required: "Nama makanan wajib diisi",
                      })}
                      className={`w-full font-bold text-gray-800 dark:text-white bg-transparent border-b border-dashed border-gray-300 focus:border-primary focus:outline-none transition-colors pb-1  ${
                        errors.items?.[i]?.name_final
                          ? "border-red-400"
                          : "border-gray-300 focus:border-primary"
                      }`}
                    />
                    {errors.items?.[i]?.name_final && (
                      <span className="error-message">
                        {errors.items[i]?.name_final?.message}
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 block">
                      Kkal
                    </label>
                    <input
                      type="number"
                      {...register(`items.${i}.calories_kcal`, {
                        disabled: createMealMutation.isPending,
                        min: {
                          value: 1,
                          message: "Minimal Kalori 1",
                        },
                        required: "Kalori Wajib diisi",
                      })}
                      className="w-16 font-bold text-primary text-right bg-transparent border-b border-dashed border-gray-300 focus:border-primary focus:outline-none pb-1"
                    />
                    {errors.items?.[i]?.calories_kcal && (
                      <span className="error-message">
                        {errors.items[i]?.calories_kcal?.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-[10px] text-gray-400 uppercase font-bold">
                      Jumlah
                    </label>
                    <input
                      {...register(`items.${i}.quantity`, {
                        min: {
                          value: 1,
                          message: "Minimal Porsi 1",
                        },
                        required: "Jumlah porsi Wajib diisi",
                      })}
                      className="w-full font-bold text-gray-800 dark:text-white bg-transparent border-b border-dashed border-gray-300 focus:border-primary focus:outline-none transition-colors pb-1"
                    />
                    {errors.items?.[i]?.quantity && (
                      <span className="error-message">
                        {errors.items[i]?.quantity?.message}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] text-gray-400 uppercase font-bold">
                      Unit
                    </label>
                    <input
                      {...register(`items.${i}.unit`)}
                      className="w-full font-bold text-gray-800 dark:text-white bg-transparent border-b border-dashed border-gray-300 focus:border-primary focus:outline-none transition-colors pb-1"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-[10px] text-gray-400 uppercase font-bold">
                    Catatan
                  </label>
                  <input
                    {...register(`items.${i}.notes`)}
                    className="w-full font-bold text-gray-800 dark:text-white bg-transparent border-b border-dashed border-gray-300 focus:border-primary focus:outline-none transition-colors pb-1"
                    placeholder="Catatan tambahan..."
                  />
                </div>

                {/* Nutrition */}
                <div className="text-sm text-gray-500">
                  P:{item.protein_g}g C:{item.carbs_g}g F:{item.fat_g}g
                </div>
              </div>
            ))}
          </div>

          {/* Total Calories */}

          <div className="bg-blue-50 dark:bg-slate-800 p-4 rounded-xl border border-blue-100 dark:border-slate-700 mb-4">
            <div className="flex justify-between font-bold text-sm text-gray-800 dark:text-white">
              <span>Total Kalori:</span>
              <span>{totalCalories} kkal</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={createMealMutation.isPending}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold"
          >
            {createMealMutation.isPending
              ? "Menyimpan..."
              : "Konfirmasi & Simpan"}
          </button>
        </form>
      </div>
    </div>
  );
}
