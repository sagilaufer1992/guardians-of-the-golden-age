import "./FaultButtons.scss";

import React, { useContext } from "react";
import classnames from "classnames";
import Button from "@material-ui/core/Button";
import { MdClose } from "react-icons/md";
import UserProvider from "../utils/UserProvider";
import Tooltip from "@material-ui/core/Tooltip";

interface Props {
    status: FaultStatus;
    onStatusChange: (status: FaultStatus) => void;
    onFaultDelete: () => void;
}

export default React.memo(function FaultButtons(props: Props) {
    const user = useContext(UserProvider);

    const { status, onStatusChange, onFaultDelete } = props;

    if (user.role === "hamal") {
        return <div className="fault-status-buttons">
            {status === "Complete" && <StateButton status="Todo" onStatusChange={onStatusChange} />}
            {status === "Todo" && <>
                <StateButton status="Complete" onStatusChange={onStatusChange} />
                <StateButton status="InProgress" onStatusChange={onStatusChange} />
            </>}
            {status === "InProgress" && <>
                <StateButton status="Complete" onStatusChange={onStatusChange} />
                <StateButton status="Todo" onStatusChange={onStatusChange} />
            </>}
        </div>;
    }

    // Cant cancel a fault that is already handled
    if (status !== "Todo") return null;

    return <Tooltip title="הסר תקלה" placement="right">
        <div><MdClose className="delete-fault-button" onClick={onFaultDelete} /></div>
    </Tooltip>;
});

interface ButtonProps {
    onStatusChange: (status: FaultStatus) => void;
    status: FaultStatus;
}

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