import "./ManualForm.scss";

import React, { useState } from "react";
import moment from "moment";
import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

import { ColorButton, ProgressBar } from "./utils";
import NumberInput from "../Inputs/NumberInput";

const BUTTON_VALUES = [100, 10, 1];

interface Props {
    date: Date;
    deliveryReport: DeliveryReportData | null;
    setIsDone: (isDone: boolean) => void;
    updateDelivery: (report: Partial<DeliveryReportData>, increment: boolean) => void;
}

export default function ManualFrom({ date, deliveryReport, setIsDone, updateDelivery }: Props) {
    const { delivered = 0, total = 100 } = deliveryReport || {};
    const [valueToAdd, setValueToAdd] = useState<number>(0);

    function onChange(value: number) {
        if (value + delivered <= total)
            updateDelivery({ delivered: value, total }, true);
    }

    return <div className="report">
        <div className="manual-form-header">
            <div className="date">
                יום {moment(date).format('dddd')} {moment(date).format("DD/MM/YY")}
            </div>
            <ColorButton onClick={() => setIsDone(true)}>
                סיים את החלוקה להיום
            </ColorButton>
        </div>
        <div><ProgressBar total={total} current={delivered} /></div>
        <div className="manual-form-bottom">
            <Fab className="small-button"
                variant="extended"
                onClick={() => onChange(valueToAdd)}
                disabled={valueToAdd + delivered > total || valueToAdd === 0}
                size="small"
                color="primary">
                הוסף
            </Fab>
            <NumberInput className="manual-form-input"
                value={valueToAdd}
                onChange={(value) => setValueToAdd(value)}
                label=""
                min={0} max={Infinity} />
            <Fab className="small-button"
                variant="extended"
                onClick={() => onChange(-valueToAdd)}
                disabled={delivered - valueToAdd < 0 || valueToAdd === 0}
                size="small">
                הורד
            </Fab>
        </div>
        <div className="manual-form-buttons">
            <div>
                {BUTTON_VALUES.map(value => <Fab key={`+${value}`}
                    className="small-button"
                    size="small"
                    color="primary"
                    disabled={delivered + value > total}
                    onClick={() => onChange(value)}>
                    {value}+
                </Fab>)}
            </div>
            <div className="decrease-buttons">
                {BUTTON_VALUES.map(value => <Fab key={`-${value}`}
                    className="small-button"
                    size="small"
                    disabled={delivered - value < 0}
                    onClick={() => onChange(-value)}>
                    {value}-
                </Fab>)}
            </div>
        </div>
    </div>
}