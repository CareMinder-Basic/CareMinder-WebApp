import { DialogProps, styled } from "@mui/material";
import { Dialog as Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { PropsWithChildren, ReactElement } from "react";

export type ModalProps = {
  title?: string | ReactElement;
  footer?: ReactElement;
  titleColor?: string;
  onClose: (event?: object, reason?: "backdropClick" | "escapeKeyDown") => void;
} & Omit<DialogProps, "children">;

export default function Modal({
  open,
  onClose,
  title,
  footer,
  children,
  titleColor,
  ...props
}: PropsWithChildren<ModalProps>) {
  return (
    <StyledDialog
      maxWidth="xs"
      open={open}
      onClose={onClose}
      {...props}
      PaperProps={{
        sx: {
          maxWidth: props.maxWidth === "xs" ? "444px !important" : undefined,
        },
      }}
    >
      {title && (
        <DialogTitle sx={{ fontSize: "20px", color: `${titleColor} !important` || "defaultColor" }}>
          {title}
        </DialogTitle>
      )}
      <DialogContent>{children}</DialogContent>
      {footer && <DialogActions>{footer}</DialogActions>}
    </StyledDialog>
  );
}

/** styled */

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "24px",
    minWidth: "300px",
    width: "100%",
    maxHeight: "100%",
    [`&.MuiDialog-paperWidthXs`]: {
      maxWidth: "444px !important",
    },
    [`&.MuiDialog-paperWidthMd`]: {
      maxWidth: "680px !important",
    },
    [`&.MuiDialog-paperWidthXl`]: {
      maxWidth: "1080px !important",
    },
  },
  "& .MuiDialogTitle-root": {
    fontSize: "18px",
    fontWeight: 700,
    color: theme.palette.text.primary,
    alignSelf: "center",
    padding: "12px",
    paddingTop: "28px",
  },
  "& .MuiDialogContent-root": {
    padding: "12px 24px",
  },
  "& .MuiDialogActions-root": {
    padding: "12px",
    paddingBottom: "28px",
    alignSelf: "center",
    gap: "12px",
  },
}));
