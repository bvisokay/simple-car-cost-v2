import { hash, compare } from "bcryptjs"
import { GetServerSidePropsContext } from "next"
import { Session } from "next-auth"
import { getSession } from "next-auth/react"

export async function hashPassword(password: string) {
  const hashedPassword = await hash(password, 12)
  return hashedPassword
}

export async function verifyPassword(password: string, hashedPassword: string) {
  const isValid = await compare(password, hashedPassword)
  return isValid
}

export async function runServerSidePageGuard(context: GetServerSidePropsContext) {
  const session: Session | null = await getSession({ req: context.req })

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }

  return {
    props: {
      session
    }
  }
}
