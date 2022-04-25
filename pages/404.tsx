import Link from "next/link"
import { WrapperNarrow } from "../styles/GlobalComponents"

const NotFoundPage = () => {
  return (
    <WrapperNarrow>
      <h2>Page Not Found</h2>
      <div>
        Head back to the <Link href="/">homepage</Link> for a fresh start.
      </div>
    </WrapperNarrow>
  )
}
export default NotFoundPage
