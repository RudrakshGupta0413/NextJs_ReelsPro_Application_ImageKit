"use client";

import Link from "next/link";
import { Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export function SimpleHeader() {
    const { data: session } = useSession();
    const pathname = usePathname();

    return (
        <header className="absolute top-0 left-0 right-0 z-50 p-6 flex items-center justify-between container mx-auto">
            <Link href="/" className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                    <Video className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Reels Pro App
                </span>
            </Link>

            <div className="flex items-center space-x-4">
                {session && pathname === "/" ? (
                    <Link href="/feed">
                        <Button className="bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25 px-6 rounded-xl hover:cursor-pointer">
                            Go to Feed
                        </Button>
                    </Link>
                ) : (
                    <>
                        <Link href="/login">
                            <Button
                                variant={pathname === "/login" ? "secondary" : "ghost"}
                                className="text-foreground hover:bg-neutral-100 hover:cursor-pointer"
                            >
                                Login
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button className="bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25 px-6 rounded-xl hover:cursor-pointer">
                                Register
                            </Button>
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}
