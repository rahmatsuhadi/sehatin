"use client";

import { useState } from "react";

export default function OnboardingPage() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState("lose");

  const saveOnboarding = () => {
    const data = {
      name,
      age,
      height,
      weight,
      goal,
    };

    // Simpan ke localStorage / API secara mudah
    localStorage.setItem("userProfile", JSON.stringify(data));

    // Redirect ke dashboard
    window.location.href = "/profile";
  };

  return (
    <div className="min-h-screen  dark:bg-darkBg p-6 fade-in">
      <h1 className="text-3xl font-extrabold mb-3 text-gray-800 dark:text-white">
        Data Fisik Kamu
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
        Kami butuh ini agar bisa hitung nutrisi yang pas.
      </p>

      <div className="space-y-6">
        {/* Nama */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Nama
          </label>
          <input
            type="text"
            value={name}
            placeholder="Masukkan nama"
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full px-4 py-3 rounded-xl bg-white dark:bg-darkCard border border-gray-200 dark:border-gray-700 dark:text-white focus:ring-2 ring-primary outline-none"
          />
        </div>

        {/* Umur */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Umur
          </label>
          <input
            type="number"
            value={age}
            placeholder="Contoh: 22"
            onChange={(e) => setAge(e.target.value)}
            className="mt-1 w-full px-4 py-3 rounded-xl bg-white dark:bg-darkCard border border-gray-200 dark:border-gray-700 dark:text-white focus:ring-2 ring-primary outline-none"
          />
        </div>

        {/* Tinggi */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Tinggi Badan (cm)
          </label>
          <input
            type="number"
            value={height}
            placeholder="Misal: 170"
            onChange={(e) => setHeight(e.target.value)}
            className="mt-1 w-full px-4 py-3 rounded-xl bg-white dark:bg-darkCard border border-gray-200 dark:border-gray-700 dark:text-white focus:ring-2 ring-primary outline-none"
          />
        </div>

        {/* Berat */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Berat Badan (kg)
          </label>
          <input
            type="number"
            value={weight}
            placeholder="Contoh: 60"
            onChange={(e) => setWeight(e.target.value)}
            className="mt-1 w-full px-4 py-3 rounded-xl bg-white dark:bg-darkCard border border-gray-200 dark:border-gray-700 dark:text-white focus:ring-2 ring-primary outline-none"
          />
        </div>

        {/* Goal */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Tujuan Kamu
          </label>

          <div className="grid grid-cols-3 gap-3 mt-2">
            <button
              onClick={() => setGoal("lose")}
              className={`rounded-xl p-3 border text-sm font-semibold transition ${
                goal === "lose"
                  ? "bg-primary text-white shadow-lg"
                  : "bg-white dark:bg-darkCard border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
              }`}
            >
              Turun BB
            </button>

            <button
              onClick={() => setGoal("maintain")}
              className={`rounded-xl p-3 border text-sm font-semibold transition ${
                goal === "maintain"
                  ? "bg-primary text-white shadow-lg"
                  : "bg-white dark:bg-darkCard border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
              }`}
            >
              Stabil
            </button>

            <button
              onClick={() => setGoal("gain")}
              className={`rounded-xl p-3 border text-sm font-semibold transition ${
                goal === "gain"
                  ? "bg-primary text-white shadow-lg"
                  : "bg-white dark:bg-darkCard border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
              }`}
            >
              Naik BB
            </button>
          </div>
        </div>
      </div>

      {/* Tombol Simpan */}
      <button
        onClick={saveOnboarding}
        className="mt-10 w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-400/30 active:scale-95 transition"
      >
        Simpan & Lanjutkan
      </button>
    </div>
  );
}
