import {
  faBreadSlice,
  faCheese,
  faDrumstickBite,
  faFire,
  faLeaf,
  faMagic,
  faMoneyBillWave,
  faTimes,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../ui/icon";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { customToast } from "@/lib/custom-toast";
import { apiClient } from "@/lib/api-client";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
import SaveMealModal from "../save-meals-modal";

interface RequestGenerateMenu {
  cooking_method: string;
  food_type: string;
  cuisine: string;
  budget_min: number;
  budget_max: number;
  max_calories_kcal: number;
  servings: number;
  diet_restrictions: string[];
}

interface Recipe {
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

interface ScanStatus {
  id: string;
  recipe_request: {
    status: "generated" | "pending" | "failed";
  };
  recipes?: Recipe[];
}

const useGenerateMenu = () =>
  useMutation({
    onError() {
      customToast("Terjadi kesalahan saat Membuat Menu", "error");
    },
    mutationFn: async ({ body }: { body: RequestGenerateMenu }) => {
      const response = await apiClient<{
        data: { recipe_request: { id: string } };
      }>(`/recipes/requests`, {
        method: "POST",
        body: JSON.stringify(body),
      });

      return response;
    },
  });

type BudgetLevel = "hemat" | "sedang" | "mahal";

// Mapping budget level ke angka

const budgetMap = {
  hemat: { min: 0, max: 25000 },
  sedang: { min: 25000, max: 50000 },
  mahal: { min: 50000, max: 100000 },
};

const useMenus = (recipeId: string) => {
  return useQuery<Recipe[], Error>({
    queryKey: ["menus", recipeId], // Kunci unik untuk query ini
    enabled: !!recipeId,
    queryFn: async () => {
      try {
        const api = await apiClient<{
          data: { recipes: Recipe[] };
          message: string;
        }>(`/recipes/requests/${recipeId}/result`); // Fungsi API yang dipanggil
        return api.data.recipes;
      } catch (error) {
        localStorage.removeItem("last_recipe_request_id");
        throw new Error("Gagal mengambil data menus.");
      }
    },
    refetchOnWindowFocus: false,
    retry: false, // Jangan coba ulang jika gagal (misal, karena belum login)
  });
};

export default function GenerateMenuModal({
  maxCalories,
}: {
  maxCalories: number;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipeId, setRecipeId] = useState<string | null>(null);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  // FORM STATES
  const [cookingMethod, setCookingMethod] = useState("steamed");
  const [foodType, setFoodType] = useState("chicken");
  const [cuisine, setCuisine] = useState("indonesian");
  const [servings, setServings] = useState("1");

  // Budget levels
  const [budgetLevel, setBudgetLevel] = useState<BudgetLevel>("sedang");

  // Diet restrictions
  const [dietRestrictions, setDietRestrictions] = useState<string[]>([]);

  const mutation = useGenerateMenu();

  const getRecipeFromStorage = () => {
    const storedId = localStorage.getItem("last_recipe_request_id");
    return storedId;
  };

  useEffect(() => {
    const lastId = getRecipeFromStorage();
    if (lastId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRecipeId(lastId);
    }
  }, [isModalOpen]);

  useEffect(() => {
    const anymodal = isModalOpen || isRecipeModalOpen || isSaveModalOpen;
    if (anymodal) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");

    return () => document.body.classList.remove("overflow-hidden");
  }, [isModalOpen, isRecipeModalOpen, isSaveModalOpen]);

  const handleSubmit = () => {
    const selectedBudget = budgetMap[budgetLevel];
    customToast("Menganalisis...", "loading", "generate-menu");

    const body: RequestGenerateMenu = {
      cooking_method: cookingMethod,
      food_type: foodType,
      cuisine,
      budget_min: selectedBudget.min,
      budget_max: selectedBudget.max,
      max_calories_kcal: maxCalories,
      servings: Number(servings), // fixed 1 porsi
      diet_restrictions: dietRestrictions,
    };

    mutation.mutate(
      { body },
      {
        onSuccess(res) {
          customToast("Resep berhasil dibuat!", "success", "generate-menu");
          setRecipeId(res.data.recipe_request.id);
          localStorage.setItem(
            "last_recipe_request_id",
            res.data.recipe_request.id as string
          );
          setIsModalOpen(false);
        },
        onError() {
          customToast(
            "Gagal membuat resep. Coba lagi nanti.",
            "error",
            "generate-menu"
          );
        },
      }
    );
  };

  const { data, isLoading: loadingMenus } = useMenus(recipeId as string);

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg text-gray-800 dark:text-white">
          Menu Hari Ini
        </h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-primary text-xs font-bold uppercase tracking-wide bg-primary/10 px-3 py-1 rounded-full hover:bg-primary hover:text-white transition flex items-center gap-1"
        >
          <Icon icon={faMagic} className="text-xs" />
          Buat Menu
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-darkCard rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl animate-bounce-in relative">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400"
              >
                <Icon icon={faTimes} className="text-xl" />
              </button>

              <div className="p-6 space-y-4">
                <h3 className="font-bold text-xl dark:text-white">
                  Kustomisasi Menu
                </h3>
                <p className="text-xs text-gray-500">
                  Bantu AI memilihkan resep yang cocok
                </p>

                {/* COOKING METHOD */}
                <div className="input-group">
                  <label className="text-xs font-bold text-gray-500 mb-1 block">
                    Lagi pengen makanan yang kek apa?
                  </label>
                  <select
                    className="w-full mt-1 p-2 rounded-lg border"
                    value={cookingMethod}
                    disabled={mutation.isPending}
                    onChange={(e) => setCookingMethod(e.target.value)}
                  >
                    <option value="steamed">Di Kukus</option>
                    <option value="fried">Di Goreng</option>
                    <option value="grilled">Di Bakar</option>
                  </select>
                </div>

                {/* FOOD TYPE */}
                <div className="input-group">
                  <label className="text-xs font-bold text-gray-500">
                    Bahannya mau yang apa?
                  </label>
                  <select
                    className="w-full mt-1 p-2 rounded-lg border"
                    value={foodType}
                    disabled={mutation.isPending}
                    onChange={(e) => setFoodType(e.target.value)}
                  >
                    <option value="chicken">Ayam</option>
                    <option value="fish">Ikan</option>
                    <option value="meat">Daging</option>
                    <option value="vegetables">Sayuran</option>
                  </select>
                </div>

                {/* CUISINE */}
                <div className="input-group">
                  <label className="text-xs font-bold text-gray-500">
                    Jenis Masakan nya
                  </label>
                  <select
                    className="w-full mt-1 p-2 rounded-lg border"
                    value={cuisine}
                    disabled={mutation.isPending}
                    onChange={(e) => setCuisine(e.target.value)}
                  >
                    <option value="indonesian">Indonesian</option>
                    <option value="chinese">Chinese</option>
                    <option value="italian">Italian</option>
                  </select>
                </div>

                {/* BUDGET - simple buttons */}
                <div>
                  <label className="text-xs font-bold text-gray-500">
                    Budget
                  </label>
                  <div className="flex gap-2 mt-2">
                    {[
                      { key: "hemat", label: "Hemat " },
                      { key: "sedang", label: "Sedang " },
                      { key: "mahal", label: "Mahal " },
                    ].map((b) => {
                      const active = budgetLevel === b.key;

                      return (
                        <button
                          key={b.key}
                          type="button"
                          disabled={mutation.isPending}
                          onClick={() => setBudgetLevel(b.key as BudgetLevel)}
                          className={`px-3 py-1 rounded-md  border transition ${
                            active
                              ? "bg-primary text-white border-primary"
                              : "border-gray-300 dark:border-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {b.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="input-group">
                  <label className="text-xs font-bold text-gray-500">
                    Berapa Porsi?
                  </label>
                  <input
                    type="number"
                    className="w-full mt-1 p-2 border rounded-lg"
                    value={servings}
                    disabled={mutation.isPending}
                    onChange={(e) => {
                      const val = e.target.value;
                      setServings(String(val));
                    }}
                  />
                  {Number(servings || "") < 1 && (
                    <p className="error-message mt-1">Jumlah porsi minimal 1</p>
                  )}
                </div>

                {/* DIET RESTRICTIONS */}
                {/* <div>
                <label className="text-xs font-bold text-gray-500">Diet</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["vegetarian", "vegan", "gluten-free", "non-dairy"].map(
                    (diet) => {
                      const active = dietRestrictions.includes(diet);

                      return (
                        <button
                          key={diet}
                          type="button"
                          onClick={() => toggleDiet(diet)}
                          className={`px-3 py-1 rounded-full text-xs border transition ${
                            active
                              ? "bg-blue-600 text-white border-blue-600"
                              : "border-gray-300 dark:border-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {diet}
                        </button>
                      );
                    }
                  )}
                </div>
              </div> */}

                {/* SUBMIT BUTTON */}
                <button
                  onClick={handleSubmit}
                  disabled={mutation.isPending}
                  className="w-full bg-gradient-to-r from-secondary to-blue-600 text-white font-bold py-3 rounded-xl mt-4 shadow-lg btn-press disabled:opacity-50"
                >
                  {mutation.isPending ? "Memproses..." : "GENERATE MENU"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div id="meal-plan-container" className="space-y-3">
        {loadingMenus ? (
          Array(2)
            .fill(null)
            .map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-darkCard p-3 rounded-2xl border border-gray-100 dark:border-gray-700 flex gap-3 items-center btn-press cursor-pointer"
              >
                <Skeleton className="h-14 w-14 " />
                <div className="flex-1 ml-3">
                  <Skeleton />
                  <Skeleton className="w-[20%] h-5 mt-1" />
                  <Skeleton className="w-[38%] h-3 mt-1" />
                </div>
              </div>
            ))
        ) : data ? (
          data?.map((r) => {
            const [first, last] = r.title.split(" ");
            return (
              <div
                key={r.id}
                onClick={() => {
                  setSelectedRecipe(r);
                  setIsRecipeModalOpen(true);
                }}
                className="bg-white dark:bg-darkCard p-3 rounded-2xl border border-gray-100 dark:border-gray-700 flex gap-3 items-center btn-press cursor-pointer"
              >
                <img
                  src={`https://placehold.co/600x400?text=${first}+${last}`}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-sm dark:text-white line-clamp-1">
                    {r.title}
                  </h4>
                  <p className="text-xs text-primary font-bold">
                    {r.calories_per_serving_kcal} kkal
                  </p>
                </div>
                <i className="fas fa-chevron-right text-gray-300"></i>
              </div>
            );
          })
        ) : (
          <div className="p-6 text-center text-gray-400 text-sm bg-white dark:bg-darkCard rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
            Belum ada rencana makan.
          </div>
        )}
      </div>

      {isRecipeModalOpen && selectedRecipe && (
        <div className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-darkCard rounded-3xl w-full max-w-md p-6 shadow-2xl relative animate-bounce-in  max-h-[90vh] overflow-y-auto ">
            {/* Close Button */}
            <button
              onClick={() => setIsRecipeModalOpen(false)}
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
                  <span>
                    {selectedRecipe.nutrition_json.protein_g}g Protein
                  </span>
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
                  <span>
                    {selectedRecipe.nutrition_json.fiber_g ?? 0}g Serat
                  </span>
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
            <h4 className="font-bold text-sm mb-2 dark:text-white">
              Cara Memasak
            </h4>
            <ol className="list-decimal ml-5 text-sm space-y-2 mb-4">
              {selectedRecipe.steps_json?.map((item, i: number) => (
                <li key={i}>{item.instruction}</li>
              ))}
            </ol>

            {/* Close Button */}
            <button
              onClick={() => setIsRecipeModalOpen(false)}
              className="w-full bg-primary text-white p-3 rounded-xl mt-2 font-bold hover:bg-primary/90 transition  hover:cursor-pointer"
            >
              Tutup
            </button>

            <button
              onClick={() => {
                setIsRecipeModalOpen(false);
                setIsSaveModalOpen(true);
              }}
              className="w-full bg-yellow-600 text-white p-3 rounded-xl mt-2 font-bold hover:bg-yellow-600/90 hover:cursor-pointer transition"
            >
              Jadiakan Menu Saat ini
            </button>
          </div>
        </div>
      )}
      {selectedRecipe && isSaveModalOpen && (
        <SaveMealModal
          isOpen={isSaveModalOpen}
          onClose={() => setIsSaveModalOpen(false)}
          recipeId={selectedRecipe.id}
          onSuccess={() => {
            localStorage.removeItem("last_recipe_request_id");
            setRecipeId(null);
            setSelectedRecipe(null);
            setIsSaveModalOpen(false);
            setIsModalOpen(false);
          }}
          defaultLabel={selectedRecipe.title}
          servings={selectedRecipe.servings}
        />
      )}
    </>
  );
}
