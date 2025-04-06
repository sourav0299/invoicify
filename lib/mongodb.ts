import { MongoClient, Db, MongoClientOptions } from "mongodb"

// Environment variables validation
const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI
const MONGODB_DB = process.env.NEXT_PUBLIC_MONGODB_DB

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local")
}

if (!MONGODB_DB) {
  throw new Error("Please define the MONGODB_DB environment variable inside .env.local")
}

interface CachedConnection {
  client: MongoClient | null;
  db: Db | null;
}

// Global cache object
let cached: CachedConnection = {
  client: null,
  db: null,
}

export async function connectToDatabase(): Promise<CachedConnection> {
  if (cached.client && cached.db) {
    return cached
  }

  try {
    const opts: MongoClientOptions = {
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 60000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    }

    const client = await MongoClient.connect(MONGODB_URI as string, opts)
    const db = client.db(MONGODB_DB)

    // Handle connection events
    client.on('error', (error) => {
      console.error('MongoDB connection error:', error)
      cached.client = null
      cached.db = null
    })

    client.on('close', () => {
      console.warn('MongoDB connection closed')
      cached.client = null
      cached.db = null
    })

    // Cache the database connection
    cached = { client, db }

    return cached
  } catch (error) {
    console.error('Failed to connect to database:', error)
    throw new Error('Unable to connect to database')
  }
}

// Add a cleanup function for graceful shutdown
export async function disconnectFromDatabase(): Promise<void> {
  try {
    if (cached.client) {
      await cached.client.close()
      cached.client = null
      cached.db = null
    }
  } catch (error) {
    console.error('Error disconnecting from database:', error)
    throw error
  }
}