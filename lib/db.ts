import { MongoClient } from "mongodb"
//const ObjectId = require("mongodb").ObjectId
import { UserDocType } from "./types"

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI
  let client
  if (uri) {
    client = await MongoClient.connect(uri)
  }
  return client
} // end connectToDatabase

export async function addUserDocument(client: MongoClient, document: UserDocType) {
  const db = client.db()
  const result = await db.collection("users").insertOne(document)
  return result
}
