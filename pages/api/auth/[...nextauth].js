import NextAuth from "next-auth"
import Providers from "next-auth/providers"
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
    // setting explicityly although not required
    jwt: true,
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        const client = await connectToDatabase()
        const usersCollection = client.db().collection("users")
        const user = await usersCollection.findOne({ username: credentials.username })

        if (!user) {
          // throwing new Error inside authorize rejects promise
          client.close()
          // message will show in flash message
          throw new Error("No user found")
          // redirects by default
        }

        const isValid = await verifyPassword(credentials.password, user.password)

        if (!isValid) {
          //this.errors.push("Could not log you in")
          client.close()
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
        client.close()
        return {
          name: user.username
        }
      } // end authorize
    }) // end Providers.Credentials
  ] // end providers key
}) // end NextAuth()