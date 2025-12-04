"use client";

import { Icon } from "@/components/ui/icon";
import { useLogout, useUser } from "@/service/auth";
import {
  faChevronRight,
  faRulerCombined,
} from "@fortawesome/free-solid-svg-icons";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const mutateLogout = useLogout();

  const { data } = useUser();
  const user = data?.data.user;

  const handleOpenOnboarding = () => {
    router.push("/onboarding");
  };

  const handleLogout = () => {
    mutateLogout.mutate();
  };

  const fullName = data?.data?.user?.name || "";
  const [firstname = "User", lastname = ""] = fullName.split(" ");
  // Avatar generator
  const avatarUrl = `https://avatar.iran.liara.run/username?username=${firstname}${
    lastname ? "+" + lastname : ""
  }`;

  return (
    <div className="page-section fade-in pb-24">
      {/* Avatar + Name */}
      <div className="text-center mb-8 pt-6">
        <div className="w-28 h-28 mx-auto bg-gray-200 rounded-full p-1 border-4 border-white dark:border-gray-700 shadow-xl mb-3 overflow-hidden">
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </div>

        <h2 className="text-2xl font-bold dark:text-white" id="profile-name">
          {user?.name}
        </h2>

        <p className="text-sm text-primary font-bold">Health Warrior</p>
      </div>

      {/* Options */}
      <div className="space-y-4">
        {/* Edit Data Fisik */}
        <div
          onClick={handleOpenOnboarding}
          className="bg-white dark:bg-darkCard rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center cursor-pointer active:scale-[0.97] transition"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <Icon icon={faRulerCombined} className="text-lg" />
            </div>

            <div>
              <h4 className="font-bold text-sm">Data Fisik & Target</h4>
              <p className="text-xs text-gray-500">
                Ubah berat, tinggi, dan tujuan
              </p>
            </div>
          </div>

          <Icon icon={faChevronRight} className="text-gray-300 text-sm" />
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={mutateLogout.isPending}
          className="w-full bg-red-50 text-red-500 disabled:text-red-300 font-bold py-4 rounded-2xl mt-4 border border-red-100 disabled:hover:bg-red-50 hover:bg-red-100 transition"
        >
          {mutateLogout.isPending ? (
            <div className=" flex items-center justify-center gap-3 ">
              <Loader2 className="animate-spin" /> Mengeluarkan Akun
            </div>
          ) : (
            "Keluar Akun"
          )}
        </button>
      </div>
    </div>
  );
}
