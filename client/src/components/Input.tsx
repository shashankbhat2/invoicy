import { Input, Stack } from "@chakra-ui/react";
import React from "react";
import { FormInputProps } from "../interfaces/form-input";
import "./Input.scss";

const FormInput: React.FC<FormInputProps> = ({
  label,
  type,
  value,
  onChange,
}: FormInputProps) => {
  return (
    <Stack
      direction={{ base: "column", md: "row" }}
      alignItems={{ base: "flex-start", md: "center" }}
      className="form_input"
    >
      <label>{label}:</label>
      <Input
        type={type}
        variant="flushed"
        maxW="xs"
        value={value || ""}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      ></Input>
    </Stack>
  );
};

export default FormInput;
