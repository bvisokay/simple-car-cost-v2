import type { NextApiRequest, NextApiResponse } from "next"
import Car from "../../models/Car"
import { getSession } from "next-auth/client"
import { connectToDatabase } from "../../lib/db"
import { ObjectId } from "mongodb"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    res.status(200).json({ message: "let's get cars" })
  }
  if (req.method === "POST") {
    // make sure there is a logged in user, redirect if not

    const session = await getSession({ req: req })
    if (!session) {
      res.status(401).json({ message: "Not authenticated" })
      return
    }

    // get the username from the session
    const username = session.user?.name
    //console.log(username)

    // get extracted values from the body
    const data = req.body
    //console.log(data)

    // create a new instance of the car class
    const car = new Car(data)

    // run the validation and cleanup methods
    // ensure strings are converted into numbers
    // look into validation for urls?
    car.cleanup()
    car.validate()

    console.log(car.errors)

    if (car.errors.length) {
      //console.log(`error thrown in /api/create-item ${car.errors}`)
      res.status(422).json({ message: car.errors })
      throw car.errors
    } else {
      //console.log("No car.errors")
    }

    try {
      // connect to the database
      const client = await connectToDatabase()

      if (!client) {
        res.status(500).json({ message: "Could not connect to the data" })
        throw "Could not connect to the data"
      }

      // find the users collection
      const usersCollection = client.db().collection("users")

      // find the userId based on the username from the session
      // maybe also want to pull dynamic settings
      const userId = await usersCollection.findOne({ username: username }, { projection: { _id: 1 } })

      if (!userId) {
        await client.close()
        res.status(404).json({ message: "Could not find registered user" })
        throw "Could not find the user"
      }

      // console.log(userId._id.toString())

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
        await client.close()
        res.status(422).json({ message: "Could not add vehicle" })
        throw "Could not add vehicle"
      }

      const createdCarItem = {
        _id: result.insertedId.toString(),
        ...carItem
      }

      // close the database connection
      await client.close()

      // return the new car details back as a respons with a success message
      res.status(200).json({ message: "success", data: createdCarItem, errors: null })
    } catch (err) {
      //console.log(`There was a problem: ${err}`)
    }
  }
}

export default handler
