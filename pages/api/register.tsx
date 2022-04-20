const jwt = require("jsonwebtoken")
import type { NextApiRequest, NextApiResponse } from "next"
import User from "../../models/User"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(500).json({ message: "There was an error." })
    return
  }
  if (req.method === "POST") {
    let user = new User(req.body)
    try {
      const response: any = await user.register()
      if (response === "success") {
        res.json({
          token: jwt.sign({ _id: user.data._id, username: user.data.username }, process.env.JWTSECRET, { expiresIn: "365d" }),
          username: user.data.username
        })
      }
    } catch (e) {
      res.status(500).json("There was an error: (code 5420)")
    }
  }
}

export default handler
