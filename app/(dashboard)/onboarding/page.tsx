"use client";

import OnboardingForm from "@/components/profile/onboarding-form";
import { useState } from "react";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen  dark:bg-darkBg p-6 fade-in">
      <h1 className="text-3xl font-extrabold mb-3 text-gray-800 dark:text-white">
        Data Fisik Kamu
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
        Kami butuh ini agar bisa hitung nutrisi yang pas.
      </p>
      <OnboardingForm />
    </div>
  );
}
