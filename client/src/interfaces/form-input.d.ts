import { ChangeEventHandler } from "react";

export interface FormInputProps{
    label: string,
    type: string,
    value: string | number,
    onChange: (value: string) => void
}

