import "./FaultButtons.scss";

import React from "react";
import classnames from "classnames";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import { MdClose } from "react-icons/md";

import { useUser } from "../../utils/UserProvider";
import { isHamal } from "../../utils/roles";

interface Props {
    status: FaultStatus;
    canBeConfirmed: boolean;
    onStatusChange: (status: FaultStatus) => void;
    onFaultDelete: () => void;
}

export default React.memo(function FaultButtons({ status, onStatusChange, onFaultDelete, canBeConfirmed }: Props) {
    const user = useUser();

    function _deleteFault(e: React.MouseEvent<any>) {
        e.stopPropagation();
        onFaultDelete();
    }

    if (isHamal(user)) {
        return <div className="fault-status-buttons">
            {status === "Complete" && <StateButton status="Todo" onStatusChange={onStatusChange} />}
            {status === "Todo" && <>
                <StateButton status="Complete" disabled={!canBeConfirmed} onStatusChange={onStatusChange} />
                <StateButton status="InProgress" onStatusChange={onStatusChange} />
            </>}
            {status === "InProgress" && <>
                <StateButton status="Complete" disabled={!canBeConfirmed} onStatusChange={onStatusChange} />
                <StateButton status="Todo" onStatusChange={onStatusChange} />
            </>}
        </div>;
    }

    // Cant cancel a fault that is already handled
    if (status !== "Todo") return null;

    return <Tooltip title="הסר תקלה" placement="right">
        <div><MdClose className="delete-fault-button" onClick={_deleteFault} /></div>
    </Tooltip>;
});

interface ButtonProps {
    onStatusChange: (status: FaultStatus) => void;
    status: FaultStatus;
    disabled?: boolean;
}

function StateButton({ onStatusChange: onChangeStatus, status, disabled = false }: ButtonProps) {
    const label = status === "Todo" ? "החזר ללא טופל" :
        status === "Complete" ? "סמן כטופל" : "סמן שבתהליך";

    function _onButtonClick(e: React.MouseEvent<any>) {
        e.stopPropagation();
        onChangeStatus(status);
    }

    return <Button className={classnames("button", status)} disabled={disabled} onClick={_onButtonClick} variant="outlined" size="small">
        {label}
    </Button>
}