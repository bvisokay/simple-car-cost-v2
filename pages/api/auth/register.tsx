import type { NextApiRequest, NextApiResponse } from "next"
import User from "../../../models/User"
import { ResponseType } from "../../../lib/types"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "unsupported request" })
    return
  }
  if (req.method === "POST") {
    const user = new User(req.body)
    try {
      const registrationResult = (await user.register()) as ResponseType

      if (registrationResult.message !== "success") {
        res.status(200).json({ message: "failure" })
        return
      }

      if (registrationResult.message === "success") {
        res.status(200).json({ message: "success" })
        return
      }

      res.status(500).json({ message: `There was a problem registering` })
    } catch (err) {
      res.status(500).json({ message: `There was a problem: ${err}` })
      throw new Error(`Problem registering: ${err}`)
    }
  }
}

export default handler
