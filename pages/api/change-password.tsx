import type { NextApiRequest, NextApiResponse } from "next"
import { connectToDatabase } from "../../lib/db"
import { hashPassword, verifyPassword } from "../../lib/auth"
import { MongoClient } from "mongodb"
import { UpdatePassTypes } from "../../lib/types"

// auth
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") {
    res.status(405).json({ message: "unsupported request" })
    return
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({ message: "Not authenticated" })
  }
  if (!session.user) {
    res.status(401).json({ message: "Not authenticated" })
    return
  }

  const username = session.user?.name as string

  const { oldPW, newPW }: UpdatePassTypes = req.body as UpdatePassTypes

  //const oldPassword: string = req.body.oldPW
  //const newPassword: string = req.body.newPW

  try {
    const client: MongoClient | undefined = await connectToDatabase()
    if (!client) {
      res.json({ error: "Error Connecting to Data" })
      throw { error: "Error Connecting to Data" }
    }

    const usersCollection = client.db().collection("users")
    const user = await usersCollection.findOne({ username: username })

    if (!user) {
      res.status(404).json({ error: "User not found" })
      void client.close()
      throw { error: "User not found" }
    }

    const currentPassword: string = user.password as string
    const passwordsAreEqual = await verifyPassword(oldPW, currentPassword)
    if (!passwordsAreEqual) {
      res.status(403).json({ error: "Old Password Is Incorrect" })
      void client.close()
      throw { error: "Old Password Is Incorrect" }
    }

    const hashedPassword = await hashPassword(newPW)

    const usernameValueToUpdate: string = user.username as string

    await usersCollection.updateOne({ username: usernameValueToUpdate }, { $set: { password: hashedPassword } })

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
