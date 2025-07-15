"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Eye, EyeOff, Video, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNotification } from "@/components/Notification"; // Adjust if path differs

const Login = () => {
  const router = useRouter();
  const { showNotification } = useNotification();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false
    });

    if (result?.error) {
      showNotification(result.error, "error");
    } else {
      showNotification("Login successful!", "success");
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Back to Home */}
        <div className="flex items-center justify-center">
          <Link
            href="/"
            className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Logo & Title */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="bg-gradient-to-r from-slate-600 to-blue-600 p-3 rounded-xl">
              <Video className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-slate-600 to-blue-600 bg-clip-text text-transparent">
              Reels Pro App
            </span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h2>
          <p className="text-slate-600">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-slate-700 font-medium">
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-2 h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-slate-700 font-medium">
                Password
              </Label>
              <div className="relative mt-2">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500 pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-slate-600">
                  Remember me
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-slate-600 to-blue-600 hover:from-slate-700 hover:to-blue-700 text-white font-semibold rounded-lg"
            >
              Sign in
            </Button>

            <div className="text-center">
              <span className="text-slate-600">Don&apos;t have an account? </span>
              <Link href="/register" className="text-blue-600 hover:text-blue-500 font-medium">
                Sign up
              </Link>
            </div>
          </form>

          {/* Optional: Social Login (if applicable in future) */}
        </div>
      </div>
    </div>
  );
};

export default Login;
