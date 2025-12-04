import { toast } from "sonner";

export const customToast = (
  message: string,
  type: "success" | "error" | "info" = "success"
) => {
  const icon = {
    success: "fas fa-check",
    error: "fas fa-times",
    info: "fas fa-info",
  };

  const bgIcon = {
    success: "bg-green-100 text-primary",
    error: "bg-red-100 text-red-500",
    info: "bg-blue-100 text-blue-500",
  };

  toast.custom(
    () => (
      <div className="w-[90%] max-w-sm md:w-[320px] mx-auto">
        {" "}
        {/* ukuran konsisten */}
        <div className="glass-card shadow-2xl px-4 py-3 rounded-2xl flex items-center gap-3 border-l-4 border-primary">
          <div className={`${bgIcon[type]} p-2 rounded-full`}>
            <i className={icon[type]}></i>
          </div>

          <div>
            <h4 className="font-bold text-sm">Alvi Berkata:</h4>
            <p className="text-xs text-gray-500 dark:text-gray-300">
              {message}
            </p>
          </div>
        </div>
      </div>
    ),
    {
      duration: 3000,
      position: "top-center",
      className:
        "!pointer-events-auto !opacity-100 !translate-y-0 transition-all duration-300",
    }
  );
};
