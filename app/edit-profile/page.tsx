"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Camera, Save } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, underscores"),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  website: z
    .string()
    .max(100)
    .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Enter a valid website")
    .optional()
    .or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const currentUser = {
  name: "John Doe",
  username: "johndoe",
  bio: "Content creator 🎬 | Travel enthusiast ✈️ | Coffee lover ☕",
  avatar: "/placeholder.svg",
  coverImage: "/placeholder.svg",
  location: "New York, USA",
  website: "johndoe.com",
};

export default function EditProfilePage() {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState(currentUser.avatar);
  const [coverPreview, setCoverPreview] = useState(currentUser.coverImage);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: currentUser.name,
      username: currentUser.username,
      bio: currentUser.bio,
      location: currentUser.location,
      website: currentUser.website,
    },
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "cover"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = type === "profile" ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(
        `${
          type === "profile" ? "Profile" : "Cover"
        } image must be smaller than ${type === "profile" ? "5MB" : "10MB"}`
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (type === "profile") {
        setProfileImage(file);
        setProfilePreview(ev.target?.result as string);
      } else {
        setCoverImage(file);
        setCoverPreview(ev.target?.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("username", data.username);
      formData.append("bio", data.bio || "");
      formData.append("location", data.location || "");
      formData.append("website", data.website || "");
      if (profileImage) formData.append("profileImage", profileImage);
      if (coverImage) formData.append("coverImage", coverImage);

      const res = await fetch("/api/user/editprofile", {
        method: "PATCH",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update profile");

      toast.success("Your profile was updated!");
    } catch (err) {
      toast.error((err as Error).message || "Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/profile">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Edit Profile</h1>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Cover Image */}
            <Card>
              <CardHeader>
                <CardTitle>Cover Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="h-48 rounded-lg overflow-hidden">
                    <img
                      src={coverPreview}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition">
                    <Label
                      htmlFor="cover-upload"
                      className="cursor-pointer inline-flex items-center px-3 py-2 rounded-md bg-secondary text-sm text-black"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Change Cover
                    </Label>
                  </div>
                  <Input
                    id="cover-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "cover")}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Profile Info */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Image */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profilePreview} />
                      <AvatarFallback>
                        {form.watch("name")?.[0] ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 rounded-full">
                      <Label
                        htmlFor="profile-upload"
                        className="cursor-pointer inline-flex items-center px-3 py-2 rounded-md bg-secondary text-sm text-black"
                      >
                        <Camera className="h-5 w-5" />
                      </Label>
                    </div>
                    <Input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "profile")}
                    />
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your display name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell people about yourself..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Where are you based?"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Link href="/profile">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2 hover:cursor-pointer" />
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
}
