import "./Fault.scss";

import React, { useState } from "react";
import classnames from "classnames";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import FaultDetails from "./FaultDetails";

interface Props {
  fault: Fault;
  onFaultClick?: () => void;
  onStatusChange: (faultId: string, status: FaultStatus) => void;
}

interface ButtonProps {
  onStatusChange: (status: FaultStatus) => void;
  status: FaultStatus;
}

export default React.memo(function Fault(props: Props) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const {
    _id,
    category,
    status,
    author,
    distributionCenter,
    content,
    date,
  } = props.fault;

  function _onStatusChange(status: FaultStatus) {
    props.onStatusChange(_id, status);
  }

  return (
    <>
      <div className="fault-container">
        <div className="fault">
          <div className={classnames("status", status)} />
          <div className="content">
            <div className="author-and-date">
              {author.name} - {date.toLocaleDateString("he-IL")}
            </div>
            <div className="station-name">{distributionCenter}</div>
            <div className="category-and-description">
              <Chip
                className="category"
                variant="outlined"
                color="primary"
                label={category}
              ></Chip>
              <span>{props.fault._id}  {content}</span>
            </div>
          </div>
          <div className="left-side">
            <div className="change-status">
              {status === "Complete" && <StateButton status="Todo" onStatusChange={_onStatusChange} />}
              {status === "Todo" && <>
                <StateButton status="Complete" onStatusChange={_onStatusChange} />
                <StateButton status="InProgress" onStatusChange={_onStatusChange} />
              </>}
              {status === "InProgress" && <>
                <StateButton status="Complete" onStatusChange={_onStatusChange} />
                <StateButton status="Todo" onStatusChange={_onStatusChange} />
              </>}
            </div>
            <div className="show-history" onClick={() => setIsDetailsOpen(!isDetailsOpen)}>
              {isDetailsOpen ? (
                <>
                  <MdKeyboardArrowUp className="expander-arrow" />
                סגור פרטים
              </>
              ) : (
                  <>
                    <MdKeyboardArrowDown className="expander-arrow" />
                הצג פרטים
              </>
                )}
            </div>
          </div>
        </div>
      </div>
      {isDetailsOpen && <FaultDetails fault={props.fault} />}
    </>
  );
});

function StateButton({ onStatusChange: onChangeStatus, status }: ButtonProps) {
  const label = status === "Todo" ? "החזר ללא טופל" :
    status === "Complete" ? "סמן כטופל" : "סמן שבתהליך";

  return <Button className={classnames("button", status)}
    onClick={() => onChangeStatus(status)}
    variant="outlined"
    size="small">
    {label}
  </Button>
}