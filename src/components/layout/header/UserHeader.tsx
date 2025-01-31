import SearchBox from "@components/common/SearachBox/SearchBox";
import SignOutButton from "./SignOutButton";
import { Box, styled, Typography } from "@mui/material";
import { ReactComponent as Logo } from "@assets/full-logo.svg";
import { useEffect } from "react";
import Alarm from "@components/alarm/alarm.tsx";
import { openSSE } from "@utils/useSSE";
import { useRecoilValue } from "recoil";
import { userState } from "@libraries/recoil";

export default function UserHeader() {
  const userType = useRecoilValue(userState)?.type;
  useEffect(() => {
    console.log("접근");
    openSSE({ checkType: "notification", userType: userType as string });
  }, [userType]);
  return (
    <>
      <Logo />
      <Typography>
        <HeaderContainer>
          <SearchBoxWrapper>
            <SearchBox />
          </SearchBoxWrapper>
          <SignOutButton />
        </HeaderContainer>
      </Typography>
      <Alarm />
    </>
  );
}

const HeaderContainer = styled(Box)({
  display: "flex",
  alignItems: "flex-start",
  gap: "20px",
});

const SearchBoxWrapper = styled(Box)({
  position: "relative",
  height: "36px",
});
