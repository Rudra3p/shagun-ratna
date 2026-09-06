import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

// We define the schema here locally just for the seed script
const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: Number, required: true }, // Added mobile field configuration
  password: { type: String, required: true },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
  lastOtpSentAt: { type: Date, default: null },
  refreshToken: { type: String },
}, { timestamps: true });

// Use the existing model if it exists, otherwise create it
const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

const seedAdmin = async () => {
  try {
    const mongodbUri = process.env.MONGODB_URI;

    if (!mongodbUri) {
      console.error("❌ MONGODB_URI is missing in .env");
      process.exit(1);
    }

    await mongoose.connect(mongodbUri);
    console.log("📡 Connected to MongoDB...");

    // Clean start
    await Admin.deleteMany({});
    
    const hashedPassword = await bcrypt.hash('1234567890', 10);

    // The client's own address, and deliberately the one that owns the Resend account:
    // while MAIL_FROM is still Resend's sandbox sender, login codes are delivered to
    // that address and nowhere else. Change both together, or logins stop arriving.
    await Admin.create({
      username: 'shagunratna',
      email: 'shagunratna.app@gmail.com',
      mobile: 9876543210, // Added default numeric mobile field value
      password: hashedPassword,
      loginAttempts: 0,
      lockUntil: null,
      lastOtpSentAt: null,
      refreshToken: null
    });

    console.log("-----------------------------------------");
    console.log("✅ SEED SUCCESSFUL: ADMIN CREATED");
    console.log("📧 Email: shagunratna.app@gmail.com");
    console.log("📱 Mobile: 9876543210");
    console.log("🔑 Password: 1234567890");
    console.log("-----------------------------------------");
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed Error:", err);
    process.exit(1);
  }
};

seedAdmin();