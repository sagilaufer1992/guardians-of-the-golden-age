interface Option {
    value: string;
    label: string;
}

interface FilterDefinition {
    type: "DropDown" | "Autocomplete",
    title: string,
    defaultValue: string,
    options: Option[]
}