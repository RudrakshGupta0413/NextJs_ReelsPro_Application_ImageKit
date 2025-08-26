"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera, Save } from "lucide-react";
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
import FeedHeader from "../feed/FeedHeader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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

export default function EditProfilePage() {
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState("/placeholder.svg");
  const [coverPreview, setCoverPreview] = useState("/placeholder.svg");
  const router = useRouter();

  const { data: session, update } = useSession();
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      username: "",
      bio: "",
      location: "",
      website: "",
    },
  });

  useEffect(() => {
    if (session?.user) {
      form.reset({
        name: session.user.name || "",
        username: session.user.username || "",
        bio: session.user.bio || "",
        location: session.user.location || "",
        website: session.user.website || "",
      });
      setProfilePreview(session.user.profilePicture || "/placeholder.svg");
      setCoverPreview(session.user.coverImage || "/placeholder.svg");
    }
  }, [session, form]);

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
        setProfilePicture(file);
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
      if (profilePicture) formData.append("profileImage", profilePicture);
      if (coverImage) formData.append("coverImage", coverImage);

      const res = await fetch("/api/user/editprofile", {
        method: "PATCH",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update profile");

      await update({
        ...session,
        user: {
          ...session?.user,
          name: data.name,
          username: data.username,
          bio: data.bio,
          location: data.location,
          website: data.website,
        },
      });

      toast.success("Your profile was updated!");
      router.push("/profile");
    } catch (err) {
      toast.error((err as Error).message || "Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <FeedHeader />

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
                <Button type="button" variant="outline" className="hover:cursor-pointer">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" className="hover:cursor-pointer">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
}