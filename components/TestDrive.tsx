import { SectionTitle, LeadMuted, FormControl, BtnWide } from "../styles/GlobalComponents"

function newTestDriveCarHandler() {
  alert("Yo")
}

const TestDrive = () => {
  return (
    <>
      <SectionTitle color={"var(--secondary)"}>Take it for a test drive</SectionTitle>
      <LeadMuted>Enter Vehicle Details Below</LeadMuted>

      <form onSubmit={newTestDriveCarHandler}>
        <FormControl>
          <label htmlFor="">Description (Example: {new Date().getFullYear()} Jeep Wrangler)</label>
          <input type="text" />
        </FormControl>
        <FormControl>
          <label htmlFor="">Price</label>
          <input type="text" />
        </FormControl>
        <FormControl>
          <label htmlFor="">Miles</label>
          <input type="text" />
        </FormControl>
        <FormControl>
          <label htmlFor="">Link</label>
          <input type="text" />
        </FormControl>
        <BtnWide>Calculate</BtnWide>
      </form>
      <p>Assumed driving of 15,000 miles per year and useful life of 150,000 miles.</p>
      <p> Register for a free account to customize miles driven per year and useful life. Also gain access to sorting and the ability to access your listings across multiple devices.</p>
    </>
  )
}
export default TestDrive
