import "./ManualForm.scss";

import React from "react";
import moment from "moment";
import { Fab } from '@material-ui/core';

import { ColorButton, ProgressBar } from "./utils";

const INCREASE_VALUES = [100, 50, 10, 1];
const DECREASE_VALUES = [1, 50];

interface Props {
    date: Date;
    deliveryReport: DeliveryReportData | null;
    setIsDone: (isDone: boolean) => void;
    updateDelivery: (report: Partial<DeliveryReportData>, increment: boolean) => void;
}

export default function ManualFrom({ date, deliveryReport, setIsDone, updateDelivery }: Props) {
    const { delivered = 0, total = 100 } = deliveryReport || {};

    function onChange(value: number) {
        updateDelivery({ delivered: value }, true);
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
        <div className="manual-form-buttons">
            <div>
                {INCREASE_VALUES.map(value => <Fab key={`+${value}`}
                    className="small-button"
                    size="small"
                    color="primary"
                    disabled={delivered + value > total}
                    onClick={() => onChange(value)}>
                    {value}+
                </Fab>)}
            </div>
            <div className="decrease-buttons">
                {DECREASE_VALUES.map(value => <Fab key={`-${value}`}
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