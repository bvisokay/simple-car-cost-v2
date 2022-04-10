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
`

const ListGroupItem = styled.div`
  padding: 1rem;
  border-top: 1px solid var(--gray);
`

interface CarItemProps {
  description: string
  price: number
  miles: number
  link?: string
  rem_months: number
  cprm: number
}

const CarCard: React.FC = (props: CarItemProps) => {
  return (
    <Container>
      <ListGroupTitleItem>{props.description}</ListGroupTitleItem>
      <ListGroupItem>Price: ${props.price}</ListGroupItem>
      <ListGroupItem>Miles: ${props.miles}</ListGroupItem>
      <ListGroupItem>
        Remaining Months: {props.rem_months} <span>~7.2 years</span>
      </ListGroupItem>
      <ListGroupItem>Cost Per Remaining Month: $401</ListGroupItem>
    </Container>
  )
}
export default CarCard
