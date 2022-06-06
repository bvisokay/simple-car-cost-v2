import { ObjectId } from "mongodb"
import type { WithId, Document } from "mongodb"

export interface ResponseType {
  message: string
  data?: string
  errors?: string
}

// ensure the user is the author
// used by /api/delete-item, /api/update-item, etc.
export interface MatchDoc {
  [key: string]: ObjectId
}

export interface CarDocType extends WithId<Document> {
  authorId: ObjectId
  description: string
  price: number
  miles: number
  link: string
  createdDate: ObjectId
}

export interface UpdatedCarType {
  _id: string
  authorId: string
  description: string
  price: number
  miles: number
  link: string
  createdDate: string
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
