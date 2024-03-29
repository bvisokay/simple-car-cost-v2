import type { NextApiRequest, NextApiResponse } from "next"
import { connectToDatabase } from "../../lib/db"
import { ObjectId } from "mongodb"
import { MatchDoc, PrimaryCarFields, UpdateTypes } from "../../lib/types"
// auth
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") {
    res.status(405).json({ message: "Method not supported" })
  }
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({ message: "Not authenticated" })
  }
  if (!session.user) {
    res.status(401).json({ message: "Not authenticated" })
    return
  }
  const username = session.user?.name
  try {
    // use the username to get the corresponding id
    const client = await connectToDatabase()
    if (!client) {
      throw { message: "Connection unsuccessful" }
    }
    const idResult = await client
      .db()
      .collection("users")
      .findOne({ username: username }, { projection: { _id: 1 } })
    const userId = idResult?._id.toString()
    //console.log(`userId: ${userId}`)

    const { carId, description, price, miles, link } = req.body as UpdateTypes

    // See if the session user's id matches the "item-being-edited" authorId sent in
    const tgtCarDoc: MatchDoc | null = await client
      .db()
      .collection("cars")
      .findOne({ _id: new ObjectId(carId) }, { projection: { _id: 0, authorId: 1 } })

    //console.log(tgtCarDoc)

    const editableItemAuthorId = tgtCarDoc?.authorId.toString()

    //console.log(editableItemAuthorId)

    if (editableItemAuthorId !== userId) {
      throw { error: "You do not have permission to perform that action" }
    }

    if (editableItemAuthorId === userId) {
      // okay to edit
      // clean up req.body to get rid of any bogus fields
      const updatedFields: PrimaryCarFields = {
        description: description,
        price: price,
        miles: miles,
        link: link
      }
      // server-side validation
      if (typeof updatedFields.description !== "string") {
        updatedFields.description === "---"
      }
      if (updatedFields.description === "") {
        throw new Error("You must enter a description")
      }
      if (typeof updatedFields.price !== "number") {
        updatedFields.price === 1
      }
      if (updatedFields.price > 200000 || updatedFields.price < 1) {
        updatedFields.price === 1
      }
      if (typeof updatedFields.miles !== "number") {
        updatedFields.miles === 1
      }
      if (updatedFields.miles > 350000 || updatedFields.miles < 1) {
        updatedFields.miles === 1
      }
      if (typeof updatedFields.link !== "string") {
        updatedFields.link === ""
      }
      if (updatedFields.link.length && !updatedFields.link.startsWith("https://")) {
        updatedFields.link = `https://${updatedFields.link}`
      }
      // actually update document
      const carDocument = await client
        .db()
        .collection("cars")
        .findOneAndUpdate({ _id: new ObjectId(carId) }, { $set: { description: updatedFields.description, price: updatedFields.price, miles: updatedFields.miles, link: updatedFields.link } })
      // return result
      //console.log(carDocument)
      void client.close()
      res.status(200).json({ message: "success", data: carDocument, errors: null })
      return
    }

    void client.close()
    res.status(200).json({ message: "failure", data: {}, errors: null })
  } catch (err) {
    throw { message: "error", errors: err }
  }
}

export default handler
