import "./index.scss";
import React, { useState, useEffect, useCallback } from "react";
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, CircularProgress, TextField } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useSnackbar } from "notistack";
import moment from "moment";

import DailySummary from "./DailySummary";
import ManualFrom from "./ManualForm";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useApi } from "../../hooks/useApi";

export default function DeliveryReport() {
    const { enqueueSnackbar } = useSnackbar();
    const [fetchDelivery] = useApi("/api/deliveryReport");
    const [fetchBranches] = useApi("/api/branches");
    const [branch, setBranch] = useState<Branch | null>(null);
    const [branches, setBranches] = useState<Branch[] | null>(null);
    const [deliveryReport, setDeliveryReport] = useState<DeliveryReportData | null>(null);
    const [openForm, setOpenForm] = useState<"manual" | "advanced" | null>(null);

    const date = moment().startOf('day').toDate();

    useEffect(() => {
        if (!branches) getBranches();

        if (branch) fetchReport(branch);
    }, [branch, branches])

    async function getBranches() {
        const branches = await fetchBranches<Branch[]>({ defaultErrorMessage: "אירעה שגיאה בקבלת מרכזי החלוקה" });
        if (branches) setBranches(branches);
    }

    async function _updateDeliveryReport(body: Partial<DeliveryReportData>, increment: boolean = false) {
        const result = await fetchDelivery<DeliveryReportData>({
            method: "PUT",
            route: `/${branch!.id}/${date.toISOString()}${increment ? "/increment" : ""}`,
            body
        });

        if (result) setDeliveryReport(result);
    }

    async function _finishDeliveryReport(body: Partial<DeliveryReportData>) {
        await _updateDeliveryReport(body);

        enqueueSnackbar("יום החלוקה הסתיים בהצלחה!", { variant: "success" });

        setOpenForm(null);
        setDeliveryReport(null);
        setBranch(null);
    }

    async function fetchReport({ id }: Branch) {
        const deliveryReport = await fetchDelivery<DeliveryReportData>({
            route: `/${id}/${date.toISOString()}`,
            defaultErrorMessage: "אירעה שגיאה בקבלת פרטי הטופס"
        });

        if (!deliveryReport) return;

        setDeliveryReport(deliveryReport);

        if (deliveryReport.deliveryFailReasons && Object.keys(deliveryReport.deliveryFailReasons).length > 0) 
            setOpenForm("advanced");
        else setOpenForm("manual");
    }

    const _filterAutocomplete = useCallback((branches: Branch[], { inputValue }) => branches.filter(_ => _.name.startsWith(inputValue)), []);

    function _showBranch({ name, napa, municipality, district }: Branch) {
        return <div className="autocomplete-branch">
            <span className="autocomplete-branch-name">{name}</span>
            <span className="autocomplete-branch-hierarchy">{district} / {napa} / {municipality}</span>
        </div>;
    }

    const _selectBranch = useCallback((_, branch) => { setBranch(branch) }, [setBranch]);
    const isManualFormDisabled = !branch || (!!deliveryReport?.deliveryFailReasons && Object.keys(deliveryReport.deliveryFailReasons).length > 0)

    return <div className="delivery-report-container">
        <div className="delivery-report">
            {!branches ?
                <div className="branches-loading">
                    <span>טוען רשימת מרכזי חלוקה</span>
                    <CircularProgress size={20} thickness={5} />
                </div> :
                <div className="autocomplete-branch-input">
                    <Autocomplete value={branch} options={branches} renderOption={_showBranch} onChange={_selectBranch}
                        filterOptions={_filterAutocomplete} getOptionLabel={b => b.name}
                        renderInput={(params: any) => (<TextField {...params} label="בחר מרכז חלוקה" variant="outlined" />)} />
                </div>}
            <ExpansionPanel disabled={isManualFormDisabled} 
                expanded={!!branch && openForm === "manual"} onChange={(_, v) => setOpenForm(v ? "manual" : null)}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={{ backgroundColor: "#eee" }}>
                    <div className="title">
                        טופס ידני
                    </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{ padding: 0 }}>
                    <ManualFrom date={date} deliveryReport={deliveryReport} updateDelivery={_updateDeliveryReport} setIsDone={() => setOpenForm("advanced")} />
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel disabled={!branch} expanded={!!branch && openForm === "advanced"} onChange={(_, v) => setOpenForm(v ? "advanced" : null)}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={{ backgroundColor: "#eee" }}>
                    <div className="title">
                        סיכום יום החלוקה
                    </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{ padding: 0 }}>
                    <DailySummary deliveryReport={deliveryReport} setDeliveryReport={_updateDeliveryReport} finishDeliveryReport={_finishDeliveryReport} />
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </div>
    </div>
}