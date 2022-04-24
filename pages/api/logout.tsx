import type { NextApiRequest, NextApiResponse } from "next"
import { serialize } from "cookie"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(500).json({ message: "There was an error." })
    return
  }

  console.log(`/api/logout hit with a GET request`)
  const { cookies } = req
  const jwt = cookies.SimpleCarCostToken

  if (!jwt) {
    res.json({ message: "Not logged in" })
  } else {
    const serialized = serialize("SimpleCarCostToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: -1,
      path: "/"
    })

    res.setHeader("Set-Cookie", serialized)
    res.status(200).json({ message: "Successfully logged out." })
  }
}
export default handler
