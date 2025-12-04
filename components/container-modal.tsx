"use client";
import { useEffect, useState, useCallback } from "react";
import DataModal from "./data-modal";
import DailyCheckinModal from "./daily-check-modal";
import { useUser } from "@/service/auth";

// ... (Interface UserData dan DailyCheckinValue tetap sama)
interface UserData {
  name: string;
  goal: "lose" | "gain" | "maintain";
  initialWeight: number; // Tambahkan ini sebagai contoh
}
interface DailyCheckinValue {
  weight: number;
}

// Interface baru untuk menyimpan log harian
interface DailyLog {
  date: string; // Format YYYY-MM-DD
  weight: number;
}

// =======================================================
// UTILITY FUNCTIONS
// =======================================================

/** Mendapatkan tanggal hari ini dalam format YYYY-MM-DD */
const getTodayDateString = () => {
  const today = new Date();
  // Gunakan toISOString() dan ambil 10 karakter pertama (YYYY-MM-DD)
  return today.toISOString().slice(0, 10);
};

/** Mengecek apakah check-in hari ini sudah dilakukan */
const isCheckedInToday = (logs: DailyLog[] | null): boolean => {
  if (!logs || logs.length === 0) return false;
  const todayStr = getTodayDateString();
  return logs.some((log) => log.date === todayStr);
};

// =======================================================
// KOMPONEN UTAMA
// =======================================================

// const [isModalDataForm, setIsModalDataForm] = useState<boolean>(false);
//  if (data?.data && !data?.data.user.goal_type) {
//       // eslint-disable-next-line react-hooks/set-state-in-effect
//       setIsModalDataForm(true);
//     }

export default function ModalContainer() {
  const [openDataModal, setOpenDataModal] = useState(false);
  const [openDailyModal, setOpenDailyModal] = useState(false);

  const { data } = useUser();
  const user = data?.data.user;

  // State untuk menampung log harian
  // const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);

  // // 1. Ambil data log harian saat komponen dimuat
  // useEffect(() => {
  //   const logsData = localStorage.getItem("daily-logs");
  //   if (logsData) {
  //     // eslint-disable-next-line react-hooks/set-state-in-effect
  //     setDailyLogs(JSON.parse(logsData) as DailyLog[]);
  //   }
  // }, []);

  // 2. Logika Pembukaan Modal Berurutan (Dipanggil hanya SEKALI saat mount)
  useEffect(() => {
    if (user && !user.goal_type) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpenDataModal(true);
    }
    // else if (!todayCheckedIn) {
    //   // Prioritas 2: User data sudah ada, tapi belum check-in hari ini
    //   setOpenDailyModal(true);
    // }
    // Jika user data ada DAN sudah check-in hari ini, tidak ada modal yang terbuka.
  }, [user]); // Jalankan ulang jika dailyLogs berubah

  // 3. Logika Penyimpanan Data Awal (DataModal)
  const handleSaveUserData = useCallback((data: unknown) => {
    localStorage.setItem("user-data", JSON.stringify(data));
    setOpenDataModal(false);

    // Setelah DataModal diisi, langsung cek untuk DailyCheckin (otomatis)
    // Walaupun akan dicek di useEffect, memanggil setOpenDailyModal(true) di sini
    // memastikan alur langsung terjadi jika DataModal baru selesai diisi.
    // if (!isCheckedInToday(dailyLogs)) {
    //   setOpenDailyModal(true);
    // }
  }, []);

  useEffect(() => {
    const isAnyModalOpen = openDataModal || openDailyModal;

    if (isAnyModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [openDataModal, openDailyModal]);

  return (
    <>
      <DataModal
        open={openDataModal}
        onClose={() => setOpenDataModal(false)}
        onSave={handleSaveUserData}
      />
      {/* <DailyCheckinModal
        open={openDailyModal}
        onClose={() => setOpenDailyModal(false)}
        onSave={(v) => handleDailySave({ weight: v })}
      /> */}
    </>
  );
}
