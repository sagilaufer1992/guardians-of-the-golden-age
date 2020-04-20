import "./DailySummary.scss";

import React, { useState, useEffect } from "react";
import { Button } from '@material-ui/core';

import NumberInput from "../Inputs/NumberInput";
import { ProgressBar } from "./utils";
import DeliveryReasons from "./DeliveryReasons";

interface Props {
    deliveryReport: DeliveryReportData | null;
    setDeliveryReport: (deliveryReport: Partial<DeliveryReportData>) => Promise<void>;
    finishDeliveryReport: (deliveryReport: Partial<DeliveryReportData>) => void;
}

export default function DailySummary(props: Props) {
    const report = props.deliveryReport;

    return <div className="report">
        {report && <ProgressBar total={report.total} current={report.delivered} />}
        <DeliveryForm {...props} />
    </div>;
}

function DeliveryForm({ deliveryReport, setDeliveryReport, finishDeliveryReport }: Props) {
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
        setDeliveryReport({ delivered: currentNumber });
    }

    return <div className="summary-content">
        <div className="total-deliveries">
            <NumberInput className="total-input"
                disabled={isApproved}
                label='כמה מנות חולקו סה"כ?'
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
        {deliveryReport?.deliveryFailReasons && <DeliveryReasons deliveryReport={deliveryReport}
            finishDeliveryReport={!isApproved ? undefined : finishDeliveryReport} />}
    </div>
}