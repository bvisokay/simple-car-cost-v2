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
