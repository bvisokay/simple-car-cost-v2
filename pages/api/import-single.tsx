import type { NextApiRequest, NextApiResponse } from "next"
import Car from "../../models/Car"
import { connectToDatabase } from "../../lib/db"
import { ObjectId } from "mongodb"
import { PrimaryCarFieldStrings } from "../../lib/types"

// auth
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(403).json({ message: "Not Supported" })
  }

  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
      return res.status(401).json({ message: "Not authenticated" })
    }
    if (!session.user) {
      res.status(401).json({ message: "Not authenticated" })
      return
    }

    // get the username from the session
    //eslint-disable-next-line
    const username = session?.user?.name

    // expecting carDetailsString, usernameFromClient, signal
    type incomingImportSingleProps = {
      carDetailsString: string
      username: string
    }

    const incomingDataPayload = req.body as incomingImportSingleProps

    const usernameFromClient = incomingDataPayload.username
    const incomingDataAsString = incomingDataPayload.carDetailsString

    // validation
    if (!usernameFromClient || !incomingDataAsString) {
      return res.status(401).json({ message: "Data not in the proper format" })
    }

    // make sure the usernames match
    if (username && username !== usernameFromClient) {
      console.log(`usernames did not match: server[${username}] and client[${usernameFromClient}]`)
      res.status(401).json({ message: "You do not have permission to perform that action" })
      return
    }

    // quick validation in the vehicle details

    if (!incomingDataAsString.split(",")[0] || !incomingDataAsString.split(",")[1] || !incomingDataAsString.split(",")[2] || !incomingDataAsString.split(",")[3]) {
      res.status(401).json({ message: "Data not in the proper format" })
      return
    }

    // split string on comma in to an array of
    const description = incomingDataAsString.split(",")[0].trim()
    const price = incomingDataAsString.split(",")[1].trim()
    const miles = incomingDataAsString.split(",")[2].trim()
    const link = incomingDataAsString.split(",")[3].trim()

    // get extracted values from the body
    const data: PrimaryCarFieldStrings = {
      description,
      price,
      miles,
      link
    }

    // create a new instance of the car class
    const car = new Car(data)

    // run the validation and cleanup methods
    // ensure strings are converted into numbers
    // look into validation for urls?
    car.cleanup()
    car.validate()

    if (car.errors.length) {
      return res.status(422).json({ message: car.errors[0] })
    }

    try {
      // connect to the database
      const client = await connectToDatabase()

      if (!client) {
        return res.status(500).json({ message: "Could not connect to the data" })
      }

      // find the users collection
      const usersCollection = client.db().collection("users")

      // find the userId based on the username from the session
      // maybe also want to pull dynamic settings
      const userId = await usersCollection.findOne({ username: username }, { projection: { _id: 1 } })

      if (!userId) {
        void client.close()
        return res.status(404).json({ message: "Could not find registered user" })
      }

      // Create a new CarItem object we want to pass to the database
      // be sure to leave out properties we don't need (this.errors)
      // add the userId to the carItem as new "author" property

      interface CreateCarType {
        authorId: ObjectId
        description: string
        price: number
        miles: number
        link?: string
        createdDate: Date
      }

      const carItem: CreateCarType = {
        authorId: userId._id,
        description: car.description,
        price: car.price,
        miles: car.miles,
        link: car.link,
        createdDate: car.createdDate
      }

      // store the cars Collection in a variable
      const carsCollection = client.db().collection("cars")

      // add the new carItem object to the items collection
      const result = await carsCollection.insertOne(carItem)

      // if this operation failed then throw an error
      if (!result) {
        void client.close()
        return res.status(422).json({ message: "Could not add vehicle" })
      }

      const createdCarItem = {
        _id: result.insertedId.toString(),
        ...carItem
      }

      // close the database connection
      void client.close()

      // return the new car details back as a respons with a success message
      res.status(200).json({ message: "success", data: createdCarItem, errors: null })
    } catch (err) {
      console.log(`There was a problem: `, err)
      res.status(403).json({ message: "Unable to add car at this time" })
    }
  }
}

export default handler
