"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";

interface CameraScanProps {
  onCapture: (image: string) => void;
  onClose: () => void;
}

const CameraScan: React.FC<CameraScanProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );

  // ==================================================
  //  START CAMERA
  // ==================================================
  const startCamera = useCallback(async () => {
    try {
      // stop previous stream
      if (stream) stream.getTracks().forEach((t) => t.stop());

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
      });

      setStream(newStream);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }

      setCameraError(null);
    } catch (err) {
      console.error(err);
      setCameraError("Tidak dapat mengakses kamera. Pastikan izin diberikan.");
    }
  }, [facingMode]);

  useEffect(() => {
    startCamera();

    // cleanup
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  // ==================================================
  // CAPTURE PHOTO
  // ==================================================
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const img = canvas.toDataURL("image/jpeg", 0.85);

    if (stream) stream.getTracks().forEach((t) => t.stop());

    onCapture(img);
  };

  // ==================================================
  // UPLOAD FROM GALLERY
  // ==================================================
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        onCapture(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 bg-black z-[9999] flex flex-col animate-fadeIn">
      {/* VIDEO AREA */}
      <div className="relative flex-1 overflow-hidden bg-black">
        {cameraError ? (
          <div className="flex items-center justify-center h-full text-white text-center px-6">
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

        {/* Overlay crop frame */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 border-2 border-white/50 rounded-lg relative">
            {/* Corners */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white"></div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-black/40 rounded-full text-white hover:bg-black/60 backdrop-blur"
        >
          ✕
        </button>
      </div>

      {/* CONTROLS */}
      <div className="h-32 bg-black flex items-center justify-around px-6 pb-6 pt-2">
        {/* Upload gallery */}
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
            className="text-white p-3 rounded-full hover:bg-white/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </button>
        </div>

        {/* Capture */}
        <button
          onClick={capturePhoto}
          className="w-20 h-20 bg-white rounded-full border-4 border-gray-300 flex items-center justify-center hover:scale-105 active:scale-95 transition"
        >
          <div className="w-16 h-16 bg-primary rounded-full"></div>
        </button>

        {/* Switch Camera */}
        <button
          onClick={() =>
            setFacingMode((p) => (p === "user" ? "environment" : "user"))
          }
          className="text-white p-3 rounded-full hover:bg-white/10"
        >
          <svg
            className="w-8 h-8"
            stroke="currentColor"
            strokeWidth={1.5}
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraScan;
