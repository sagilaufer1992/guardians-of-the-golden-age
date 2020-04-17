import "./DeliveryReasons.scss";

import React, { useState } from "react";
import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

import DropDownInput from "../Inputs/DropDownInput";
import NumberInput from "../Inputs/NumberInput";
import { ColorButton } from "./utils";

interface Props {
    total: number;
    delivered: number;
    getDeliveryReport: (deliveryReport: Partial<DeliveryReportData>) => void;
}

interface Reason {
    index: number
    value: string;
    deliveries: number;
}

const DEFAULT_REASON = { index: 0, value: "אחר", deliveries: 0 };
const EXPLANATION_OPTIONS = [
    { value: "כתובת לא נכונה", label: "כתובת לא נכונה" },
    { value: "לא היו בבית", label: "לא היו בבית" },
    { value: "סירבו לקבל", label: "סירבו לקבל" },
    { value: "אחר", label: "אחר" },
]

export default function DeliveryReasons({ total, delivered, getDeliveryReport }: Props) {
    const [reasons, setReasons] = useState<Reason[]>([DEFAULT_REASON]);

    function _onAddReason() {
        const firstUnusedOption = EXPLANATION_OPTIONS.find(option =>
            !reasons.find(r => r.value === option.value)
        );
        if (firstUnusedOption)
            setReasons([...reasons, { index: reasons.length, value: firstUnusedOption.value, deliveries: 0 }]);
    }

    function _onRemoveReason() {
        if (reasons.length > 0) setReasons(reasons.slice(0, -1));
    }

    function _onReasonChange({ index, value: explanation, deliveries }: Reason) {
        setReasons(reasons.map(reason =>
            reason.index === index ? { index, value: explanation, deliveries } : reason
        ));
    }

    function _getDeliveryReport() {
        const deliveryReport = {
            delivered,
            pendingDelivery: 0,
            deliveryFailed: total - delivered,
            deliveryFailReasons: reasons.reduce((dict, { value: explanation, deliveries }) => ({
                ...dict, [explanation]: deliveries
            }), {}),
        }

        getDeliveryReport(deliveryReport);
    }

    const sumDeliveries = delivered + reasons.reduce((sum, { deliveries }) => sum + (isNaN(deliveries) ? 0 : deliveries), 0);

    function _calculateMaxDelivery(index: number) {
        return total - sumDeliveries + reasons[index].deliveries
    }

    return <>
        <div className="reasons">
            {reasons.map(({ index, deliveries, value }) =>
                <ReasonInput key={index}
                    index={index}
                    reasons={reasons}
                    value={value}
                    deliveries={deliveries}
                    maxDeliveries={_calculateMaxDelivery(index)}
                    getReason={_onReasonChange} />)}
        </div>
        <div className="reason-buttons">
            <Fab className="add-reason-button"
                onClick={() => _onAddReason()}
                disabled={EXPLANATION_OPTIONS.length === reasons.length}
                size="small"
                color="primary"
                variant="extended">
                הוסף סיבה
                <AddIcon />
            </Fab>
            <Fab className="add-reason-button" onClick={() => _onRemoveReason()} disabled={reasons.length === 1} size="small" color="primary" variant="extended">
                הסר סיבה
                <RemoveIcon />
            </Fab>
        </div>
        <div className="remaining-deliveries">סה״כ מנות שלא ידועות: {total - sumDeliveries}</div>
        <div className="send-reasons">
            <ColorButton  disabled={sumDeliveries !== total} onClick={_getDeliveryReport}>
                סיום יום החלוקה
        </ColorButton>
        </div>
    </>
}

interface ReasonsProps {
    index: number
    maxDeliveries: number;
    deliveries: number;
    value: string;
    reasons: Reason[];
    getReason: (reason: Reason) => void;
}

function ReasonInput({ maxDeliveries, index, deliveries, value, getReason, reasons }: ReasonsProps) {
    const options = EXPLANATION_OPTIONS.map(option => ({
        ...option,
        disabled: !!reasons.find(r => r.value === option.value)
    }));

    return <div className="reason">
        <div className="fault-field">
            <div className="label">למה נוצר הפער?</div>
            <DropDownInput
                defaultValue={value}
                options={options}
                title=""
                onChange={(explanation) => getReason({ value: explanation, deliveries, index })} />
        </div>
        <NumberInput className="reason-number"
            label="מספר המנות"
            onChange={(deliveries) => getReason({ value, deliveries, index })}
            min={0}
            max={maxDeliveries}
            value={deliveries} />
    </div>
}