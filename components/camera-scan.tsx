"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

interface CaptureResult {
  file: File;
  base64: string;
}

interface CameraScanProps {
  onCapture: (image: CaptureResult) => void;
  onClose: () => void;
}

const CameraScan: React.FC<CameraScanProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Stream TIDAK disimpan di state untuk menghindari race & re-render
  const streamRef = useRef<MediaStream | null>(null);

  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );
  const [cameraError, setCameraError] = useState<string | null>(null);

  // =============================================================
  // STOP CAMERA BENAR-BENAR MATI
  // =============================================================
  const stopCamera = useCallback(() => {
    const s = streamRef.current;
    if (s) {
      s.getTracks().forEach((track) => track.stop());
    }
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // =============================================================
  // START CAMERA
  // =============================================================
  const startCamera = useCallback(async () => {
    try {
      stopCamera(); // pastikan stop dulu

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });

      const video = videoRef.current;
      if (!video) return;

      streamRef.current = stream;
      video.srcObject = stream;

      // PLAY hanya setelah metadata siap (fix untuk iPhone, Android, Chrome, Safari)
      video.onloadedmetadata = async () => {
        try {
          await video.play();
        } catch (err) {
          console.warn("Video play error:", err);
        }
      };

      setCameraError(null);
    } catch (err) {
      console.error(err);
      setCameraError("Tidak dapat mengakses kamera.");
    }
  }, [facingMode, stopCamera]);

  // ON MOUNT + facingMode berubah
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  // =============================================================
  // CAPTURE PHOTO
  // =============================================================
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64 = canvas.toDataURL("image/jpeg", 0.9);

    // buat file
    const byteString = atob(base64.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i);

    const file = new File([ab], `capture_${Date.now()}.jpg`, {
      type: "image/jpeg",
    });

    stopCamera(); // kamera pasti mati

    onCapture({ file, base64 });
  };

  // =============================================================
  // UPLOAD FOTO
  // =============================================================
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        stopCamera();
        onCapture({ file, base64: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  // =============================================================
  // CLOSE POPUP
  // =============================================================
  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black z-[9999] flex flex-col">
      <div className="relative flex-1 bg-black">
        {cameraError ? (
          <div className="flex items-center justify-center text-white">
            {cameraError}
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-white"
        >
          ✕
        </button>
      </div>

      <div className="h-28 bg-black flex items-center justify-around">
        {/* Upload */}
        <div>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
          <button
            onClick={() => document.getElementById("file-upload")?.click()}
            className="text-white"
          >
            Gallery
          </button>
        </div>

        {/* Capture */}
        <button
          onClick={capturePhoto}
          className="w-20 h-20 bg-white rounded-full border-4 border-gray-300"
        ></button>

        {/* Switch Camera */}
        <button
          onClick={() =>
            setFacingMode((p) => (p === "user" ? "environment" : "user"))
          }
          className="text-white"
        >
          Flip
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraScan;
