import { sign } from "jsonwebtoken"
import { serialize } from "cookie"
import type { NextApiRequest, NextApiResponse } from "next"
import User from "../../models/User"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(500).json({ message: "There was an error." })
    return
  }
  if (req.method === "POST") {
    let user = new User(req.body)
    const { _id, username } = user.data
    try {
      const response: any = await user.register()
      console.log(response)
      if (response === "success") {
        // define and sign token
        const token = sign(
          {
            _id: _id,
            username: username
          },
          process.env.JWTSECRET!,
          { expiresIn: "30d" }
        )

        // create serialized cookie
        const serialized = serialize("SimpleCarCostToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 30,
          path: "/"
        })

        res.setHeader("Set-Cookie", serialized)
        res.status(200).json({
          data: {
            username
          }
        })
      }
    } catch (e) {
      res.status(422).json(e)
    }
  }
}

export default handler
