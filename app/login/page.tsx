"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Phone, KeyRound, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNotification } from "@/components/Notification";
import { SimpleHeader } from "../../components/SimpleHeader";

const Login = () => {
  const router = useRouter();
  const { showNotification } = useNotification();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loginMode, setLoginMode] = useState<"password" | "otp">("password");
  const [otpStep, setOtpStep] = useState<"send" | "verify">("send");

  const [otpData, setOtpData] = useState({
    method: "email",
    value: "",
    otp: "",
  });

  const [verifying, setVerifying] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (result?.error) {
      showNotification(result.error, "error");
    } else {
      showNotification("Login successful!", "success");
      router.push("/feed");
    }
  };

  const sendOtp = async () => {
    if (!otpData.value) {
      showNotification("Please enter your email or phone number.", "error");
      return;
    }

    setSendingOtp(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: otpData.method,
          value: otpData.value,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to send OTP.");
      }

      showNotification("OTP sent successfully!", "success");
      setOtpStep("verify");
    } catch (error: any) {
      showNotification(error.message, "error");
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    if (verifying) return;

    if (!otpData.otp) {
      showNotification("Please enter the OTP.", "error");
      return;
    }

    setVerifying(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: otpData.method,
          value: otpData.value.trim().toLowerCase(),
          otp: otpData.otp.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid OTP.");
      }

      await signIn("credentials", {
        email: otpData.value.trim().toLowerCase(),
        otpLogin: "true",
        redirect: false,
      });

      showNotification("OTP verified! Logging you in...", "success");

      router.push("/feed");
    } catch (error: any) {
      showNotification(error.message, "error");
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center px-4 pt-20">
      <SimpleHeader />
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back
          </h2>
          <p className="text-slate-600">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          {/* Login Mode Toggle */}
          <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1 mb-8">
            <button
              type="button"
              onClick={() => {
                setLoginMode("password");
                setOtpStep("send");
              }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all cursor-pointer ${loginMode === "password"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
                }`}
            >
              <KeyRound className="h-4 w-4" />
              Password
            </button>

            <button
              type="button"
              onClick={() => setLoginMode("otp")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all cursor-pointer ${loginMode === "otp"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
                }`}
            >
              <Phone className="h-4 w-4" />
              OTP
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {loginMode === "password" ? (
              <>
                {/* Email */}
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                  />
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-2">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 text-sm text-slate-600"
                    >
                      Remember me
                    </label>
                  </div>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit */}
                <Button type="submit" className="w-full h-12">
                  Sign in
                </Button>
              </>
            ) : (
              <>
                {/* OTP Method Selector */}
                <div>
                  <Label>Login via</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() =>
                        setOtpData({ ...otpData, method: "email", value: "" })
                      }
                      className={`flex items-center justify-center gap-2 py-3 rounded-lg border text-sm font-medium transition-all cursor-pointer ${otpData.method === "email"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                    >
                      <Mail className="h-4 w-4" />
                      Email
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setOtpData({ ...otpData, method: "phone", value: "" })
                      }
                      className={`flex items-center justify-center gap-2 py-3 rounded-lg border text-sm font-medium transition-all cursor-pointer ${otpData.method === "phone"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                    >
                      <Phone className="h-4 w-4" />
                      Phone
                    </button>
                  </div>
                </div>

                {/* OTP Input */}
                <div>
                  <Label htmlFor="otp-value">
                    {otpData.method === "email" ? "Email address" : "Phone number"}
                  </Label>
                  <Input
                    id="otp-value"
                    type={otpData.method === "email" ? "email" : "tel"}
                    placeholder={
                      otpData.method === "email"
                        ? "john@example.com"
                        : "+91 9876543210"
                    }
                    value={otpData.value}
                    onChange={(e) =>
                      setOtpData({ ...otpData, value: e.target.value })
                    }
                    disabled={otpStep === "verify"}
                  />
                </div>

                {/* Send OTP Button */}
                {otpStep === "send" && (
                  <Button
                    type="button"
                    onClick={sendOtp}
                    disabled={sendingOtp}
                    className="w-full h-12"
                  >
                    {sendingOtp ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send OTP
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}

                {/* Verify OTP */}
                {otpStep === "verify" && (
                  <div className="space-y-4">
                    <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3">
                      <p className="text-sm text-green-700">
                        OTP sent to <strong>{otpData.value}</strong>
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="otp-code">Enter OTP</Label>
                      <Input
                        id="otp-code"
                        placeholder="Enter 6-digit OTP"
                        value={otpData.otp}
                        onChange={(e) =>
                          setOtpData({ ...otpData, otp: e.target.value })
                        }
                        maxLength={6}
                        className="text-center text-lg tracking-[0.5em] font-mono"
                      />
                    </div>

                    <Button
                      type="button"
                      onClick={verifyOtp}
                      disabled={verifying}
                      className="w-full h-12"
                    >
                      {verifying ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Verify & Sign in"
                      )}
                    </Button>

                    <button
                      type="button"
                      onClick={() => {
                        setOtpStep("send");
                        setOtpData({ ...otpData, otp: "" });
                      }}
                      className="w-full text-sm text-slate-500 hover:text-slate-700 cursor-pointer"
                    >
                      Didn&apos;t receive it? Resend OTP
                    </button>
                  </div>
                )}
              </>
            )}
          </form>

          {/* Divider + Sign up link */}
          <div className="mt-6 pt-6 border-t border-slate-200 text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
