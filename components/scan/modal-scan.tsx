import { useEffect, useState } from "react";
import CameraScan from "../camera-scan";
import ModalConfirm from "./modal-confirm";
import Image from "next/image";
import { useMutation, useQuery } from "@tanstack/react-query";
import { customToast } from "@/lib/custom-toast";
import { apiClient } from "@/lib/api-client";
import { Meals, User } from "@/lib/types";
import { set } from "react-hook-form";
import ModalAnalisis from "./modal-analisis";

interface ModalScanContentProps {
  isOpen: boolean;
  onClose: () => void;
}

const useUploadedImage = () =>
  useMutation({
    onSuccess(data) {
      //   customToast("Login Berhasil", "success");
    },
    onError() {
      customToast("Terjadi kesalahan saat upload gambar", "error");
    },
    mutationFn: async ({ body }: { body: { image: File } }) => {
      const formdata = new FormData();
      formdata.append("image", body.image);

      const response = await apiClient<{
        message: string;
        data: { scan_session: { id: string } };
      }>("/scan", {
        method: "POST",
        body: formdata,
      });

      return response.data;
    },
  });

export default function ModalScanContent({
  isOpen,
  onClose,
}: ModalScanContentProps) {
  const [sesssionId, setSessionId] = useState<string | null>(null);

  const [isCameraOpen, setIsCameraOpen] = useState(true);
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);

  const [isAnalisisOpen, setIsAnalisisOpen] = useState(false);

  const uploadImageMutation = useUploadedImage();

  useEffect(() => {
    const isAnyModalOpen = isOpen;

    if (isAnyModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  const handleImageCapture = (val: File) => {
    customToast("Menganalisis gambar", "loading", "upload-scan");
    uploadImageMutation.mutate(
      { body: { image: val } },
      {
        onSuccess(data) {
          setSessionId(data.scan_session.id);
          customToast("Berhasil diproses!", "success", "upload-scan");
          setIsModalConfirmOpen(true);
        },
        onError() {
          customToast("Gagal memproses data!", "error", "upload-scan");
        },
      }
    );
  };

  const onCloseModal = () => {
    setIsCameraOpen(true);
    setIsModalConfirmOpen(false);
    setIsAnalisisOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {isCameraOpen && (
        <CameraScan
          onCapture={({ file }) => {
            handleImageCapture(file);
            setIsCameraOpen(false);
          }}
          onClose={() => onCloseModal()}
        />
      )}

      {sesssionId && isModalConfirmOpen && (
        <ModalConfirm
          sessionId={sesssionId}
          onClose={onCloseModal}
          onConfirm={() => {
            setIsModalConfirmOpen(false);
            setIsAnalisisOpen(true);
          }}
        />
      )}

      {isAnalisisOpen && sesssionId && (
        <ModalAnalisis
          sesssionId={sesssionId}
          onClose={() => {
            onCloseModal();
          }}
        />
      )}
    </>
  );
}
