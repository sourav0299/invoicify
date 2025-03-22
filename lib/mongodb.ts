import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI
const MONGODB_DB = process.env.NEXT_PUBLIC_MONGODB_DB

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local")
}

if (!MONGODB_DB) {
  throw new Error("Please define the MONGODB_DB environment variable inside .env.local")
}

let cachedClient = null
let cachedDb = null

export async function connectToDatabase() {
  // If we have cached values, use them
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  // Connect to the MongoDB server
  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  const db = client.db(MONGODB_DB)

  // Cache the client and db connection
  cachedClient = client
  cachedDb = db

  return { client, db }
}

