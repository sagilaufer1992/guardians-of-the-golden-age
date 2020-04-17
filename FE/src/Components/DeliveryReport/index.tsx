import "./index.scss";
import React, { useState, useContext, useEffect } from "react";
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import moment from "moment";
import { useSnackbar } from "notistack";

import { updateDeliveryReport, getDeliveryReport } from "../../utils/fetchDeliveryReport";
import { UserProvider } from "../../utils/UserProvider";
import DailySummary from "./DailySummary";
import ManualFrom from "./ManualForm";

const total = 1200;
const branchId = 1111111;

export default function DeliveryReport() {
    const [delivered, setDelivered] = useState<number>(0);
    const [deliveryFailed, setDeliveryFailed] = useState<number>(0);
    const [isManualFormDone, setIsManualFormDone] = useState<boolean>(false);
    const [isDeliveryReportDone, setIsDeliveryReportDone] = useState<boolean>(false);
    const user = useContext(UserProvider);
    const { enqueueSnackbar } = useSnackbar();
    const date = moment().startOf('day').toDate();

    useEffect(() => {
        fetchReport();
    }, [])

    async function _getDeliveryReport(deliveryReport: Partial<DeliveryReportData>) {
        const finishedDeliveryReport = {
            ...deliveryReport,
            name: "",
            branchId,
            date,
            total,
        }

        await updateDeliveryReport(user, branchId, date, finishedDeliveryReport);
    }

    async function _getManualFormReport(deliveryReport: Partial<DeliveryReportData>) {
        const report = {
            ...deliveryReport,
            deliveryFailReasons: {},
            deliveryFailed: 0,
            name: "",
            branchId,
            date,
            total,
        }

        await updateDeliveryReport(user, branchId, date, report);
    }

    async function fetchReport() {
        const deliveryReport = await getDeliveryReport(user, branchId, date);
        if (!deliveryReport) return enqueueSnackbar("אירעה שגיאה בטעינת הטופס", { variant: "error" });

        setDelivered(deliveryReport.delivered);
        setDeliveryFailed(deliveryReport.deliveryFailed);

        if (deliveryReport.delivered + deliveryReport.deliveryFailed === total) {
            setIsDeliveryReportDone(true);
            setIsManualFormDone(true);
        }
    }

    return <div className="delivery-report-container">
        <div className="delivery-report">
            <ExpansionPanel expanded={!isManualFormDone} onChange={() => setIsManualFormDone(false)} disabled={isDeliveryReportDone && isManualFormDone}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={{ backgroundColor: "#eee" }}>
                    <div className="title">
                        טופס ידני
                </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{ padding: 0 }}>
                    <ManualFrom total={total}
                        getReport={_getManualFormReport}
                        setIsDone={setIsManualFormDone}
                        delivered={delivered}
                        setDelivered={setDelivered} />
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel expanded={isManualFormDone} disabled={!isManualFormDone}>
                <ExpansionPanelSummary style={{ backgroundColor: "#eee" }}>
                    <div className="title">
                        סיכום יום החלוקה
                </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{ padding: 0 }}>
                    <DailySummary getDeliveryReport={_getDeliveryReport}
                        deliveryFailed={deliveryFailed}
                        isManualFormDone={isManualFormDone}
                        setIsDone={setIsDeliveryReportDone}
                        total={total}
                        delivered={delivered}
                        setDelivered={setDelivered} />
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </div>
    </div>
}