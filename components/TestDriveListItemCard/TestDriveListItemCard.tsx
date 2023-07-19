import { MdSpeed, MdOutlinePriceChange, MdOutlineDelete } from "react-icons/md"
import { IoMdCash } from "react-icons/io"
import { HiOutlineExternalLink, HiOutlineClock } from "react-icons/hi"

import Card from "./TestDriveListItemCardStyles"

//types

import { TestDriveCarType } from "../../lib/types"

type Props = {
  deleteHandler: (carId: number) => void
  item: TestDriveCarType
}

const TestDriveListItemCard = (props: Props) => {
  return (
    <Card>
      <div className="header">
        <h3>{props.item.description}</h3>
        <div>
          <button>
            <MdOutlineDelete
              onClick={() => {
                props.deleteHandler(props.item.uniqueId)
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
            <p>{props.item.rem_months > 12 ? `~${(Math.round(props.item.rem_months) / 12).toFixed(1)} years` : `${props.item.rem_months > 1 ? `${Math.round(props.item.rem_months)} months` : `${props.item.rem_months === 1 ? "1 month" : "n/a"}`}`}</p>
          </div>

          <div className="box">
            <div className="box-header">
              <div className="title">Miles</div>
              <MdSpeed />
            </div>
            <p>{props.item.miles <= 10 ? "New" : props.item.miles.toLocaleString()}</p>
          </div>
          <div className="box">
            <div className="box-header">
              <div className="title">CPRM</div>
              <MdOutlinePriceChange />
            </div>
            <p>{props.item.cost_per_rem_mos > 0 ? `$${Math.round(props.item.cost_per_rem_mos).toLocaleString()}` : "n/a"}</p>
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
        </div>
      </div>
    </Card>
  )
}
export default TestDriveListItemCard
