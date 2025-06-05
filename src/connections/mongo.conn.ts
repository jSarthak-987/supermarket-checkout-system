import mongoose from 'mongoose';

export async function connectMongo(uri: string): Promise<void> {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

export async function disconnectMongo(): Promise<void> {
  await mongoose.disconnect();
  console.log('MongoDB disconnected');
}
