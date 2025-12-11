"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { customToast } from "@/lib/custom-toast";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "./ui/icon";

interface SaveMealModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export default function SaveMealModal({
  isOpen,
  onClose,
  recipeId,
  defaultLabel = "",
  servings = 1,
}: SaveMealModalProps) {
  const [mealType, setMealType] = useState("lunch");
  const [label, setLabel] = useState(defaultLabel);
  const [eatenAt, setEatenAt] = useState("");
  const [servingsMade, setServingsMade] = useState(servings);
  const [notes, setNotes] = useState("");

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMealType(getAutoMealType());
      setEatenAt(getDateTimeLocalNow());
    }
  }, [isOpen]);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");

    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  const mutation = useMutation({
    mutationFn: async () => {
      const body = {
        meal_type: mealType,
        label,
        eaten_at: eatenAt,
        servings_made: servingsMade,
        notes,
      };

      return apiClient(`/recipes/${recipeId}/add-to-meal`, {
        method: "POST",
        body: JSON.stringify(body),
      });
    },
    onSuccess() {
      customToast("Berhasil disimpan ke catatan makan!", "success");
      onClose();
    },
    onError() {
      customToast("Gagal menyimpan data.", "error");
    },
  });

  const handleSave = () => {
    if (!eatenAt) {
      customToast("Tanggal & waktu makan harus diisi", "error");
      return;
    }
    mutation.mutate();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-darkCard rounded-[2rem] w-full max-w-sm shadow-2xl relative animate-bounce-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400"
        >
          <Icon icon={faTimes} className="text-xl" />
        </button>
        <div className="p-6 space-y-4">
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
              disabled={mutation.isPending}
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="w-full mt-1 p-2 rounded-lg border"
            >
              <option value="breakfast">Sarapan</option>
              <option value="lunch">Makan Siang</option>
              <option value="dinner">Makan Malam</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          {/* Label */}
          <div className="mb-3 input-group">
            <label className="text-xs font-bold text-gray-500">Nama Menu</label>
            <input
              disabled={mutation.isPending}
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </div>

          {/* Eaten At */}
          <div className="mb-3 input-group">
            <label className="text-xs font-bold text-gray-500">
              Waktu Makan
            </label>
            <input
              disabled={mutation.isPending}
              type="datetime-local"
              value={eatenAt}
              onChange={(e) => setEatenAt(e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </div>

          {/* Servings */}
          {/* <div className="mb-3 input-group">
            <label className="text-xs font-bold text-gray-500">
              Jumlah Porsi
            </label>
            <input
              type="number"
              min={1}
              value={servingsMade}
              onChange={(e) => setServingsMade(parseInt(e.target.value))}
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </div> */}

          {/* Notes */}
          <div className="mb-4 input-group">
            <label className="text-xs font-bold text-gray-500">Catatan</label>
            <textarea
              disabled={mutation.isPending}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg min-h-20"
              placeholder="Opsional (misal: tambah sambal, kurang asin, dsb)"
            ></textarea>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={mutation.isPending}
            className="w-full bg-primary text-white font-bold py-3 rounded-xl shadow-lg btn-press disabled:opacity-50  hover:cursor-pointer"
          >
            {mutation.isPending ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
