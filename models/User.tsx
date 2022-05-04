import validator from "validator"
import { hashPassword } from "../lib/auth"
import { addUserDocument, connectToDatabase } from "../lib/db"

export default class User {
  data: any
  useful_miles: number
  monthly_miles: number
  created_date: Date
  errors: string[]

  constructor(data: any) {
    // data is username, email, password
    this.data = data
    this.useful_miles = 150000
    this.monthly_miles = 1250
    this.created_date = new Date()
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
      useful_miles: this.useful_miles,
      monthly_miles: this.monthly_miles,
      created_date: this.created_date
    }
  } // end cleanup

  async validate(): Promise<object> {
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

      // Only if username is valid then check db to see if username already taken
      if (this.data.username.length > 2 && this.data.username.length < 31 && validator.isAlphanumeric(this.data.username)) {
        try {
          let client = await connectToDatabase()
          let usernameExists = await client.db().collection("users").findOne({ username: this.data.username })
          if (usernameExists) {
            this.errors.push("That username is already taken.")
          }
          client.close()
        } catch (e) {
          this.errors.push("Error checking username.")
          return { errors: e }
        }
      }

      // Only if email is valid then check db to see if email is already taken
      if (validator.isEmail(this.data.email)) {
        try {
          let client = await connectToDatabase()
          let emailExists = await client.db().collection("users").findOne({ email: this.data.email })
          if (emailExists) {
            this.errors.push("That email is already being used.")
          }
          client.close()
        } catch (e) {
          console.log("There was an error seeing if that email already exists.")
        }
      }
      //resolve({ message: "success" })
      // doesn't need to resolve with a value, checking for errors
      return { message: "validation successful", errors: null }
    } catch (e) {
      throw { message: `Errors with validation: ${e}`, errors: e }
    }
  }

  //register
  async register(): Promise<object | string[]> {
    //Step #1 CleanUp and Validate user submitted data
    this.cleanup()
    await this.validate()
    //console.log(result)

    //Step #2 Only if there are no validation errors
    //Save the user to the database
    if (!this.errors.length) {
      //

      // hash user password
      const hashedPassword = await hashPassword(this.data.password)
      this.data.password = hashedPassword

      // connect to db
      let client
      try {
        client = await connectToDatabase()
      } catch (e) {
        return { message: "connection failure", data: null, errors: e }
      }

      // add user to db
      try {
        await addUserDocument(client, this.data)
        // result.acknowledged, result.insertedId
        client.close()
        return { message: "success", data: null, errors: null }
      } catch (e) {
        client.close()
        return { message: "insertion failure", data: null, errors: "insertion failure" }
      }
    } else {
      return { message: "womp", data: null, errors: this.errors }
    }
  }

  // doesUserValueExist: meant as aid for client-side checking if username/password/etc. exist
  static async doesUserValueExist(key: string, value: string): Promise<boolean | object> {
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
        client.close()
        return true
      } else {
        client.close()
        return false
      }
    } catch (err) {
      return { errors: err }
    }
  } // end doesUserValue Exist
} // close User class
