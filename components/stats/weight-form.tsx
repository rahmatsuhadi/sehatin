import { apiClient } from "@/lib/api-client";
import { customToast } from "@/lib/custom-toast";
import { Weight } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface MutationBody {
  weight_kg: number;
  log_date: string;
}

interface WeightFormInput {
  weight_kg: number;
}

interface WeightFormProps {
  isAlreadyLogged?: boolean;
}

export function WeightForm({ isAlreadyLogged }: WeightFormProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WeightFormInput>({
    defaultValues: {
      weight_kg: 0,
    },
  });

  // Setup React Query Mutation
  const mutation = useMutation<Weight, Error, MutationBody>({
    mutationFn: async (newLog) => {
      const response = await apiClient<{ data: Weight }>("/weights", {
        method: "POST",
        body: JSON.stringify(newLog),
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["weight-history"] });

      queryClient.invalidateQueries({ queryKey: ["weight-chart"] });
      customToast("Berat badan berhasil disimpan", "success");
      reset(); // Clear the form
    },
    onError: (error) => {
      customToast("Gagal menyimpan data", "error");
    },
  });

  // Handle form submission
  const onSubmit: SubmitHandler<WeightFormInput> = (data) => {
    const today = new Date().toISOString().split("T")[0];

    const apiBody: MutationBody = {
      weight_kg: Number(data.weight_kg),
      log_date: today,
    };

    mutation.mutate(apiBody);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex  gap-3 pb-4">
      <div className="flex-1 h-10">
        <input
          type="number"
          placeholder="Berat (kg)"
          {...register("weight_kg", {
            required: "Berat wajib diisi",
            min: { value: 1, message: "Berat minimal 1 kg" },
            valueAsNumber: true,
          })}
          className={`input-style border p-2 rounded-lg w-full dark:bg-gray-800 dark:border-gray-600 ${
            errors.weight_kg ? "border-red-500" : "border-gray-200"
          }`}
        />
        {errors.weight_kg && (
          <p className="error-message">{errors.weight_kg.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={mutation.isPending || isAlreadyLogged}
        className="bg-secondary text-white px-5 py-2 rounded-xl font-bold shadow-lg not-disabled:shadow-blue-500/30 w-[150px] disabled:bg-gray-400"
      >
        {mutation.isPending ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
}
