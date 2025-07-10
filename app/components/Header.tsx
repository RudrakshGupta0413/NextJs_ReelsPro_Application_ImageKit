"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

function Header() {
  const { data: session } = useSession();

  const handleSignout = async () => {
    try {
      await signOut();
    } catch (error) {}
  };

  return (
    <div>
      <button onClick={handleSignout}></button>
      {session ? (
        <div>Welcome</div>
      ) : (
        <div>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </div>
      )}
    </div>
  );
}

export default Header;
