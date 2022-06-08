import { render, screen } from "@testing-library/react"
import TestDrive from "./TestDrive"

test("renders 'Hello World'", () => {
  render(<TestDrive />)
  const myElement = screen.getByText(/Take it for a Spin/i)
  //screen.debug()
  expect(myElement).toBeInTheDocument()
})
