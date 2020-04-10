import "./FaultDetails.scss";

import React from "react";
import FaultChat from "./FaultChat";
import AddFaultMessage from "./AddFaultMessage";

interface Props {
    fault: Fault;
}

function FaultDetails({ fault }: Props) {
    return <div className="fault-details">
        <FaultChat fault={fault} />
        <AddFaultMessage setNewMessage={() => {}}/>
    </div>;
}

export default React.memo(FaultDetails);