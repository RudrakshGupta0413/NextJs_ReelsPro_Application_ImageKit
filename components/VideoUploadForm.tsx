"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, Video as VideoIcon, Image as ImageIcon, Sparkles, Loader2, X, Hash } from "lucide-react";
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
  hashtags: z.array(z.string()).optional(),
});

type PostUploadFormData = z.infer<typeof postUploadSchema>;

interface AISuggestion {
  caption: string;
  hashtags: string[];
}

interface VideoUploadFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function VideoUploadForm({
  open,
  onOpenChange,
}: VideoUploadFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null);
  const [hashtagInput, setHashtagInput] = useState("");
  const [captionAttempts, setCaptionAttempts] = useState<number[]>([]);
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
      hashtags: [],
    },
  });

  const uploadType = form.watch("type");
  const currentHashtags = form.watch("hashtags") || [];

  const handleSuggestCaption = async () => {
    // Rate limit: 2 requests per 60 seconds
    const now = Date.now();
    const recentAttempts = captionAttempts.filter(t => now - t < 60000);
    
    if (recentAttempts.length >= 2) {
      const waitTime = Math.ceil((60000 - (now - recentAttempts[0])) / 1000);
      showNotification(`Rate limit reached. Please wait ${waitTime} seconds.`, "error");
      return;
    }

    const mediaUrl = uploadType === "video" 
      ? form.getValues("thumbnailUrl") 
      : form.getValues("videoUrl");

    if (!mediaUrl) {
      showNotification(`Please upload a ${uploadType} first`, "error");
      return;
    }

    setIsGeneratingAI(true);
    setAiSuggestions([]);
    setSelectedSuggestion(null);
    setCaptionAttempts(prev => [...prev.filter(t => now - t < 60000), now]);
    try {
      const endpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/voxa-ai";

      let fullUrl = "";
      if (mediaUrl.startsWith("http")) {
        fullUrl = mediaUrl;
      } else {
        const sanitizedEndpoint = endpoint.endsWith("/") ? endpoint.slice(0, -1) : endpoint;
        const sanitizedPath = mediaUrl.startsWith("/") ? mediaUrl.slice(1) : mediaUrl;
        fullUrl = `${sanitizedEndpoint}/${sanitizedPath}`;
      }

      const res = await apiClient.generateCaption(fullUrl);
      setAiSuggestions(res.suggestions);
      showNotification("AI generated 3 caption suggestions!", "success");
    } catch (error: any) {
      console.error("AI Generation error:", error);
      const message = error.status === 429 
        ? "AI service is busy. Retrying in the background. Please wait..." 
        : (error.message || "Failed to generate captions");
      showNotification(message, "error");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSelectSuggestion = (index: number) => {
    const suggestion = aiSuggestions[index];
    setSelectedSuggestion(index);
    form.setValue("caption", suggestion.caption);
    // Merge AI hashtags with any existing manual ones (deduplicate)
    const existing = form.getValues("hashtags") || [];
    const merged = [...new Set([...existing, ...suggestion.hashtags])];
    form.setValue("hashtags", merged);
  };

  const handleAddHashtag = () => {
    const tag = hashtagInput
      .trim()
      .toLowerCase()
      .replace(/^#/, "")
      .replace(/\s+/g, "");
    if (!tag) return;
    const existing = form.getValues("hashtags") || [];
    if (!existing.includes(tag)) {
      form.setValue("hashtags", [...existing, tag]);
    }
    setHashtagInput("");
  };

  const handleRemoveHashtag = (tag: string) => {
    const existing = form.getValues("hashtags") || [];
    form.setValue(
      "hashtags",
      existing.filter((t) => t !== tag)
    );
  };

  const handleHashtagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddHashtag();
    }
  };

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
        hashtags: data.hashtags || [],
      });
      showNotification(`${data.type.charAt(0).toUpperCase() + data.type.slice(1)} published successfully`, "success");
      form.reset();
      setUploadProgress(0);
      setAiSuggestions([]);
      setSelectedSuggestion(null);
      setHashtagInput("");
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
                  setAiSuggestions([]);
                  setSelectedSuggestion(null);
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
                  <div className="flex items-center justify-between mb-2">
                    <FormLabel className="text-sm font-semibold">Caption</FormLabel>
                    {(uploadType === "image" || uploadType === "video") && form.watch("videoUrl") && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleSuggestCaption}
                        disabled={isGeneratingAI || captionAttempts.filter(t => Date.now() - t < 60000).length >= 2}
                        className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-2 disabled:opacity-50"
                      >
                        {isGeneratingAI ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5" />
                        )}
                        {isGeneratingAI 
                          ? "Generating..." 
                          : captionAttempts.filter(t => Date.now() - t < 60000).length >= 2
                          ? "Limit reached"
                          : "Suggest Caption"
                        }
                      </Button>
                    )}
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder={`Write a caption for your ${uploadType}...`}
                      className="min-h-[100px] bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* AI Suggestion Picker */}
            {aiSuggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  AI Suggestions — Pick one
                </p>
                <div className="space-y-2">
                  {aiSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSelectSuggestion(index)}
                      className={`w-full text-left p-3 rounded-xl border-2 transition-all duration-200 ${
                        selectedSuggestion === index
                          ? "border-blue-500 bg-blue-50 shadow-sm"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            selectedSuggestion === index
                              ? "border-blue-500 bg-blue-500"
                              : "border-slate-300"
                          }`}
                        >
                          {selectedSuggestion === index && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground leading-relaxed">
                            {suggestion.caption}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {suggestion.hashtags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Hashtags */}
            <div className="space-y-3">
              <FormLabel className="text-sm font-semibold flex items-center gap-2">
                <Hash className="w-4 h-4 text-blue-500" />
                Hashtags
              </FormLabel>

              {/* Hashtag Chips */}
              {currentHashtags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {currentHashtags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveHashtag(tag)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Manual Hashtag Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyDown={handleHashtagKeyDown}
                  placeholder="Type a hashtag and press Enter..."
                  className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddHashtag}
                  className="shrink-0"
                >
                  Add
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Press Enter or comma to add. AI suggestions will also appear here.
              </p>
            </div>

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

                    {/* Thumbnail Preview */}
                    {form.watch("thumbnailUrl") && (
                      <div className="mt-4">
                        <FormLabel className="text-sm font-semibold mb-2 block">Thumbnail Preview</FormLabel>
                        <div
                          className={`relative w-full bg-black rounded-xl overflow-hidden shadow-inner mx-auto ${form.watch("aspectRatio") === "9:16" ? "aspect-[9/16] max-h-[400px]" : "aspect-[16/9]"
                            }`}
                        >
                          <IKImage
                            path={form.watch("thumbnailUrl")}
                            className="w-full h-full object-contain"
                            transformation={[{ height: "800", width: "800" }]}
                            alt="Thumbnail preview"
                          />
                        </div>
                      </div>
                    )}

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
