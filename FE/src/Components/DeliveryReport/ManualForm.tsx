import "./ManualForm.scss";

import React, { useState } from "react";
import moment from "moment";
import { Fab } from '@material-ui/core';

import { ColorButton, ProgressBar } from "./utils";
import NumberInput from "../Inputs/NumberInput";

interface Props {
    date: Date;
    deliveryReport: DeliveryReportData | null;
    setIsDone: (deliveryType: string) => void;
    updateDelivery: (report: Partial<DeliveryInfoData>, deliveryType: DeliveryType, increment: boolean) => void;
}

export default function ManualForm({ date, deliveryReport, setIsDone, updateDelivery }: Props) {
    const { deliveries = {} } = deliveryReport || {};

    return <div className="report">
        <div className="manual-form-header">
            <div className="date">
                יום {moment(date).format('dddd')} {moment(date).format("DD/MM/YY")}
            </div>
        </div>
        {Object.entries(deliveries).map(([deliveryType, deliveryInfo]) =>
            <AddDeliveriesByType key={deliveryType}
                updateDelivery={updateDelivery}
                setIsDone={setIsDone}
                deliveryType={deliveryType}
                {...deliveryInfo} />)}
    </div>
}

interface AddProps {
    total: number;
    delivered: number;
    deliveryFailed: number;
    deliveryType: DeliveryType;
    setIsDone: (deliveryType: string) => void;
    updateDelivery: (report: Partial<DeliveryInfoData>, deliveryType: DeliveryType, increment: boolean) => void;
}

function AddDeliveriesByType({ delivered = 0, total = 100, deliveryFailed = 0, deliveryType, setIsDone, updateDelivery }: AddProps) {
    const [valueToAdd, setValueToAdd] = useState<number>(0);

    function onChange(value: number) {
        if (value + delivered <= total)
            updateDelivery({ delivered: value, total }, deliveryType, true);
    }

    console.log(delivered, deliveryFailed, total, deliveryFailed + delivered === total);

    return <>
        <div className="title">{deliveryType}</div>
        <div className="delivery-progress">
            <ProgressBar total={total} current={delivered} failed={deliveryFailed} />
            <ColorButton className="progress-button" onClick={() => setIsDone(deliveryType)}>
                סיים להיום
            </ColorButton>
        </div>
        {deliveryFailed + delivered !== total && <div className="manual-form-bottom">
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
                dense={true}
                min={0} max={Infinity} />
            <Fab className="small-button"
                variant="extended"
                onClick={() => onChange(-valueToAdd)}
                disabled={delivered - valueToAdd < 0 || valueToAdd === 0}
                size="small">
                הורד
            </Fab>
        </div>}
    </>
}