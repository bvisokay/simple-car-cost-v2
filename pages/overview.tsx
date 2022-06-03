import { WrapperNarrow } from "../styles/GlobalComponents"
import Head from "next/head"

const overview = () => {
  return (
    <>
      <Head>
        <title>Overview | Simple Car Cost</title>
      </Head>
      <WrapperNarrow>
        <h2>Overview</h2>
        <p>When calculating the cost of a car it may be helpful to estimate a &ldquo;useful life&rdquo; for the vehicle in miles.</p>
        <p>It&apos;s also good to know how much driving you approximately do to do on a yearly basis.</p>
        <p>By using these two approximations, along with the current mileage and price of a car, you can estimate how many &ldquo;useful months&rdquo; remain for the car and how much each of these months will cost.</p>
        <h2>Months Remaining</h2>
        <p>This is calculated by taking the total useful life (in miles) and subtracting the current miles. You then divide this by how many miles you expect to drive per month.</p>
        <h2>Cost Per Remaining Month</h2>
        <p>This is calculated by dividing a vehicle&apos;s price by how many months are remaining.</p>
        <h2>Default Values</h2>
        <p>The default value for &ldquo;useful life&rdquo; is 150,000 miles. The default value for &ldquo;expected miles driven&rdquo; in a year is 15,000 miles. These values can be customized by visiting your settings.</p>
        <h2>Rough Approximations</h2>
        <p>Understand these metrics are very simplied approximations to better compare vehicles assuming all else is equal.</p>
        <h2>All Else Equal</h2>
        <p>Comparing vehicles by the &ldquo;cost per remaining month&rdquo; is an oversimplification. No two cars are exactly the same. Some vehicles are more expensive for a reason.</p>
        <h2>Residual Value</h2>
        <p>Residual value is not considered in the &ldquo;cost per remaining months&rdquo; metric. Keep in mind that many vehicles will likely have a residual value and certain vehicles &ldquo;retain their value&rdquo; better than others.</p>
      </WrapperNarrow>
    </>
  )
}
export default overview
