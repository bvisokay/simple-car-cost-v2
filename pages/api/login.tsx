import type { NextApiRequest, NextApiResponse } from "next"
import { sign } from "jsonwebtoken"
import { serialize } from "cookie"
import User from "../../models/User"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(500).json({ message: "There was an error." })
    return
  }
  if (req.method === "POST") {
    console.log("/api/login endpoint hit with a POST request")
    let user = new User(req.body)

    try {
      // Check db for match by calling user.login()
      const result = await user.login()
      // if there is a take the info returned create token
      if (result && result.message === "success") {
        // define and sign token
        const token = sign(
          {
            _id: result.data._id.toString(),
            username: result.data.username
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
            username: result.data.username
          }
        })
      }
    } catch (e) {
      res.status(422).json(e)
    }
  }
}
export default handler
