import { useState, useCallback } from "react";

export function useInput(intialValue: string): [string, (v: React.ChangeEvent) => void] {
    const [state, setState] = useState(intialValue);
    const onChange = useCallback(e => setState(e.target.value), []);

    return [state, onChange];
}