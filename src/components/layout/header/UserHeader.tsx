import SearchBox from "@components/common/SearachBox/SearchBox";
import SignOutButton from "./SignOutButton";
import { Box, styled, Typography } from "@mui/material";

import { ReactComponent as Logo } from "@assets/full-logo.svg";

export default function UserHeader() {
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
