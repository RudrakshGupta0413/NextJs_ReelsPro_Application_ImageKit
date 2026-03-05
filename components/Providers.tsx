"use client";

import { ImageKitProvider } from "imagekitio-next";
import { SessionProvider } from "next-auth/react";
import { NotificationProvider } from "./Notification";
import { HeroUIProvider } from "@heroui/react";

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;

export default function Providers({ children }: { children: React.ReactNode }) {
  const authenticator = async () => {
    try {
      const response = await fetch("/api/imagekit-auth");

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();
      const { signature, token, expire } = data;
      return { signature, expire, token };
    } catch (error) {
      console.error("ImageKit Authenticator Error:", error);
      throw new Error("Failed to fetch ImageKit authentication parameters");
    }
  };

  return (
    <SessionProvider>
      <NotificationProvider>
        <HeroUIProvider>
          <ImageKitProvider
            urlEndpoint={urlEndpoint}
            publicKey={publicKey}
            authenticator={authenticator}
          >
            {children}
          </ImageKitProvider>
        </HeroUIProvider>
      </NotificationProvider>
    </SessionProvider>
  );
}
