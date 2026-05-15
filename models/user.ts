import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;        // Buyer's Full Name
  email: string;       
  phone: string;       // Crucial for jewelry orders/OTP
  password: string;
  refreshToken?: string; 
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshToken: { type: String }, 
}, { timestamps: true });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;