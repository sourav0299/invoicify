import { MongoClient, type Db } from "mongodb"

const uri = process.env.NEXT_PUBLIC_MONGODB_URI
const dbName = process.env.NEXT_PUBLIC_MONGODB_DB

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

if (!uri) {
  throw new Error("Please define the NEXT_PUBLIC_MONGODB_URI environment variable")
}

if (!dbName) {
  throw new Error("Please define the NEXT_PUBLIC_MONGODB_DB environment variable")
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = await MongoClient.connect(uri!)
  const db = client.db(dbName)

  cachedClient = client
  cachedDb = db

  return { client, db }
}
