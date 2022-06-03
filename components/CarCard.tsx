import styled from "styled-components"
import { FaExternalLinkAlt, FaTrash } from "react-icons/fa"

const Container = styled.div`
  max-width: 100%;
  margin: 0 auto 2rem auto;
  border: 1px solid var(--gray);
  border-radius: 0.5rem;
`

const ListGroupTitleItem = styled.div`
  padding: 1rem;
  color: #004085;
  background-color: #b8daff;
  border-top-right-radius: 0.5rem;
  border-top-left-radius: 0.5rem;
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  position: relative;

  .tdCarTitle {
    //border: 1px solid aqua;
    display: flex;
    padding-top: 0.2rem;
  }

  .tdCarDelete {
    position: relative;
    top: 3px;
    border: none;
    background-color: transparent;
    color: crimson;

    :hover {
      cursor: pointer;
    }
  }
`

const ListGroupItem = styled.div`
  padding: 1rem;
  border-top: 1px solid var(--gray);

  span {
    font-size: 0.8rem;
  }
`

const LinkIconContainer = styled.div`
  //border: 2px solid red;
  //height: 100%;
  margin-left: 0.5rem;
  margin-top: 0.1rem;

  a {
    color: var(--primary);
  }
`

interface CarItemProps {
  deleteHandler: (uniqueId: number) => void
  item: {
    description: string
    uniqueId: number
    price: number
    miles: number
    rem_months: number
    cost_per_rem_mos: number
    link: string
  }
}

const CarCard: React.FC<CarItemProps> = props => {
  console.log(props.item)
  return (
    <Container>
      <ListGroupTitleItem>
        <div className="tdCarTitle">
          {props.item.description}
          {props.item.link !== "" && (
            <LinkIconContainer>
              <a href={props.item.link} target="_blank" rel="noreferrer">
                <FaExternalLinkAlt size={16}></FaExternalLinkAlt>
              </a>
            </LinkIconContainer>
          )}
        </div>

        <button
          onClick={() => {
            props.deleteHandler(props.item.uniqueId)
          }}
          className="tdCarDelete"
        >
          <FaTrash size={16} />
        </button>
      </ListGroupTitleItem>
      <ListGroupItem>Price: ${props.item.price.toLocaleString()}</ListGroupItem>
      <ListGroupItem>Miles: {props.item.miles.toLocaleString()}</ListGroupItem>
      <ListGroupItem>
        Remaining Months: {props.item.rem_months} <span>(~{(props.item.rem_months / 12).toFixed(1)} years)</span>
      </ListGroupItem>
      <ListGroupItem>Cost Per Remaining Month: ${props.item.cost_per_rem_mos.toLocaleString()}</ListGroupItem>
    </Container>
  )
}
export default CarCard
