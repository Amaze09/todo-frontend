// src/types/nextauth.d.ts
import { Session, JWT } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface JWT {
    id: string;
    name?: string | null;
  }
}