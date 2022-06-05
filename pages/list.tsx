import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { Session } from "next-auth"
import { getSession } from "next-auth/client"
import { useState, useContext } from "react"
import { breakpoints } from "../styles/breakpoints"
import { Wrapper, Section } from "../styles/GlobalComponents"
import Car from "../models/Car"
import CarListItemCard from "../components/CarListItemCard/CarListItemCard"
import Link from "next/link"
import styled from "styled-components"
import { GlobalDispatchContext } from "../store/GlobalContext"

const ListPageHeading = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  @media ${breakpoints.md} {
    flex-direction: row;
  }
`

interface CarInList {
  carId: string
  description: string
  price: number
  miles: number
  link: string
  createdDate: string
  rem_months: number
  cprm: number
}

type Props = {
  session?: Session
  carData?: CarInList[]
  userData?: {
    user_id: string
    useful_miles: number
    monthly_miles: number
  }
}

const List = ({ session, carData, userData }: Props) => {
  console.log(session)
  console.log(carData)
  console.log(userData)
  const [cars, setCars] = useState(carData)

  const appDispatch = useContext(GlobalDispatchContext)

  const deleteItem = (carId: string) => {
    const controller = new AbortController()
    const signal = controller.signal
    async function sendDeleteRequest() {
      try {
        //appDispatch({ type: "flashMessage", value: "Sent Request to API" })
        const response = await fetch("/api/delete-item", {
          signal,
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            carId: carId
          })
        })
        const data = await response.json()
        if (data.error) {
          appDispatch({ type: "flashMessage", value: data.error })
          //console.warn(`from client: ${data.error}`)
          return
        }
        if (data.message === "success") {
          appDispatch({ type: "flashMessage", value: "Car removed" })
          setCars(
            cars?.filter((car: CarInList) => {
              return car.carId !== carId
            })
          )

          //console.log(data.data)
          return
        }
      } catch (err) {
        appDispatch({ type: "flashMessage", value: "Could not remove car" })
        //console.error(err)
      }
    }
    sendDeleteRequest()
    return () => controller.abort()
  }

  return (
    <Wrapper>
      <Section>
        <ListPageHeading>
          {session !== undefined && session !== null && (
            <h2>
              {session.user?.name?.charAt(0).toUpperCase()}
              {session.user?.name?.slice(1)}&apos;s List
            </h2>
          )}
          {cars?.length && cars?.length === 1 ? <p>You have 1 car in your list</p> : ""}
          {cars?.length && cars?.length > 1 ? <p>You have {cars.length} cars in your list</p> : ""}
          {/* <p>Sort &amp; Filter Icon</p> */}
          {/* <p>Clear All</p> */}
        </ListPageHeading>
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
          {cars?.length ? (
            cars.map(item => <CarListItemCard key={item.carId} item={item} deleteItem={deleteItem} />)
          ) : (
            <>
              <p>
                No items found.{" "}
                <Link href="/create-item">
                  <a>Add a car</a>
                </Link>{" "}
                to get started.
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

  const username = session.user!.name!.toString()

  let data

  try {
    data = await Car.findByAuthor(username)
    //console.log(data)
  } catch (err) {
    //console.log(err)
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
