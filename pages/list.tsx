import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { getSession } from "next-auth/client"
import { useState } from "react"
import { Wrapper, Section } from "../styles/GlobalComponents"
import Car from "../models/Car"
import CarListItemCard from "../components/CarListItemCard"
import Link from "next/link"
import styled from "styled-components"

const ListPageHeading = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const List = (props: any) => {
  console.log(props)
  const [cars] = useState(props.carData)
  const [usefulMiles] = useState(props.userData.useful_miles)
  const [monthlyMiles] = useState(props.userData.monthly_miles)

  return (
    <Wrapper>
      <Section>
        <ListPageHeading>
          <h2>{props.session.user.name}'s List</h2>
          <p>Add Car</p>
          <p>Learn More</p>
          <p>Sort &amp; Filter Icon</p>
        </ListPageHeading>
        <hr />
        <br />
        {cars.length == 1 && <p>You have 1 car in your list</p>}
        {cars.length > 1 && <p>You have {cars.length} cars in your list</p>}
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
          {cars.length ? (
            cars.map((item: any) => {
              item.rem_months = (usefulMiles - item.miles) / monthlyMiles
              item.cprm = item.price / ((usefulMiles - item.miles) / monthlyMiles)
              return <CarListItemCard key={item.carId} item={item} />
            })
          ) : (
            <>
              <p>
                No Items Found.{" "}
                <Link href="/create-item">
                  <a>Add Car</a>
                </Link>{" "}
                to get Started.
              </p>
            </>
          )}
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

export default List
