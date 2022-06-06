import type { NextApiRequest, NextApiResponse } from "next"
import User from "../../../models/User"
import { ResponseType, RegAttemptTypes } from "../../../lib/types"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "unsupported request" })
    return
  }
  if (req.method === "POST") {
    const regAttemptData: RegAttemptTypes = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    }

    const user = new User(regAttemptData)
    //const user = new User(req.body)
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
      res.status(500).json({ message: `There was a problem` })
      throw { message: `There was a problem`, errors: err }
    }
  }
}

export default handler
