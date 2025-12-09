"use client";

import { useUser } from "@/service/auth";

export default function GreetingCard() {
  const { data } = useUser();
  const name = data?.name || "User";

  return (
    <div>
      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
        Hai,
        <span className="text-gray-900 dark:text-white font-bold">
          {" "}
          {name}!
        </span>
      </p>
      <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-800 dark:text-white">
        Ayo Sehat! 🥑
      </h2>
    </div>
  );
}
