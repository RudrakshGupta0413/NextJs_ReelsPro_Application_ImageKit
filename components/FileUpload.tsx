"use client";

import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import ImageCropper from "./ImageCropper";
import { Button } from "./ui/button";

interface FileUploadProps {
  onSuccess: (res: IKUploadResponse) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video" | "thumbnail";
  aspectRatio?: "9:16" | "16:9";
}

export default function FileUpload({
  onSuccess,
  onProgress,
  fileType = "image",
  aspectRatio = "9:16",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const onError = (err: { message: string }) => {
    console.error("Upload error:", err);
    setError(err.message);
    setUploading(false);
  };

  const handleSuccess = (response: IKUploadResponse) => {
    setUploading(false);
    setError(null);
    setSelectedImage(null);
    onSuccess(response);
  };

  const handleStartUpload = () => {
    setUploading(true);
    setError(null);
  };

  const handleProgress = (evt: ProgressEvent) => {
    if (evt.lengthComputable && onProgress) {
      const percentComplete = (evt.loaded / evt.total) * 100;
      onProgress(Math.round(percentComplete));
    }
  };

  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please upload a valid video file");
        return false;
      }
      if (file.size > 100 * 1024 * 1024) {
        setError("Video size must be less than 100MB");
        return false;
      }
    } else {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a valid image file (JPEG, PNG, or WebP)");
        return false;
      }
      if (file.size > 10 * 1024 * 1024) { // Increased limit slightly for flexibility
        setError("File size must be less than 10MB");
        return false;
      }
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) return;

    if (fileType === "video") {
      // For video, keep using standard IKUpload which is triggered by its own input
      // However, since we might use a custom UI, we may need to trigger it
      return;
    }

    // For images, show cropper
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadCroppedImage = async (blob: Blob) => {
    try {
      setUploading(true);
      setError(null);

      // 1. Get Authentication Parameters
      const authRes = await fetch("/api/imagekit-auth");
      if (!authRes.ok) throw new Error("Authentication failed");
      const authData = await authRes.json();

      // 2. Prepare FormData
      const formData = new FormData();
      formData.append("file", blob, fileType === "thumbnail" ? "thumbnail.jpg" : "image.jpg");
      formData.append("fileName", fileType === "thumbnail" ? "thumbnail.jpg" : "image.jpg");
      formData.append("publicKey", process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!);
      formData.append("signature", authData.signature);
      formData.append("expire", authData.expire.toString());
      formData.append("token", authData.token);
      formData.append("useUniqueFileName", "true");
      formData.append("folder", getFolder());

      // 3. Upload to ImageKit
      const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const errData = await uploadRes.json();
        throw new Error(errData.message || "Upload failed");
      }

      const responseData = await uploadRes.json();
      handleSuccess(responseData);
    } catch (err: any) {
      onError({ message: err.message });
    }
  };

  const getFolder = () => {
    switch (fileType) {
      case "video":
        return "videos";
      case "image":
        return "images";
      case "thumbnail":
        return "thumbnails";
      default:
        return "others";
    }
  };

  return (
    <div className="space-y-4">
      {fileType === "video" ? (
        <IKUpload
          fileName="video"
          onError={onError}
          onSuccess={handleSuccess}
          onUploadStart={handleStartUpload}
          onUploadProgress={handleProgress}
          accept="video/*"
          className="file-input file-input-bordered w-full"
          validateFile={validateFile}
          useUniqueFileName={true}
          folder={getFolder()}
        />
      ) : (
        <div className="flex flex-col gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload-input"
          />
          <Button
            asChild
            variant="outline"
            className="w-full border-dashed border-2 h-24 flex flex-col gap-2 hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <label htmlFor="image-upload-input">
              <Upload className="w-6 h-6 text-muted-foreground" />
              <span className="text-sm font-medium">Select {fileType} to Crop & Upload</span>
            </label>
          </Button>
        </div>
      )}

      {selectedImage && (
        <ImageCropper
          imageSrc={selectedImage}
          onCropComplete={(blob) => {
            setSelectedImage(null);
            uploadCroppedImage(blob);
          }}
          onClose={() => setSelectedImage(null)}
          aspectRatio={fileType === "thumbnail" ? 16 / 9 : (aspectRatio === "9:16" ? 9 / 16 : 16 / 9)}
        />
      )}

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-primary animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing & Uploading...</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div className="bg-primary h-full animate-progress-indeterminate"></div>
          </div>
        </div>
      )}

      {error && <div className="text-error text-sm font-medium bg-error/10 p-3 rounded-lg border border-error/20">{error}</div>}
    </div>
  );
}