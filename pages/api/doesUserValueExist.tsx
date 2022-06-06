import type { NextApiRequest, NextApiResponse } from "next"
import User from "../../models/User"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const result = await User.doesUserValueExist(req.body.key, req.body.value)
      if (result) {
        //Send message as answer to doesUserValueExist
        res.json({ message: true })
      } else {
        //Send message as answer to doesUserValueExist
        res.json({ message: false })
      }
    } catch (err) {
      res.json({ message: "error", errors: err })
    }
  } else {
    res.json({ message: "There was an error" }) // not POST request
  }
}

export default handler
