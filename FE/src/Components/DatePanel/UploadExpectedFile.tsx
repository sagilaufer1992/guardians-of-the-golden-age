import React from "react";
import { Button } from "@material-ui/core";
import { isNull } from "util";
import { fetchBackend } from "../../utils/fetchHelpers";
import { extractDailyReports } from "../../utils/extractDailyReports";
import { useSnackbar } from "notistack";
import { useApi } from "../../hooks/useApi";

interface Props {
    title: string;
    date: Date;
}

export function UploadExpectedFile({ title, date }: Props) {
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
            <input type="file" onChange={onFileUpload} style={{ display: "none" }} />
        </Button>
    </div>

}