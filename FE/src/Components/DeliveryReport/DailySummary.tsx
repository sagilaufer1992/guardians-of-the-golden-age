import "./DailySummary.scss";

import React, { useState, useEffect } from "react";
import { Button } from '@material-ui/core';

import NumberInput from "../Inputs/NumberInput";
import { ProgressBar } from "./utils";
import DeliveryReasons from "./DeliveryReasons";
import { deliveryTypeToText } from "../../utils/translations";

interface Props {
    deliveryReport: DeliveryInfoData | null;
    deliveryType: DeliveryType;
    setDeliveryReport: (deliveryReport: Partial<DeliveryInfoData>, deliveryType: DeliveryType) => Promise<void>;
    finishDeliveryReport: (deliveryReport: Partial<DeliveryInfoData>, deliveryType: DeliveryType) => void;
}

export default function DailySummary(props: Props) {
    const report = props.deliveryReport;

    return <div className="report">
        <div className="title">{deliveryTypeToText[props.deliveryType] ?? props.deliveryType}</div>
        {report && <ProgressBar total={report.total} current={report.delivered} failed={report.deliveryFailed} />}
        <DeliveryForm {...props} />
    </div>;
}

function DeliveryForm({ deliveryReport, setDeliveryReport, finishDeliveryReport, deliveryType }: Props) {
    const [currentNumber, setCurrentNumber] = useState<number>(0);
    const [isApproved, setIsApproved] = useState<boolean>(false);
    const [isValid, setIsValid] = useState<boolean>(true);

    useEffect(() => {
        if (deliveryReport) {
            setCurrentNumber(deliveryReport.delivered);
            setIsApproved(!!deliveryReport.deliveryFailReasons);
        }
    }, [deliveryReport])

    function _onCurrentNumber() {
        if (!isValid) return;

        setIsApproved(true);
        setDeliveryReport({ delivered: currentNumber }, deliveryType);
    }

    function _finishDeliveryReport(deliveryReport: Partial<DeliveryInfoData>) {
        finishDeliveryReport(deliveryReport, deliveryType);
    }

    return <div className="summary-content">
        <div className="total-deliveries">
            <NumberInput className="total-input"
                disabled={isApproved}
                dense
                label='כמה משלוחים בוצעו סה"כ?'
                min={0}
                max={deliveryReport?.total ?? 0}
                onChange={(value, isValid) => {
                    setIsValid(isValid);
                    setCurrentNumber(value);
                }}
                value={currentNumber} />
            {!isApproved ?
                <Button onClick={_onCurrentNumber} className="total-button" disabled={!isValid} color="primary" size="small" variant="contained">
                    אשר
                </Button> :
                <Button onClick={() => setIsApproved(false)} className="total-button" color="primary" size="small" variant="outlined">
                    שנה
            </Button>}
        </div>
        {isApproved && <DeliveryReasons deliveryReport={deliveryReport}
            finishDeliveryReport={!isApproved ? undefined : _finishDeliveryReport} />}
    </div>
}