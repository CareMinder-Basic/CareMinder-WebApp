import { Box, Stack, SvgIcon, Typography, styled } from "@mui/material";
import { AdminTable } from "@components/admin";
import CSwitch from "@components/common/atom/C-Switch";
import CButton from "@components/common/atom/C-Button";
import CSearchBox from "@components/common/atom/C-SearchBox";
import { ReactComponent as ArrayIcon } from "@assets/array.svg";
import PaginationComponent from "@components/common/pagination";

const StaffWardInoutManagementPage = () => {
  return (
    <Container>
      <div>
        <Title variant="h1">입퇴원 관리</Title>
        <AdminInoutSubTitleContainer>
          <AdminInoutSubTitleLeftContainer>
            <Subtitle variant="h2">내 구역 테블릿 리스트</Subtitle>
            <div>
              <CSwitch />
            </div>
            <SectionArrayLayout>
              <Arraytitle variant="h2">구역 정렬</Arraytitle>
              <SvgIcon component={ArrayIcon} inheritViewBox />
            </SectionArrayLayout>
          </AdminInoutSubTitleLeftContainer>
          <AdminInoutSubTitleRightContainer>
            <SearchLayout>
              <CSearchBox
                value={""}
                onChange={() => null}
                placeholder={"환자 이름을 검색해 주세요."}
              />
            </SearchLayout>
            <ButtonLayout>
              <CButton buttonType={"primarySpaure"}>퇴원 처리</CButton>
            </ButtonLayout>
          </AdminInoutSubTitleRightContainer>
        </AdminInoutSubTitleContainer>
      </div>
      <TableLayout>
        <AdminTable />
      </TableLayout>
      <FooterLayout>
        <div>
          <PaginationComponent totalPage={5} />
        </div>
      </FooterLayout>
    </Container>
  );
};

export default StaffWardInoutManagementPage;

/** styles */

const Container = styled(Stack)({
  height: "100%",
});

const AdminInoutSubTitleContainer = styled(Box)({
  marginTop: "17.66px",
  display: "flex",
  justifyContent: "space-between",
});

const AdminInoutSubTitleLeftContainer = styled(Box)({
  display: "flex",
  gap: "20px",
  alignItems: "center",
});
const AdminInoutSubTitleRightContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "15.66px",
});
const ButtonLayout = styled(Box)({
  width: "148px",
});
const TableLayout = styled(Box)({
  marginTop: "40px",
});

const FooterLayout = styled(Box)({
  paddingTop: "61.27px",
  // paddingBottom: "48.73px",
  display: "flex",
  width: "100%",
  justifyContent: "center",
  alignItems: "center",
});

const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.dark,
  textTransform: "uppercase",
  lineHeight: "24px",
  letterSpacing: "-3%",
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  lineHeight: "26px",
  fontSize: "18px",
  fontWeight: 500,
  color: theme.palette.primary.dark,
}));
const Arraytitle = styled(Typography)(({ theme }) => ({
  lineHeight: "26px",
  fontSize: "18px",
  fontWeight: 500,
  color: theme.palette.primary.main,
}));

const SectionArrayLayout = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "5px",
});

const SearchLayout = styled(Box)({
  width: "373px",
});
