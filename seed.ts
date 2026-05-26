// seed.ts
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

// We define the schema here locally just for the seed script
const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null }
});

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

    await Admin.create({
      username: 'rudra',
      email: 'rudra090207@gmail.com',
      password: hashedPassword,
      loginAttempts: 0,
      lockUntil: null
    });

    console.log("-----------------------------------------");
    console.log("✅ SEED SUCCESSFUL: ADMIN CREATED");
    console.log("📧 Email: rudra090207@gmail.com");
    console.log("🔑 Password: 1234567890");
    console.log("-----------------------------------------");
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed Error:", err);
    process.exit(1);
  }
};

seedAdmin();