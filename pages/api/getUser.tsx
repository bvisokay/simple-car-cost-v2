import type { NextApiRequest, NextApiResponse } from "next"
import { verify } from "jsonwebtoken"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).json("Error")
  }

  console.log("From server: /api/getUser endpoint has been hit with GET request")

  // Endpoint to be called from Layout comp to set global use state

  // Get access to the cookies
  const { cookies } = req
  const jwt = cookies.SimpleCarCostToken

  // See if there is a token and respond if not
  if (jwt === undefined) {
    res.status(200).json({ message: "No logged in user" })
  }

  // See if the token is valid
  try {
    const jwtPayload = verify(jwt, process.env.JWTSECRET!)
    res.status(200).json({ message: "success", user: jwtPayload })
  } catch (e) {}

  // Send back token payload (username, _id?)
}

export default handler
