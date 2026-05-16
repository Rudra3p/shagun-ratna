import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

// 1. Force initialize the global object if it doesn't exist
if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

// 2. Use a direct reference to the global cache object
const cached = global.mongoose;

async function dbConnect(): Promise<typeof mongoose> {
  // 3. Use the '!' operator to tell TS: "Trust me, this is defined"
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // MONGODB_URI is validated above; use non-null assertion to satisfy TS
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      console.log("✅ MongoDB Connected (TypeScript)");
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; 
    throw e;
  }

  return cached.conn;
}

export default dbConnect;