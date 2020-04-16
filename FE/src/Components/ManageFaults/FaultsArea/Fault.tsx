import "./Fault.scss";

import React, { useState, useContext } from "react";
import classnames from "classnames";
import moment from "moment";
import { Card } from "@material-ui/core";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import UserProvider from "../../../utils/UserProvider";
import FaultDetails from "./FaultDetails";
import FaultButtons from "./FaultButtons";

interface Props {
  fault: Fault;
  onStatusChange: (faultId: string, status: FaultStatus) => void;
  onFaultDelete: (id: string) => void;
}

export default React.memo(function Fault(props: Props) {
  const user = useContext(UserProvider);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { _id, category, status, author, distributionCenter, date, branch } = props.fault;

  const _onStatusChange = (status: FaultStatus) => props.onStatusChange(_id, status);
  const _onFaultDelete = () => props.onFaultDelete(_id);

  return (
    <>
      <Card className="fault">
        <div className={classnames("status", status)} />
        <div className="content">
          <div className="hierarchy">{branch ? `${branch.district} / ${branch.napa} / ${branch.municipalityName} ` : ""}</div>
          <div className="name">{branch ? `${branch.name} - ${branch.id}` : distributionCenter}</div>
          <div className="more-info">
            <span>{`נפתחה בשעה - ${moment(date).format("HH:mm")}`}</span>
            <span>{`על ידי ${author.name}`}</span>
            <span>{`בקטגוריה ${category}`}</span>
          </div>
        </div>
        <div className="left-side">
          <FaultButtons status={status} onStatusChange={_onStatusChange} onFaultDelete={_onFaultDelete} />
          <div className="show-history" onClick={() => setIsDetailsOpen(!isDetailsOpen)}>
            {isDetailsOpen ? (
              <><MdKeyboardArrowUp className="expander-arrow" />סגור פרטים</>
            ) : (
                <><MdKeyboardArrowDown className="expander-arrow" />הצג פרטים</>
              )}
          </div>
        </div>
      </Card>
      {isDetailsOpen && <FaultDetails fault={props.fault} />}
    </>
  );
});