import "./UploadDeliveryFile.scss";

import React from "react";
import { Button } from "@material-ui/core";
import { useSnackbar } from "notistack";

import { extractDailyReports } from "../../utils/expectedReports";
import { useApi } from "../../hooks/useApi";

interface Props {
    title: string;
    date: Date;
    onUploaded: () => void;
}

export default function UploadExpectedFile({ title, date, onUploaded }: Props) {
    const [fetchApi] = useApi("/api/dailyReports/futureReports");
    const { enqueueSnackbar } = useSnackbar();

    const onFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const file = e.target.files[0];
        let reports: FutureReport[];

        e.target.value = "";

        try {
            reports = await extractDailyReports(file);
        }
        catch (e) {
            return enqueueSnackbar(e.message, { variant: "error" });
        }

        const result = await fetchApi({
            method: "POST",
            body: { reports, date },
            successMessage: "הדיווחים נשלחו בהצלחה"
        });

        if (result) onUploaded();
    }

    return <div className="upload-file-input">
        <Button
            color="primary"
            variant="contained"
            component="label">
            {title}
            <input type="file" className="upload-input-element" onChange={onFileUpload}
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            />
        </Button>
        <a className="example-file-link" href={process.env.PUBLIC_URL + "/example.xlsx"}>להורדת קובץ לדוגמה</a>
    </div>;
}