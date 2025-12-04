"use client";

import Cookies from "js-cookie";

// Nama cookie bisa diatur di satu tempat
export const TOKEN_COOKIE_NAME = "setok";

/**
 * Menyimpan token ke dalam cookie.
 * @param token - Token otentikasi yang akan disimpan.
 */
export const setToken = (token: string): void => {
  if (typeof window === "undefined") {
    // Mencegah error saat berjalan di sisi server
    return;
  }
  // Atur cookie dengan masa berlaku 1 hari, aman, dan sameSite
  Cookies.set(TOKEN_COOKIE_NAME, token, {
    expires: 1,
    secure: process.env.NODE_ENV === "production", // Hanya secure di produksi
    sameSite: "strict",
  });
};

/**
 * Mengambil token dari cookie.
 * @returns Token otentikasi atau null jika tidak ada.
 */
export const getToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }
  return Cookies.get(TOKEN_COOKIE_NAME) || null;
};

/**
 * Menghapus token dari cookie (untuk logout).
 */
export const removeToken = (): void => {
  if (typeof window === "undefined") {
    return;
  }
  Cookies.remove(TOKEN_COOKIE_NAME);
};
