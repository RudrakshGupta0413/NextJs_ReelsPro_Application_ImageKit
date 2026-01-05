"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import getCroppedImg from "@/lib/cropImage";

interface ImageCropperProps {
  image: string | null; 
  type: "profile" | "cover";
  onClose: () => void;
  onCropDone: (file: File, url: string) => void;
}

export default function ImageCropper({
  image,
  type,
  onClose,
  onCropDone,
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  // ✅ Save crop area
  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // ✅ Generate cropped image and return to parent
  const generateCroppedImage = async () => {
    if (!image || !croppedAreaPixels) return;
    try {
      const { file, url } = await getCroppedImg(image, croppedAreaPixels);
      onCropDone(file, url);
      onClose(); // close modal after done
    } catch (err) {
      console.error("Crop failed:", err);
    }
  };

  if (!image) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-2xl shadow-lg w-[90%] max-w-lg">
        <div className="relative w-full h-[400px] bg-black/20 rounded-xl overflow-hidden">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={type === "profile" ? 1 : 16 / 9}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mt-4">
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-2/3"
          />

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={generateCroppedImage}>Save Crop</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
