import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdmin extends Document {
  username: string;
  email: string;
  password: string;
  
  otp: string | null;            // Stores the 32-character Magic Link token hex
  otptimeout: Date | null;       // Valid for 11 minutes (Backend validation buffer)
  
  loginAttempts: number;         // Tracks wrong passwords up to 4-5 tries to trigger rescue
  lockUntil: Date | null;        // Freezes password authentication attempts for 10 mins
  
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema: Schema = new Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: { 
    type: String, 
    required: true 
  },
  otp: { 
    type: String, 
    default: null 
  },
  otptimeout: { 
    type: Date, 
    default: null 
  },
  loginAttempts: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  lockUntil: { 
    type: Date, 
    default: null 
  },
  refreshToken: { 
    type: String 
  },
}, { timestamps: true });

const Admin: Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);

export default Admin;