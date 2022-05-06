import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { getSession } from "next-auth/client"
import { useMemo } from "react"
import { Wrapper, Section } from "../styles/GlobalComponents"
import Car from "../models/Car"
import { useTable } from "react-table"

// experiment with React Table

const Cars = (props: any) => {
  console.log(props)
  //const [cars] = useState(props.carData)

  const data = useMemo(
    () => [
      {
        col1: "Hello",
        col2: "World"
      },
      {
        col1: "react-table",
        col2: "rocks"
      },
      {
        col1: "whatever",
        col2: "you want"
      }
    ],
    []
  )

  const columns: any = useMemo(
    () => [
      {
        Header: "Column 1",
        accessor: "col1" // accessor is the "key" in the data
      },
      {
        Header: "Column 2",
        accessor: "col2"
      }
    ],
    []
  )

  const tableInstance = useTable({ columns, data })

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance

  return (
    <Wrapper>
      <Section>
        // apply the table props
        <table {...getTableProps()}>
          <thead>
            {
              // Loop over the header rows
              headerGroups.map(headerGroup => (
                // Apply the header row props
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {
                    // Loop over the headers in each row
                    headerGroup.headers.map(column => (
                      // Apply the header cell props
                      <th {...column.getHeaderProps()}>
                        {
                          // Render the header
                          column.render("Header")
                        }
                      </th>
                    ))
                  }
                </tr>
              ))
            }
          </thead>
          {/* Apply the table body props */}
          <tbody {...getTableBodyProps()}>
            {
              // Loop over the table rows
              rows.map(row => {
                // Prepare the row for display
                prepareRow(row)
                return (
                  // Apply the row props
                  <tr {...row.getRowProps()}>
                    {
                      // Loop over the rows cells
                      row.cells.map(cell => {
                        // Apply the cell props
                        return (
                          <td {...cell.getCellProps()}>
                            {
                              // Render the cell contents
                              cell.render("Cell")
                            }
                          </td>
                        )
                      })
                    }
                  </tr>
                )
              })
            }
          </tbody>
        </table>
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
