import type { NextApiRequest, NextApiResponse } from "next"
import { resolve } from "path"
import TestDriveCar from "../../models/TestDriveCar"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    let newTdItem = new TestDriveCar(req.body)
    newTdItem.register()
    if (newTdItem.errors.length) {
      res.json(newTdItem.errors)
    } else {
      resolve("holla")
      res.json(newTdItem)
    }
  } else {
    res.json({ message: "There was an error" })
  }
}

export default handler
