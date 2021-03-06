import "./UploadDeliveryFile.scss";

import React, { useState, useCallback, useEffect } from "react";
import { Button, Dialog, RadioGroup, FormControl, FormControlLabel, Radio, CircularProgress } from "@material-ui/core";
import { useSnackbar } from "notistack";
import GetAppOutlinedIcon from '@material-ui/icons/GetAppOutlined';

import { extractDailyReports } from "../../utils/expectedReports";
import { deliveryTypeToText } from "../../utils/translations";
import { useApi } from "../../hooks/useApi";
import Autocomplete from "../Inputs/AutocompleteInput";

interface Props {
    title: string;
    date: Date;
    onUploaded: () => void;
}

const DELIVERY_TYPE_OPTIONS: DeliveryType[] = Object.keys(deliveryTypeToText).filter(key => key !== "other");

export default function UploadExpectedFile({ title, date, onUploaded }: Props) {
    const [fetchApi] = useApi("/api/dailyReports");
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [deliveryType, setDeliveryType] = useState<DeliveryType>(DELIVERY_TYPE_OPTIONS[0]);
    const [otherDeliveryType, setOtherDeliveryType] = useState<string>("");
    const [otherDeliveryTypes, setOtherDeliveryTypes] = useState<Option[]>([]);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (!modalOpen) return;

        async function getOtherDeliveries() {
            const result = await fetchApi<string[]>({ route: `/${date.toISOString()}/deliveryTypes` });
            if (!result) return;

            setOtherDeliveryTypes(result.filter(s => !DELIVERY_TYPE_OPTIONS.includes(s))
                .map(value => ({ value, label: deliveryTypeToText[value] || value })));
        }

        getOtherDeliveries();
    }, [modalOpen]);

    const onFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        setIsLoading(true);

        const result = await sendFile(e.target.files[0]);

        if (result) {
            closeModal();
            onUploaded();
        }

        setIsLoading(false);

        if (e.target) e.target.value = "";
    }

    async function sendFile(file: File) {
        let reports: FutureReport[];

        try {
            reports = await extractDailyReports(file);
        }
        catch (e) {
            enqueueSnackbar(e.message, { variant: "error" });
            return null;
        }

        return await fetchApi({
            route: `/futureReports?deliveryType=${deliveryType === "other" ? otherDeliveryType : deliveryType}`,
            method: "POST",
            body: { reports, date },
            successMessage: "הדיווחים נשלחו בהצלחה"
        });
    }

    const closeModal = useCallback(() => {
        if (isLoading) return;

        setModalOpen(false);
        setDeliveryType(DELIVERY_TYPE_OPTIONS[0]);
        setOtherDeliveryType("");
    }, [isLoading, setModalOpen, setDeliveryType, setOtherDeliveryType]);

    return <div className="upload-file-input">
        <Dialog open={modalOpen} onClose={closeModal} fullWidth maxWidth="sm">
            <div className="upload-file-dialog">
                <FormControl className="select-delivery-type">
                    <div className="select-title">בחר את סוג המשלוח:</div>
                    <RadioGroup className="select-radio-group" value={deliveryType} onChange={(_, v) => setDeliveryType(v)}>
                        <div className="delivery-type-options">
                            {DELIVERY_TYPE_OPTIONS.map(value =>
                                <FormControlLabel key={value} value={value} label={deliveryTypeToText[value] ?? value} control={<Radio color="primary" />} />)}
                        </div>
                        <FormControlLabel className="other-control-label" value="other" control={<Radio color="primary" />}
                            label={<Autocomplete freeSolo className="other-delivery-type" title="משלוח אחר"
                                defaultValue={otherDeliveryType} options={otherDeliveryTypes}
                                onInputChange={setOtherDeliveryType} />} onClick={() => setDeliveryType("other")} />
                    </RadioGroup>
                </FormControl>
                <div className="upload-file-button">
                    <Button disabled={isLoading} color="primary" variant="contained" component="label" onClick={() => setModalOpen(true)}>
                        העלה קובץ
                    <input type="file" className="upload-input-element" onChange={onFileUpload}
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                    </Button>
                </div>
                {isLoading && <div className="upload-loading">
                    <CircularProgress className="upload-progress" color="primary" size={12} thickness={5} />
                    <span>שולח מידע...</span>
                </div>}
            </div>
        </Dialog>
        <Button color="primary" variant="contained" component="label" onClick={() => setModalOpen(true)}>
            {title}
        </Button>
        <Button
            href={process.env.PUBLIC_URL + "/example.xlsx"}
            color="secondary"
            variant="contained"
            startIcon={<GetAppOutlinedIcon />}
            className="example-file-link">
            הורד קובץ לדוגמא
        </Button>
    </div>;
}