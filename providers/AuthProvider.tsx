"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useUser } from "@/service/auth";
import { getToken } from "@/lib/token-service";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isLoading, data } = useUser();

  const isAuthenticated = !!data;
  useEffect(() => {
    const token = getToken();

    if (!token) {
      window.location.href = "/masuk";
      return;
    }

    if (!isAuthenticated && !isLoading) {
      if (typeof window !== "undefined") {
        window.location.href = "/masuk";
        return;
      }
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!!!data && !isLoading) {
    return null;
  }

  return <>{children}</>;
}
