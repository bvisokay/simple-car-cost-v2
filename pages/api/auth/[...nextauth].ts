import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { connectToDatabase } from "../../../lib/db"
import { verifyPassword } from "../../../lib/auth"
import type { NextAuthOptions } from "next-auth"
//
//
//
//
//
//

/* Do not override NextAuth.js routes */
/* /api/auth/signin */
/* /api/auth/signout */
/* /api/auth/callback */
/* /api/auth/session */
/* /api/auth/csrf */
/* /api/auth/providers */

//
//
//
//
//

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // Do not delete this key
      name: "Credentials",
      // Do not delete this, not using Next-Auth form but need anyway
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Jane Doe" },
        password: { label: "Password", type: "password", placeholder: "Secure Password" }
      },
      async authorize(credentials) {
        console.log("From [...nextAuth].ts file Credentials", credentials)
        try {
          if (!credentials) {
            throw new Error("No credentials for authorization attempt")
          }

          const { username, password } = credentials

          if (!username || !password) {
            throw new Error("Missing credentials for authorization attempt")
          }

          const client = await connectToDatabase()
          if (!client) {
            throw new Error("Could not connect")
          }
          const usersCollection = client.db().collection("users")
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const user = (await usersCollection.findOne({ username: credentials.username })) as Record<string, unknown>

          if (!user) {
            // throwing new Error inside authorize rejects promise
            void client.close()
            // message will show in flash message
            //throw new Error("No user found")
            // redirects by default
            return null
          }

          if (!credentials || (!credentials.password && typeof credentials.password !== "string")) {
            return null
          }

          if (!user.password || typeof user.password !== "string") {
            return null
          }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const isValid = await verifyPassword(credentials.password, user.password)

          if (!isValid) {
            //this.errors.push("Could not log you in")
            void client.close()
            // message will show in flash message
            //throw new Error("Incorrect username/password")
            return null
          }
          //
          // returning object inside of authorize let NextAuth know auth succeeded
          //
          // this is what gets encoded in the token
          //
          // don't send entire user obj to avoid sending pw
          //
          // close db before return
          //
          void client.close()
          if (isValid) {
            //eslint-disable-next-line
            return {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              name: user.username
              //eslint-disable-next-line
            } as any
          }

          return null
        } catch (err) {
          //throw { message: "Error attempting authorization", errors: err }
          return null
        }
      } // end authorize
    }) // end Providers.Credentials
  ] // end providers key
}

export default NextAuth(authOptions) // end NextAuth()
