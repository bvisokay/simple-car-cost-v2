import styled from "styled-components"
import { MdSpeed, MdOutlinePriceChange, MdOutlineDelete, MdOutlineEdit } from "react-icons/md"
import { IoMdCash } from "react-icons/io"
import { HiOutlineExternalLink, HiOutlineClock } from "react-icons/hi"

const Card = styled.li`
  width: 100%;
  margin: 1rem auto;
  border: 2px solid var(--transparent);
  border-radius: 4px;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
  background-color: #fff;
  font-family: var(--font-secondary);
  font-weight: 600;
  color: var(--primary);
  max-width: 500px;

  .header {
    background-color: var(--primary);
    color: #fff;
    padding: 1rem;
    display: flex;
    align-items: center;
    font-size: 1.35rem;
    justify-content: space-between;
    border: 2px solid var(--transparent);
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    margin: 0;

    svg {
      color: #fff;
      font-size: 1.75rem;
      top: 2px;
    }

    button {
      background: none;
      border: none;
      padding: 0 0.25rem;
      margin: 0;

      :hover {
        cursor: pointer;
      }

      svg {
        margin-right: 0;
      }
    }
  }

  .body {
    padding: 0.5rem 0.5rem;

    .specs-grid {
      padding: 1rem 0.5rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      gap: 0.75rem;
      //border: 1px solid hotpink;

      .box {
        //border: 1px solid var(--primary);
        //border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        //font-size: 1.5rem;
        flex-direction: column;

        .box-header {
          //padding-bottom: 5px;
          //border-bottom: 2px solid var(--primary);

          span {
            font-family: var(--font-secondary);
            font-size: 1.5rem;
            letter-spacing: 1px;
          }
        }
      }
    }
  }

  svg {
    position: relative;
    top: 0.4rem;
    margin-right: 0.5rem;
    font-size: 1.75rem;
  }

  p {
    padding: 0;
    margin: 0.25rem 0 0.5rem 0;
    color: var(--gray);
    font-size: 1.25rem;
    font-family: var(--font-primary);
  }

  .link {
    padding: 0.5rem 1rem;
    text-align: right;
    font-size: 0.8rem;
    color: var(--primary);

    svg {
      font-size: 1.2rem;
      top: 3px;
    }
  }
`

const CarListItemCard = (props: any) => {
  return (
    <Card>
      <div className="header">
        <h3>{props.item.description}</h3>
        <div>
          <button>
            <MdOutlineEdit
              onClick={() => {
                alert("Edit")
              }}
            />
          </button>
          <button>
            <MdOutlineDelete
              onClick={() => {
                alert("Delete")
              }}
            />
          </button>
        </div>
      </div>
      <div className="body">
        <div className="specs-grid">
          <div className="box">
            <div className="box-header">
              <IoMdCash />
              <span> Price</span>
            </div>
            <p>${props.item.price.toLocaleString()}</p>
          </div>

          <div className="box">
            <div className="box-header">
              <HiOutlineClock />
              <span>Rem. Mos.</span>
            </div>
            <p>{props.item.price.toLocaleString()}</p>
          </div>

          <div className="box">
            <div className="box-header">
              <MdSpeed />
              <span>Miles</span>
            </div>
            <p>{props.item.miles.toLocaleString()}</p>
          </div>
          <div className="box">
            <div className="box-header">
              <MdOutlinePriceChange />
              <span>CPRM</span>
            </div>
            <p>${props.item.price.toLocaleString()}</p>
          </div>
        </div>
        <div className="link">
          <span>Visit Link</span>
          <HiOutlineExternalLink />
        </div>
      </div>
    </Card>
  )
}
export default CarListItemCard
