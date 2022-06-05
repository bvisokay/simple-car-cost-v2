import { ObjectId } from "mongodb"

// ensure the user is the author
// used by /api/delete-item, /api/update-item, etc.
export interface MatchDoc {
  [key: string]: ObjectId
}

export interface PrimaryCarFields {
  description: string
  price: number
  miles: number
  link: string
}

export interface TestDriveCarType {
  description: string
  price: number
  miles: number
  link?: string
  rem_months: number
  cost_per_rem_mos: number
  createdDate: Date
  uniqueId: number
  errors: string[]
}
