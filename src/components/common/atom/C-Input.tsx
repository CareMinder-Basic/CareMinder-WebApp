import { TextField, styled, TextFieldVariants } from "@mui/material";
import { ChangeEvent, FC } from "react";

export type CustomInputProps = {
  variant: TextFieldVariants;
  placeholder: string;
  // onChange: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: string;
  disabled: boolean;
  id: string;
  focusColorType?: string;
};

const CInput: FC<CustomInputProps> = ({
  placeholder,
  onChange,
  value,
  disabled,
  variant,
  id,
  focusColorType,
  ...props
}) => {
  return (
    <StyledTextField
      id={id}
      placeholder={placeholder}
      disabled={disabled}
      value={value}
      onChange={onChange}
      variant={variant}
      focusColorType={focusColorType}
      {...props}
    />
  );
};

export default CInput;

/** styled */

const StyledTextField = styled(TextField)<{ focusColorType?: string }>(
  ({ theme, focusColorType }) => ({
    "width": "100%",
    "height": "100%",
    "borderRadius": "6px",
    "padding": "6px,16px",
    "& .MuiOutlinedInput-root": {
      "borderRadius": "6px",
      "height": "100%",
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor:
          focusColorType === "STAFF" ? theme.palette.secondary.main : theme.palette.primary.main,
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderRadius: "6px",
    },
    "& .MuiInputBase-input": {
      color: "black",
    },
  }),
);

/* 
EX)
<form> // 상위 요소에서 width와 hegith 를 정해주세요
  <label htmlFor=""></label>
  <CInput 
  />
</form> */
