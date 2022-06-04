import type { NextApiRequest, NextApiResponse } from "next"
import TestDriveCar from "../../models/TestDriveCar"

function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.json({ message: "error", data: null, errors: "Invalid request" })
  }

  if (req.method === "POST") {
    const newTdItem = new TestDriveCar(req.body)
    newTdItem.register()
    if (newTdItem.errors.length) {
      res.json({ message: "error", data: null, errors: newTdItem.errors })
    } else {
      res.json({ message: "success", data: newTdItem, errors: null })
    }
  } else {
    res.json({ message: "error", data: null, errors: "Something else went wrong" })
  }
}

export default handler
