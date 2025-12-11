"use client";

import { useEffect, useState } from "react";
import DataModal from "./data-modal";
import DailyCheckinModal from "./daily-check-modal";
import { useUser } from "@/service/auth";
import { apiClient } from "@/lib/api-client";

interface DailyLog {
  log_date: string; // Dari API kamu
  weight: number;
}

// --------------------------------------------------------
// Utility: Mengambil YYYY-MM-DD hari ini
// --------------------------------------------------------
const getToday = () => new Date().toISOString().slice(0, 10);

export default function ModalContainer() {
  const [openDataModal, setOpenDataModal] = useState(false);
  const [openDailyModal, setOpenDailyModal] = useState(false);
  const [todayCheckedIn, setTodayCheckedIn] = useState<boolean | null>(null);

  const { data } = useUser();
  const user = data;

  // --------------------------------------------------------
  // Fetch Daily Check-In: apakah user sudah submit hari ini?
  // --------------------------------------------------------
  const checkDaily = async () => {
    try {
      const today = getToday();

      const response = await apiClient<{ data: { items: DailyLog[] } }>(
        `/weights?period=daily&date_from=${today}&date_to=${today}&limit=1`
      );

      const logs: DailyLog[] = response?.data.items ?? [];

      // Jika array ada isinya → sudah check-in
      setTodayCheckedIn(logs.length > 0);
    } catch (err) {
      console.error("Gagal cek daily check-in:", err);
      setTodayCheckedIn(false);
    }
  };

  // --------------------------------------------------------
  // Step 1: Jika user belum isi data → tampilkan DataModal
  // Step 2: Jika user sudah isi data → cek daily check-in
  // --------------------------------------------------------
  useEffect(() => {
    if (!user) return;

    // 1. Jika user belum isi data awal → buka DataModal
    if (!user.goal_type) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpenDataModal(true);
      return;
    }

    // 2. Jika data sudah ada → cek apakah sudah check-in
    checkDaily();
  }, [user]);

  // --------------------------------------------------------
  // Step 3: Jika daily check-in belum dilakukan → buka modal
  // --------------------------------------------------------
  useEffect(() => {
    if (todayCheckedIn === null) return; // Masih fetching

    if (todayCheckedIn === false && !openDataModal) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpenDailyModal(true);
    }
  }, [todayCheckedIn, openDataModal]);

  // --------------------------------------------------------
  // Lock body scroll ketika modal terbuka
  // --------------------------------------------------------
  useEffect(() => {
    const isAnyOpen = openDataModal || openDailyModal;

    if (isAnyOpen) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");

    return () => document.body.classList.remove("overflow-hidden");
  }, [openDataModal, openDailyModal]);

  return (
    <>
      <DataModal open={openDataModal} onClose={() => setOpenDataModal(false)} />
      <DailyCheckinModal
        currentWeight={user?.current_weight_kg || 0}
        open={openDailyModal}
        onClose={() => setOpenDailyModal(false)}
      />
    </>
  );
}
