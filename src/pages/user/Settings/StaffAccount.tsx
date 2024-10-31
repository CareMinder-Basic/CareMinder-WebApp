import { Box, styled } from "@mui/system";
import CButton from "@components/common/atom/C-Button";
import PaginationComponent from "@components/common/pagination";
import StaffAccountSettingsTable from "@components/settings/StaffAccountSettingsTable";
import { IconButton, InputBase, Paper, Typography } from "@mui/material";
import { useBooleanState } from "@toss/react";

import { useState } from "react";
import InfoModal, { ModalType } from "@components/settings/modal/InfoModal";
import TOSModal from "@components/settings/modal/TOSModal";
import ChangeModal from "@components/settings/modal/ChangeModal";
import { useRecoilState } from "recoil";
import { editingState } from "@libraries/recoil";

import { ReactComponent as X } from "@/assets/x-Icon.svg";
import { ReactComponent as Search } from "@/assets/serachIcons/search-gray.svg";
import { ReactComponent as Edit } from "@/assets/accountEdit.svg";
import { ReactComponent as Lock } from "@/assets/completedRequests/Interface essential/Lock.svg";
import { ReactComponent as Delete } from "@/assets/completedRequests/accountDelete.svg";
import { CreateStaff } from "./CreateStaff";
import { CComboBox } from "@components/common/atom/C-ComboBox";
import PasswordChangeModal from "@components/settings/modal/PasswordChangeModal";

export const StaffAccount = () => {
  const [isOpen, openCreateModal, closeCreateModal] = useBooleanState(false);
  const [isInfoModalOpen, openInfoModal, closeInfoModal] = useBooleanState(false);
  const [isTOSModalOpen, openTOSModal, closeTOSModal] = useBooleanState(false);
  const [isPWChangeModalOpen, openPWChangeModal, closePWChangeModal] = useBooleanState(false);

  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isClear, setIsClear] = useState<boolean>(false);
  const [isModalType, setIsModalType] = useState<ModalType>("checkDeleteStaff");
  const [options, setOptions] = useState<string[]>(["구역1", "구역2", "구역3", "구역4"]);

  const [isEditing, setIsEditing] = useRecoilState(editingState);

  const handleClear = () => {
    setIsEditing([]);
    setIsClear(true);
  };

  const handleTOS = () => {
    setIsCreate(true);
    closeTOSModal();
  };

  const handleInfoModal = (modalType: string) => {
    switch (modalType) {
      case "edit":
        return;
      case "lock":
        setIsModalType("checkUnLockStaff");
        break;
      case "unlock":
        setIsModalType("checkLockStaff");
        break;
      case "delete":
        setIsModalType("checkDeleteStaff");
        break;
    }
    openInfoModal();
  };

  return (
    <>
      {isCreate ? (
        <CreateStaff onCreate={setIsCreate} />
      ) : (
        <>
          {/* 약관 동의 모달 */}
          <TOSModal open={isTOSModalOpen} onClose={closeTOSModal} onConfirm={handleTOS} />

          {/* 스태프 추가 모달 */}
          <ChangeModal
            open={isOpen}
            onClose={closeCreateModal}
            onConfirm={() => null}
            modalTitle={"스태프 추가"}
            subTitle={"아이디/휴대폰 번호/이메일 중 택일"}
            rightText={"추가"}
          />

          {/* 계정 관리 등 정보 모달 */}
          <InfoModal
            open={isInfoModalOpen}
            onClose={closeInfoModal}
            modalType={isModalType}
            onConfirm={() => null}
          />

          {/* 비밀번호 편집 모달 */}
          <PasswordChangeModal open={isPWChangeModalOpen} onClose={closePWChangeModal} />

          <BodyTitleContainer>
            {isEditing.length !== 0 ? (
              <EditContainer>
                <X style={{ cursor: "pointer" }} onClick={handleClear} />
                <EditMenu sx={{ marginRight: "60px", textDecoration: "none" }}>
                  {isEditing.length}개 항목 선택됨
                </EditMenu>
                <div style={{ width: "138px", height: "36px", backgroundColor: "#EFF0F8" }}>
                  <CComboBox
                    placeholder={"직업"}
                    options={["간호사", "의사", "조무사", "직원"]}
                    value={""}
                    onChange={() => null}
                  />
                </div>
                <div style={{ width: "224px", height: "36px", backgroundColor: "#EFF0F8" }}>
                  <CComboBox
                    placeholder={"구역"}
                    options={options}
                    value={""}
                    onChange={() => null}
                    allowCustomInput={true}
                    onCustomInputAdd={newValue => {
                      setOptions([...options, newValue]);
                    }}
                  />
                </div>
                <Edit onClick={openPWChangeModal} style={{ cursor: "pointer" }} />
                <Lock />
                <Delete />
              </EditContainer>
            ) : (
              <>
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
              </>
            )}
          </BodyTitleContainer>
          {/* 스태프 리스트 실제 데이터 조건문으로 변경해야함 */}
          {/* {staffList?.data.length === 0 ? (
            <EmptyStaffContainer>
              <EmptyStaff />
              <p>등록된 스태프가 없습니다.</p>
            </EmptyStaffContainer>
          ) : (
            <>
              <StaffAccountSettingsTable
                onManage={handleInfoModal}
                isClear={isClear}
                setIsClear={setIsClear}
                staffLists={staffList as GetStaffListResponse}
                areaLists={areaList as GetAreaListResponse[]}
                isLoading={staffLoading && areaLoading}
              />
              <PaginationContainer>
                <div>
                  <PaginationComponent totalPage={5} />
                </div>
              </PaginationContainer>
            </>
          )} */}
          <>
            <StaffAccountSettingsTable
              onManage={handleInfoModal}
              isClear={isClear}
              setIsClear={setIsClear}
            />
            <PaginationContainer>
              <div>
                <PaginationComponent totalPage={5} />
              </div>
            </PaginationContainer>
          </>
        </>
      )}
    </>
  );
};

/** styles */

const BodyTitleContainer = styled(Box)({
  position: "relative",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  margin: "60px 0 40px 0",
});

const StaffButtonContainer = styled(Box)({
  display: "flex",
  gap: "20px",
  width: "400px",
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

const EditContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "start",
  alignItems: "center",
  gap: "20px",

  width: "100%",
  height: "60px",
  padding: "15px 12px",

  border: "2px solid #5D6DBE",
  borderRadius: "100px",

  opacity: "0.6",
  color: theme.palette.text.dark,
}));

const EditMenu = styled(Typography)({
  textDecoration: "underline",
});
