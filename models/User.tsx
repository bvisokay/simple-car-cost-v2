import validator from "validator"
import { hashPassword } from "../lib/auth"
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

    // get rid of any bogu properties
    this.data = {
      username: this.data.username.trim().toLowerCase(),
      email: this.data.email.trim().toLowerCase(),
      password: this.data.password
    }
  }

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
        //
        /* if (this.data.username.length > 2 && this.data.username.length < 31 && validator.isAlphanumeric(this.data.username)) {
        let usernameExists = await usersCollection.findOne({username: this.data.username})
        if (usernameExists) {this.errors.push("That username is already taken.")}
      } */

        // Only if email is valid then check to see if it's already taken
        //
        /* if (validator.isEmail(this.data.email)) {
        let emailExists = await usersCollection.findOne({email: this.data.email})
        if (emailExists) {this.errors.push("That email is already being used.")}
      } */

        resolve({ message: "success" })
      } catch (e) {
        reject("failure")
      }
    }) // end promise
  } // end validate

  //login

  //register
  register() {
    console.log("register ran from model")
    return new Promise(async (resolve: any, reject: any) => {
      //Step #1 Validate user submitted data
      this.cleanup()
      const result = await this.validate()
      console.log(result)

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
        //await usersCollection.insertOne(this.data)
        resolve("success")
      } else {
        reject(this.errors)
      }
    })
  }

  //findByUsername

  //doesEmailExist
}
