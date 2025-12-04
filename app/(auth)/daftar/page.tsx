import RegisterForm from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div
      className="
        fixed inset-0 bg-white dark:bg-darkBg flex flex-col 
        items-center justify-center p-6 auth-bg z-[100]
      "
    >
      <div
        className="
          w-full max-w-sm bg-white/90 dark:bg-darkCard/90 backdrop-blur-xl 
          p-8 rounded-[2.5rem] shadow-2xl border border-white/50 
          dark:border-gray-700 relative overflow-hidden animate-fadeIn
        "
      >
        {/* Background Decoration Icon */}
        <div className="absolute -top-6 -right-6 text-[8rem] opacity-10 rotate-12">
          🥑
        </div>

        {/* Header */}
        <div className="text-center mb-6 relative z-10">
          <div className="text-4xl animate-float mb-2">🥑</div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Sehatin<span className="text-primary">.</span>
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Digital Nutrition Platform
          </p>
        </div>

        {/* Register Form */}
        <RegisterForm />
      </div>
    </div>
  );
}
