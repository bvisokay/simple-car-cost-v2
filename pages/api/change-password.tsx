import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/client"
import { connectToDatabase } from "../../lib/db"
import { hashPassword, verifyPassword } from "../../lib/auth"
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

  const oldPassword = req.body.oldPW

  const newPassword = req.body.newPW

  try {
    const client: MongoClient = await connectToDatabase()
    if (!client) {
      res.json({ error: "Error Connecting to Data" })
      throw { error: "Error Connecting to Data" }
    }

    // reach out to the users collection
    const usersCollection = client.db().collection("users")
    // use to find one user by email
    const user = await usersCollection.findOne({ username: username })
    if (!user) {
      res.status(404).json({ error: "User not found" })
      await client.close()
      throw { error: "User not found" }
    }

    const currentPassword = user.password
    const passwordsAreEqual = await verifyPassword(oldPassword, currentPassword)
    if (!passwordsAreEqual) {
      res.status(403).json({ error: "Old Password Is Incorrect" })
      void client.close()
      throw { error: "Old Password Is Incorrect" }
    }

    const hashedPassword = await hashPassword(newPassword)

    await usersCollection.updateOne({ username: user.username }, { $set: { password: hashedPassword } })

    // passing on error handling for now

    void client.close()
    res.status(200).json({ message: "success", error: null })
  } catch (err) {
    console.error(err)
    console.log("Error in /api/change-password")
    throw err
  }
}

export default handler

/* 

Sending request from the front-end
need to send PATCH method
need to send as the body the new and old password


*/
