import { ObjectId } from 'mongodb';

// Merges into passport's `Express.User` (see @types/passport), which
// `Request.user` is already typed against. Optional because req.user is
// populated by two different code paths with different shapes:
// passport session auth attaches the full Mongo user doc, while
// middleware/auth.ts's requireJWT attaches the decoded JWT payload.
declare global {
  namespace Express {
    interface User {
      _id?: ObjectId;
      id?: string;
      googleId?: string;
      UserName?: string;
      DisplayName?: string;
      firstName?: string;
      email?: string;
      Role?: string;
      iat?: number;
      exp?: number;
    }
  }
}

export {};
