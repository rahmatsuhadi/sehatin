"use client";

import { useForm, Controller } from "react-hook-form";
import { Icon } from "./ui/icon";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { User } from "@/lib/types";
import { useUpdateProfile } from "@/service/auth";
import { customToast } from "@/lib/custom-toast";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface DataModalProps {
  onSave: (val: User) => void;
  onClose: () => void;
  open: boolean;
}

export default function DataModal({ open, onClose }: DataModalProps) {
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<User>({
    defaultValues: {
      current_weight_kg: undefined,
      height_cm: undefined,
      birth_date: "",
      gender: "male", // Default gender
      goal_type: "lose", // Default goal
    },
  });

  const goalInfo = {
    lose: "Defisit kalori aman untuk hasil jangka panjang.",
    gain: "Surplus kalori membantu menaikkan massa otot.",
    maintain: "Menjaga kalori seimbang untuk stabilitas tubuh.",
  };

  const { mutateAsync, isPending: loading } = useUpdateProfile();

  if (!open) return null;

  const save = async (data: User) => {
    const formattedBirthDate = new Date(data.birth_date)
      .toISOString()
      .split("T")[0];
    await mutateAsync(
      {
        credentials: {
          current_weight_kg: data.current_weight_kg,
          birth_date: formattedBirthDate,
          height_cm: data.height_cm,
          gender: data.gender,
          goal_type: data.goal_type,
        },
      },
      {
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["user"] });
          customToast("Profile data anda berhasil di tambahkan!.", "success");
        },
      }
    );
    onClose();
  };

  const goal = watch("goal_type");

  return (
    <div className="fixed inset-0 bg-black/70 z-90 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn pointer-events-auto">
      <div className="bg-white dark:bg-darkCard rounded-4xl w-full max-w-sm shadow-2xl overflow-hidden animate-scaleIn pointer-events-auto">
        {/* Header */}
        <div className="bg-linear-to-r from-primary to-green-400 p-6 text-white text-center">
          <h3 className="font-bold text-xl">Lengkapi Profil</h3>
          <p className="text-xs opacity-90">Agar target nutrisi akurat</p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Weight + Height */}
          <div className="grid grid-cols-2 gap-4 input-group">
            <div>
              <label className="text-xs font-bold text-gray-500">
                Berat (kg)
              </label>
              <Controller
                control={control}
                disabled={loading}
                name="current_weight_kg"
                rules={{
                  required: "Berat badan wajib diisi",
                  min: {
                    value: 1,
                    message: "Berat badan harus lebih besar dari 0",
                  },
                }}
                render={({ field }) => (
                  <input
                    type="number"
                    className="text-center input-field"
                    placeholder="50"
                    {...field}
                    value={field.value || ""}
                  />
                )}
              />
              {errors.current_weight_kg && (
                <p className="error-message">
                  {errors.current_weight_kg.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500">
                Tinggi (cm)
              </label>
              <Controller
                control={control}
                disabled={loading}
                name="height_cm"
                rules={{
                  required: "Tinggi badan wajib diisi",
                  min: {
                    value: 1,
                    message: "Tinggi badan harus lebih besar dari 0",
                  },
                }}
                render={({ field }) => (
                  <input
                    type="number"
                    className="text-center input-field"
                    placeholder="160"
                    {...field}
                    value={field.value || ""}
                  />
                )}
              />
              {errors.height_cm && (
                <p className="error-message">{errors.height_cm.message}</p>
              )}
            </div>
          </div>

          {/* Tanggal Lahir */}
          <div className="input-group">
            <label className="text-xs font-bold text-gray-500">
              Tanggal Lahir
            </label>
            <Controller
              control={control}
              disabled={loading}
              name="birth_date"
              rules={{
                required: "Tanggal Lahir wajib diisi",
                validate: (value) => {
                  const today = new Date().toISOString().split("T")[0];
                  if (value > today) {
                    return "Tanggal Lahir tidak boleh lebih dari hari ini";
                  }
                  return true; // validasi berhasil
                },
              }}
              render={({ field }) => (
                <input
                  type="date"
                  className="text-center input-field"
                  {...field}
                />
              )}
            />
            {errors.birth_date && (
              <p className="error-message">{errors.birth_date.message}</p>
            )}
          </div>

          {/* Goal */}
          <div className="input-group">
            <label className="text-xs font-bold text-gray-500">
              Target Kesehatan
            </label>
            <Controller
              control={control}
              disabled={loading}
              name="goal_type"
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full input-field not-disabled:cursor-pointer"
                >
                  <option value="lose">Turunkan Berat Badan</option>
                  <option value="gain">Naikkan Berat Badan</option>
                  <option value="maintain">Jaga Berat Badan</option>
                </select>
              )}
            />

            <div className="mt-2 p-3 bg-blue-50 dark:bg-slate-800 rounded-xl text-[10px] text-gray-600 dark:text-gray-300 border border-blue-100 dark:border-slate-700 flex items-start">
              <Icon
                className="text-blue-500 mr-1 text-sm"
                icon={faInfoCircle}
              />
              {goalInfo[goal]}
            </div>
          </div>

          {/* Gender Select */}
          <div className="flex gap-3">
            <button
              disabled={loading}
              type="button"
              onClick={() => setValue("gender", "male")}
              className={`flex-1 py-3 rounded-2xl border-2 font-bold text-sm transition not-disabled:cursor-pointer ${
                watch("gender") === "male"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-gray-300 dark:border-gray-600 text-gray-400"
              }`}
            >
              Pria
            </button>

            <button
              disabled={loading}
              type="button"
              onClick={() => setValue("gender", "female")}
              className={`flex-1 py-3 rounded-2xl border-2 font-bold text-sm transition  not-disabled:cursor-pointer ${
                watch("gender") === "female"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-gray-300 dark:border-gray-600 text-gray-400"
              }`}
            >
              Wanita
            </button>
          </div>

          {/* Save */}
          <button
            onClick={handleSubmit(save)}
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-4 rounded-xl mt-2 shadow-lg  disabled:bg-primary/60  not-disabled:active:scale-95 transition"
          >
            {loading ? (
              <Loader2 className="animate-spin mx-auto" />
            ) : (
              "SIMPAN & HITUNG"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
