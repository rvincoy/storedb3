// src/types/express.d.ts
import 'express';

interface AppUser {
  _id?: unknown;
  googleId: string;
  UserName: string;
  DisplayName: string;
  email: string;
  Role: string;
}

declare global {
  namespace Express {
    interface User extends AppUser {}
  }
}

export {};