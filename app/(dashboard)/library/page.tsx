"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Icon } from "@/components/ui/icon";
import {
  faArrowRight,
  faBookmark,
  faBreadSlice,
  faCheese,
  faChevronLeft,
  faChevronRight,
  faDrumstickBite,
  faFire,
  faLeaf,
  faMoneyBillWave,
  faRightLeft,
  faTimes,
  faUtensils,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import SaveMealModal from "@/components/save-meals-modal";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// =======================================================
// INTERFACES
// =======================================================

interface RecipeItem {
  id: string;
  title: string;
  description: string;
  calories_per_serving_kcal: number;
  cooking_method: string;
  servings: number;
  estimated_cost_min: number;
  estimated_cost_max: number;
  nutrition_json: {
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    fiber_g: number;
  };
  ingredients_json: {
    name: string;
    amount: string;
    notes: string;
  }[];
  steps_json: {
    step: number;
    instruction: string;
  }[];
}

const dummyArticles: ArticleItem[] = [
  {
    id: "sport-1",
    title: "Latihan Kardio 20 Menit",
    description:
      "Latihan ringan untuk membakar lemak dan meningkatkan stamina.",
    category: "olahraga",
    image:
      "https://d1vbn70lmn1nqe.cloudfront.net/prod/wp-content/uploads/2021/06/15012412/kesehatan-olahraga.jpg.webp",
  },
  {
    id: "sport-2",
    title: "Stretching Pagi Hari",
    description: "Membantu tubuh lebih fleksibel dan mengurangi cedera.",
    category: "olahraga",
    image:
      "https://www.neorheumacyl.com/public/files/Yuk-Praktikkan-10-Menit-Gerakan-Stretching-Di-Pagi-Hari.jpg",
  },
  {
    id: "health-1",
    title: "Manfaat Tidur Cukup",
    description: "Tidur berkualitas membantu metabolisme dan fokus.",
    category: "kesehatan",
    image:
      "https://d1vbn70lmn1nqe.cloudfront.net/prod/wp-content/uploads/2021/10/25025409/manfaat-istirahat-yang-cukup-dan-cara-memperolehnya-halodoc.jpg",
  },
  {
    id: "health-2",
    title: "Minum Air yang Cukup",
    description: "Menjaga hidrasi penting untuk fungsi organ tubuh.",
    category: "kesehatan",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTs9Ii6ieinLXJDEtOfLXhiBYkFoViS337l3g&s",
  },
  {
    id: "food-1",
    title: "Salad Sayur Rendah Kalori",
    description: "Pilihan makanan sehat untuk diet dan pencernaan.",
    category: "makanan_sehat",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvq8gI9i1hz6NXP70ZW3jzIYWCyXOo3Agt7Q&s",
  },
  {
    id: "food-2",
    title: "Menu Sarapan Tinggi Protein",
    description: "Membantu kenyang lebih lama dan menjaga energi.",
    category: "makanan_sehat",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5e2pqwjakw5IvjYLc39tmYxZXIoc1f3OfGw&s",
  },
];

interface Pagination {
  current_page: number;
  total_pages: number;
  total_items: number;
}

interface ArticleItem {
  id: string;
  title: string;
  description: string;
  category: "olahraga" | "kesehatan" | "makanan_sehat";
  image: string;
}

interface RecipeResponse {
  items: RecipeItem[];
  pagination: Pagination;
}

// =======================================================
// TABS
// =======================================================
interface Tab {
  key: string;
  label: string;
  icon?: IconDefinition;
}

const tabs: Tab[] = [
  { key: "all", label: "Resep" },
  // { key: "saved", label: "Disimpan", icon: faBookmark },
  { key: "olahraga", label: "Olahraga" },
  { key: "kesehatan", label: "Kesehatan" },
  { key: "makanan_sehat", label: "Makanan Sehat" },
];

export default function LibraryPage() {
  const [active, setActive] = useState<Tab["key"]>("all");
  const [page, setPage] = useState(1);
  const limit = 6;
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeItem | null>(null);
  const [isDetailModal, setIsDetailModal] = useState<boolean>(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);

  // Fetch recipes dari API
  const { data, isLoading, refetch } = useQuery<RecipeResponse>({
    queryKey: ["recipes", page, limit],
    enabled: active == "active",
    queryFn: async () => {
      const res = await apiClient<{ data: RecipeResponse }>(
        `/recipes?limit=${limit}&page=${page}`
      );
      return res.data;
    },
  });

  const items = data?.items || [];

  const pagination = data?.pagination || {
    current_page: 1,
    total_items: 1,
    total_pages: 1,
  };

  useEffect(() => {
    refetch();
  }, [page, refetch]);

  const handleItemClick = (val: RecipeItem) => {
    setIsDetailModal(true);
    setSelectedRecipe(val);
    // Bisa redirect ke halaman detail recipe
  };

  const filteredArticles =
    active === "olahraga"
      ? dummyArticles.filter((a) => a.category === "olahraga")
      : active === "kesehatan"
      ? dummyArticles.filter((a) => a.category === "kesehatan")
      : active === "makanan_sehat"
      ? dummyArticles.filter((a) => a.category === "makanan_sehat")
      : [];

  return (
    <div className="page-section fade-in pb-24 px-5 mt-3 pb-28">
      {/* Header */}
      <div className=" dark:bg-darkBg pb-4 pt-2 w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          Pustaka
        </h2>

        {/* Tabs */}
        <div className="relative -mx-5 w-[400px] md:w-[500px]">
          <div
            className="
      flex gap-2
      overflow-x-auto
      overflow-y-hidden
      flex-nowrap
      px-5
      hide-scroll
      scroll-smooth
      touch-pan-x
    "
          >
            {tabs.map((t) => {
              const selected = active === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActive(t.key)}
                  className={`
            px-5 py-2 rounded-full font-semibold text-sm
            whitespace-nowrap shrink-0
            transition
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
      </div>

      {/* Content */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
        {/* TAB RESEP */}
        {active === "all" && (
          <>
            {isLoading &&
              Array(4)
                .fill(null)
                .map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-darkCard rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700"
                  >
                    <div className="h-32 bg-gray-200 relative">
                      <Skeleton className="w-full h-full" />
                    </div>
                    <div className="p-3">
                      <Skeleton className="w-[60%] h-3 mb-2" />
                      <Skeleton className="w-full h-2" />
                      <Skeleton className="w-[40%] h-2 mt-1" />
                    </div>
                  </div>
                ))}

            {!isLoading && items.length === 0 && (
              <div className="col-span-full text-center text-gray-400 py-10">
                Tidak ada resep tersedia.
              </div>
            )}

            {!isLoading &&
              items.map((item) => {
                const [first, last] = item.title.split(" ");
                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className="bg-white dark:bg-darkCard rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer"
                  >
                    <div className="h-32 relative">
                      <img
                        src={
                          item.title == "Ayam Bakar Madu"
                            ? "https://buckets.sasa.co.id/v1/AUTH_Assets/Assets/p/website/medias/page_medias/Screen_Shot_2023-01-09_at_17_40_36_(1)_(1)_(1)_(1)_(1)_(1)_(1)_(1).png"
                            : `https://placehold.co/600x400?text=${first}+${last}`
                        }
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-lg">
                        Resep
                      </span>
                    </div>
                    <div className="p-3">
                      <h4 className="font-bold text-xs line-clamp-2 dark:text-white">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-1">
                        Kalori: {item.calories_per_serving_kcal} kcal
                      </p>
                    </div>
                  </div>
                );
              })}
          </>
        )}

        {/* TAB ARTIKEL */}
        {(active === "olahraga" || active === "kesehatan" || "makanan_sehat") &&
          filteredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white dark:bg-darkCard rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="h-32 relative">
                <img
                  src={article.image}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-lg">
                  {article.category === "olahraga"
                    ? "Olahraga"
                    : article.category === "kesehatan"
                    ? "Kesehatan"
                    : "Makanan Sehat"}
                </span>
              </div>
              <div className="p-3">
                <h4 className="font-bold text-xs line-clamp-2 dark:text-white">
                  {article.title}
                </h4>
                <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">
                  {article.description}
                </p>
              </div>
            </div>
          ))}
      </div>

      {/* Pagination */}
      {active == "all" && pagination.total_pages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          {/* Prev */}
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="
      w-10 h-10 flex items-center justify-center
      rounded-xl border
      bg-white dark:bg-darkCard
      border-gray-200 dark:border-gray-700
      text-gray-600 dark:text-gray-300
      disabled:opacity-40 disabled:cursor-not-allowed
      hover:bg-gray-100 dark:hover:bg-slate-700
      transition
    "
            aria-label="Previous page"
          >
            <Icon icon={faChevronLeft} />
          </button>

          {/* Page Info */}
          <div
            className="
      px-4 py-2 rounded-xl
      bg-gray-100 dark:bg-slate-700
      text-sm font-semibold
      text-gray-700 dark:text-gray-200
      min-w-[90px] text-center
    "
          >
            {page} / {pagination.total_pages}
          </div>

          {/* Next */}
          <button
            onClick={() =>
              setPage((p) => Math.min(p + 1, pagination.total_pages))
            }
            disabled={page === pagination.total_pages}
            className="
      w-10 h-10 flex items-center justify-center
      rounded-xl border
      bg-white dark:bg-darkCard
      border-gray-200 dark:border-gray-700
      text-gray-600 dark:text-gray-300
      disabled:opacity-40 disabled:cursor-not-allowed
      hover:bg-gray-100 dark:hover:bg-slate-700
      transition
    "
            aria-label="Next page"
          >
            <Icon icon={faChevronRight} />
          </button>
        </div>
      )}

      {(active === "olahraga" ||
        active === "kesehatan" ||
        active === "makanan_sehat") &&
        filteredArticles.length === 0 && (
          <div className="col-span-full text-center text-gray-400 py-10">
            Belum ada artikel tersedia.
          </div>
        )}
      {selectedRecipe && isDetailModal && (
        <ModalDetailMenu
          onSave={() => {
            setIsDetailModal(false);
            setIsSaveModalOpen(true);
          }}
          isOpen={isDetailModal}
          selectedRecipe={selectedRecipe}
          onClose={() => {
            setIsDetailModal(false);
            setSelectedRecipe(null);
          }}
        />
      )}

      {selectedRecipe && (
        <SaveMealModal
          isOpen={isSaveModalOpen}
          onClose={() => setIsSaveModalOpen(false)}
          recipeId={selectedRecipe.id}
          onSuccess={() => {
            setSelectedRecipe(null);
            setIsSaveModalOpen(false);
          }}
          defaultLabel={selectedRecipe.title}
          servings={selectedRecipe.servings}
        />
      )}
    </div>
  );
}

const ModalDetailMenu = ({
  selectedRecipe,
  onClose,
  onSave,
  isOpen,
}: {
  isOpen: boolean;
  selectedRecipe: RecipeItem;
  onClose: () => void;
  onSave: () => void;
}) => {
  return (
    <div className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-darkCard rounded-3xl w-full max-w-md p-6 shadow-2xl relative animate-bounce-in  max-h-[90vh] overflow-y-auto ">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400"
        >
          <Icon icon={faTimes} className="text-xl" />
        </button>

        {/* Title */}
        <h3 className="text-2xl font-bold mb-2 dark:text-white">
          {selectedRecipe.title}
        </h3>

        <Image
          width={500}
          height={200}
          alt="ilustrasi"
          src={"/images/resep-illustrasi.jpg"}
          className="w-full object-cover rounded-xl mb-4"
        />

        <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400 mb-4">
          {/* Cost */}
          <span className="flex items-center gap-1">
            <Icon icon={faMoneyBillWave} className="text-[11px]" />
            Rp{" "}
            {new Intl.NumberFormat("id-ID").format(
              selectedRecipe.estimated_cost_min
            )}
            {" - "}
            Rp{" "}
            {new Intl.NumberFormat("id-ID").format(
              selectedRecipe.estimated_cost_max
            )}
          </span>

          {/* Calories */}
          <span className="flex items-center gap-1">
            <Icon icon={faFire} className="text-[11px]" />
            {selectedRecipe.calories_per_serving_kcal ?? 0} kcal
          </span>

          {/* Serving */}
          <span className="flex items-center gap-1">
            <Icon icon={faUtensils} className="text-[11px]" />
            {selectedRecipe.servings} porsi
          </span>
        </div>

        <div className="bg-gray-100 rounded-xl p-4 mb-4 text-sm">
          <h3 className="font-semibold mb-2">Nutrisi Per Porsi:</h3>

          <div className="grid grid-cols-2 gap-3 text-gray-700">
            {/* Protein */}
            <div className="flex items-center gap-2">
              <Icon icon={faDrumstickBite} className="text-red-600" />
              <span>{selectedRecipe.nutrition_json.protein_g}g Protein</span>
            </div>

            {/* Carbs */}
            <div className="flex items-center gap-2">
              <Icon icon={faBreadSlice} className="text-orange-500" />
              <span>{selectedRecipe.nutrition_json.carbs_g}g Karbo</span>
            </div>

            {/* Fat */}
            <div className="flex items-center gap-2">
              <Icon icon={faCheese} className="text-yellow-500" />
              <span>{selectedRecipe.nutrition_json.fat_g}g Lemak</span>
            </div>

            {/* Fiber */}
            <div className="flex items-center gap-2">
              <Icon icon={faLeaf} className="text-green-600" />
              <span>{selectedRecipe.nutrition_json.fiber_g ?? 0}g Serat</span>
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <h4 className="font-bold text-sm mb-2 dark:text-white">
          Bahan - Bahan
        </h4>
        <ul className="list-disc ml-5 text-sm space-y-1 mb-4">
          {selectedRecipe.ingredients_json?.map((item, i) => (
            <li key={i}>
              <p>
                {item.name} ({item.amount})
              </p>
              <span className="text-xs text-gray-600">{item.notes}</span>
            </li>
          ))}
        </ul>

        {/* Steps */}
        <h4 className="font-bold text-sm mb-2 dark:text-white">Cara Memasak</h4>
        <ol className="list-decimal ml-5 text-sm space-y-2 mb-4">
          {selectedRecipe.steps_json?.map((item, i: number) => (
            <li key={i}>{item.instruction}</li>
          ))}
        </ol>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-primary text-white p-3 rounded-xl mt-2 font-bold hover:bg-primary/90 transition  hover:cursor-pointer"
        >
          Tutup
        </button>

        <button
          onClick={() => {
            onSave();
          }}
          className="w-full bg-yellow-600 text-white p-3 rounded-xl mt-2 font-bold hover:bg-yellow-600/90 hover:cursor-pointer transition"
        >
          Jadiakan Menu Saat ini
        </button>
      </div>
    </div>
  );
};
