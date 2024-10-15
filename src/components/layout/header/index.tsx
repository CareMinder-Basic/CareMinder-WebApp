import UserHeader from "./UserHeader";

import { userState } from "@libraries/recoil";
import { UserType } from "@models/user";
import { Box, styled, Typography } from "@mui/material";
import { SwitchCase } from "@toss/react";
import { useRecoilValue } from "recoil";
import { LayoutType } from "../sidebar";

export default function Header() {
  const user = useRecoilValue(userState);

  return (
    <Layout adminType={user?.type as UserType}>
      <SwitchCase
        value={user?.type as UserType}
        caseBy={{
          main: <UserHeader />,
          staff: <UserHeader />,
          admin: (
            <Typography variant="h1" sx={{ color: "white" }}>
              Administrator
            </Typography>
          ),
        }}
      />
    </Layout>
  );
}

const Layout = styled(Box)<LayoutType>(({ theme, adminType }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "64px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px 28px",
  zIndex: "10",

  backgroundColor: theme.palette.primary.main,
  ...(adminType === "staff" && {
    backgroundColor: theme.palette.secondary.main,
  }),
  ...(adminType === "admin" && {
    backgroundColor: theme.palette.success.light,
  }),
}));
