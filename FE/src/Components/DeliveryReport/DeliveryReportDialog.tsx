import "./DeliveryReportDialog.scss";
import React, { useState, useEffect } from "react";
import { Dialog, CircularProgress, Fab, Tooltip } from '@material-ui/core/';
import { Create as CreateIcon } from "@material-ui/icons";

import { useApi } from "../../hooks/useApi";
import DeliveryReport from "./index";

interface Props {
    name: string;
    municipality: string;
    disabled: boolean;
}

export default function DeliveryReportDialog({ name, municipality, disabled }: Props) {
    const [open, setOpen] = useState<boolean>(false);
    const [branch, setBranch] = useState<Branch | null>(null);
    const [fetchApi] = useApi("/api/branches");

    useEffect(() => {
        if (open) fetchBranch();
    }, [name, municipality, open]);

    async function fetchBranch() {
        const branch = await fetchApi<Branch>({ route: `/fromInfo?municipality=${municipality}&name=${name}` });
        if (branch) setBranch(branch);
    }

    return <div className="delivery-report-dialog">
        <Tooltip title={disabled ? "לא ניתן להזין סטטוס חלוקה לנקודה שמנוהלת ממערכת \"משמרות הזהב\"" : "הזן סטטוס חלוקה"} placement="top">
            <Fab className="open-manual-report" onClick={() => !disabled && setOpen(true)} disabled={disabled} color="primary" size="small">
                <CreateIcon />
            </Fab>
        </Tooltip>
        <Dialog onClose={() => setOpen(false)} open={open}>
            {branch ?
                <DeliveryReport isDialog branch={branch} /> :
                <div className="load-dialog-branch">
                    <span>טוען מרכז חלוקה</span>
                    <CircularProgress size={20} thickness={5} />
                </div>
            }
        </Dialog>
    </div>
}