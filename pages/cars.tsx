import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { getSession } from "next-auth/client"
import { useState } from "react"
import { Wrapper, Section } from "../styles/GlobalComponents"
import Car from "../models/Car"

// experiment with React Table

const Cars = (props: any) => {
  console.log(props)
  const [cars] = useState(props.carData)

  return (
    <Wrapper>
      <Section>
        <h2>{props.session.user.name}'s Cars</h2>
        <p>Add Car</p>
        <p>Learn More</p>
        <p>Sort &amp; Filter Icon</p>
        <hr />
        <br />
        {/* <FormControl>
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
            <option value="cprmASC">Lowest Cost Per Rem Mo</option>
          </select>
        </FormControl>
        <hr /> */}
        <ul>
          {cars.map((item: any, index: any) => {
            return <li key={index}>{item.description}</li>
          })}
        </ul>
        <ul>
          {cars.length
            ? cars.map((item: any, index: any) => {
                return <li key={index}>{item.description}</li>
              })
            : "No Items Found"}
        </ul>
      </Section>
    </Wrapper>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getSession({ req: context.req })
  // redirect away from page if there is no session
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }

  const username = session!.user!.name!.toString()

  // instead of calling internal API just do the db work here
  /* interface ListDataType {
    userData: {}
    carData: []
  } */

  let data: any = {}
  try {
    data = await Car.findByAuthor(username)
    console.log(data)
  } catch (err) {
    console.log(err)
  }

  // send session and vehicle data as props
  return {
    props: {
      session,
      carData: data?.carData,
      userData: data?.userData
    }
  }
}

export default Cars
