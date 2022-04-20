import { MongoClient } from "mongodb"
//const ObjectId = require("mongodb").ObjectId

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI
  const client = await MongoClient.connect(uri!)

  return client
} // end connectToDatabase

export async function addUserDocument(client: MongoClient, document: any) {
  const db = client.db()
  const result = await db.collection("users").insertOne(document)
  return result
}
