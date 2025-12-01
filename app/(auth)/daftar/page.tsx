"use client";

import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    setLoading(true);

    const name = (document.getElementById("reg-name") as HTMLInputElement)
      .value;
    const email = (document.getElementById("reg-email") as HTMLInputElement)
      .value;
    const pass = (document.getElementById("reg-pass") as HTMLInputElement)
      .value;
    const conf = (
      document.getElementById("reg-pass-confirm") as HTMLInputElement
    ).value;

    if (!name || !email || !pass || !conf) {
      alert("Semua kolom wajib diisi!");
      setLoading(false);
      return;
    }

    if (pass !== conf) {
      alert("Password tidak sama!");
      setLoading(false);
      return;
    }

    // Simulasi register
    setTimeout(() => {
      alert("Pendaftaran berhasil!");
      setLoading(false);
    }, 1200);
  };

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
        <div className="space-y-4 relative z-20">
          <div className="input-group space-y-3">
            {/* Fullname */}
            <input
              type="text"
              id="reg-name"
              placeholder="Nama Lengkap"
              className="input-style"
            />

            {/* Email */}
            <input
              type="email"
              id="reg-email"
              placeholder="Email"
              className="input-style"
            />

            {/* Password */}
            <div>
              <input
                type="password"
                id="reg-pass"
                placeholder="Password (Min. 8 Karakter)"
                className="input-style"
              />
              <p className="text-[10px] text-gray-400 mt-1 ml-1">
                *Harus kombinasi huruf & angka
              </p>
            </div>

            {/* Confirm Password */}
            <input
              type="password"
              id="reg-pass-confirm"
              placeholder="Konfirmasi Password"
              className="input-style"
            />

            {/* Submit Button */}
            <button
              onClick={handleRegister}
              disabled={loading}
              className="
                w-full bg-gradient-to-r from-secondary to-blue-500 text-white 
                font-bold py-4 rounded-xl shadow-lg active:scale-[0.97] transition
              "
            >
              {loading ? "Memproses..." : "DAFTAR AKUN"}
            </button>
          </div>

          {/* Link to Login */}
          <p className="text-center mt-6 text-xs text-gray-500">
            Sudah punya akun?{" "}
            <Link href={"/masuk"}>
              <span className="text-secondary font-bold cursor-pointer">
                Masuk
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
