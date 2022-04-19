import styled from "styled-components"

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

  .tdCarDelete {
    background-color: crimson;
    border-radius: 0.35rem;
    border: none;
    padding: 0.25rem 0.5rem;
    transform: scaleX(1.2);
    color: white;
    font-weight: 700;
  }
`

const ListGroupItem = styled.div`
  padding: 1rem;
  border-top: 1px solid var(--gray);

  span {
    font-size: 0.8rem;
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
  }
}

const CarCard: React.FC<CarItemProps> = props => {
  console.log(props.item)
  return (
    <Container>
      <ListGroupTitleItem>
        <div className="tdCarTitle">{props.item.description}</div>
        <button
          onClick={() => {
            props.deleteHandler(props.item.uniqueId)
          }}
          className="tdCarDelete"
        >
          X
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
