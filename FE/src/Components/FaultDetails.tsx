import "./FaultDetails.scss";

import React from "react";
import FaultChat from "./FaultChat";

interface Props {
    fault: Fault;
}

function FaultDetails({ fault }: Props) {
    return <div className="fault-details">
        <FaultChat fault={fault} />
    </div>;
}

export default React.memo(FaultDetails);