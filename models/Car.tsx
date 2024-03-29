import { connectToDatabase } from "../lib/db"
import { ObjectId } from "mongodb"

import { CarInput, CarDocType } from "../lib/types"

//const DEFAULT_USEFUL_MILES = 150000
//const DEFAULT_MONTHLY_MILES = 1250

// export default class Car implements CarTypeInterface
export default class Car {
  //define for TypeScript
  description: string
  price: number
  miles: number
  link?: string
  readonly createdDate: Date
  readonly uniqueId: number
  errors: string[]

  constructor(data: CarInput) {
    this.description = data.description.trim()
    this.price = parseInt(data.price)
    this.miles = parseInt(data.miles)
    this.link = data.link
    this.createdDate = new Date()
    // scrap unique Id for autoGen mongoDb
    this.uniqueId = Math.round(Math.random() * 10000)
    this.errors = []
  }

  cleanup(this: Car) {
    // i think this is wehere all of the trim and parseInt() should happen?
    if (typeof this.description != "string") {
      this.description = ""
      //console.log("description was not a string")
    }
    if (typeof this.price != "number") {
      //console.log("price was not a number")
    }
    if (typeof this.miles != "number") {
      this.miles = 0
    }
    if (this.miles === 0) {
      this.miles = 0
    }
    if (typeof this.link != "string") {
      this.link = ""
      //console.log("link was not a string")
    }

    /*
    if (this.link.startsWith("http://") || this.link.startsWith("https://")) {
      console.log("Link Looks Good")
    } else {
        this.link = ""
    }
    */
  }

  validate(this: Car) {
    if (this.description !== "" && this.description.length < 3) {
      this.errors.push("You must provide a longer description")
    }
    if (this.description !== "" && this.description.length > 60) {
      this.errors.push("Please provide a shorter description")
    }
    /* price */
    if (this.price < 0) {
      this.errors.push("You must provide a price greater than 0")
    }
    if (this.price === 0) {
      this.errors.push("You must provide a price")
    }
    if (this.price < 1) {
      this.price = 1
    }
    if (this.price > 250000) {
      this.errors.push("You must provide a lower price")
    }
    /* miles */
    if (this.miles < 0) {
      this.errors.push("Incorrect miles")
    }
    if (this.miles < 1) {
      this.miles = 1
    }
    if (this.miles > 250000) {
      this.errors.push("Please enter a lower miles value")
    }
    // if a field is left blank
    if (this.description == "") {
      this.errors.push("You must provide a description")
    }
    if (this.price === 0) {
      this.errors.push("You must provide a price greater than 0")
    }
    if (this.miles < 0) {
      this.miles = 0
    }
    /* link */
    if (this.link && this.link.length && !this.link.startsWith("https://")) {
      this.link = `https://${this.link}`
    }
  }

  register() {
    this.validate()
  }

  static async findByAuthor(username: string) {
    //console.log("findByAuthor ran with " + username + " passed in")
    // quick clean up
    if (typeof username != "string") {
      //console.log(typeof username)
      return { error: "invalid request" }
    }

    try {
      // connect to DB
      const client = await connectToDatabase()
      if (!client) {
        throw { error: "Could not connect to data" }
      }

      const usersCollection = client.db().collection("users")

      const userDoc = await usersCollection.findOne({ username: username })

      if (!userDoc) {
        throw "no user found"
      }

      interface CleanedUserDocTypes {
        user_id: string
        useful_miles: number
        monthly_miles: number
      }

      // clean up the userDoc (no password)
      const userData: CleanedUserDocTypes = {
        user_id: userDoc._id.toString(),
        useful_miles: +userDoc.useful_miles,
        monthly_miles: +userDoc.annual_miles / 12
      }
      //console.log(userData)

      const carsCollection = client.db().collection("cars")

      const cars = (await carsCollection.find({ authorId: new ObjectId(userDoc._id) }).toArray()) as CarDocType[]

      if (!cars) {
        throw "no cars found"
      }

      // Send to client
      const carDataArr: object[] = cars.map(carItem => {
        //console.log(carItem)
        return {
          carId: carItem._id.toString(),
          description: carItem.description.toString(),
          price: carItem.price,
          miles: carItem.miles,
          link: carItem.link.toString(),
          createdDate: carItem.createdDate.toString(),
          rem_months: Math.round((userData.useful_miles - carItem.miles) / userData.monthly_miles),
          cprm: parseFloat((carItem.price / ((userData.useful_miles - carItem.miles) / userData.monthly_miles)).toFixed(2))
        }
      })

      //console.log(carDataArr)

      if (client) {
        void client.close()
      }

      if (carDataArr.length) {
        return { carData: carDataArr, userData: userData }
      }
      if (!carDataArr.length) {
        throw "no cars found"
      }
    } catch (err) {
      throw { error: err }
    }
  } // End findByAuthor
} // End Car Class
