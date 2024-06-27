import { ModalProps as MuiModalProps, styled } from "@mui/material";
import { Dialog as Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { PropsWithChildren, ReactElement } from "react";

export type ModalProps = {
  title?: string | ReactElement;
  footer?: ReactElement;
} & Omit<MuiModalProps, "children">;

export default function Modal({
  open,
  onClose,
  title,
  footer,
  children,
}: PropsWithChildren<ModalProps>) {
  return (
    <StyledDialog maxWidth="xs" open={open} onClose={onClose}>
      {title && <DialogTitle>{title}</DialogTitle>}
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
  },
  "& .MuiDialogTitle-root": {
    fontSize: "18px",
    fontWeight: 700,
    color: theme.palette.primary.dark,
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
