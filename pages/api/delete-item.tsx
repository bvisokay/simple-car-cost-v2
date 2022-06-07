import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/client"
import { connectToDatabase } from "../../lib/db"
import { ObjectId } from "mongodb"
import { MatchDoc } from "../../lib/types"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
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
    if (!client) {
      throw { message: "Could not connect" }
    }

    const idResult = await client
      .db()
      .collection("users")
      .findOne({ username: username }, { projection: { _id: 1 } })
    const userId = idResult?._id.toString()
    //console.log(`userId: ${userId}`)

    const carId: string = req.body.carId

    // See if the session user's id matches the "item-being-edited" authorId sent in
    const tgtCarDoc: MatchDoc | null = await client
      .db()
      .collection("cars")
      .findOne({ _id: new ObjectId(carId) }, { projection: { _id: 0, authorId: 1 } })

    let editableItemAuthorId
    if (tgtCarDoc !== null) {
      editableItemAuthorId = tgtCarDoc?.authorId?.toString()
    }

    //console.log(editableItemAuthorId)

    if (editableItemAuthorId !== userId) {
      throw { error: "You do not have permission to perform that action" }
    }

    if (editableItemAuthorId === userId) {
      // okay to delete so update document in db
      await client
        .db()
        .collection("cars")
        .deleteOne({ _id: new ObjectId(carId) })
      // return result
      //console.log(carDocument)
      void client.close()
      res.status(200).json({ message: "success", errors: null })
      return
    }

    void client.close()
    res.status(200).json({ message: "failure", data: {}, errors: null })
  } catch (err) {
    throw { message: "error", errors: err }
  }
}

export default handler
