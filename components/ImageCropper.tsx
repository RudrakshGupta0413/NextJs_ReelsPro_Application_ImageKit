"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import getCroppedImg from "@/lib/image-utils";

interface ImageCropperProps {
    imageSrc: string;
    onCropComplete: (croppedBlob: Blob) => void;
    onClose: () => void;
    aspectRatio?: number;
}

export default function ImageCropper({
    imageSrc,
    onCropComplete,
    onClose,
    aspectRatio = 9 / 16,
}: ImageCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    const onCropChange = (crop: { x: number; y: number }) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom: number) => {
        setZoom(zoom);
    };

    const onCropCompleteInternal = useCallback(
        (croppedArea: any, croppedAreaPixels: any) => {
            setCroppedAreaPixels(croppedAreaPixels);
        },
        []
    );

    const handleCrop = async () => {
        try {
            const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            if (croppedBlob) {
                onCropComplete(croppedBlob);
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Dialog open={!!imageSrc} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800 text-white p-0 overflow-hidden">
                <DialogHeader className="p-4 border-b border-zinc-800">
                    <DialogTitle className="text-center">Crop Image</DialogTitle>
                </DialogHeader>

                <div className="relative w-full aspect-square bg-black min-h-[400px]">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspectRatio}
                        onCropChange={onCropChange}
                        onCropComplete={onCropCompleteInternal}
                        onZoomChange={onZoomChange}
                    />
                </div>

                <DialogFooter className="p-4 bg-zinc-900 border-t border-zinc-800 sm:justify-between items-center gap-4">
                    <div className="flex-1 px-4">
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full accent-blue-500 h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={onClose} className="hover:bg-zinc-800 text-zinc-400 hover:text-white">
                            Cancel
                        </Button>
                        <Button onClick={handleCrop} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6">
                            Apply
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
