import validator from "validator"
import { hashPassword } from "../lib/auth"
import { addUserDocument, connectToDatabase } from "../lib/db"
import { ObjectId } from "mongodb"
import { CarDocType, UpdatedCarType, GetSettingsResultType } from "../lib/types"
//import { PrimaryCarFields } from "../lib/types"

interface UserRegFields {
  username: string
  email: string
  password: string
  useful_miles?: number
  annual_miles?: number
  created_date?: Date
  errors?: string[]
}

export default class User {
  data: UserRegFields
  useful_miles: number
  annual_miles: number
  created_date: Date
  errors: string[]

  constructor(data: UserRegFields) {
    // data is username, email, password
    this.data = data
    this.useful_miles = 150000
    this.annual_miles = 15000
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
      annual_miles: this.annual_miles,
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
          const client = await connectToDatabase()
          if (!client) {
            throw { message: "Error" }
          }
          const usernameExists = await client.db().collection("users").findOne({ username: this.data.username })
          if (usernameExists) {
            this.errors.push("That username is already taken.")
          }
          void client.close()
        } catch (err) {
          this.errors.push("Error checking username.")
          return { message: "failure", data: null, errors: err }
        }
      }

      // Only if email is valid then check db to see if email is already taken
      if (validator.isEmail(this.data.email)) {
        try {
          const client = await connectToDatabase()
          if (!client) {
            throw { message: "Error" }
          }
          const emailExists = await client.db().collection("users").findOne({ email: this.data.email })
          if (emailExists) {
            this.errors.push("That email is already being used.")
          }
          void client.close()
        } catch (err) {
          return { message: "Errors checking email", data: null, errors: err }
        }
      }
      return { message: "validation successful", data: null, errors: null }
    } catch (err) {
      return { message: "Errors with validation", data: null, errors: err }
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
        if (!client) {
          throw { message: "Error" }
        }
      } catch (err) {
        return { message: "connection failure", data: null, errors: err }
      }

      // add user to db
      try {
        await addUserDocument(client, this.data)
        void client.close()
        return { message: "success", data: null, errors: null }
      } catch (err) {
        void client.close()
        return { message: "insertion failure", data: null, errors: err }
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
      const client = await connectToDatabase()
      if (!client) {
        throw { message: "Error" }
      }
      const result = await client
        .db()
        .collection("users")
        .findOne({ [key]: value })
      if (result) {
        void client.close()
        return true
      } else {
        void client.close()
        return false
      }
    } catch (err) {
      return { errors: err }
    }
  } // end doesUserValue Exist

  // getSettings
  static async getSettings(username: string) {
    if (typeof username !== "string") {
      return { message: "failed", error: "improper data" }
    }
    try {
      const client = await connectToDatabase()
      if (!client) {
        throw { message: "Error" }
      }
      const result = (await client
        .db()
        .collection("users")
        .findOne({ username: username }, { projection: { _id: 1, useful_miles: 1, annual_miles: 1 } })) as GetSettingsResultType
      if (result) {
        void client.close()
        return { message: "success", data: { result } }
      } else {
        void client.close()
        return { message: "failed", error: "Could not get existing" }
      }
    } catch (err) {
      return { message: "failed", errors: err }
    }
  } // end getSettings

  // doesUserMatchAuthor
  static async doesUserMatchAuthor(username: string | undefined, carId: string | string[] | undefined) {
    if (typeof username !== "string" || typeof carId !== "string") {
      return { error: "Something Went Wrong" }
    }
    //console.log(`passed in carId: ${carId}`)
    // Lookup userId given username
    try {
      const client = await connectToDatabase()
      if (!client) {
        throw { message: "Error" }
      }
      const idResult = await client.db().collection("users").findOne({ username: username })
      const userId = idResult?._id.toString()
      const carDocument: CarDocType | null = (await client
        .db()
        .collection("cars")
        .findOne({ _id: new ObjectId(carId) })) as CarDocType

      if (!carDocument) {
        void client.close()
        throw new Error("No doc found")
      }

      const authorId: string = carDocument.authorId.toString()

      //console.log(authorId)
      void client.close()

      if (userId !== authorId) {
        return { message: "failure", error: "user and author do not match" }
      }

      if (userId === authorId) {
        // clean up car document
        const editableCar: UpdatedCarType = {
          _id: carDocument._id.toString(),
          authorId: authorId,
          description: carDocument.description,
          price: carDocument.price,
          miles: carDocument.miles,
          link: carDocument.link,
          createdDate: carDocument?.createdDate.toString()
        }
        return { message: "success", data: editableCar, error: "" }
      }
      void client.close()
      return { message: "failure", data: {}, error: "user and author do not match" }
    } catch (err) {
      return { message: "failure", data: {}, errors: err }
    }
  } // end doesUserMatchAuthor
} // close User class
