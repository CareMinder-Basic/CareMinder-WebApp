import { CMModal, CMModalProps, ModalActionButton } from "@components/common";
import { CComboBox } from "@components/common/atom/C-ComboBox";
import CInput from "@components/common/atom/C-Input";
import ChangeModal from "@components/settings/modal/ChangeModal";
import { Box, styled, Typography } from "@mui/material";
import { useBooleanState } from "@toss/react";
import { useState } from "react";

export default function ChangeWardModal({ onClose, ...props }: CMModalProps) {
  const [options] = useState<string[]>(["구역1", "구역2", "구역3", "구역4"]);
  const [ward, setWard] = useState<string>("");
  const [wardName, setWardName] = useState<string>("");
  const [name, setName] = useState<string>("홍길동");
  const [userId, setUserId] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("010-0000-0000");
  const [email, setEmail] = useState<string>("User1234@email.com");

  const [open, openModal, closeModal] = useBooleanState();

  const handleSubmit = () => {
    console.log({
      ward,
      wardName,
      name,
      userId,
      phoneNumber,
      email,
    });
  };

  return (
    <>
      <ChangeModal
        open={open}
        onClose={closeModal}
        onConfirm={() => null}
        modalTitle={"비밀번호 변경"}
        subTitle={"신규 비밀번호"}
        rightText={"다음"}
      />
      <CMModal
        onClose={onClose}
        title={"계정 정보 변경"}
        footer={
          <>
            <ModalActionButton color="secondary" onClick={onClose}>
              취소
            </ModalActionButton>
            <ModalActionButton onClick={handleSubmit}>다음</ModalActionButton>
          </>
        }
        {...props}
      >
        <ContentLayout>
          <InputLayout>
            <Typography variant="h3">구역</Typography>
            <CComboBox
              placeholder={"구역"}
              options={options}
              value={ward}
              onChange={value => setWard(value as string)}
            />
          </InputLayout>
          <InputLayout>
            <Typography variant="h3">병동명</Typography>
            <CInput
              variant={"outlined"}
              placeholder={"병동명"}
              onChange={e => setWardName(e.target.value)}
              value={wardName}
              disabled={true}
              id={"wardName"}
            />
          </InputLayout>
          <InputLayout>
            <Typography variant="h3">이름</Typography>
            <CInput
              variant={"outlined"}
              placeholder={"이름을 입력하세요"}
              onChange={e => setName(e.target.value)}
              value={name}
              disabled={false}
              id={"name"}
            />
          </InputLayout>
          <InputLayout>
            <Typography variant="h3">사용자 ID</Typography>
            <CInput
              variant={"outlined"}
              placeholder={"User_1234"}
              onChange={e => setUserId(e.target.value)}
              value={userId}
              disabled={true}
              id={"userId"}
            />
          </InputLayout>
          <InputLayout>
            <Typography variant="h3">전화번호</Typography>
            <CInput
              variant={"outlined"}
              placeholder={"전화번호를 입력하세요"}
              onChange={e => setPhoneNumber(e.target.value)}
              value={phoneNumber}
              disabled={false}
              id={"phoneNumber"}
            />
          </InputLayout>
          <InputLayout>
            <Typography variant="h3">이메일</Typography>
            <CInput
              variant={"outlined"}
              placeholder={"이메일을 입력해주세요."}
              onChange={e => setEmail(e.target.value)}
              value={email}
              disabled={false}
              id={"email"}
            />
          </InputLayout>
          <TextLayout>
            <ChangePassword
              onClick={() => {
                onClose();
                openModal();
              }}
            >
              비밀번호 변경 {">"}
            </ChangePassword>
          </TextLayout>
        </ContentLayout>
      </CMModal>
    </>
  );
}

const ContentLayout = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  padding: "24px 30px",
});

const InputLayout = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  width: "349px",
  height: "54px",
  marginBottom: "30px",
});

const TextLayout = styled(Box)({
  display: "flex",
  justifyContent: "center",
  cursor: "pointer",
  marginTop: "23px",
});

const ChangePassword = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
}));
