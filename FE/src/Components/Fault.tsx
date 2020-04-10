import "./Fault.scss";

import React, { useState } from "react";
import classnames from "classnames";
import Chip from "@material-ui/core/Chip";
import FaultChat from "./FaultChat";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

interface Props {
  fault: Fault;
  onFaultClick?: () => void;
}

export default React.memo(function Fault(props: Props) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const {
    category,
    status,
    author,
    distributionCenter,
    content,
    date,
  } = props.fault;

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
              <span>{content}</span>
            </div>
          </div>
          <div
            className="show-history"
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          >
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
      {isDetailsOpen && <FaultChat fault={props.fault} />}
    </>
  );
});
