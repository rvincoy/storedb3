import mongoose from 'mongoose';

interface UserDocument extends mongoose.Document {
  googleId?: string;
  name?: string;
  email?: string;
  role: 'admin' | 'staff';
}

const UserSchema = new mongoose.Schema<UserDocument>({
  googleId: String,
  name: String,
  email: String,
  role: {
    type: String,
    enum: ['admin', 'staff'],
    default: 'staff',
  },
});

export default mongoose.model<UserDocument>('User', UserSchema);
