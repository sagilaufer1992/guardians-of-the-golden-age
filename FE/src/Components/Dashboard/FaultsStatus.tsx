import "./FaultsStatus.scss";

import React, { useMemo } from 'react';
import { useHistory } from "react-router-dom";

import { Card, LinearProgress } from '@material-ui/core';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import QuestionAnswerOutlinedIcon from '@material-ui/icons/QuestionAnswerOutlined';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { categoryToText } from "../../utils/translations";

interface Props {
    report: FaultsReport,
}

export default function FaultsStatus({ report }: Props) {
    const history = useHistory();

    const _showAllFaults = () => history.push("/faults");

    const maxFaultsForCategory = useMemo(() => {
        return report.reasons.reduce((prev, current) => {
            const currentTotal = (current.closed + current.open);
            return (currentTotal > prev) ? currentTotal : prev;
        }, 0)
    }, [report])

    return <Card className="faults-status-panel">
        <div className="title">תקלות שנפתחו</div>
        <div className="status-container">
            <Card className="status">
                <div className="status-type">
                    <QuestionAnswerOutlinedIcon />
                    <span>נפתחו היום</span>
                </div>
                <div className="status-number">{report.total}</div>
            </Card>
            <Card className="status warning">
                <div className="status-type">
                    <ErrorOutlineIcon />
                    <span>טרם טופלו</span>
                </div>
                <div className="status-number">{report.open}</div>
            </Card>
        </div>
        <div className="progress-list">
            {report.reasons.map(({ category, open, closed }) => {
                return <div className="progress-item">
                    <div className="category-progress">
                        <div className="category">{categoryToText[category]}</div>
                        <div className="progress-bar-container">
                            <LinearProgress className="progress-bar"
                                variant="determinate"
                                value={open / (open + closed) * 100}
                                style={{ width: `${(open + closed) / maxFaultsForCategory * 100}%` }}
                            />
                        </div>
                    </div >
                    <div className="progress-details">
                        <div>{`${open + closed} תקלות`}</div>
                        {open === 0 ?
                            <div className="solved">הכל טופל</div> :
                            <div className="unsolved">{`${open} עדיין לא טופלו`}</div>}
                    </div>
                </div>
            })}
        </div>
        <div className="show-all-faults" onClick={_showAllFaults}>
            {"עבור לכלל הבעיות של יום זה"}
            <ArrowBackIosIcon />
        </div>
    </Card>;
}
