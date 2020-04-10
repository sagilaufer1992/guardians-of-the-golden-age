import React, { useState } from "react";
import classnames from "classnames";
import Card from "@material-ui/core/Card";
import Chip from "@material-ui/core/Chip";
import CardContent from "@material-ui/core/CardContent";
import FaultChat from "./FaultChat";
import "./Fault.css";

interface Props {
  fault: Fault;
  onFaultClick?: () => void;
}

export default React.memo(function Fault(props: Props) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { category, hierarchy, status, title } = props.fault;

  return (<>
    <Card className="fault">
      <CardContent className="fault-content">
        <div className="content-and-status">
          <div className={classnames("status", status)} />
          <div className="content">
            <div className="region">{_getRegion(hierarchy)}</div>
            <div className="station-name">{_getStationName(hierarchy)}</div>
            <div className="category-and-description">
              <Chip
                className="category"
                variant="outlined"
                color="primary"
                label={category}
              ></Chip>
              <span>{title}</span>
            </div>
          </div>
        </div>
        <div className="history">
          <Chip label="הצג היסטוריית טיפול" onClick={() => setIsDetailsOpen(true)}></Chip>
        </div>
      </CardContent>
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
