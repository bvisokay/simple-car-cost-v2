import { ObjectId } from "mongodb"
import type { WithId, Document } from "mongodb"

export interface CarDocType extends WithId<Document> {
  authorId: ObjectId
  description: string
  price: number
  miles: number
  link: string
  createdDate: ObjectId
}

export interface CarInList {
  carId: string
  description: string
  price: number
  miles: number
  link: string
  createdDate: string
  rem_months: number
  cprm: number
}

export interface EditReadyCarType {
  _id: string
  authorId: string
  description: string
  price: string
  miles: string
  link: string
  createdDate: string
}

export interface GetSettingsResultType extends WithId<Document> {
  _id: ObjectId
  annual_miles: number | string
  useful_miles: number | string
}

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

export interface PrimaryCarFieldStrings {
  description: string
  price: string
  miles: string
  link: string
}

export interface RegAttemptTypes {
  username: string
  email: string
  password: string
}

export interface ResponseType {
  message: string
  data?: string
  errors?: string
}

export interface NewTDResponseType {
  message: string
  data?: TestDriveCarClassType
  errors?: string | string[]
}

export interface TestDriveCarClassType extends TestDriveCarType {
  errors: string[]
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

export interface UpdateMilesTypes {
  annual_miles: number | string
  useful_miles: number | string
}

export interface UpdateTypes extends PrimaryCarFields {
  carId: number | string
}

export interface UpdatePassTypes {
  oldPW: string
  newPW: string
}

export interface UserDocType {
  username: string
  email: string
  password: string
  useful_miles?: number
  annual_miles?: number
  created_date?: Date
}
