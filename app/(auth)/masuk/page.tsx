import Link from "next/link";

export default function MasukPage() {
  return (
    <div className="fixed inset-0 z-100 auth-bg bg-white dark:bg-darkBg flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white/90 dark:bg-darkCard/90 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white/50 dark:border-gray-700 fade-in relative overflow-hidden">
        <div className="absolute -top-6 -right-6 text-[8rem] opacity-10 rotate-12">
          🥑
        </div>
        <div className="text-center mb-6 relative z-10">
          <div className="mascot-avatar animate-float mb-2">🥑</div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Sehatin<span className="text-primary">.</span>
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Digital Nutrition Platform
          </p>
        </div>
        <div className="space-y-4 input-group">
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 ml-1">
              Email
            </label>
            <input type="email" id="login-email" placeholder="nama@email.com" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 ml-1">
              Password
            </label>
            <input
              type="password"
              id="login-pass"
              placeholder="Password akun"
            />
          </div>
          <button
            //   onclick="handleLogin()"
            className="w-full bg-linear-to-r from-primary to-green-500 text-white font-bold py-4 rounded-xl shadow-lg btn-press"
          >
            MASUK
          </button>
        </div>
        <p className="text-center mt-6 text-xs text-gray-500">
          Belum punya akun?
          <Link href={"/daftar"}>
            <span className="text-primary font-bold cursor-pointer">
              Daftar
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}
