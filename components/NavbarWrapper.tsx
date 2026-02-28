"use client";

import { usePathname } from "next/navigation";
import NewHeader from "./NewHeader";

export default function NavbarWrapper() {
    const pathname = usePathname();
    const isExcludedPage = ["/", "/login", "/register"].includes(pathname);

    if (isExcludedPage) return null;

    return <NewHeader />;
}
