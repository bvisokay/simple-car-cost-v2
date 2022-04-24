import validator from "validator"
import { hashPassword, verifyPassword } from "../lib/auth"
import { addUserDocument, connectToDatabase } from "../lib/db"

export default class User {
  data: any
  errors: string[]

  constructor(data: any) {
    this.data = data
    this.errors = []
  }

  //cleanup
  cleanup() {
    if (typeof this.data.username !== "string") {
      this.data.username = ""
    }
    if (typeof this.data.email !== "string") {
      this.data.email = ""
    }
    if (typeof this.data.password !== "string") {
      this.data.password = ""
    }

    // get rid of any bogus properties
    // add a few more of my own
    this.data = {
      username: this.data.username.trim().toLowerCase(),
      email: this.data.email.trim().toLowerCase(),
      password: this.data.password,
      useful_miles: 150000,
      monthly_miles: 1250,
      created_date: new Date()
    }
  } // end cleanup

  //validate
  validate() {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        if (this.data.username == "") {
          this.errors.push("You must provide a username.")
        }
        if (this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {
          this.errors.push("Username can only contain letters and numbers.")
        }
        if (!validator.isEmail(this.data.email)) {
          this.errors.push("You must provide a valid email address.")
        }
        if (this.data.password == "") {
          this.errors.push("You must provide a password.")
        }
        if (this.data.password.length > 0 && this.data.password.length < 8) {
          this.errors.push("Password must be at least 8 characters.")
        }
        if (this.data.password.length > 50) {
          this.errors.push("Password cannot exceed 50 characters.")
        }
        if (this.data.username.length > 0 && this.data.username.length < 3) {
          this.errors.push("Username must be at least 3 characters.")
        }
        if (this.data.username.length > 30) {
          this.errors.push("Username cannot exceed 30 characters.")
        }

        // Only if username is valid then check to see if it's already taken
        if (this.data.username.length > 2 && this.data.username.length < 31 && validator.isAlphanumeric(this.data.username)) {
          try {
            let client = await connectToDatabase()
            let usernameExists = await client.db().collection("users").findOne({ username: this.data.username })
            if (usernameExists) {
              this.errors.push("That username is already taken.")
            }
          } catch (e) {
            console.log("There was an error seeing if that username already exists.")
          }
        }

        // Only if email is valid then check to see if it's already taken
        if (validator.isEmail(this.data.email)) {
          try {
            let client = await connectToDatabase()
            let emailExists = await client.db().collection("users").findOne({ email: this.data.email })
            if (emailExists) {
              this.errors.push("That email is already being used.")
            }
          } catch (e) {
            console.log("There was an error seeing if that email already exists.")
          }
        }

        resolve({ message: "success" })
      } catch (e) {
        reject(e)
      }
    }) // end promise
  } // end validate

  //register
  register() {
    return new Promise(async (resolve: any, reject: any) => {
      //Step #1 Validate user submitted data
      this.cleanup()
      await this.validate()
      //console.log(result)

      //Step #2 Only if there are no validation errors
      //Save the user to the database
      if (!this.errors.length) {
        //hash user password
        const hashedPassword = await hashPassword(this.data.password)
        this.data.password = hashedPassword

        // connect to db
        let client
        try {
          client = await connectToDatabase()
        } catch (e) {
          reject("connection failure")
          return
        }

        // add user to db
        try {
          await addUserDocument(client, this.data)
        } catch (e) {
          reject("insertion failure")
          client.close()
          return
        }
        client.close()
        //await usersCollection.insertOne(this.data)
        resolve("success")
      } else {
        reject(this.errors)
      }
    })
  } // end register method

  // login
  async login() {
    this.cleanup()

    // see if user exists
    try {
      const client = await connectToDatabase()
      const usersCollection = client.db().collection("users")
      const attemptedUserDoc = await usersCollection.findOne({ username: this.data.username })
      // if user exists hash the submitted password
      if (attemptedUserDoc) {
        console.log(attemptedUserDoc)
        // see if the hashed submitted password matches
        const isValid = await verifyPassword(this.data.password, attemptedUserDoc.password)
        if (isValid) {
          this.data = attemptedUserDoc
          client.close()
          // send a success response if matched
          return {
            message: "success",
            data: this.data
          }
        } else {
          client.close()
          // send a failed response if no match
          this.errors.push("user does not exist")
          throw this.errors
        }
      }
    } catch (e) {
      this.errors.push("Please try again later")
      throw this.errors
    }
  } // end login method

  // doesUserValueExist
  // meant as aid for client-side
  static async doesUserValueExist(key: string, value: string): Promise<any> {
    if (typeof key !== "string" || typeof value !== "string") {
      return false
    }
    try {
      let client = await connectToDatabase()
      let result = await client
        .db()
        .collection("users")
        .findOne({ [key]: value })
      if (result) {
        return true
      } else {
        return false
      }
    } catch (err) {
      throw err
    }
  } // end doesUserValue Exist
} // close User class
