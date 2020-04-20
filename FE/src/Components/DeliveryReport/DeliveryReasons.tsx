import "./DeliveryReasons.scss";

import React, { useState, useEffect } from "react";
import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

import DropDownInput from "../Inputs/DropDownInput";
import NumberInput from "../Inputs/NumberInput";
import { ColorButton } from "./utils";
import { toSelect } from "../../utils/inputs";
import { failRasonToText } from "../../utils/translations";

interface Props {
    deliveryReport: DeliveryReportData | null;
    setDeliveryReport: (deliveryReport: Partial<DeliveryReportData>) => void;
}

interface Reason {
    value: FailReason;
    deliveries: number;
}

const DEFAULT_REASON: Reason = { value: "other", deliveries: 0 };
const EXPLANATION_OPTIONS = toSelect(failRasonToText);

export default function DeliveryReasons({ deliveryReport, setDeliveryReport }: Props) {
    const [reasons, setReasons] = useState<Reason[]>([]);

    useEffect(() => {
        if (!deliveryReport) return;

        const { deliveryFailReasons } = deliveryReport;
        const initialReasons = !deliveryFailReasons ? [DEFAULT_REASON] :
            Object.entries(deliveryFailReasons).map(([value, deliveries]) => ({ value, deliveries })) as Reason[];

        setReasons(initialReasons);
    }, [deliveryReport]);

    function _onAddReason() {
        const firstUnusedOption = EXPLANATION_OPTIONS.find(option => !reasons.find(r => r.value === option.value));

        if (firstUnusedOption)
            setReasons([...reasons, { value: firstUnusedOption.value, deliveries: 0 }]);
    }

    function _onRemoveReason() {
        if (reasons.length > 0) setReasons(reasons.slice(0, -1));
    }

    function _onReasonChange(old: Reason, newValue: Reason) {
        const newReasons = [...reasons];
        const index = newReasons.findIndex(_ => _ === old);
        newReasons[index] = newValue;

        setReasons(newReasons);
    }

    function _setDeliveryReport() {
        const { delivered, total } = deliveryReport!;
        setDeliveryReport({
            delivered,
            deliveryFailed: total - delivered,
            deliveryFailReasons: reasons.reduce((dict, { value, deliveries }) => ({
                ...dict, [value]: deliveries
            }), {} as Record<FailReason, number>),
        });
    }

    const sumDeliveries = !deliveryReport ? 0 :
        deliveryReport.delivered + reasons.reduce((sum, { deliveries }) => sum + (isNaN(deliveries) ? 0 : deliveries), 0);

    return <>
        <div className="reasons">
            {reasons.map(reason =>
                <ReasonInput key={reason.value} reason={reason} reasons={reasons} setReason={_onReasonChange} />)}
        </div>
        <div className="reason-buttons">
            <Fab className="add-reason-button"
                onClick={_onAddReason}
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
        <div className="remaining-deliveries">סה״כ מנות שלא ידועות: {(deliveryReport?.total ?? 0) - sumDeliveries}</div>
        <div className="send-reasons">
            <ColorButton disabled={!deliveryReport || sumDeliveries !== deliveryReport.total} onClick={_setDeliveryReport}>
                סיום יום החלוקה
        </ColorButton>
        </div>
    </>
}

interface ReasonsProps {
    reason: Reason;
    reasons: Reason[];
    setReason: (oldReason: Reason, newValue: Reason) => void;
}

function ReasonInput({ reason, reasons, setReason }: ReasonsProps) {
    const options = EXPLANATION_OPTIONS.map(option => ({
        ...option,
        disabled: !!reasons.find(r => r.value === option.value)
    }));

    return <div className="reason">
        <div className="fault-field">
            <div className="label">למה נוצר הפער?</div>
            <DropDownInput
                defaultValue={reason.value}
                options={options}
                title=""
                onChange={explanation => setReason(reason, { value: explanation as FailReason, deliveries: reason.deliveries })} />
        </div>
        <NumberInput className="reason-number"
            label="מספר המנות"
            onChange={deliveries => setReason(reason, { value: reason.value, deliveries })}
            min={0}
            max={Infinity}
            value={reason.deliveries} />
    </div>
}