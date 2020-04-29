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
import { AppRouteProps } from "../../routesConfig";

interface Props {
    branch?: Branch | null;
    isDialog?: boolean;
    onUpdate?: () => void;
}

export default function DeliveryReport({ isDialog = false, branch: DialogBranch = null, levelAndValue, onUpdate }: Props & Partial<AppRouteProps>) {
    const { enqueueSnackbar } = useSnackbar();
    const [fetchDelivery] = useApi("/api/deliveryReport");
    const [fetchDailyReports] = useApi("/api/dailyReports");
    const [branch, setBranch] = useState<Branch | null>(DialogBranch);
    const [branches, setBranches] = useState<Branch[] | null>(null);
    const [deliveryReport, setDeliveryReport] = useState<DeliveryReportData | null>(null);
    const [openForm, setOpenForm] = useState<"manual" | "advanced" | null>(null);
    const [deliveryType, setDeliveryType] = useState<DeliveryType | null>(null);

    const date = moment().startOf('day').toDate();

    useEffect(() => {
        if (!isDialog && !branches) getBranches();

        if (branch) fetchReport(branch);
    }, [branch, branches]);

    useEffect(() => {
        if (levelAndValue) getBranches();
    }, [levelAndValue]);

    async function getBranches() {
        const { level, value } = levelAndValue as LevelAndValue;
        const queryString = `level=${level}` + `${level !== "national" ? `&value=${value}` : ""}`;
        const branches = await fetchDailyReports<Branch[]>({
            route: `/${date.toISOString()}/branches?${queryString}`,
            defaultErrorMessage: "אירעה שגיאה בקבלת מרכזי החלוקה"
        });
        if (branches) setBranches(branches);
    }

    async function _updateDeliveryReport(body: Partial<DeliveryInfoData>, type: DeliveryType, increment: boolean = false) {
        const result = await fetchDelivery<DeliveryReportData>({
            method: "PUT",
            route: `/${branch!.id}/${date.toISOString()}${increment ? "/increment" : ""}`,
            body: {
                ...body,
                deliveryType: type,
            }
        });

        if (!result) return;

        setDeliveryReport(result);
        onUpdate?.();
    }

    async function _finishDeliveryReport(body: Partial<DeliveryInfoData>, type: DeliveryType) {
        await _updateDeliveryReport(body, type);

        enqueueSnackbar("עודכן בהצלחה!", { variant: "success" });

        setDeliveryType(null);
        setOpenForm("manual");
    }

    async function fetchReport({ id }: Branch) {
        const deliveryReport = await fetchDelivery<DeliveryReportData>({
            route: `/${id}/${date.toISOString()}`,
            defaultErrorMessage: "אירעה שגיאה בקבלת פרטי הטופס"
        });

        if (!deliveryReport) return;

        setDeliveryReport(deliveryReport);
        setOpenForm("manual");
    }

    const _filterAutocomplete = useCallback((branches: Branch[], { inputValue }) => branches.filter(_ => _.name.startsWith(inputValue)), []);

    function _showBranch({ name, napa, municipality, district, address }: Branch) {
        return <div className="autocomplete-branch">
            <span className="autocomplete-branch-name">{name}</span>
            <span className="autocomplete-branch-address">כתובת: {address}</span>
            <span className="autocomplete-branch-hierarchy">{district} / {napa} / {municipality}</span>
        </div>;
    }

    const _selectBranch = useCallback((_, branch) => { setBranch(branch) }, [setBranch]);
    const deliveryReportInfo = (deliveryType && deliveryReport) ? deliveryReport.deliveries[deliveryType] : null;

    function _manualFormIsDone(type: string) {
        setDeliveryType(type);
        setOpenForm("advanced");
    }

    return <div className="delivery-report-container">
        <div className="delivery-report">
            {!isDialog ?
                branches ?
                    <div className="autocomplete-branch-input">
                        <Autocomplete value={branch} options={branches!} renderOption={_showBranch} onChange={_selectBranch}
                            filterOptions={_filterAutocomplete} getOptionLabel={b => b.name}
                            renderInput={(params: any) => (<TextField {...params} label="בחר מרכז חלוקה" variant="outlined" />)} />
                    </div> :
                    <div className="branches-loading">
                        <span>טוען רשימת מרכזי חלוקה</span>
                        <CircularProgress size={20} thickness={5} />
                    </div> :
                <></>
            }
            <ExpansionPanel disabled={!branch}
                expanded={!!branch && openForm === "manual"} onChange={(_, v) => setOpenForm(v ? "manual" : null)}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={{ backgroundColor: "#eee" }}>
                    <div className="title">
                        טופס ידני
                    </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{ padding: 0 }}>
                    <ManualFrom date={date} deliveryReport={deliveryReport} updateDelivery={_updateDeliveryReport} setIsDone={_manualFormIsDone} />
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel disabled={!branch || !deliveryType} expanded={!!branch && openForm === "advanced"} onChange={(_, v) => setOpenForm(v ? "advanced" : null)}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={{ backgroundColor: "#eee" }}>
                    <div className="title">
                        סיכום החלוקה
                    </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{ padding: 0 }}>
                    <DailySummary deliveryType={deliveryType ? deliveryType : ""} deliveryReport={deliveryReportInfo} setDeliveryReport={_updateDeliveryReport} finishDeliveryReport={_finishDeliveryReport} />
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </div>
    </div>
}