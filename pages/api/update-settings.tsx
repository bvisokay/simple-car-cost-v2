import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/client"
import { connectToDatabase } from "../../lib/db"
import { MongoClient } from "mongodb"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") {
    res.status(405).json({ message: "unsupported request" })
    return
  }

  const session = await getSession({ req: req })
  if (!session) {
    res.status(401).json({ message: "Not authenticated" })
    return
  }

  const username = session.user?.name

  interface UserSettings {
    usefulMiles: number
    annualMiles: number
  }

  const { usefulMiles, annualMiles } = req.body as UserSettings

  if (annualMiles < 1200 || annualMiles > 200000) {
    throw { error: "Invalid annual miles" }
  }

  if (usefulMiles < 12000 || usefulMiles > 500000) {
    throw { error: "Invalid useful miles" }
  }

  // round
  const annualMilesRounded = Math.round(annualMiles)
  const usefulMilesRounded = Math.round(usefulMiles)

  try {
    const client: MongoClient | undefined = await connectToDatabase()

    if (!client) {
      res.json({ error: "Error Connecting to Data" })
      throw { error: "Error Connecting to Data" }
    }

    const usersCollection = client.db().collection("users")
    await usersCollection.updateOne({ username: username }, { $set: { annual_miles: annualMilesRounded, useful_miles: usefulMilesRounded } })
    void client.close()
    res.status(200).json({ message: "success", error: null })
  } catch (err) {
    throw { message: "error", errors: err }
  }
}

export default handler

/* 

Sending request from the front-end
need to send PATCH method
need to send as the body the new and old password


*/
