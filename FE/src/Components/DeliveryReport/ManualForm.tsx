import "./ManualForm.scss";

import React from "react";
import { Fab } from '@material-ui/core';
import moment from "moment";

import { ColorButton, ProgressBar } from "./utils";

const INCREASE_VALUES = [100, 50, 10, 1];
const DECREASE_VALUES = [1, 50];

interface Props {
    total: number;
    delivered: number;
    setDelivered: (value: number) => void;
    setIsDone: (isDone: boolean) => void;
    getReport: (report: Partial<DeliveryReportData>) => void;
}

export default function ManualFrom({ total, delivered, setDelivered, setIsDone, getReport }: Props) {
    const momentDate = moment(new Date());

    function onIncrease(value: number) {
        if (delivered + value <= total) {
            setDelivered(delivered + value);
            getReport({
                delivered: delivered + value,
                pendingDelivery: total - delivered - value,
            })
        }
    }

    function onDecrease(value: number) {
        if (delivered - value >= 0) {
            setDelivered(delivered - value);
            getReport({
                delivered: delivered - value,
                pendingDelivery: total - delivered + value,
            })
        }
    }

    return <div className="report">
        <div className="manual-form-header">
            <div className="date">
                יום {momentDate.format('dddd')} {momentDate.format("DD/MM/YY")}
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
                    onClick={() => onIncrease(value)}>
                    {value}+
                </Fab>)}
            </div>
            <div className="decrease-buttons">
                {DECREASE_VALUES.map(value => <Fab key={`-${value}`}
                    className="small-button"
                    size="small"
                    disabled={delivered - value < 0}
                    onClick={() => onDecrease(value)}>
                    {value}-
                </Fab>)}
            </div>
        </div>
    </div>
}