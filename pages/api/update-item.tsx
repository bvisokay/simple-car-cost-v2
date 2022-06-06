import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/client"
import { connectToDatabase } from "../../lib/db"
import { ObjectId } from "mongodb"
import { MatchDoc, PrimaryCarFields } from "../../lib/types"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") {
    res.status(405).json({ message: "Method not supported" })
  }
  const session = await getSession({ req: req })
  if (!session) {
    res.status(401).json({ message: "Not authenticated" })
    return
  }
  const username = session.user?.name
  try {
    // use the username to get the corresponding id
    const client = await connectToDatabase()
    const idResult = await client
      .db()
      .collection("users")
      .findOne({ username: username }, { projection: { _id: 1 } })
    const userId = idResult?._id.toString()
    //console.log(`userId: ${userId}`)

    // See if the session user's id matches the "item-being-edited" authorId sent in
    const tgtCarDoc: MatchDoc | null = await client
      .db()
      .collection("cars")
      .findOne({ _id: new ObjectId(req.body.carId) }, { projection: { _id: 0, authorId: 1 } })

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
        description: req.body.description,
        price: parseFloat(req.body.price),
        miles: parseFloat(req.body.miles),
        link: req.body.link
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
        .findOneAndUpdate({ _id: new ObjectId(req.body.carId) }, { $set: { description: updatedFields.description, price: updatedFields.price, miles: updatedFields.miles, link: updatedFields.link } })
      // return result
      //console.log(carDocument)
      await client.close()
      res.status(200).json({ message: "success", data: carDocument, errors: null })
      return
    }

    await client.close()
    res.status(200).json({ message: "failure", data: {}, errors: null })
  } catch (err) {
    throw { message: "error", errors: err }
  }
}

export default handler
