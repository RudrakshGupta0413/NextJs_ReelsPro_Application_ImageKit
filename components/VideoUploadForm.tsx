"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import FileUpload from "@/components/FileUpload";
import { apiClient } from "@/lib/api-client";
import { useNotification } from "@/components/Notification";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";

const videoUploadSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500),
  isPublic: z.boolean(),
  videoUrl: z.string().min(1, "Video upload is required"),
  thumbnailUrl: z.string(),
});

type VideoUploadFormData = z.infer<typeof videoUploadSchema>;

interface VideoUploadFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function VideoUploadForm({
  open,
  onOpenChange,
}: VideoUploadFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { showNotification } = useNotification();

  const form = useForm<VideoUploadFormData>({
    resolver: zodResolver(videoUploadSchema),
    defaultValues: {
      title: "",
      description: "",
      isPublic: true,
      videoUrl: "",
      thumbnailUrl: "",
    },
  });

  const onSubmit = async (data: VideoUploadFormData) => {
    if (!data.videoUrl) {
      showNotification("Please upload a video", "error");
      return;
    }

    setIsUploading(true);
    try {
      await apiClient.createVideo({
        ...data,
        description: data.description || "",
        thumbnailUrl: data.thumbnailUrl || "",
      });
      showNotification("Video published successfully", "success");
      form.reset();
      setUploadProgress(0);
      onOpenChange(false);
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Failed to publish video",
        "error"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Upload Video
          </DialogTitle>
          <DialogDescription>
            Fill in the details and upload your reel.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter video title..."
                      {...field}
                      className="bg-background"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description / Caption</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write a caption for your video..."
                      className="min-h-[100px] bg-background"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional description for your video (max 500 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Video Upload */}
            <FormField
              control={form.control}
              name="videoUrl"
              render={() => (
                <FormItem>
                  <FormLabel>Video File</FormLabel>
                  <FormControl>
                    <FileUpload
                      fileType="video"
                      onSuccess={(res: IKUploadResponse) => {
                        form.setValue("videoUrl", res.filePath);
                        // fallback thumbnail
                        if (!form.getValues("thumbnailUrl")) {
                          form.setValue(
                            "thumbnailUrl",
                            res.thumbnailUrl || res.filePath
                          );
                        }
                        showNotification(
                          "Video uploaded successfully",
                          "success"
                        );
                      }}
                      onProgress={(p: number) => setUploadProgress(p)}
                    />
                  </FormControl>
                  {uploadProgress > 0 && (
                    <div className="w-full bg-muted rounded-full h-2.5 mt-2">
                      <div
                        className="bg-primary h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Thumbnail Upload */}
            <FormField
              control={form.control}
              name="thumbnailUrl"
              render={() => (
                <FormItem>
                  <FormLabel>Video Thumbnail (Optional)</FormLabel>
                  <FormControl>
                    <FileUpload
                      fileType="image"
                      onSuccess={(res: IKUploadResponse) => {
                        form.setValue("thumbnailUrl", res.filePath);
                        showNotification("Thumbnail uploaded", "success");
                      }}
                      onProgress={() => {}}
                    />
                  </FormControl>
                  <FormDescription>
                    If not provided, one will be auto-generated from your video
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Public / Private */}
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Make this video public</FormLabel>
                    <FormDescription>
                      Public videos can be seen by anyone. Uncheck to keep it
                      private.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-slate-600 to-blue-600 hover:from-slate-700 hover:to-blue-700"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Upload className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Video
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
