import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username?: string;
      profilePicture?: string;
      coverImage?: string;
      bio?: string;
      website?: string;
      location?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    username?: string;
    profilePicture?: string;
    coverImage?: string;
    bio?: string;
    website?: string;
    location?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username?: string;
    profilePicture?: string;
    coverImage?: string;
    bio?: string;
    website?: string;
    location?: string;
  }
}
