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
    this.uniqueId = Math.round(Math.random() * 10000)
    this.errors = []
  }

  cleanup() {}

  validate() {
    // if a field is left blank
    if (this.description == "") {
      this.errors.push("You must provide a description")
    }
    if (this.price == 0) {
      this.errors.push("You must provide a price greater than 0")
    }
    if (this.miles == 0) {
      this.errors.push("You must provide miles greater than 0")
    }
  }

  register() {
    this.validate()
  }
}
