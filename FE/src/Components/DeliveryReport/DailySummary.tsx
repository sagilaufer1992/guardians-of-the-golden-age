import "./DailySummary.scss";

import React, { useState, useEffect } from "react";
import { Button } from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

import NumberInput from "../Inputs/NumberInput";
import { ProgressBar } from "./utils";
import DeliveryReasons from "./DeliveryReasons";

interface Props {
    total: number;
    delivered: number;
    deliveryFailed: number;
    isManualFormDone: boolean;
    setDelivered: (value: number) => void;
    setIsDone: (isDone: boolean) => void; // CHANGE THIS
    getDeliveryReport: (deliveryReport: Partial<DeliveryReportData>) => void;
}

export default function DailySummary(props: Props) {
    const { total, delivered, getDeliveryReport, isManualFormDone, deliveryFailed } = props;
    const [isReportDone, setIsReportDone] = useState<boolean>(false); // CHANGE THIS

    useEffect(() => {
        if (isManualFormDone && delivered === total)
            getDeliveryReport({
                delivered,
                deliveryFailed: 0,
                name: "",
                deliveryFailReasons: {},
                pendingDelivery: 0,
            });
    }, [total, delivered, isManualFormDone])

    function _getDeliveryReport(deliveryReport: Partial<DeliveryReportData>) {
        setIsReportDone(true); // CHANGE THIS
        getDeliveryReport(deliveryReport);
    }

    return <div className="report">
        <ProgressBar total={total} current={delivered} />
        {isReportDone || total === delivered + deliveryFailed ?
            <DeliveryFullyCompleted {...props} /> :
            <DeliveryForm {...props} getDeliveryReport={_getDeliveryReport} />
        }
    </div>
}

function DeliveryFullyCompleted({ setIsDone }: Props) {
    useEffect(() => {
        setIsDone(true); // CHANGE THIS
    }, [])
    return <div className="sucess-message">
        <CheckCircleOutlineIcon />
        סיימת את היום בהצלחה
    </div>
}

function DeliveryForm({ total, delivered, setDelivered, getDeliveryReport }: Props) {
    const [currentNumber, setCurrentNumber] = useState<number | null>(null);
    const [isApproved, setIsApproved] = useState<boolean>(false);
    const [isValid, setIsValid] = useState<boolean>(true);

    useEffect(() => {
        setCurrentNumber(delivered);
    }, [delivered])

    function _onCurrentNumber() {
        if (isValid && currentNumber) {
            setIsApproved(true);
            setDelivered(currentNumber);
        };
    }

    return <div className="summary-content">
        <div className="total-deliveries">
            <NumberInput className="total-input"
                disabled={isApproved}
                label='כמה מנות חולקו סה"כ?'
                min={0}
                max={total}
                onChange={(value, isValid) => {
                    setIsValid(isValid);
                    setCurrentNumber(value);
                }}
                value={currentNumber ? currentNumber : delivered} />
            {!isApproved ?
                <Button onClick={() => _onCurrentNumber()} className="total-button" disabled={!isValid} color="primary" size="small" variant="contained">
                    אשר
                </Button> :
                <Button onClick={() => setIsApproved(false)} className="total-button" color="primary" size="small" variant="outlined">
                    שנה
            </Button>}
        </div>
        {isApproved &&
            <DeliveryReasons total={total}
                delivered={delivered}
                getDeliveryReport={getDeliveryReport} />}
    </div>
}