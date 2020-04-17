import "./Initializer.scss";

import React, { useState, useEffect } from "react";
import { CircularProgress, FormControlLabel, RadioGroup, Radio, Button } from "@material-ui/core";

import AutocompleteInput from "../Inputs/AutocompleteInput";
import { useApi } from "../../hooks/useApi";

interface Props {
  onInitialize: (level: Level, value: string | null) => void;
}

export default function FaultsStatus(props: Props) {
  const [fetchApi] = useApi();
  const [level, setLevel] = useState<Level>("national");
  const [districts, setDistricts] = useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [napas, setNapas] = useState<string[]>([]);
  const [selectedNapa, setSelectedNapa] = useState<string>("");
  const [isLoading, setIsloading] = useState<boolean>(true);

  useEffect(() => {
    const districtsPromise = fetchApi<string[]>({ route: "/api/districts" });
    const napasPromise = fetchApi<Branch[]>({ route: "/api/napas" });

    Promise.all([districtsPromise, napasPromise]).then(
      ([districtResult, napasResult]) => {
        napasResult && setNapas(napasResult.map(_ => _.napa));
        districtResult && setDistricts(districtResult);
        setIsloading(false);
      }
    );
  }, []);

  const loadingMessage = isLoading ? (
    <div className="loading-message">
      <CircularProgress className="loading" />
      <div>מביא את רשימת המחוזות והנפות...</div>
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
          value="national"
          checked={level === "national"}
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
              case "national": {
                onInitialize("national", null);
                break;
              }
              case "district": {
                onInitialize("district", selectedDistrict);
                break;
              }
              case "napa": {
                onInitialize("napa", selectedNapa);
                break;
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
