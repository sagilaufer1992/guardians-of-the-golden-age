import "./Initializer.scss";

import React, { useState, useEffect } from "react";
import {
  CircularProgress,
  FormControlLabel,
  RadioGroup,
  Radio,
  Button,
} from "@material-ui/core";
import DatePicker from "react-date-picker";
import AutocompleteInput from "../Inputs/AutocompleteInput";
import { fetchBackend } from "../../utils/fetchHelpers";

type Level = "all" | "district" | "napa";

interface Props {
  onInitialize: (date: Date, level: Level, value?: string) => void;
}

export default function FaultsStatus(props: Props) {
  const [level, setLevel] = useState<Level>("all");
  const [districts, setDistricts] = useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [napas, setNapas] = useState<string[]>([]);
  const [selectedNapa, setSelectedNapa] = useState<string>("");
  const now = new Date();
  const [date, setDate] = useState<Date>(now);
  const [isLoading, setIsloading] = useState<boolean>(true);

  useEffect(() => {
    const districtsPromise = fetchBackend("/api/districts").then((res) =>
      res.json()
    );
    const napasPromise = fetchBackend("/api/napas").then((res) => res.json());
    Promise.all([districtsPromise, napasPromise]).then(
      ([districtResults, napasResults]) => {
        setNapas(napasResults.map((napa: { napa: string }) => napa.napa));
        setDistricts(districtResults);
        setIsloading(false);
      }
    );
  }, []);

  const loadingMessage = isLoading ? (
    <div>
      מביא את רשימת המחוזות והנפות...
      <CircularProgress />
    </div>
  ) : null;

  const radioGroup = (
    <RadioGroup
      className="radio-group"
      onChange={(event) => setLevel(event.target.value as Level)}
    >
      <div>
        <FormControlLabel
          control={<Radio color="primary" />}
          label="ארצי"
          value="all"
          checked={level === "all"}
        />
      </div>
      <div className="radio-with-text-field">
        <FormControlLabel
          control={<Radio color="primary" />}
          label="מחוזי"
          value="district"
          checked={level === "district"}
        />
        <AutocompleteInput
          className="autocomplete"
          disabled={level !== "district"}
          onChange={setSelectedDistrict}
          options={districts.map((_) => ({ value: _, label: _ }))}
          defaultValue=""
          title="בחר מחוז"
        />
      </div>
      <div className="radio-with-text-field">
        <FormControlLabel
          control={<Radio color="primary" />}
          label="נפה"
          value="napa"
          checked={level === "napa"}
        />
        <AutocompleteInput
          className="autocomplete"
          disabled={level !== "napa"}
          onChange={setSelectedNapa}
          options={napas.map((_) => ({ value: _, label: _ }))}
          defaultValue=""
          title="בחר נפה"
        />
      </div>
    </RadioGroup>
  );

  return (
    <div className="dashboard-initializer">
      {loadingMessage}
      <div className="inititalizer-form">
        {radioGroup}
        <div className="calendar-wrapper">
          <DatePicker
            onChange={(newDate: Date | Date[]) => setDate(newDate as Date)}
            value={date}
            maxDate={now}
            required
            locale="he-IL"
            format="dd/MM/yyyy"
            clearIcon={null}
          />
        </div>
        <Button
          className="initialize"
          color="primary"
          variant="contained"
          disabled={
            (level === "napa" && selectedNapa === "") ||
            (level === "district" && selectedDistrict === "")
          }
          onClick={() => {
            const { onInitialize } = props;
            switch (level) {
              case "all": {
                onInitialize(date, "all");
              }
              case "district": {
                onInitialize(date, "district", selectedDistrict);
              }
              case "napa": {
                onInitialize(date, "napa", selectedNapa);
              }
            }
          }}
        >
          טען דאשבורד
        </Button>
      </div>
    </div>
  );
}
