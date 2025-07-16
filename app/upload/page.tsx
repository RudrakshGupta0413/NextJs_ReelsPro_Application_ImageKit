"use client";

import { useState } from "react";
import VideoUploadForm from "../../components/VideoUploadForm";

export default function VideoUploadPage() {
    const [open, setOpen] = useState(true);
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <VideoUploadForm open={open} onOpenChange={setOpen} />
            </div>
        </div>
    )
}