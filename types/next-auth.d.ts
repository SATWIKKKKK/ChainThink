import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module '@auth/core/adapters' {
  interface AdapterUser {
    id: string;
    email: string;
    emailVerified: Date | null;
    name?: string | null;
    image?: string | null;
  }
}