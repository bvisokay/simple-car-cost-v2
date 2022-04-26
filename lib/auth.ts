import { hash, compare } from "bcryptjs"
import { verify } from "jsonwebtoken"

export async function hashPassword(password: string) {
  const hashedPassword = await hash(password, 12)
  return hashedPassword
}

export async function verifyPassword(password: string, hashedPassword: string) {
  const isValid = await compare(password, hashedPassword)
  return isValid
}

export async function getJWTPayload(context: any) {
  const { cookies } = context.req
  const jwt = cookies.SimpleCarCostToken
  let user: any = ""
  if (jwt === undefined) {
    user = ""
    return user
  }
  try {
    const jwtPayload: any = verify(jwt, process.env.JWTSECRET!)
    if (jwtPayload) {
      user = jwtPayload.username
      return user
    }
  } catch (e) {
    user = ""
    return user
  }
}

// BE CAREFUL IMPORTING
/* export async function getServerSideProps(context: any) {
  const { cookies } = context.req
  const jwt = cookies.SimpleCarCostToken
  let user: any = null
  if (jwt === undefined) {
    user = ""
  }
  try {
    const jwtPayload: any = verify(jwt, process.env.JWTSECRET!)
    if (jwtPayload) {
      user = jwtPayload.username
    }
  } catch (e) {
    user = ""
  }

  return {
    props: {
      user
    }
  }
} */
