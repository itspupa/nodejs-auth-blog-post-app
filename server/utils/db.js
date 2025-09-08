import { MongoClient } from "mongodb";

const connectionString = process.env.MONGODB_URI || "mongodb://anuna:123456@localhost:27017";
const dbName = process.env.DB_NAME || "practice-mongo";

export const client = new MongoClient(connectionString, {
  useUnifiedTopology: true,
});

export const db = client.db(dbName);
