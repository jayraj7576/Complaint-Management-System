import mongoose from 'mongoose';

// Cache connection
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  const MONGODB_URI = process.env.MONGODB_URI;
  // If no MongoDB URI, skip connection (static auth mode)
  if (!MONGODB_URI) {
    console.warn('MongoDB URI not configured - running in static auth mode');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('[Database] Initializing new MongoDB connection attempt...');
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('[Database] MongoDB connection established successfully.');
      return mongoose;
    }).catch((err) => {
      console.error('[Database] MongoDB connection FAILED:', err.message);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    console.error('[Database] Connection promise rejected:', e.message);
    throw e;
  }
}

export default dbConnect;
