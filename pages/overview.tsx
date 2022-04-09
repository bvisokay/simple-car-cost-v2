import { WrapperNarrow } from "../styles/GlobalComponents"

const overview = () => {
  return (
    <WrapperNarrow>
      <h2>The Basics</h2>
      <p>When calculating the cost of a car it may be useful to estimate the useful life for the vehicle in miles. It's also a good to know how much driving you expect to do on a yearly basis. Using these assumptions, along with the current mileage and price of a car, you can estimate how many useful months remain for the car and how much each of these months will cost you.</p>
      <h2>Months Remaining</h2>
      <p>This is calculated by taking the total useful life (in miles) and subtracting the current miles. You then divide this by how many miles you expect to drive per month.</p>
      <h2>Cost Per Remaining Month</h2>
      <p>This is calculated by dividing a vehicle's price by how many months are remaining.</p>
      <h2>Default Values</h2>
      <p>The default values used for "useful life" is 150,000 miles. The default value for "expected miles driven" in a year is 15,000. These values can be customized by visiting your settings.</p>
      <h2>These are Rough Approximations</h2>
      <p>Understand these metrics are very simplied approximations to better compare vehicles assuming all else is equal.</p>
      <h2>All Else Equal</h2>
      <p>All else equal is impossible as no two cars are exactly the same. Some vehicles are more expensive for a reason. Also, vehicles typically have a resale or residual value, at the end of it's useful life.</p>
      <h2>Residual Value</h2>
      <p>Residual value is not considered in the "cost per remaining months" metric. Keep in mind that many vehicles will likely have a residual value and certain vehicles "retain their value" better than others.</p>
      <h2>Use These Metrics as a Guide.</h2>
      <p>Despite the difficulties in comparing different vehicles as it relates to features, resale value, etc., these metrics can be helpful in comparing vehicles.</p>
    </WrapperNarrow>
  )
}
export default overview
