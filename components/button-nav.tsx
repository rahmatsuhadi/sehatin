"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import {
  faHome,
  faChartPie,
  faCamera,
  faBookOpen,
  faComments,
} from "@fortawesome/free-solid-svg-icons";

export default function ButtonNav() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const items = [
    { label: "Home", path: "/", icon: faHome },
    { label: "Stats", path: "/stats", icon: faChartPie },
    { label: "Scan", path: "/scan", icon: faCamera },
    { label: "Info", path: "/library", icon: faBookOpen },
    { label: "Chat", path: "/chat", icon: faComments },
  ];

  return (
    <>
      {/* MOBILE BOTTOM NAV */}
      <nav className="lg:hidden fixed bottom-0 w-full bg-white dark:bg-darkCard border-t border-gray-200 dark:border-gray-800 flex justify-around py-3 z-40 pb-6 md:pb-3  mx-auto left-0 right-0 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
        {/* Loop items */}
        {items.map((item, index) => (
          <Link
            key={item.path}
            href={item.path}
            className={`nav-btn flex flex-col items-center gap-1 w-12 transition-all ${
              isActive(item.path)
                ? "text-primary font-bold"
                : "text-gray-400 dark:text-gray-500"
            }`}
          >
            {/* Camera special button */}
            {index === 2 ? (
              <div className="relative -top-8 group">
                <div className="w-16 h-16 bg-primary rounded-full text-white shadow-xl shadow-green-500/40 flex items-center justify-center border-[5px] border-surface dark:border-darkBg transform transition group-hover:scale-105 group-hover:rotate-12">
                  <Icon icon={faCamera} className="text-2xl" />
                </div>
              </div>
            ) : (
              <>
                <Icon icon={item.icon} className="text-xl mb-0.5" />
                <span className="text-[10px] font-bold">{item.label}</span>
              </>
            )}
          </Link>
        ))}
      </nav>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden  lg:flex lg:flex-col lg:w-64 lg:fixed lg:left-0 lg:top-0 lg:h-full bg-white dark:bg-darkCard border-r border-gray-200 dark:border-gray-800 p-5 space-y-6">
        <div className="flex flex-col gap-2 mt-20">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${
                isActive(item.path)
                  ? "bg-primary/10 text-primary font-bold"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Icon icon={item.icon} className="text-lg" />

              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
}
