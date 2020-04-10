import React, { useState } from "react";
import classnames from "classnames";
import Card from "@material-ui/core/Card";
import Chip from "@material-ui/core/Chip";
import CardContent from "@material-ui/core/CardContent";
import FaultChat from "./FaultChat";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import "./Fault.scss";

interface Props {
  fault: Fault;
  onFaultClick?: () => void;
}

export default React.memo(function Fault(props: Props) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { category, status, author, distributionCenter } = props.fault;

  return (<>
    <Card className="fault-container">
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
        <div className="show-history" onClick={() => setIsDetailsOpen(!isDetailsOpen)}>
          {isDetailsOpen ? <><MdKeyboardArrowUp className="expander-arrow" />סגור פרטים</> :
            <><MdKeyboardArrowDown className="expander-arrow" />הצג פרטים</>}
        </div>
      </div>
    </Card>
    {isDetailsOpen && <FaultChat fault={props.fault} />}
  </>);

  function _getStationName(hierarchy: string) {
    const splittedHeirarchy = hierarchy.split("/");
    return splittedHeirarchy[splittedHeirarchy.length - 1];
  }

  function _getRegion(hierarchy: string) {
    const splittedHeirarchy = hierarchy.split("/");
    return splittedHeirarchy.slice(0, splittedHeirarchy.length - 1).join("/");
  }
})
