import { Wrapper, Section, SectionTitle, FormControl } from "../styles/GlobalComponents"

const List = () => {
  return (
    <Wrapper>
      <Section>
        <SectionTitle>List</SectionTitle>
        <p>Add Car</p>
        <p>Learn More</p>
        <br />
        <FormControl>
          <select
            name=""
            onChange={e => {
              alert(e.target.value)
            }}
          >
            <option value="priceAsc">Price Ascending</option>
            <option value="priceDesc">Price Descending</option>
            <option value="milesAsc">Miles Ascending</option>
            <option value="milesDesc">Miles Descending</option>
          </select>
        </FormControl>
        <hr />
        <ul>
          <li></li>
        </ul>
      </Section>
    </Wrapper>
  )
}
export default List
