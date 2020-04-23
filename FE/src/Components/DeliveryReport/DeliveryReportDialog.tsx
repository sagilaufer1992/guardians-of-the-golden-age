import "./DeliveryReportDialog.scss";
import React, { useState, useEffect } from "react";
import { Dialog, CircularProgress, Fab } from '@material-ui/core/';
import { Create as CreateIcon } from "@material-ui/icons";

import { useApi } from "../../hooks/useApi";
import DeliveryReport from "./index";

interface Props {
    expected: number;
    name: string;
    municipality: string | null;
}

export default function DeliveryReportDialog({ name, municipality, expected }: Props) {
    const [open, setOpen] = useState<boolean>(false);
    const [branch, setBranch] = useState<Branch | null>(null);
    const [fetchApi] = useApi("/api/branches");

    useEffect(() => {
        if (open) fetchBranch();
    }, [name, municipality, open]);

    async function fetchBranch() {
        if (!municipality || !name) return;

        const branch = await fetchApi<Branch>({ route: `/fromInfo?municipality=${municipality}&name=${name}` });
        if (branch) setBranch(branch);
    }

    return <div>
        <Fab className="open-manual-report" onClick={() => setOpen(true)} disabled={expected === 0} color="primary" size="small">
            <CreateIcon />
        </Fab>
        <Dialog onClose={() => setOpen(false)} open={open}>
            {branch ?
                <DeliveryReport isDialog={true} branch={branch} /> :
                <div className="load-dialog-branch">
                    <span>טוען מרכז חלוקה</span>
                    <CircularProgress size={20} thickness={5} />
                </div>
            }
        </Dialog>
    </div>
}