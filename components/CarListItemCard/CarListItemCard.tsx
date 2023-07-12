import { MdSpeed, MdOutlinePriceChange, MdOutlineDelete, MdOutlineEdit } from "react-icons/md"
import { IoMdCash } from "react-icons/io"
import { HiOutlineExternalLink, HiOutlineClock } from "react-icons/hi"

import Card from "./CarListItemCardStyles"

import { useRouter } from "next/router"

type Props = {
  deleteItem: (carId: string) => void
  item: {
    carId: string
    cprm: number
    createdDate: string
    description: string
    link: string
    miles: number
    price: number
    rem_months: number
  }
}

const CarListItemCard = (props: Props) => {
  const router = useRouter()

  return (
    <Card>
      <div className="header">
        <h3>{props.item.description}</h3>
        <div>
          <button>
            <MdOutlineEdit
              onClick={() => {
                void router.push(`/edit/${props.item.carId}`)
              }}
            />
          </button>
          <button>
            <MdOutlineDelete
              onClick={() => {
                props.deleteItem(props.item.carId)
              }}
            />
          </button>
        </div>
      </div>
      <div className="body">
        <div className="specs-grid">
          <div className="box">
            <div className="box-header">
              <div className="title">Price</div>
              <IoMdCash />
            </div>
            <p>${props.item.price.toLocaleString()}</p>
          </div>

          <div className="box">
            <div className="box-header">
              <div className="title">Time Left</div>
              <HiOutlineClock />
            </div>
            <p>
              {/* 3 Layer Ternary */}
              {props.item.rem_months > 12 ? `~${(Math.round(props.item.rem_months) / 12).toFixed(1)} years` : `${props.item.rem_months > 1 ? `${Math.round(props.item.rem_months)} months` : `${props.item.rem_months === 1 ? "1 month" : "n/a"}`}`}
            </p>
          </div>

          <div className="box">
            <div className="box-header">
              <div className="title">Miles</div>
              <MdSpeed />
            </div>
            <p>{props.item.miles <= 1 ? "New" : props.item.miles.toLocaleString()}</p>
          </div>
          <div className="box">
            <div className="box-header">
              <div className="title">CPRM</div>
              <MdOutlinePriceChange />
            </div>
            <p>{props.item.cprm > 1 ? `$${Math.round(props.item.cprm).toLocaleString()}` : "n/a"}</p>
          </div>
        </div>
        <div className="footer">
          <p>
            Car Added: {new Date(props.item.createdDate).getMonth() + 1}/{new Date(props.item.createdDate).getDate()}/{new Date(props.item.createdDate).getFullYear()}
          </p>

          {props.item.link && (
            <a target="_blank " href={props.item.link}>
              Visit Link
              <HiOutlineExternalLink />
            </a>
          )}

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
