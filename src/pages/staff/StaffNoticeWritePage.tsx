import { Box, Stack, Typography, styled } from "@mui/material";
import { AdminTable } from "@components/admin";

import CButton from "@components/common/atom/C-Button";

import PaginationComponent from "@components/common/pagination";
import AdminNoticeWriteForm from "@components/admin/adminNotice/adminNoticeWriteForm";
import useGetWardTabletRequests from "@hooks/queries/useGetStaffsTablet";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { WardTabletType } from "@models/ward-tablet";
import useDischargePatients from "@hooks/mutation/usePatientsDischarge";
import { toast } from "react-toastify";

const StaffNoticeWritePage = () => {
  const { data: getTablet, isLoading } = useGetWardTabletRequests();
  const [selected, setSelected] = useState<Array<any>>([{}]);
  const { mutate, isPending } = useDischargePatients();

  const onChangeSelected = (index: any) => {
    setSelected(prev => {
      if (prev.includes(index)) {
        return prev.filter(item => item !== index);
      } else {
        return [...prev, index];
      }
    });
  };
  const defaultValuesUpdate: WardTabletType = {
    areaId: 0,
    tabletId: 0,
    areaName: "",
    tabletName: "",
    serialNumber: "",
    patientId: 0,
    patientName: "",
  };

  //To-do
  //공지 작성 폼 완성
  //데이터 잘 오는지 체크 달라하자
  const formDischarge = useForm<WardTabletType>({
    defaultValues: defaultValuesUpdate,
    mode: "onChange",
  });

  const { handleSubmit: handleDischarge } = formDischarge;

  const onDischarge: SubmitHandler<WardTabletType> = data => {
    mutate(data.tabletId, {
      onSuccess: () => {
        toast.success("퇴원 처리가 완료 되었습니다.");
      },
      onError: error => {
        toast.error(error.message);
      },
    });
  };

  return (
    <Container>
      <div>
        <Title variant="h1">공지</Title>
        <AdminInoutSubTitleContainer>
          <AdminInoutSubTitleLeftContainer></AdminInoutSubTitleLeftContainer>
          <AdminInoutSubTitleRightContainer>
            <ButtonLayout width={"148px"}>
              <CButton buttontype={"primarySpaure"}>공지 작성</CButton>
            </ButtonLayout>
          </AdminInoutSubTitleRightContainer>
        </AdminInoutSubTitleContainer>
      </div>
      <TableLayout>
        <AdminNoticeListLayout>
          <AdminTable
            getTablet={getTablet}
            form={formDischarge}
            onChangeSelected={onChangeSelected}
            selected={selected}
          />
        </AdminNoticeListLayout>
        <AdminNoticeWriteForm />
      </TableLayout>
      <FooterLayout>
        <PaginationComponent totalPage={5} />
      </FooterLayout>
    </Container>
  );
};

export default StaffNoticeWritePage;

/** styles */

const Container = styled(Stack)({
  height: "100%",
});

const AdminInoutSubTitleContainer = styled(Box)({
  marginTop: "17.66px",
  display: "flex",
  justifyContent: "space-between",
});

const AdminNoticeListLayout = styled(Box)({
  width: "50%",
  height: "100%",
});

const AdminInoutSubTitleLeftContainer = styled(Box)({
  display: "flex",
  width: "50%",
  gap: "20px",
  alignItems: "center",
});
const AdminInoutSubTitleRightContainer = styled(Box)({
  display: "flex",
  width: "50%",
  alignItems: "center",
  gap: "15.66px",

  justifyContent: "end",
});
const ButtonLayout = styled(Box)(width => ({
  width: `${width}`,
}));
const ButtonListLayout = styled(Box)({
  display: "flex",
  gap: "10px",
});
const TableLayout = styled(Box)({
  marginTop: "40px",
  display: "flex",
  gap: "24px",
  height: "100%",
  maxHeight: "647px",
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
