"use client";
import { useLogin } from "@/service/auth";
import { Loader2 } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";

type IFormInput = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const { mutate, isPending } = useLogin();

  const onSubmit: SubmitHandler<IFormInput> = (val) =>
    mutate({ credentials: val });

  return (
    <form className="space-y-4 input-group" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="text-xs font-bold text-gray-500 mb-1 ml-1">
          Email
        </label>
        <input
          type="email"
          id="login-email"
          {...register("email", {
            disabled: isPending,
            required: "Email diperlukan",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: "Masukan alamat Email yang valid",
            },
          })}
          placeholder="nama@email.com"
        />
        {errors.email && (
          <span className="error-message">{errors.email.message}</span>
        )}
      </div>
      <div>
        <label className="text-xs font-bold text-gray-500 mb-1 ml-1">
          Password
        </label>
        <input
          type="password"
          id="login-pass"
          {...register("password", {
            disabled: isPending,
            required: "Password diperlukan",
            minLength: {
              value: 6,
              message: "Password harus minimal 6 karakter",
            },
          })}
          placeholder="Password akun"
        />
        {errors.password && (
          <span className="error-message">{errors.password.message}</span>
        )}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-linear-to-r disabled:opacity-40 from-primary to-green-500 text-white font-bold py-4 rounded-xl shadow-lg disabled:active:scale-100 active:scale-105 transition-all"
      >
        {isPending ? <Loader2 className="animate-spin mx-auto" /> : "MASUK"}
      </button>
    </form>
  );
}
