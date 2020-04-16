import "./FaultsStatus.scss";

import React from 'react';
import { useHistory } from "react-router-dom";

import { Card, LinearProgress } from '@material-ui/core';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import QuestionAnswerOutlinedIcon from '@material-ui/icons/QuestionAnswerOutlined';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

interface Props {
    reports: FaultReport[],
}

export default function FaultsStatus({ reports }: Props) {
    const history = useHistory();

    const _showAllFaults = () => history.push("/faults");

    return <Card className="faults-status-panel">
        <div className="title">תקלות שנפתחו</div>
        <div className="status-container">
            <Card className="status">
                <div className="status-type">
                    <QuestionAnswerOutlinedIcon />
                    <span>נפתחו היום</span>
                </div>
                <div className="status-number">10</div>
            </Card>
            <Card className="status warning">
                <div className="status-type">
                    <ErrorOutlineIcon />
                    <span>טרם טופלו</span>
                </div>
                <div className="status-number">4</div>
            </Card>
        </div>
        <div className="progress-list">
            {reports.map(({ name, total, solved }) => (<div className="progress-item">
                <div className="category-progress">
                    <div className="category">{name}</div>
                    <LinearProgress className="progress-bar"
                        variant="determinate"
                        value={(total - solved) / total * 100}
                        style={{
                            width: "100px"
                        }}
                    />
                </div >
                <div className="progress-details">
                    <div>{`${total} תקלות`}</div>
                    {total === solved ?
                        <div className="solved">הכל טופל</div> :
                        <div className="unsolved">{`${total - solved} עדיין לא טופלו`}</div>}
                </div>
            </div>))}
        </div>
        <div className="show-all-faults" onClick={_showAllFaults}>
            {"עבור לכלל הבעיות של יום זה"}
            <ArrowBackIosIcon />
        </div>
    </Card>;
}
