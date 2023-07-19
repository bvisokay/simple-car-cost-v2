//import { PrimaryCarFields } from "../lib/types"
import { CarInput } from "../lib/types"

const useful_miles = 150000
const annual_miles = 15000

export default class TestDriveCar {
  // Quick attempt to swap for type failed
  // having class implement also failed
  description: string
  price: number
  miles: number
  link?: string
  rem_months: number
  cost_per_rem_mos: number
  createdDate: Date
  uniqueId: number
  errors: string[]

  // constructor(data: TestDriveCarClassType) {
  constructor(data: CarInput) {
    this.description = data.description.trim()
    this.price = parseInt(data.price)
    this.miles = parseInt(data.miles)
    this.link = data.link
    this.rem_months = Math.round((useful_miles - this.miles) / (annual_miles / 12))
    this.cost_per_rem_mos = parseFloat((this.price / ((useful_miles - this.miles) / (annual_miles / 12))).toFixed(2))
    this.createdDate = new Date()
    this.uniqueId = Math.round(Math.random() * 10000)
    this.errors = []
  }

  cleanup() {
    if (this.description === "") {
      this.errors.push("You must provide a description")
    }
    if (typeof this.description !== "string") {
      this.description = ""
      this.errors.push("Invalid Description")
    }
    if (typeof this.price !== "number") {
      this.errors.push("Invalid price")
    } else {
      this.price = Math.round((this.price + Number.EPSILON) * 100) / 100
    }

    if (typeof this.miles !== "number") {
      this.errors.push("Miles must be a number")
    } else {
      //this.miles = Math.round((this.miles + Number.EPSILON) * 100) / 100
      this.miles = Math.round(this.miles)
    }
    if (typeof this.link !== "string") {
      this.link = ""
      this.errors.push("Invalid link")
    }
  }

  validate() {
    /* description */

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

    /* link */
    if (this.link && this.link.length && !this.link.startsWith("https://")) {
      this.link = `https://${this.link}`
    }
  }

  register() {
    this.cleanup()
    this.validate()
  }
}
