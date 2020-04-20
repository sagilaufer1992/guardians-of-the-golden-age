import "./DatePicker.scss";

import React, { useState, useMemo } from "react";
import classnames from "classnames";

import moment from "moment";
import 'moment/locale/he'
moment.locale("he");

interface Props {
    initDate?: Date;
    onDateChanged: (date: Date) => void;
}

export default function DatePicker({ initDate, onDateChanged }: Props) {
    const [date, setDate] = useState(initDate || new Date());
    const momentDate = useMemo(() => moment(date), [date]);
    const onClick = (daysToAdd: number) => {
        const newDate = moment(date).add(daysToAdd, "days").startOf('day').toDate();
        setDate(newDate);
        onDateChanged(newDate);
    }

    const leftArrowClassName = classnames("left-arrow", { disabled: _getDiffInDays(date, new Date()) > 6 });

    return <div className="date-picker" >
        <div className="title">תמונת מצב ליום:</div>
        <div>
            <div className="right-arrow" onClick={() => onClick(-1)} />
            <div className="value">{`${_huminzeDay(date)} ${momentDate.format("DD/MM/YY")}`}</div>
            <div className={leftArrowClassName} onClick={() => onClick(1)} />
        </div>
    </div>
}

function _huminzeDay(date: Date): string {
    let prefix = "";
    if (_isToday(date)) prefix += "היום,";
    else if (_isYesterday(date)) prefix += "אתמול,"
    return `${prefix} ${moment(date).format('dddd')}`;
}

function _isToday(date: Date) {
    return _getDiffInDays(new Date(), date) === 0;
}

function _isYesterday(date: Date) {
    return _getDiffInDays(new Date(), date) === 1;
}

function _getDiffInDays(first: Date, second: Date) {
    return moment(first).diff(second, "days");
}
