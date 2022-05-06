import styled from "styled-components"
import { MdSpeed, MdOutlinePriceChange, MdOutlineDelete, MdOutlineEdit } from "react-icons/md"
import { IoMdCash } from "react-icons/io"
import { HiOutlineExternalLink, HiOutlineClock } from "react-icons/hi"

import { breakpoints } from "../styles/breakpoints"

const Card = styled.li`
  width: 100%;
  margin: 1.5rem auto;
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
    padding: 0.75rem;
    display: flex;
    align-items: center;
    font-size: 1rem;
    justify-content: space-between;
    border: 2px solid var(--transparent);
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    margin: 0;

    @media ${breakpoints.sm} {
      font-size: 1.25rem;
    }

    svg {
      color: #fff;
      font-size: 1.2rem;
      top: 2px;

      @media ${breakpoints.sm} {
        font-size: 1.6rem;
      }
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
    padding: 0.25rem 0.25rem;

    .specs-grid {
      padding: 0.5rem 0.25rem;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      grid-template-rows: 1fr;
      gap: 0.05rem;
      //border: 1px solid hotpink;

      .box {
        //border: 1px solid var(--primary);
        display: flex;
        align-items: center;
        justify-content: center;
        //font-size: 1.5rem;
        flex-direction: column;

        .box-header {
          //padding-bottom: 5px;
          //border-bottom: 2px solid var(--primary);
          text-align: center;

          span {
            font-family: var(--font-secondary);
            font-size: 0.9rem;
            letter-spacing: 0.25px;

            @media ${breakpoints.sm} {
              font-size: 1.2rem;
              letter-spacing: 1px;
            }
          }
        }
      }
    }
  }

  svg {
    position: relative;
    top: 0.1rem;
    margin-right: 0.1rem;
    font-size: 0.9rem;

    @media ${breakpoints.sm} {
      font-size: 1.6rem;
      top: 0.4rem;
      margin-right: 0.5rem;
    }
  }

  p {
    padding: 0;
    margin: 0.25rem 0 0.5rem 0;
    color: var(--gray);
    font-size: 0.9rem;
    font-family: var(--font-primary);

    @media ${breakpoints.sm} {
      font-size: 1.15rem;
    }
  }

  .footer {
    //border: 1px solid purple;
    padding: 0.25rem 1rem;
    display: flex;
    align-items: center;
    font-size: 0.8rem;
    color: var(--primary);
    justify-content: space-between;

    p {
      font-size: 0.6rem;
      padding: 0;
      margin: 0;
    }

    a {
      font-size: 0.75rem;
      padding: 0;
      margin: 0;
      color: var(--primary);

      :hover {
        text-decoration: none;
        color: var(--indigo);
      }

      @media ${breakpoints.sm} {
        font-size: 0.9rem;
      }
    }

    svg {
      font-size: 0.8rem;
      top: 2px;
      padding: 0;
      margin: 0 0 0 0.1rem;

      @media ${breakpoints.sm} {
        font-size: 1rem;
      }
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
            <p>{Math.round(props.item.rem_months)}</p>
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
            <p>${Math.round(props.item.cprm.toLocaleString())}</p>
          </div>
        </div>
        <div className="footer">
          <p>
            Car added: {new Date(props.item.createdDate).getMonth() + 1}/{new Date(props.item.createdDate).getDate()}/{new Date(props.item.createdDate).getFullYear()}
          </p>

          <a href="#">
            Visit Link
            <HiOutlineExternalLink />
          </a>

          {/* <div>
            <span>Visit Link</span>
            <HiOutlineExternalLink />
          </div> */}
        </div>
      </div>
    </Card>
  )
}
export default CarListItemCard
