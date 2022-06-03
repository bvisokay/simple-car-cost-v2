import type { NextApiRequest, NextApiResponse } from "next"
import User from "../../../models/User"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(500).json({ message: "There was an error." })
    return
  }
  if (req.method === "POST") {
    const user = new User(req.body)
    //console.log(req.body)
    //console.log("user.data.username:", user.data.username)
    try {
      const response: any = await user.register()
      if (response.message === "success") {
        res.status(200).json({
          message: "success",
          data: {
            username: user.data.username
          }
        })
      } else {
        res.status(422).json({ errors: response.errors })
      }
    } catch (err) {
      res.status(422).json({ errors: err })
    }
  }
}

export default handler
