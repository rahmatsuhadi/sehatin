"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CameraScan from "@/components/camera-scan";

export default function ScanPage() {
  const [openCamera, setOpenCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleCapture = (img: string) => {
    setCapturedImage(img);
    setOpenCamera(false);
  };

  return (
    <div className="px-5  pb-20 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Scan Makanan
      </h1>

      <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
        Foto makananmu supaya AI dapat menganalisis kalori, nutrisi, dan
        rekomendasi makan sehat.
      </p>

      {/* If image already captured */}
      {capturedImage ? (
        <div className="space-y-5">
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={capturedImage}
              alt="Captured"
              width={500}
              height={500}
              className="w-full h-auto"
            />
          </div>

          <Link
            href={{
              pathname: "/scan/result",
              //   query: { img: capturedImage },
            }}
            className="bg-primary text-white w-full py-3 rounded-xl text-center font-bold block active:scale-95 transition"
          >
            Lanjut Analisis
          </Link>

          <button
            onClick={() => setCapturedImage(null)}
            className="w-full py-2 text-gray-500 dark:text-gray-300 text-sm"
          >
            Ambil ulang
          </button>
        </div>
      ) : (
        <>
          {/* Default Scan UI */}
          <div className="bg-white dark:bg-darkCard rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-28 h-28 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 20.25c4.556 0 8.25-3.694 8.25-8.25S16.556 3.75 12 3.75 3.75 7.444 3.75 12s3.694 8.25 8.25 8.25z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 17.25v.008h.008V17.25H12zm0-10.5v.008h.008V6.75H12z"
                  />
                </svg>
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Ambil foto makanan secara jelas, pastikan berada di dalam
                bingkai.
              </p>
            </div>
          </div>

          {/* Scan button */}
          <button
            onClick={() => setOpenCamera(true)}
            className="bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-green-500/30 w-full active:scale-95 transition"
          >
            Mulai Scan
          </button>

          {/* Upload file option */}
          <label className="block text-center mt-4 text-primary text-sm cursor-pointer">
            <span>Pilih dari galeri</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onloadend = () => {
                  if (typeof reader.result === "string") {
                    setCapturedImage(reader.result);
                  }
                };
                reader.readAsDataURL(file);
              }}
            />
          </label>
        </>
      )}

      {/* Camera Fullscreen */}
      {openCamera && (
        <CameraScan
          onCapture={handleCapture}
          onClose={() => setOpenCamera(false)}
        />
      )}
    </div>
  );
}
