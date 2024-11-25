import { Box, styled } from "@mui/system";
import { IconButton, InputBase, Paper, Typography } from "@mui/material";
import TabletManagementTable from "@components/settings/TabletManagementTable";

import { ReactComponent as Search } from "@/assets/serachIcons/search-gray.svg";

//태블릿 병상 관리

export const TabletManagement = () => {
  return (
    <>
      <BodyTitleContainer>
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: 400,
            border: "1px solid #ECECEC",
            borderRadius: "6px",
            boxShadow: "none",
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="검색할 내용을 입력해주세요."
            inputProps={{ "aria-label": "검색할 내용을 입력해주세요." }}
          />
          <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
            <Search />
          </IconButton>
        </Paper>
        <div>
          <Title variant="h1">태블릿 병상 관리</Title>
        </div>
        <div style={{ width: "400px" }}></div>
      </BodyTitleContainer>
      <TabletManagementTable />
    </>
  );
};

const BodyTitleContainer = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  margin: "60px 0 40px 0",
});

const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.dark,
  textTransform: "uppercase",
  lineHeight: "24px",
  letterSpacing: "-3%",
}));
