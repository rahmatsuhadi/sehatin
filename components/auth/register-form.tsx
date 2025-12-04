"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Link from "next/link";
import { useRegister } from "@/service/auth";
import { Loader2 } from "lucide-react";

type RegisterInputs = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export default function RegisterForm() {
  const { mutate, isPending: loading } = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInputs>();

  const onSubmit: SubmitHandler<RegisterInputs> = (data) => {
    mutate({ credentials: data });
  };

  const password = watch("password");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative z-20">
      <div className="input-group space-y-3">
        {/* Fullname */}
        <input
          type="text"
          placeholder="Nama Lengkap"
          {...register("name", {
            disabled: loading,
            required: "Nama wajib diisi",
          })}
          className="input-style"
        />
        {errors.name && <p className="error-message">{errors.name.message}</p>}

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          {...register("email", {
            disabled: loading,
            required: "Email wajib diisi",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Format email tidak valid",
            },
          })}
          className="input-style"
        />
        {errors.email && (
          <p className="error-message">{errors.email.message}</p>
        )}

        {/* Password */}
        <div>
          <input
            type="password"
            placeholder="Password (Min. 8 Karakter)"
            {...register("password", {
              disabled: loading,
              required: "Password wajib diisi",
              minLength: {
                value: 8,
                message: "Password minimal 8 karakter",
              },
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d).+$/,
                message: "Harus kombinasi huruf & angka",
              },
            })}
            className="input-style"
          />
          <p className="text-[10px] text-gray-400 mt-1 ml-1">
            *Harus kombinasi huruf & angka
          </p>
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <input
          type="password"
          placeholder="Konfirmasi Password"
          {...register("password_confirmation", {
            disabled: loading,
            required: "Konfirmasi password wajib diisi",
            validate: (val) => val === password || "Password tidak sama",
          })}
          className="input-style"
        />
        {errors.password_confirmation && (
          <p className="error-message">
            {errors.password_confirmation.message}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="
                w-full bg-gradient-to-r disabled:opacity-40 from-secondary to-blue-500 text-white disabled:active:scale-100
                font-bold py-4 rounded-xl shadow-lg  active:scale-105 transition-all
              "
        >
          {loading ? (
            <Loader2 className="animate-spin mx-auto" />
          ) : (
            "DAFTAR AKUN"
          )}
        </button>
      </div>

      {/* Link to Login */}
      <p className="text-center mt-6 text-xs text-gray-500">
        Sudah punya akun?{" "}
        <Link href={"/masuk"}>
          <span className="text-secondary font-bold cursor-pointer">Masuk</span>
        </Link>
      </p>
    </form>
  );
}
