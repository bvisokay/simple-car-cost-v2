import { NextResponse } from "next/server"
import { verify } from "jsonwebtoken"

export default function middleware(req, res) {
  const { cookies } = req
  const jwt = cookies.SimpleCarCostToken
  const url = req.url

  if (url.includes("/landing")) {
    if (jwt === undefined) {
      const url = req.nextUrl.clone()
      url.pathname = "/login"
      return NextResponse.rewrite(url)
    }

    try {
      const user = verify(jwt, process.env.JWTSECRET)
      // see the token payload on the server
      console.log(`user from middleware: ${user.username}`)
      // not sure how to send data from token payload to the client
      //res.json({ user: user.username })
      //
      return NextResponse.next()
    } catch (e) {
      const url = req.nextUrl.clone()
      url.pathname = "/login"
      return NextResponse.rewrite(url)
    }
  }

  return NextResponse.next()
}
