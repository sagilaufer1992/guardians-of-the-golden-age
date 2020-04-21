import "./DatePicker.scss";

import React, { useMemo } from "react";
import classnames from "classnames";
import moment from "moment";
import { dayDifference } from "../../utils/dates";

interface Props {
    date: Date;
    onDateChanged: (date: Date) => void;
}

export default function DatePicker({ date, onDateChanged }: Props) {
    const onClick = (daysToAdd: number) => {
        const newDate = moment(date).add(daysToAdd, "days").startOf('day').toDate();
        console.log(newDate);
        onDateChanged(newDate);
    }

    const leftArrowClassName = classnames("left-arrow", { disabled: dayDifference(date, new Date()) > 6 });

    return <div className="date-picker" >
        <div className="title">תמונת מצב ליום:</div>
        <div>
            <div className="right-arrow" onClick={() => onClick(-1)} />
            <div className="value">{`${_huminzeDay(date)} ${moment(date).format("DD/MM/YY")}`}</div>
            <div className={leftArrowClassName} onClick={() => onClick(1)} />
        </div>
    </div>
}

function _huminzeDay(date: Date): string {
    const diff = dayDifference(new Date(), date);
    
    let prefix = "";
    if (diff === 0) prefix += "היום, ";
    else if (diff === 1) prefix += "אתמול, ";

    return prefix + moment(date).format('dddd');
}