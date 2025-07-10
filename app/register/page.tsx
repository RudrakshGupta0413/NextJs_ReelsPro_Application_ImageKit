"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter(); // we can push user anywhere after registration

  router.push("/login"); // redirect to login page after registration

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError("Registration failed");
      }

      router.push("/login");
    } catch (error) {
        console.error("Registration error:", error);
        setError("An error occurred during registration");
    }
  };

  return <div>page</div>;
}

export default page;
