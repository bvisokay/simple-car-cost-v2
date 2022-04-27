import { NextResponse } from "next/server"
import { verify } from "jsonwebtoken"

export default function middleware(req) {
  const { cookies } = req
  const jwt = cookies.SimpleCarCostToken
  const url = req.url

  if (url.includes("/profile") || url.includes("/landing")) {
    if (jwt === undefined) {
      const url = req.nextUrl.clone()
      url.pathname = "/login"
      return NextResponse.rewrite(url)
    }

    try {
      const jwtPayload = verify(jwt, process.env.JWTSECRET)
      console.log(`middleware ran, jwtPayload.username: ${jwtPayload.username}`)
      let response = NextResponse.next()
      response.cookie("Hello", jwtPayload.username)
      return response
    } catch (e) {
      const url = req.nextUrl.clone()
      url.pathname = "/login"
      return NextResponse.rewrite(url)
    }
  }

  return NextResponse.next()
}
