"use client";

import { useState } from "react";
import { Icon } from "./ui/icon";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

type GoalType = "lose" | "gain" | "maintain";

interface Nutrient {
  weight: string;
  height: string;
  age: string;
  gender: string;
  goal: GoalType;
}

interface DataModalProps {
  onSave: (val: Nutrient) => void;
  onClose: () => void;
  open: boolean;
}

export default function DataModal({ open, onClose, onSave }: DataModalProps) {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [goal, setGoal] = useState<"lose" | "gain" | "maintain">("lose");

  const goalInfo = {
    lose: "Defisit kalori aman untuk hasil jangka panjang.",
    gain: "Surplus kalori membantu menaikkan massa otot.",
    maintain: "Menjaga kalori seimbang untuk stabilitas tubuh.",
  };

  if (!open) return null;

  const save = () => {
    if (!weight || !height || !age || !gender) return;
    onSave({ weight, height, age, gender, goal });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-60 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn  pointer-events-none">
      <div className="bg-white dark:bg-darkCard rounded-[2rem] w-full max-w-sm shadow-2xl overflow-hidden animate-scaleIn  pointer-events-auto   ">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-green-400 p-6 text-white text-center">
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
              <input
                type="number"
                className="text-center input-field"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500">
                Tinggi (cm)
              </label>
              <input
                type="number"
                className="text-center input-field"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
          </div>

          {/* Age */}
          <div className="input-group">
            <label className="text-xs font-bold text-gray-500">Usia</label>
            <input
              type="number"
              className="text-center input-field"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          {/* Goal */}
          <div className="input-group">
            <label className="text-xs font-bold text-gray-500">
              Target Kesehatan
            </label>
            <select
              className="w-full input-field"
              value={goal}
              onChange={(e) => setGoal(e.target.value as GoalType)}
            >
              <option value="lose">Turunkan Berat Badan</option>
              <option value="gain">Naikkan Berat Badan</option>
              <option value="maintain">Jaga Berat Badan</option>
            </select>

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
              onClick={() => setGender("male")}
              className={`
                flex-1 py-3 rounded-2xl border-2 font-bold text-sm transition
                ${
                  gender === "male"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-gray-300 dark:border-gray-600 text-gray-400"
                }
              `}
            >
              Pria
            </button>

            <button
              onClick={() => setGender("female")}
              className={`
                flex-1 py-3 rounded-2xl border-2 font-bold text-sm transition
                ${
                  gender === "female"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-gray-300 dark:border-gray-600 text-gray-400"
                }
              `}
            >
              Wanita
            </button>
          </div>

          {/* Save */}
          <button
            onClick={save}
            className="w-full bg-primary text-white font-bold py-4 rounded-xl mt-2 shadow-lg active:scale-95 transition"
          >
            SIMPAN & HITUNG
          </button>
        </div>
      </div>
    </div>
  );
}
