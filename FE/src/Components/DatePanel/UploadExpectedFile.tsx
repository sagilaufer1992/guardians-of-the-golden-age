import React from "react";
import { Button } from "@material-ui/core";
import { isNull } from "util";
import { extractDailyReports, getReportsFileExample } from "../../utils/expectedReports";
import { useSnackbar } from "notistack";
import { useApi } from "../../hooks/useApi";

interface Props {
    title: string;
    date: Date;
    onUploaded: () => void;
}

export function UploadExpectedFile({ title, date, onUploaded }: Props) {
    const [fetchApi] = useApi();
    const { enqueueSnackbar } = useSnackbar();

    const onFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isNull(e)) return;

        const file = (e as any).target.files[0] as File;
        try {
            const reports = await extractDailyReports(file);

            await fetchApi({
                route: "/api/dailyReports/futureReports",
                method: "POST",
                body: {
                    reports,
                    date
                },
                successMessage: "הדיווחים נשלחו בהצלחה"
            });

            onUploaded();
        }
        catch (e) {
            enqueueSnackbar(e.message, { variant: "error" });
        }
    }

    return <div className="upload-file-input">
        <Button
            color="primary"
            variant="contained"
            component="label">
            {title}
            <input type="file"
                onChange={onFileUpload}
                style={{ display: "none" }}
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            />
        </Button>
        <span className="example-file-link" onClick={e=> getReportsFileExample("example")}>להורדת קובץ לדוגמה</span>
    </div>

}