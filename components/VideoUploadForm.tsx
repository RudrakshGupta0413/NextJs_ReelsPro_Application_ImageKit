"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, Video as VideoIcon, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IKImage, IKVideo } from "imagekitio-next";

import FileUpload from "@/components/FileUpload";
import { apiClient } from "@/lib/api-client";
import { useNotification } from "@/components/Notification";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";

const postUploadSchema = z.object({
  caption: z.string().min(1, "Caption is required").max(500),
  isPublic: z.boolean(),
  videoUrl: z.string().min(1, "File upload is required"),
  thumbnailUrl: z.string(),
  type: z.enum(["video", "image"]),
  aspectRatio: z.enum(["9:16", "16:9"]),
});

type PostUploadFormData = z.infer<typeof postUploadSchema>;

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

  const form = useForm<PostUploadFormData>({
    resolver: zodResolver(postUploadSchema),
    defaultValues: {
      caption: "",
      isPublic: true,
      videoUrl: "",
      thumbnailUrl: "",
      type: "video",
      aspectRatio: "9:16",
    },
  });

  const uploadType = form.watch("type");

  const onSubmit = async (data: PostUploadFormData) => {
    if (!data.videoUrl) {
      showNotification(`Please upload a ${data.type}`, "error");
      return;
    }

    setIsUploading(true);
    try {
      await apiClient.createVideo({
        ...data,
        thumbnailUrl: data.thumbnailUrl || "",
      });
      showNotification(`${data.type.charAt(0).toUpperCase() + data.type.slice(1)} published successfully`, "success");
      form.reset();
      setUploadProgress(0);
      onOpenChange(false);
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Failed to publish post",
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
          <DialogTitle className="text-2xl font-bold text-center">
            Create New Post
          </DialogTitle>
          <DialogDescription className="text-center">
            Share your amazing content with the world.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Type Toggle */}
            <div className="flex justify-center">
              <Tabs
                defaultValue="video"
                onValueChange={(val) => {
                  form.setValue("type", val as "video" | "image");
                  form.setValue("videoUrl", "");
                  form.setValue("thumbnailUrl", "");
                  setUploadProgress(0);
                }}
                className="w-full max-w-[400px]"
              >
                <TabsList className="grid w-full grid-cols-2 lg:h-12 bg-slate-100 p-1">
                  <TabsTrigger
                    value="video"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
                  >
                    <VideoIcon className="w-4 h-4 mr-2" />
                    Video
                  </TabsTrigger>
                  <TabsTrigger
                    value="image"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Image
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Orientation Toggle */}
            <div className="flex flex-col gap-3">
              <FormLabel className="text-sm font-semibold text-center">Media Orientation</FormLabel>
              <div className="flex justify-center">
                <Tabs
                  defaultValue="9:16"
                  onValueChange={(val) => {
                    form.setValue("aspectRatio", val as "9:16" | "16:9");
                    form.setValue("videoUrl", "");
                    form.setValue("thumbnailUrl", "");
                    setUploadProgress(0);
                  }}
                  className="w-full max-w-[400px]"
                >
                  <TabsList className="grid w-full grid-cols-2 lg:h-12 bg-slate-100 p-1">
                    <TabsTrigger
                      value="9:16"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
                    >
                      Portrait (9:16)
                    </TabsTrigger>
                    <TabsTrigger
                      value="16:9"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
                    >
                      Landscape (16:9)
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {/* Caption */}
            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Caption</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={`Write a caption for your ${uploadType}...`}
                      className="min-h-[120px] bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Media Upload */}
            <FormField
              control={form.control}
              name="videoUrl"
              render={() => (
                <FormItem className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 transition-colors">
                  <FormLabel className="text-sm font-semibold flex items-center mb-4">
                    {uploadType === "video" ? <VideoIcon className="w-4 h-4 mr-2 text-blue-500" /> : <ImageIcon className="w-4 h-4 mr-2 text-blue-500" />}
                    {uploadType === "video" ? "Video File" : "Image File"}
                  </FormLabel>
                  <FormControl>
                    <FileUpload
                      fileType={uploadType}
                      aspectRatio={form.watch("aspectRatio")}
                      onSuccess={(res: IKUploadResponse) => {
                        form.setValue("videoUrl", res.filePath);
                        if (uploadType === "video" && !form.getValues("thumbnailUrl")) {
                          form.setValue("thumbnailUrl", res.thumbnailUrl || res.filePath);
                        } else if (uploadType === "image") {
                          form.setValue("thumbnailUrl", res.filePath);
                        }
                        showNotification(
                          `${uploadType.charAt(0).toUpperCase() + uploadType.slice(1)} uploaded successfully`,
                          "success"
                        );
                      }}
                      onProgress={(p: number) => setUploadProgress(p)}
                    />
                  </FormControl>
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="w-full bg-slate-200 rounded-full h-2 mt-4 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}

                  {/* Media Preview */}
                  {form.watch("videoUrl") && (
                    <div className="mt-4">
                      <FormLabel className="text-sm font-semibold mb-2 block">Preview</FormLabel>
                      <div
                        className={`relative w-full bg-black rounded-xl overflow-hidden shadow-inner mx-auto ${form.watch("aspectRatio") === "9:16" ? "aspect-[9/16] max-h-[400px]" : "aspect-[16/9]"
                          }`}
                      >
                        {uploadType === "image" ? (
                          <IKImage
                            path={form.watch("videoUrl")}
                            className="w-full h-full object-contain"
                            transformation={[{ height: "800", width: "800" }]}
                            alt="Upload preview"
                          />
                        ) : (
                          <IKVideo
                            path={form.watch("videoUrl")}
                            className="w-full h-full object-contain"
                            controls
                          />
                        )}
                      </div>
                    </div>
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Thumbnail Upload (Only for Video) */}
            {uploadType === "video" && (
              <FormField
                control={form.control}
                name="thumbnailUrl"
                render={() => (
                  <FormItem className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <FormLabel className="text-sm font-semibold flex items-center mb-4">
                      <ImageIcon className="w-4 h-4 mr-2 text-blue-500" />
                      Video Thumbnail (Optional)
                    </FormLabel>
                    <FormControl>
                      <FileUpload
                        fileType="thumbnail"
                        onSuccess={(res: IKUploadResponse) => {
                          form.setValue("thumbnailUrl", res.filePath);
                          showNotification("Thumbnail uploaded", "success");
                        }}
                        onProgress={() => { }}
                      />
                    </FormControl>
                    <FormDescription className="text-xs mt-2 italic">
                      If not provided, a preview will be auto-generated from your video.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Public / Private */}
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-blue-600 border-slate-300"
                    />
                  </FormControl>
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-medium">Make this post public</FormLabel>
                    <FormDescription className="text-xs">
                      Public posts can be discovered by the community.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex gap-4 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="flex-1 text-slate-600 hover:bg-slate-100"
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Upload className="h-5 w-5 mr-3 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5 mr-3" />
                    Publish {uploadType === "video" ? "Video" : "Image"}
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
