"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function ScanResultPage() {
  const img =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9eA750ToXsXF9xzZr4cnCbLaNui6Q_55IdA&s";

  // sample AI result
  const [foodName, setFoodName] = useState("Masakan Padang");

  const [items, setItems] = useState([
    { id: 1, name: "Nasi Putih", p: 2, c: 40, f: 1, cal: 180 },
    { id: 2, name: "Ayam Gulai", p: 12, c: 4, f: 10, cal: 150 },
    { id: 3, name: "Sayur Daun Singkong", p: 3, c: 3, f: 2, cal: 50 },
    { id: 4, name: "Kuah Gulai", p: 1, c: 1, f: 3, cal: 30 },
  ]);

  // total calculated
  const total = items.reduce(
    (acc, i) => ({
      p: acc.p + i.p,
      c: acc.c + i.c,
      f: acc.f + i.f,
      cal: acc.cal + i.cal,
    }),
    { p: 0, c: 0, f: 0, cal: 0 }
  );

  // add new item
  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now(), name: "Item Baru", p: 0, c: 0, f: 0, cal: 0 },
    ]);
  };

  const updateItem = (id: number, field: string, value: unknown) => {
    setItems(
      items.map((i) =>
        i.id === id
          ? { ...i, [field]: field === "name" ? value : Number(value) }
          : i
      )
    );
  };

  const removeItem = (id: number) => {
    setItems(items.filter((i) => i.id !== id));
  };

  // Radar Chart
  const chartData = {
    labels: ["Protein", "Karbo", "Lemak", "Serat", "Vitamin"],
    datasets: [
      {
        label: "Komposisi Makanan",
        data: [total.p, total.c, total.f, 5, 4], // dummy serat & vitamin
        backgroundColor: "rgba(0, 200, 0, 0.2)",
        borderColor: "rgb(0, 200, 0)",
        borderWidth: 2,
        pointBackgroundColor: "rgb(0, 200, 0)",
      },
    ],
  };

  return (
    <div className="pb-24 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-xl dark:text-white">Laporan Nutrisi</h3>
        <div className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 text-xs font-bold border border-gray-300">
          Grade: <span className="text-green-600">A-</span>
        </div>
      </div>

      {/* Image Preview */}
      {img && (
        <div className="rounded-2xl overflow-hidden shadow-lg mb-5">
          <img
            src={img}
            alt="Food"
            width={400}
            height={400}
            className="w-full h-auto"
          />
        </div>
      )}

      {/* Food name */}
      <input
        value={foodName}
        onChange={(e) => setFoodName(e.target.value)}
        className="w-full text-xl font-bold mb-4 bg-transparent dark:text-white p-2 border-b dark:border-gray-600"
      />

      {/* LIST ITEM MAKAN */}
      <h2 className="text-lg font-semibold mb-3 dark:text-white">
        Komponen Makanan
      </h2>

      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-darkCard p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition"
          >
            {/* Top Row */}
            <div className="flex justify-between items-start mb-4">
              <input
                value={item.name}
                onChange={(e) => updateItem(item.id, "name", e.target.value)}
                className="font-semibold bg-transparent text-lg flex-1 dark:text-white focus:outline-none"
                placeholder="Nama makanan..."
              />

              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 text-xs font-semibold px-2 py-1 rounded hover:bg-red-100/30 dark:hover:bg-red-500/10 transition"
              >
                Hapus
              </button>
            </div>

            {/* Nutrient Inputs */}
            <div className="grid grid-cols-4 gap-3 text-sm">
              {/* Protein */}
              <div>
                <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 rounded-full">
                    P
                  </span>
                  <span className="block text-[10px] opacity-70 mt-0.5">
                    Protein
                  </span>
                </p>

                <input
                  type="number"
                  value={item.p}
                  onChange={(e) => updateItem(item.id, "p", e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              {/* Carbs */}
              <div>
                <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">
                  <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-300 rounded-full">
                    C
                  </span>
                  <span className="block text-[10px] opacity-70 mt-0.5">
                    Karbo
                  </span>
                </p>

                <input
                  type="number"
                  value={item.c}
                  onChange={(e) => updateItem(item.id, "c", e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              {/* Fat */}
              <div>
                <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">
                  <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 rounded-full">
                    F
                  </span>
                  <span className="block text-[10px] opacity-70 mt-0.5">
                    Lemak
                  </span>
                </p>

                <input
                  type="number"
                  value={item.f}
                  onChange={(e) => updateItem(item.id, "f", e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              {/* Calories */}
              <div>
                <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">
                  <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-300 rounded-full">
                    Kal
                  </span>
                  <span className="block text-[10px] opacity-70 mt-0.5">
                    Kalori
                  </span>
                </p>

                <input
                  type="number"
                  value={item.cal}
                  onChange={(e) => updateItem(item.id, "cal", e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Item Button */}
      <button
        onClick={addItem}
        className="w-full py-3 bg-primary/10 text-primary dark:text-primaryDark rounded-xl mb-6 font-semibold hover:bg-primary hover:text-white transition shadow-sm"
      >
        + Tambah Item
      </button>

      {/* Total Summary */}
      <div className="bg-white dark:bg-darkCard p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="font-bold mb-3 text-lg dark:text-white">
          Total Nutrisi
        </h3>

        <div className="text-sm dark:text-gray-300 space-y-1">
          <p>
            Protein: <span className="font-semibold">{total.p}g</span>
          </p>
          <p>
            Karbo: <span className="font-semibold">{total.c}g</span>
          </p>
          <p>
            Lemak: <span className="font-semibold">{total.f}g</span>
          </p>
        </div>

        <p className="font-extrabold text-xl mt-3 dark:text-white">
          {total.cal} kkal
        </p>
      </div>

      {/* Radar Chart */}
      <div className="bg-white dark:bg-darkCard p-5 rounded-2xl shadow border mb-6">
        <Radar
          data={chartData}
          options={{
            elements: { line: { borderWidth: 3 } },
            scales: {
              r: { ticks: { display: false }, grid: { color: "#e5e5e5" } },
            },
          }}
        />
      </div>

      {/* Insight AI */}
      <div className="bg-white dark:bg-darkCard p-5 rounded-xl shadow border mb-6">
        <p className="font-bold flex items-center gap-2 dark:text-white">
          🥑 Saran Alvi:
        </p>
        <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
          Nutrisimu sudah cukup seimbang! Kurangi lemak agar lebih optimal.
        </p>
      </div>

      {/* Fakta unik */}
      <div className="bg-white dark:bg-darkCard p-5 rounded-xl shadow border mb-6">
        <h3 className="font-semibold mb-2 dark:text-white">Fakta Unik</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Masakan Padang terkenal memiliki kalori tinggi karena santan dan
          bumbunya yang kaya rempah.
        </p>
      </div>

      {/* Save button */}
      <button className="w-full bg-primary text-white py-4 rounded-2xl text-lg font-bold shadow-lg shadow-green-500/40 active:scale-95 transition">
        Simpan ke Jurnal
      </button>
    </div>
  );
}
