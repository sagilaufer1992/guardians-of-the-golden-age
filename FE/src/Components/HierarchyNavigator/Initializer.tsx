import "./Initializer.scss";

import React, { useState, useEffect } from "react";
import { CircularProgress, FormControlLabel, RadioGroup, Radio, Button } from "@material-ui/core";

import AutocompleteInput, { Option } from "../Inputs/AutocompleteInput";
import { useApi } from "../../hooks/useApi";

interface Props {
  onInitialize: (level: Level, value: string | null) => void;
}

export default function FaultsStatus(props: Props) {
  const [fetchApi] = useApi();
  const [level, setLevel] = useState<Level>("national");
  const [districts, setDistricts] = useState<Option[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [napas, setNapas] = useState<Option[]>([]);
  const [selectedNapa, setSelectedNapa] = useState<string>("");
  const [municipalities, setMunicipalities] = useState<Option[]>([]);
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>("");
  const [isLoading, setIsloading] = useState<boolean>(true);

  useEffect(() => {
    const districtsPromise = fetchApi<string[]>({ route: "/api/districts" });
    const napasPromise = fetchApi<Branch[]>({ route: "/api/napas" });
    const municipalitiesPromise = fetchApi<Branch[]>({ route: "/api/municipalities" });

    Promise.all([districtsPromise, napasPromise, municipalitiesPromise]).then(
      ([districtResult, napasResult, municipalitiesResult]) => {
        districtResult && setDistricts(districtResult.map(v => ({ value: v, label: v })));
        napasResult && setNapas(napasResult.map(_ => ({ value: _.napa, label: _.napa })));
        municipalitiesResult && setMunicipalities(municipalitiesResult.map(_ => ({ value: _.municipality, label: _.municipality })));
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
          options={districts}
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
          options={napas}
          defaultValue=""
          title="בחר נפה"
        />
      </div>
      <div className="radio-with-text-field">
        <FormControlLabel
          control={<Radio color="primary" />}
          label="רשות"
          value="municipality"
          checked={level === "municipality"}
        />
        <AutocompleteInput
          className="autocomplete"
          disabled={level !== "municipality"}
          onChange={setSelectedMunicipality}
          options={municipalities}
          defaultValue=""
          title="בחר רשות"
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
            (level === "district" && selectedDistrict === "") ||
            (level === "napa" && selectedNapa === "") ||
            (level === "municipality" && selectedMunicipality === "")
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
              case "municipality": {
                onInitialize("municipality", selectedMunicipality)
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
