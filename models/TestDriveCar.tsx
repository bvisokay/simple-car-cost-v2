export default class TestDriveCar {
  //define for TypeScript
  description: string
  price: number
  miles: number
  link?: string
  useful_miles: number
  annual_miles: number
  rem_months: number
  cost_per_rem_mos: number
  createdDate: Date
  uniqueId: number
  errors: string[]

  constructor(data: any) {
    this.description = data.description.trim()
    this.price = parseFloat(data.price)
    this.miles = parseFloat(data.miles)
    this.link = data.link
    this.useful_miles = 150000
    this.annual_miles = 15000
    this.rem_months = Math.round((this.useful_miles - this.miles) / (this.annual_miles / 12))
    this.cost_per_rem_mos = parseFloat((this.price / ((this.useful_miles - this.miles) / (this.annual_miles / 12))).toFixed(2))
    this.createdDate = new Date()
    // scrap unique Id for autoGen mongoDb
    this.uniqueId = Math.round(Math.random() * 10000)
    this.errors = []
  }

  cleanup() {
    // i think this is wehere all of the trim and parseInt() should happen?
    if (typeof this.description != "string") {
      this.description = ""
      console.log("description was not a string")
    }
    if (typeof this.price != "string") {
      console.log("price was not a string")
    }
    if (typeof this.miles != "string") {
      console.log("miles was not a string")
    }
    if (typeof this.link != "string") {
      this.link = ""
      console.log("link was not a string")
    }
  }

  validate() {
    // bring in more vali from the client side logic
    // if a field is left blank
    if (this.description == "") {
      this.errors.push("You must provide a description")
    }
    if (this.price <= 0) {
      this.errors.push("You must provide a price greater than 0")
    }
    if (this.miles == 0) {
      this.errors.push("You must provide miles greater than 0")
    }
  }

  create() {
    //return the document, cleaned up
  }

  register() {
    this.validate()
  }
}
