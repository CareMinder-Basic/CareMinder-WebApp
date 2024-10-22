import { Box, styled } from "@mui/system";
import CButton from "@components/common/atom/C-Button";
import PaginationComponent from "@components/common/pagination";
import StaffAccountSettingsTable from "@components/settings/StaffAccountSettingsTable";
import { Stack, Typography } from "@mui/material";
import { useBooleanState } from "@toss/react";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { NewStaff, NewStaffField, QuickRegisterNewStaff } from "@models/staff";
import NewStaffInputField from "@components/settings/NewStaffInputField";
import InfoModal from "@components/settings/modal/InfoModal";
import TOSModal from "@components/settings/modal/TOSModal";
import { ReactComponent as EmptyStaff } from "@/assets/EmptyStaff.svg";
import ChangeModal from "@components/settings/modal/ChangeModal";
import { useRecoilState } from "recoil";
import doubleCheckState from "@libraries/recoil/staff";
import useCreateStaff from "@hooks/mutation/useCreateStaff";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// 스태프 계정 설정

const defaultValues: NewStaff = {
  name: "",
  occupation: "DOCTOR",
  username: "",
  password: "",
  confirmPassword: "",
  phoneNumber: "",
  email: "",
};

const quickRegisters: QuickRegisterNewStaff[] = [
  { label: "NFC", value: "NFC 등록" },
  { label: "지문 입력", value: "지문 등록" },
];

export const StaffAccount = () => {
  const [open, openCreateModal, closeCreateModal] = useBooleanState(false);
  const [openDelete, openDeleteModal, closeDeleteModal] = useBooleanState(false);
  const [openTOS, openTOSModal, closeTOSModal] = useBooleanState(false);

  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isDoubleChecked, setIsDoubleCheckd] = useRecoilState(doubleCheckState);

  const navigate = useNavigate();

  const { mutate } = useCreateStaff();

  const form = useForm<NewStaff>({
    defaultValues,
    mode: "onChange",
  });

  const { handleSubmit } = form;

  const onSubmit: SubmitHandler<NewStaff> = data => {
    console.log(data);
    const newStaffRequesets = {
      name: data.name,
      loginId: data.username,
      password: data.password,
      phoneNumber: data.phoneNumber,
      areaId: 0,
      email: data.email,
      nfc: "",
      fingerprint: "",
      staffRole: data.occupation,
    };
    console.log(newStaffRequesets);
    mutate(newStaffRequesets, {
      onSuccess: () => {
        toast.success("어드민 계정 생성이 완료되었습니다.");
        navigate("/");
        setIsDoubleCheckd(false);
      },
      onError: error => {
        toast.error(error.message);
      },
    });
  };

  const handleTOS = () => {
    setIsCreate(true);
    closeTOSModal();
  };

  return (
    <>
      {isCreate ? (
        <>
          <BodyTitleContainer>
            <Title variant="h1">스태프 계정 생성</Title>
          </BodyTitleContainer>
          <StaffInputLayout>
            <Stack gap={"24px"} style={{ width: "343px" }}>
              {fields.map(field => (
                <NewStaffInputField key={field.name} field={field} form={form} />
              ))}
              <Stack gap={"24px"}>
                {quickRegisters.map(quickReg => (
                  <Stack gap={"3px"}>
                    <Typography variant="h3">{quickReg.label}</Typography>
                    <CButton buttontype="primarySpaureWhite" style={{ height: "50px" }}>
                      {quickReg.value}
                    </CButton>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </StaffInputLayout>
          <ConfirmLayout>
            <CButton
              buttontype="primaryWhite"
              onClick={() => setIsCreate(prev => !prev)}
              style={{ width: "134px", height: "45px" }}
            >
              이전으로
            </CButton>
            <CButton
              buttontype="primary"
              onClick={handleSubmit(onSubmit)}
              style={{ width: "134px", height: "45px" }}
              sx={{
                "&:hover": {
                  backgroundColor: "#4759b2", // hover 시 더 진한 빨간색
                },
              }}
              disabled={!isDoubleChecked}
            >
              다음
            </CButton>
          </ConfirmLayout>
        </>
      ) : (
        <>
          {" "}
          <ChangeModal
            open={open}
            onClose={closeCreateModal}
            onConfirm={() => null}
            modalTitle={"스태프 추가"}
            subTitle={"아이디/휴대폰 번호/이메일 중 택일"}
            rightText={"추가"}
          />
          <TOSModal open={openTOS} onClose={closeTOSModal} onConfirm={handleTOS} />
          <InfoModal
            open={openDelete}
            onClose={closeDeleteModal}
            modalType={"checkDeleteStaff"}
            onConfirm={() => null}
          ></InfoModal>
          <BodyTitleContainer>
            <div>
              <Title variant="h1">스태프 계정 수정</Title>
            </div>
            <StaffButtonContainer>
              <CButton buttontype="primarySpaureWhite" onClick={openTOSModal}>
                스태프 계정 생성
              </CButton>
              <CButton buttontype="primarySpaureWhite" onClick={openCreateModal}>
                스태프 추가
              </CButton>
            </StaffButtonContainer>
          </BodyTitleContainer>
          {/* 스태프 리스트 실제 데이터 조건문으로 변경해야함 */}
          {false ? (
            <EmptyStaffContainer>
              <EmptyStaff />
              <p>등록된 스태프가 없습니다.</p>
            </EmptyStaffContainer>
          ) : (
            <>
              <StaffAccountSettingsTable onDelete={openDeleteModal} />
              <PaginationContainer>
                <div>
                  <PaginationComponent totalPage={5} />
                </div>
              </PaginationContainer>
            </>
          )}
        </>
      )}
    </>
  );
};

/** utils */

const fields: NewStaffField[] = [
  { name: "name", label: "이름", placeholder: "이름을 입력해주세요." },
  { name: "occupation", label: "직종 선택", placeholder: "의사" },
  { name: "username", label: "아이디", placeholder: "아이디를 입력해주세요." },
  { name: "password", label: "비밀번호", placeholder: "비밀번호를 입력해주세요.(4자 이상)" },
  {
    name: "confirmPassword",
    label: "비밀번호 확인",
    placeholder: "비밀번호를 다시 한번 입력해주세요.",
  },
  { name: "phoneNumber", label: "전화번호", placeholder: "010-0000-0000" },
  { name: "email", label: "이메일", placeholder: "이메일을 입력해주세요." },
];

/** styles */

const BodyTitleContainer = styled(Box)({
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "60px 0 40px 0",
});

const StaffButtonContainer = styled(Box)({
  position: "absolute",
  right: "0",
  display: "flex",
  gap: "20px",
  width: "300px",
});

const StaffInputLayout = styled(Box)(({ theme }) => ({
  "display": "flex",
  "justifyContent": "center",

  "margin": "0 auto",
  "maxWidth": "400px",
  "maxHeight": "700px",

  "overflowY": "scroll",
  "&::-webkit-scrollbar": {
    width: "5px",
  },
  "&::-webkit-scrollbar-track": {
    background: theme.palette.background.default,
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: theme.palette.primary.main,
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: theme.palette.primary.light,
  },
}));

const ConfirmLayout = styled(Box)({
  display: "flex",
  justifyContent: "center",
  gap: "40px",

  marginTop: "80px",
});

const PaginationContainer = styled(Box)({
  marginTop: "60px",
});

const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.dark,
  textTransform: "uppercase",
  lineHeight: "24px",
  letterSpacing: "-3%",
}));

const EmptyStaffContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",

  minHeight: "600px",
  marginBottom: "100px",
});
