import { apiClient } from "@/lib/api-client";
import { Meals } from "@/lib/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Icon } from "../ui/icon";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { customToast } from "@/lib/custom-toast";

interface ModalConfirmProps {
  sessionId?: string;
  onConfirm?: () => void;
  onClose: () => void;
}
interface FormValues {
  items: Meals[];
}

const useConfirmMeals = () =>
  useMutation({
    onError() {
      customToast("Terjadi kesalahan saat menkonfirmasi data", "error");
    },
    mutationFn: async ({
      body,
      sessionId,
    }: {
      sessionId: string;
      body: { items: Meals[] };
    }) => {
      const response = await apiClient<{
        message: string;
        data: { scan_session: { id: string } };
      }>("/scan" + sessionId + "/confirm", {
        method: "POST",
        body: JSON.stringify(body),
      });

      return response.data;
    },
  });

interface ResponseScan {
  id: string;
  ai_model: string;
  status: "pending" | "success" | "failed";
  image_path: string;
}
export default function ModalConfirm({
  sessionId,
  onConfirm,
  onClose,
}: ModalConfirmProps) {
  const { data, isLoading } = useQuery<
    { scan_session: ResponseScan; items: Meals[] },
    Error
  >({
    enabled: !!sessionId,
    queryKey: ["dashboard", sessionId],
    queryFn: async () => {
      try {
        const api = await apiClient<{
          data: {
            scan_session: ResponseScan;
            items: Meals[];
          };
          message: string;
        }>("/scan/" + sessionId);

        return api.data;
      } catch (e) {
        throw new Error("Gagal mengambil data Scann.");
      }
    },
    refetchOnWindowFocus: true,
  });

  const items = data?.items || [];

  const { register, control, setValue, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      items: items,
    },
  });
  useEffect(() => {
    if (items.length > 0) {
      setValue("items", items);
    }
  }, [items, setValue]);

  const watchedItems = useWatch({
    control,
    name: "items",
  });

  const totalCalories = watchedItems?.reduce(
    (total, item) => total + Number(item.calories_kcal || 0),
    0
  );

  const confirmMealsMutation = useConfirmMeals();

  const submitHandler = (values: FormValues) => {
    if (!sessionId) return;
    confirmMealsMutation.mutate({
      body: values,
      sessionId: sessionId as string,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-90 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn pointer-events-auto">
      <div className="bg-white dark:bg-darkCard w-full max-w-sm rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden shadow-2xl slide-up max-h-[90vh] overflow-y-auto flex flex-col">
        <form className="p-6" onSubmit={handleSubmit(submitHandler)}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-xl dark:text-white">
                Hasil Scan AI
              </h3>
              <p className="text-xs text-green-600 font-bold">
                Terdeteksi {items.length} Komponen
              </p>
            </div>
            <button
              className="text-gray-400 hover:cursor-pointer"
              type="button"
              onClick={onClose}
            >
              <Icon icon={faTimes} className="text-xl" />
            </button>
          </div>

          <div id="scan-items-container" className="space-y-4 mb-6">
            {items.map((item, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm mb-3 flex justify-between items-center relative"
              >
                <div className="flex-1 mr-4">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 block">
                    Nama Makanan
                  </label>
                  <input
                    type="text"
                    {...(register(`items.${i}.name_final`),
                    {
                      disabled: confirmMealsMutation.isPending,
                    })}
                    defaultValue={item.name_final}
                    className="w-full font-bold text-gray-800 dark:text-white bg-transparent not-disabled:border-b border-dashed border-gray-300 focus:border-primary focus:outline-none transition-colors pb-1"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">
                    P:{item.protein_g} C:{item.carbs_g} F:{item.fat_g}
                  </p>
                </div>
                <div className="text-right">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 block">
                    Kkal
                  </label>
                  <input
                    type="number"
                    {...register(`items.${i}.calories_kcal`, {
                      disabled: confirmMealsMutation.isPending,
                      valueAsNumber: true,
                    })}
                    defaultValue={item.calories_kcal}
                    className="w-16 font-bold text-primary text-right bg-transparent not-disabled:border-b border-dashed border-gray-300 focus:border-primary focus:outline-none pb-1"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 dark:bg-slate-800 p-4 rounded-xl border border-blue-100 dark:border-slate-700 mb-4">
            <div className="flex justify-between font-bold text-sm text-gray-800 dark:text-white">
              <span>Total Kalori:</span>
              <span id="scan-total-display">{totalCalories} kkal</span>
            </div>
          </div>

          <button
            disabled={confirmMealsMutation.isPending}
            type="submit"
            className="w-full bg-primary text-white disabled:bg-primary/40 font-bold py-4 rounded-xl shadow-lg btn-press  hover:cursor-pointer"
          >
            {confirmMealsMutation.isPending
              ? "Memproses"
              : "Konfirmasi & Lanjut"}
          </button>
        </form>
      </div>
    </div>
  );
}
