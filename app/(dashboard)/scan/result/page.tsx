"use client";

// import { useSearchParams } from "next/navigation";
import Image from "next/image";

export default function ScanResultPage() {
  //   const params = useSearchParams();
  //   const img = params.get("img");

  return (
    <div className="px-5 pt-24 pb-20 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 dark:text-white text-gray-800">
        Hasil Analisis
      </h1>

      {/* {img && (
        <div className="rounded-2xl overflow-hidden shadow-lg mb-6">
          <Image
            src={img}
            alt="Scanned food"
            width={600}
            height={600}
            className="w-full h-auto"
          />
        </div>
      )} */}

      <p className="text-gray-600 dark:text-gray-300 text-sm">
        (Di sini nanti tampil hasil analisis AI)
      </p>
    </div>
  );
}
