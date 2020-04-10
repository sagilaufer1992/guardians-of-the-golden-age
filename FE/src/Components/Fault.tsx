import "./Fault.scss";

import React, { useState } from "react";
import classnames from "classnames";
import Chip from "@material-ui/core/Chip";
import FaultDetails from "./FaultDetails";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

interface Props {
  fault: Fault;
  onFaultClick?: () => void;
}

export default React.memo(function Fault(props: Props) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { category, status, author, distributionCenter } = props.fault;

  return (<div className="fault-expander">
    <div className="fault">
      <div className={classnames("status", status)} />
      <div className="content">
        {/* <div className="region">{_getRegion(hierarchy)}</div>
          <div className="station-name">{_getStationName(hierarchy)}</div> */}
        <div className="category-and-description">
          <Chip
            className="category"
            variant="outlined"
            color="primary"
            label={category}
          ></Chip>
          <span>{distributionCenter}</span>
        </div>
      </div>
      <div className="show-details" onClick={() => setIsDetailsOpen(!isDetailsOpen)}>
        {isDetailsOpen ? <><MdKeyboardArrowUp className="expander-arrow" />סגור פרטים</> :
          <><MdKeyboardArrowDown className="expander-arrow" />הצג פרטים</>}
      </div>
    </div>
    {isDetailsOpen && <FaultDetails fault={props.fault} />}
  </div>);

  function _getStationName(hierarchy: string) {
    const splittedHeirarchy = hierarchy.split("/");
    return splittedHeirarchy[splittedHeirarchy.length - 1];
  }

  function _getRegion(hierarchy: string) {
    const splittedHeirarchy = hierarchy.split("/");
    return splittedHeirarchy.slice(0, splittedHeirarchy.length - 1).join("/");
  }
})
