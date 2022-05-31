import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/client"
import { connectToDatabase } from "../../lib/db"
import { ObjectId } from "mongodb"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    res.status(405).json({ message: "Method not supported" })
  }
  const session = await getSession({ req: req })
  if (!session) {
    res.status(401).json({ message: "Not authenticated" })
    return
  }
  const username = session!.user!.name
  try {
    // use the username to get the corresponding id
    let client = await connectToDatabase()
    const idResult = await client
      .db()
      .collection("users")
      .findOne({ username: username }, { projection: { _id: 1 } })
    const userId = idResult?._id.toString()
    //console.log(`userId: ${userId}`)

    // See if the session user's id matches the "item-being-edited" authorId sent in
    const tgtCarDoc = await client
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
      // okay to delete

      // actually update document
      await client
        .db()
        .collection("cars")
        .deleteOne({ _id: new ObjectId(req.body.carId) })
      // return result
      //console.log(carDocument)
      client.close()
      res.status(200).json({ message: "success", errors: null })
      return
    }

    client.close()
    res.status(200).json({ message: "failure", data: {}, errors: null })
  } catch (err: any) {
    throw new Error(err)
  }
}

export default handler
