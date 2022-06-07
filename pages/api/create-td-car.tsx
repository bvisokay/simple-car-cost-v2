import type { NextApiRequest, NextApiResponse } from "next"
import TestDriveCar from "../../models/TestDriveCar"
import { PrimaryCarFields } from "../../lib/types"

function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.json({ message: "error", errors: "Invalid request" })
  }

  if (req.method === "POST") {
    const data = req.body as PrimaryCarFields
    const newTdItem = new TestDriveCar(data)
    newTdItem.register()
    if (newTdItem.errors.length) {
      res.json({ message: "error", errors: newTdItem.errors })
    } else {
      res.json({ message: "success", data: newTdItem })
    }
  } else {
    res.json({ message: "error", errors: "Something else went wrong" })
  }
}

export default handler
