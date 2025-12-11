interface TabsStatNutritionProps {
  activeTab: "calorie" | "weight";
  setActiveTab: (tab: "calorie" | "weight") => void;
}

export default function TabsStatNutrition({
  activeTab,
  setActiveTab,
}: TabsStatNutritionProps) {
  return (
    <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-xl flex gap-1">
      <button
        id="stat-tab-cal"
        onClick={() => setActiveTab("calorie")}
        className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${
          activeTab === "calorie"
            ? "bg-white text-primary shadow-sm"
            : "text-gray-500"
        }`}
      >
        Kalori
      </button>

      <button
        id="stat-tab-wei"
        onClick={() => setActiveTab("weight")}
        className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${
          activeTab === "weight"
            ? "bg-white text-primary shadow-sm"
            : "text-gray-500"
        }`}
      >
        Berat Badan
      </button>
    </div>
  );
}
