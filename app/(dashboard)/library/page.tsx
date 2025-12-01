"use client";

import { useEffect, useState, useCallback } from "react";
import { Icon } from "@/components/ui/icon";
import { faBookmark, IconDefinition } from "@fortawesome/free-solid-svg-icons";

// =======================================================
// DEFINISI TIPE DATA (INTERFACES)
// =======================================================

/** Tipe untuk setiap item konten (Resep atau Artikel) */
interface ContentItem {
  title: string;
  type: "Resep" | "Artikel";
  img: string; // URL gambar
}

/** Tipe untuk struktur App State */
interface AppState {
  user: {
    goal: "lose" | "gain" | "maintain";
  };
  savedRecipes: ContentItem[];
}

/** Tipe untuk struktur Content Database */
interface ContentDB {
  recipes: Record<AppState["user"]["goal"], ContentItem[]>;
  articles: Record<AppState["user"]["goal"], ContentItem[]>;
}

/** Tipe untuk tab navigasi */
interface Tab {
  key: "all" | "recipe" | "article" | "saved";
  label: string;
  icon?: IconDefinition;
}

// =======================================================
// MOCK DATA (Data tiruan agar komponen tidak error)
// =======================================================

const MOCK_APP_STATE: AppState = {
  user: {
    goal: "maintain",
  },
  savedRecipes: [
    {
      title: "Nasi Goreng Sehat Protein Tinggi",
      type: "Resep",
      img: "/images/mock-img-1.jpg",
    },
    {
      title: "Resep Sayur Bayam Kuah Bening",
      type: "Resep",
      img: "/images/mock-img-8.jpg",
    },
  ],
};

const MOCK_CONTENT_DB: ContentDB = {
  recipes: {
    lose: [
      {
        title: "Salad Ayam Rendah Kalori",
        type: "Resep",
        img: "/images/mock-img-2.jpg",
      },
    ],
    maintain: [
      {
        title: "Smoothie Pisang Protein",
        type: "Resep",
        img: "/images/mock-img-3.jpg",
      },
    ],
    gain: [
      {
        title: "Pasta Daging Tinggi Kalori",
        type: "Resep",
        img: "/images/mock-img-4.jpg",
      },
    ],
  },
  articles: {
    lose: [
      {
        title: "5 Latihan Bakar Lemak Cepat",
        type: "Artikel",
        img: "/images/mock-img-5.jpg",
      },
    ],
    maintain: [
      {
        title: "Pentingnya Tidur untuk Kebugaran",
        type: "Artikel",
        img: "/images/mock-img-6.jpg",
      },
    ],
    gain: [
      {
        title: "Cara Membentuk Otot Lengan",
        type: "Artikel",
        img: "/images/mock-img-7.jpg",
      },
    ],
  },
};

const tabs: Tab[] = [
  //   { key: "all", label: "Untukmu" },
  { key: "recipe", label: "Resep" },
  { key: "article", label: "Olahraga" },
  { key: "saved", label: "Disimpan", icon: faBookmark },
];

export default function LibraryPage() {
  // Gunakan tipe string untuk active key, tapi sesuaikan dengan tipe yang mungkin
  const [active, setActive] = useState<Tab["key"]>("all");

  // Gunakan ContentItem[]
  const [items, setItems] = useState<ContentItem[]>([]);

  // Mengakses Mock Data (gunakan tipe yang sudah didefinisikan)
  const appState: AppState = MOCK_APP_STATE;
  const contentDB: ContentDB = MOCK_CONTENT_DB;
  const { user, savedRecipes } = appState;
  const { recipes, articles } = contentDB;

  // Logika Render Library (Gunakan tipe data yang spesifik untuk 'filter' dan hasil)
  const renderLibrary = useCallback(
    (filter: Tab["key"]) => {
      let result: ContentItem[] = [];
      const goal = user.goal || "maintain";

      // Untuk "all"
      if (filter === "all") {
        const allContent: ContentItem[] = [
          ...(recipes[goal] || []),
          ...(articles[goal] || []),
        ];
        setItems(allContent);
        return;
      }

      // Untuk "recipe"
      if (filter === "recipe") {
        result = [...(recipes[goal] || [])];
      }

      // Untuk "article"
      if (filter === "article") {
        result = [...(articles[goal] || [])];
      }

      // Untuk "saved"
      if (filter === "saved") {
        result = savedRecipes || [];
      }

      setItems(result);
    },
    [user.goal, recipes, articles, savedRecipes]
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    renderLibrary(active);
  }, [active, renderLibrary]);

  const handleItemClick = (title: string) => {
    console.log(`Item clicked: ${title}`);
    // Aksi navigasi sebenarnya
  };

  return (
    <div className="page-section fade-in pb-24">
      {/* Sticky Header */}
      <div className="sticky top-20 z-30 bg-white dark:bg-darkBg pb-4 pt-2 overflow-hidden">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          Pustaka Pintar
        </h2>

        {/* Tabs */}
        <div
          className="
    flex gap-2 
    overflow-x-auto flex-nowrap hide-scroll
    w-full max-w-full
    whitespace-nowrap
    scroll-smooth
  "
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {tabs.map((t) => {
            const selected = active === t.key;

            return (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                className={`
          px-5 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition
          ${
            selected
              ? "bg-primary text-white shadow-lg shadow-green-500/30"
              : "bg-white dark:bg-darkCard border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
          }
        `}
              >
                {t.icon && (
                  <Icon
                    icon={t.icon}
                    className={`mr-1 ${
                      selected ? "text-white" : "text-secondary"
                    }`}
                  />
                )}
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div
        id="library-content"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2"
      >
        {/* State Kosong */}
        {items.length === 0 && (
          <div className="col-span-full text-gray-400 dark:text-gray-500 text-center py-10">
            Tidak ada konten tersedia.
          </div>
        )}

        {/* Mapping Item */}
        {items.map((item, idx) => (
          <div
            key={idx}
            onClick={() => handleItemClick(item.title)}
            className="bg-white dark:bg-darkCard rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer active:scale-[0.97] transition"
          >
            {/* Image Component Sederhana (tag <img>) */}
            <div className="h-32 bg-gray-200 relative">
              <img
                src={item.img || "/images/placeholder.jpg"}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-lg backdrop-blur">
                {item.type || "Konten"}
              </span>
            </div>

            {/* Title */}
            <div className="p-3">
              <h4 className="font-bold text-xs dark:text-white line-clamp-2">
                {item.title}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
