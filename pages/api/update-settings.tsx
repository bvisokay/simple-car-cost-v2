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

  const username = session!.user!.name

  if (typeof req.body.annualMiles !== "string" || req.body.annualMiles === "") {
    throw { error: "Invalid annual miles" }
  }

  if (typeof req.body.usefulMiles !== "string" || req.body.usefulMiles === "") {
    throw { error: "Invalid useful miles" }
  }

  const usefulMiles = parseInt(req.body.usefulMiles)
  const annualMiles = parseInt(req.body.annualMiles)

  if (annualMiles < 1200 || annualMiles > 200000) {
    throw { error: "Invalid annual miles" }
  }

  if (usefulMiles < 12000 || usefulMiles > 500000) {
    throw { error: "Invalid useful miles" }
  }

  //console.log(username, usefulMiles, annualMiles)

  try {
    const client: MongoClient = await connectToDatabase()
    if (!client) {
      res.json({ error: "Error Connecting to Data" })
      throw { error: "Error Connecting to Data" }
    }

    const usersCollection = client.db().collection("users")
    await usersCollection.updateOne({ username: username }, { $set: { annual_miles: annualMiles, useful_miles: usefulMiles } })
    client.close()
    res.status(200).json({ message: "success", error: null })
  } catch (err) {
    //console.error(err)
    //console.log("Error in /api/update-settings")
    throw err
  }
}

export default handler

/* 

Sending request from the front-end
need to send PATCH method
need to send as the body the new and old password


*/
