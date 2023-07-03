import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { connectToDatabase } from "../../../lib/db"
import { verifyPassword } from "../../../lib/auth"
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

export default NextAuth({
  session: {
    // setting explicitly although not required
    jwt: true
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const client = await connectToDatabase()
          const usersCollection = client.db().collection("users")
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const user = await usersCollection.findOne({ username: credentials.username })

          if (!user) {
            // throwing new Error inside authorize rejects promise
            void client.close()
            // message will show in flash message
            throw new Error("No user found")
            // redirects by default
          }

          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const isValid = await verifyPassword(credentials.password, user.password)

          if (!isValid) {
            //this.errors.push("Could not log you in")
            void client.close()
            // message will show in flash message
            throw new Error("Incorrect username/password")
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

          return {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            name: user.username
          }
        } catch (err) {
          throw { message: "Error attempting authorization", errors: err }
        }
      } // end authorize
    }) // end Providers.Credentials
  ] // end providers key
}) // end NextAuth()
