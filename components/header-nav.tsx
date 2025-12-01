"use client";

import { Icon } from "@/components/ui/icon";
import { faLeaf, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

export default function HeaderNav() {
  const { theme, setTheme } = useTheme();

  const toggleDark = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <header
      className="
    fixed top-0 left-0 right-0 
    w-full 
    z-999
    bg-white/90 dark:bg-darkCard/90 
    backdrop-blur-md 
    border-b border-gray-200 dark:border-gray-800 
    flex items-center justify-between
    px-5 py-3
    md:px-8 md:py-4
    lg:px-12 lg:py-5
  "
    >
      {/* Logo */}
      <div className="flex items-center gap-2 lg:gap-3">
        <div
          className="
          w-8 h-8 
          md:w-9 md:h-9 
          lg:w-11 lg:h-11
          bg-gradient-to-tr from-primary to-green-400 
          rounded-lg flex items-center justify-center 
          text-white 
        "
        >
          <Icon icon={faLeaf} className="text-sm md:text-base lg:text-lg" />
        </div>

        <h1
          className="
            font-bold tracking-tight 
            text-gray-800 dark:text-white 
            text-lg md:text-xl lg:text-2xl
          "
        >
          Sehatin
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 lg:gap-4">
        {/* Dark Mode Button */}
        <button
          onClick={toggleDark}
          className="
            rounded-full flex items-center justify-center
            bg-gray-100 dark:bg-gray-700 
            text-gray-600 dark:text-accent 
            active:scale-95 transition 
            w-9 h-9 
            md:w-10 md:h-10 
            lg:w-12 lg:h-12
          "
        >
          {theme === "dark" ? (
            <Icon icon={faSun} className="text-base md:text-lg lg:text-xl" />
          ) : (
            <Icon icon={faMoon} className="text-base md:text-lg lg:text-xl" />
          )}
        </button>

        {/* Avatar */}
        <Link
          href="/profile"
          className="
            overflow-hidden rounded-full border-2 border-primary 
            w-9 h-9 
            md:w-10 md:h-10 
            lg:w-12 lg:h-12
          "
        >
          <img
            src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix"
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </Link>
      </div>
    </header>
  );
}
