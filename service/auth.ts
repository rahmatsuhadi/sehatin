import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { removeToken, setToken } from "@/lib/token-service";
import { ActivityLevel, Gender, GoalType, User } from "@/lib/types";
import { apiClient } from "@/lib/api-client";
import { customToast } from "@/lib/custom-toast";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  email: string;
  name: string;
  password: string;
  password_confirmation: string;
}

interface UpdateProfileData extends RegisterCredentials {
  gender: Gender;
  birth_date: string;
  height_cm: number;
  current_weight_kg: number;
  goal_type: GoalType;
  activity_level: ActivityLevel;
}

/**
 * Hook untuk mengambil data pengguna yang sedang login.
 * Data ini akan di-cache dan bisa diakses di seluruh aplikasi.
 */
export const useUser = () => {
  return useQuery<User, Error>({
    queryKey: ["user"], // Kunci unik untuk query ini
    queryFn: async () => {
      try {
        const api = await apiClient<{ data: { user: User }; message: string }>(
          "/auth/me"
        ); // Fungsi API yang dipanggil
        return api.data.user;
      } catch (error) {
        throw new Error("Gagal mengambil data user.");
      }
    },
    refetchOnWindowFocus: false,
    retry: false, // Jangan coba ulang jika gagal (misal, karena belum login)
  });
};

/**
 * Hook untuk proses login (Mutation).
 */
export const useLogin = () => {
  return useMutation({
    onSuccess(data) {
      customToast("Login Berhasil", "success");
      setToken(data.token);
      window.location.href = "/";
    },
    onError() {
      customToast("Kesalahan pengguna", "error");
    },
    mutationFn: async ({
      credentials,
      redirectUrl,
    }: {
      credentials: LoginCredentials;
      redirectUrl?: string | null;
    }) => {
      const response = await apiClient<{
        message: string;
        data: { user: User; token: string };
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      return response.data;
    },
  });
};

/**
 * Hook untuk proses pendaftaran (Mutation).
 */
export const useRegister = () => {
  return useMutation({
    onSuccess(data) {
      customToast("Daftar Berhasil", "success");
      setToken(data.token);
      window.location.href = "/";
    },
    onError(error) {
      customToast(error.message || "Kesalahan pengguna", "error");
    },
    mutationFn: async ({
      credentials,
    }: {
      credentials: RegisterCredentials;
    }) => {
      const response = await apiClient<{
        message: string;
        data: { user: User; token: string };
      }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      return response.data;
    },
  });
};

/**
 * Hook untuk proses logout (Mutation).
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (): Promise<{ status: boolean }> => {
      return apiClient<{ status: boolean }>("/auth/logout", {
        method: "POST",
      });
    }, // Fungsi API yang dipanggil
    onSuccess: () => {
      // 1. Hapus token dari cookie
      removeToken();

      // 2. Hapus data pengguna dari cache TanStack Query
      queryClient.removeQueries({ queryKey: ["user"] });

      // 3. Tampilkan notifikasi
      // toast.success("Logout Berhasil", {
      //   description: "Anda telah berhasil keluar dari akun Anda.",
      // });

      customToast("Anda telah berhasil keluar dari akun Anda.", "info");

      // 4. Arahkan ke halaman login
      router.push("/masuk");
    },
    onError: (error) => {
      // Handle jika logout di server gagal, tapi tetap paksa di client
      removeToken();
      queryClient.removeQueries({ queryKey: ["user"] });
      router.push("/masuk");

      console.error("Logout error:", error);
      customToast(
        "Terjadi kesalahan, namun Anda telah dikeluarkan dari sisi klien.",
        "info"
      );
      // toast.error("Logout Gagal", {
      //   description:
      //     "Terjadi kesalahan, namun Anda telah dikeluarkan dari sisi klien.",
      // });
    },
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: async ({
      credentials,
    }: {
      credentials: Partial<UpdateProfileData>;
    }) => {
      const response = await apiClient<{
        message: string;
        data: { user: User; token: string };
      }>("/auth/profile", {
        method: "PUT",
        body: JSON.stringify(credentials),
      });

      return response.data;
    },
    onError: (error) => {
      customToast(error.message || "Gagal Menyimpan Data Profil!", "error");
    },
  });
};

// export const usePasswordChange = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (data: ChangePasswordData) => changePassword(data),
//     onSuccess: () => {
//       // 1. Invalidate query 'user' agar data di seluruh aplikasi ter-update
//       queryClient.invalidateQueries({ queryKey: ["user"] });

//       // 2. Tampilkan notifikasi sukses
//       toast.success("Password Berhasil Diubah!");

//       // 3. Arahkan kembali ke halaman profil
//       // router.push('/pengguna/edit');
//     },
//     onError: (error) => {
//       toast.error("Gagal Mengubah Password", { description: error.message });
//     },
//   });
// };
