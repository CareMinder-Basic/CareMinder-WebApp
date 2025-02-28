import { FunctionComponent } from "react";

import { Stack, styled, SvgIcon, SxProps, Theme, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import { useRecoilValue } from "recoil";
import { userState } from "@libraries/recoil";

type PageButtonProps = {
  routePath: string;
  pageName: string;
  icon: FunctionComponent<React.SVGProps<SVGSVGElement>>;
};

export default function MenuLayout({ pageName, routePath, icon }: PageButtonProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isActive = pathname === routePath;
  const user = useRecoilValue(userState);

  let menuButtonStyle = useMenuButtonStyles(isActive);

  switch (user?.type) {
    case "WARD":
      menuButtonStyle = useMenuButtonStyles(isActive);
      break;
    case "STAFF":
      menuButtonStyle = useStaffMenuButtonStyles(isActive);
      break;
    case "ADMIN":
      menuButtonStyle = useAdminMenuButtonStyles(isActive);
      break;
  }

  return (
    <Container>
      <MenuButton onClick={() => navigate(routePath)} sx={menuButtonStyle}>
        <SvgIcon component={icon} inheritViewBox />
      </MenuButton>
      <Typography variant="h5" sx={getTypographyStyles(isActive, user?.type!)}>
        {pageName}
      </Typography>
    </Container>
  );
}

/** utils */

// @ts-ignore
const getTypographyStyles = (isActive: boolean, userType: string): SxProps<Theme> => ({
  whiteSpace: "pre",
  textAlign: "center",
  color: theme => theme.palette.primary.contrastText,

  opacity: isActive ? "1" : "0.2",
});

const useMenuButtonStyles = (isActive: boolean): SxProps<Theme> => ({
  borderRadius: "12px",
  width: "36px",
  height: "36px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  backgroundColor: theme => theme.palette.primary[isActive ? "light" : "main"],
  color: theme => theme.palette.primary[isActive ? "contrastText" : "light"],
});
const useStaffMenuButtonStyles = (isActive: boolean): SxProps<Theme> => ({
  borderRadius: "12px",
  width: "36px",
  height: "36px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  backgroundColor: theme => theme.palette.secondary[isActive ? "dark" : "main"],
  color: theme => theme.palette.secondary[isActive ? "contrastText" : "light"],
});
const useAdminMenuButtonStyles = (isActive: boolean): SxProps<Theme> => ({
  borderRadius: "12px",
  width: "36px",
  height: "36px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  backgroundColor: theme => (isActive ? theme.palette.secondary.dark : theme.palette.success.light),
  color: theme => theme.palette.primary.contrastText,
});

/** styles */
const Container = styled(Stack)({
  alignItems: "center",
  gap: "6px",
});

const MenuButton = styled("button")(({ theme }) => ({
  "border": "none",
  "cursor": "pointer",
  "padding": 0,
  "background": "none",
  "&:hover": {
    opacity: 0.8,
  },
}));
