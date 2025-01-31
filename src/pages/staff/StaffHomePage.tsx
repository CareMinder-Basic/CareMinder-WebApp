// import { CComboBox } from "@components/common/atom/C-ComboBox";
// import CSwitch from "@components/common/atom/C-Switch";
// import PatientBox from "@components/common/patientListBox";
// import ChangeModal from "@components/settings/modal/ChangeModal";
// import StaffGroupList from "@components/common/patientListBox/staff/StaffGroupList";
// import { useStaffAccept, useStaffComplete } from "@hooks/mutation";
// import {
//   useGetStaffPatientInprogress,
//   useGetStaffPatientInprogressGroup,
//   useGetStaffPatientPending,
// } from "@hooks/queries";
// import { userState } from "@libraries/recoil";
// import layoutState from "@libraries/recoil/layout";
// import reqChangePWState from "@libraries/recoil/reqChangePW";
// import { CSwitchType, isRoleType } from "@models/home";
// import { Box, styled, Typography } from "@mui/material";
// import { useBooleanState } from "@toss/react";
// import { isFindRole } from "@utils/homePage";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useRecoilState, useSetRecoilState } from "recoil";
// import { OPTIONS } from "@components/settings/const";
// import accountActiveState from "@libraries/recoil/accountActive";

// export default function StaffHomePage() {
//   const setlayoutState = useSetRecoilState(layoutState);
//   const [userStatus] = useRecoilState(userState);
//   const [reqChangePWStatus] = useRecoilState(reqChangePWState);
//   const [isRequestModalOpen, openRequestModal, closeRequestModal] = useBooleanState(false);
//   const [isAccountActive, setIsAccountActive] = useRecoilState(accountActiveState);
//   const navigate = useNavigate();

//   const [staffWaitIsMine, setStaffWaitIsMine] = useState<boolean>(false); //대기중인 내 환자 보기
//   const [staffAcceptIsGroup, setStaffAcceptIsGroup] = useState<boolean>(false); //수락중인 환자, 환자별로 묶기
//   const [isRole, setIsRole] = useState<isRoleType>(null);
//   const [roomId, setRoomId] = useState<number | null>(null);

//   const { data: getPending, refetch: pendingRefetch } = useGetStaffPatientPending(
//     isRole,
//     staffWaitIsMine,
//   );
//   const { data: getInprogress, refetch: inprogressRefetch } =
//     useGetStaffPatientInprogress(staffAcceptIsGroup);
//   //@ts-ignore
//   const { data: getInprogressGroup, refetch: inprogressGroupRefetch } =
//     useGetStaffPatientInprogressGroup(staffAcceptIsGroup);

//   const refetchProps = {
//     pendingRefetch,
//     inprogressRefetch,
//     inprogressGroupRefetch,
//     staffAcceptIsGroup,
//   };

//   const { mutate: postAccept } = useStaffAccept(refetchProps);
//   const { mutate: patchComplete } = useStaffComplete(refetchProps);

//   const onMutates = (e: React.MouseEvent, id: number, type: string) => {
//     e.stopPropagation();
//     if (type === "wait") {
//       return postAccept(id);
//     }
//     if (type === "accept") {
//       return patchComplete(id);
//     }
//   };

//   useEffect(() => {
//     setlayoutState("home");
//     if (reqChangePWStatus) {
//       openRequestModal();
//     }

//     switch (userStatus?.type) {
//       case "WARD":
//         navigate("/");
//         break;
//       case "STAFF":
//         navigate("/staff");
//         break;
//     }
//   }, []);

//   const handleChangePW = () => {
//     console.log("비밀번호 변경");
//   };

//   return (
//     <>
//       <ChangeModal
//         open={isRequestModalOpen}
//         onClose={closeRequestModal}
//         onConfirm={handleChangePW}
//         modalTitle={"비밀번호 변경 요청"}
//         subTitle={
//           <Typography variant="body1" sx={{ textAlign: "center", lineHeight: "1.8" }}>
//             비밀번호 변경 요청이 왔습니다. 비밀번호를 변경해주세요.
//             <br /> 2024년 11월 30일까지 변경하지 않을 경우, 계정이 잠기게 됩니다.
//           </Typography>
//         }
//         rightText={"변경하기"}
//         isPasswordChange={true}
//       />
//       <LeftSection>
//         <Title>대기중인 환자</Title>
//         <SubTitle>
//           <SubTitleLeft>
//             <span>내 환자만 보기</span>
//             <CSwitch onChange={(el: CSwitchType) => setStaffWaitIsMine(el.target.checked)} />
//           </SubTitleLeft>
//           <SubTitleRight>
//             <span>직종</span>
//             <CComboBox
//               placeholder={"전체"}
//               options={["전체", "간호사", "조무사", "직원", "의사"]}
//               value={OPTIONS.find(el => el.role === isRole)?.value || "전체"}
//               onChange={el => setIsRole(isFindRole(el.target.value))}
//             />
//           </SubTitleRight>
//         </SubTitle>
//         {getPending?.map(el => (
//           <PatientBox
//             key={el.patientRequestId}
//             user="staffWait"
//             data={el}
//             onMutates={onMutates}
//             refetchProps={refetchProps}
//           />
//         ))}
//       </LeftSection>
//       <RightSection>
//         <Title>수락중인 환자</Title>
//         <SubTitle>
//           <SubTitleLeft>
//             <span>환자별로 묶기</span>
//             <CSwitch onChange={(el: CSwitchType) => setStaffAcceptIsGroup(el.target.checked)} />
//           </SubTitleLeft>
//         </SubTitle>
//         {!staffAcceptIsGroup &&
//           getInprogress?.map(el => (
//             <PatientBox
//               key={el.patientRequestId}
//               user="staffAccept"
//               data={el}
//               onMutates={onMutates}
//               roomId={roomId}
//               setRoomId={setRoomId}
//               refetchProps={refetchProps}
//             />
//           ))}
//         {/* 디자인 나오기 전이여서 주석 처리 */}
//         {staffAcceptIsGroup &&
//           getInprogressGroup?.map(el => (
//             <StaffGroupList data={el} onMutates={onMutates} roomId={roomId} setRoomId={setRoomId} />
//           ))}
//       </RightSection>
//     </>
//   );
// }

// const SectionBase = styled(Box)(({ theme }) => ({
//   width: "calc(50% - 15px)",
//   padding: "30px",
//   borderRadius: "24px",
//   backgroundColor: theme.palette.background.paper,
//   minHeight: "80vh",
// }));

// const LeftSection = styled(SectionBase)({
//   // 왼쪽 컨테이너에 스타일 적용
// });

// const RightSection = styled(SectionBase)({
//   // 오른쪽 컨테이너에 스타일 적용
// });

// const Title = styled("div")`
//   font-weight: 700;
//   font-size: 24px;
//   color: #000000;
//   margin-bottom: 26px;
// `;
// const SubTitle = styled("div")`
//   font-weight: 500;
//   font-size: 18px;
//   color: #000000;
//   margin-bottom: 16px;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
// `;
// const SubTitleLeft = styled("div")`
//   & > span {
//     margin-right: 18px;
//   }
// `;
// const SubTitleRight = styled("div")`
//   display: flex;
//   align-items: center;
//   height: 35px;
//   & > * {
//     font-size: 14px;
//   }
//   & > span {
//     width: 40px;
//     margin-right: 12px;
//   }
// `;

import { CComboBox } from "@components/common/atom/C-ComboBox";
import CSwitch from "@components/common/atom/C-Switch";
import PatientBox from "@components/common/patientListBox";
import ChangeModal from "@components/settings/modal/ChangeModal";
import StaffGroupList from "@components/common/patientListBox/staff/StaffGroupList";
import { useStaffAccept, useStaffComplete } from "@hooks/mutation";
import {
  useGetStaffPatientInprogress,
  useGetStaffPatientInprogressGroup,
  useGetStaffPatientPending,
} from "@hooks/queries";
import { userState } from "@libraries/recoil";
import layoutState from "@libraries/recoil/layout";
import reqChangePWState from "@libraries/recoil/reqChangePW";
import { CSwitchType, isRoleType } from "@models/home";
import { Box, styled, Typography } from "@mui/material";
import { useBooleanState } from "@toss/react";
import { isFindRole } from "@utils/homePage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { OPTIONS } from "@components/settings/const";
import AccountActiveModal from "@components/settings/modal/AccountActive";
import accountActiveState from "@libraries/recoil/accountActive";
import StopAccountActiveModal from "@components/settings/modal/StopAccountActive";
import useSignOut from "@hooks/mutation/useSignout";
import { UserType } from "@models/user";

export default function StaffHomePage() {
  const setlayoutState = useSetRecoilState(layoutState);
  const [userStatus] = useRecoilState(userState);
  const [reqChangePWStatus] = useRecoilState(reqChangePWState);
  const [isAccountActive, setIsAccountActive] = useRecoilState(accountActiveState);
  const userType = useRecoilValue(userState)?.type;

  const [isRequestModalOpen, openRequestModal, closeRequestModal] = useBooleanState(false);
  const [isStopAccountActive, openStopAccountActive, closeStopAccountActive] = useBooleanState();
  const navigate = useNavigate();

  const [staffWaitIsMine, setStaffWaitIsMine] = useState<boolean>(false); //대기중인 내 환자 보기
  const [staffAcceptIsGroup, setStaffAcceptIsGroup] = useState<boolean>(false); //수락중인 환자, 환자별로 묶기
  const [isRole, setIsRole] = useState<isRoleType>(null);
  const [roomId, setRoomId] = useState<number | null>(null);

  const { data: getPending, refetch: pendingRefetch } = useGetStaffPatientPending(
    isRole,
    staffWaitIsMine,
  );
  const { data: getInprogress, refetch: inprogressRefetch } =
    useGetStaffPatientInprogress(staffAcceptIsGroup);
  //@ts-ignore
  const { data: getInprogressGroup, refetch: inprogressGroupRefetch } =
    useGetStaffPatientInprogressGroup(staffAcceptIsGroup);

  const refetchProps = {
    pendingRefetch,
    inprogressRefetch,
    inprogressGroupRefetch,
    staffAcceptIsGroup,
  };

  const { mutate: postAccept } = useStaffAccept(refetchProps);
  const { mutate: patchComplete } = useStaffComplete(refetchProps);
  const { mutate: signOut } = useSignOut(userType as UserType);

  const onMutates = (e: React.MouseEvent, id: number, type: string) => {
    e.stopPropagation();
    if (type === "wait") {
      return postAccept(id);
    }
    if (type === "accept") {
      return patchComplete(id);
    }
  };

  useEffect(() => {
    setlayoutState("home");
    if (reqChangePWStatus) {
      openRequestModal();
    }

    switch (userStatus?.type) {
      case "WARD":
        navigate("/");
        break;
      case "STAFF":
        navigate("/staff");
        break;
    }
  }, []);

  const handleChangePW = () => {
    console.log("비밀번호 변경");
  };

  return (
    <>
      {/* 비밀번호 변경 요청 모달 */}
      <ChangeModal
        open={isRequestModalOpen}
        onClose={closeRequestModal}
        onConfirm={handleChangePW}
        modalTitle={"비밀번호 변경 요청"}
        subTitle={
          <Typography variant="body1" sx={{ textAlign: "center", lineHeight: "1.8" }}>
            비밀번호 변경 요청이 왔습니다. 비밀번호를 변경해주세요.
            <br /> 2024년 11월 30일까지 변경하지 않을 경우, 계정이 잠기게 됩니다.
          </Typography>
        }
        rightText={"변경하기"}
        isPasswordChange={true}
      />

      {/* 계정 활성화 모달 */}
      <AccountActiveModal
        open={isAccountActive}
        onClose={openStopAccountActive}
        onConfirm={() => setIsAccountActive(false)}
      />

      <StopAccountActiveModal
        open={isStopAccountActive}
        onClose={closeStopAccountActive}
        onConfirm={() => signOut()}
      />

      <LeftSection>
        <Title>대기중인 환자</Title>
        <SubTitle>
          <SubTitleLeft>
            <span>내 환자만 보기</span>
            <CSwitch onChange={(el: CSwitchType) => setStaffWaitIsMine(el.target.checked)} />
          </SubTitleLeft>
          <SubTitleRight>
            <span>직종</span>
            <CComboBox
              placeholder={"전체"}
              options={["전체", "간호사", "조무사", "직원", "의사"]}
              value={OPTIONS.find(el => el.role === isRole)?.value || "전체"}
              onChange={el => setIsRole(isFindRole(el.target.value))}
            />
          </SubTitleRight>
        </SubTitle>
        {getPending?.map(el => (
          <PatientBox
            key={el.patientRequestId}
            user="staffWait"
            data={el}
            onMutates={onMutates}
            refetchProps={refetchProps}
          />
        ))}
      </LeftSection>
      <RightSection>
        <Title>수락중인 환자</Title>
        <SubTitle>
          <SubTitleLeft>
            <span>환자별로 묶기</span>
            <CSwitch onChange={(el: CSwitchType) => setStaffAcceptIsGroup(el.target.checked)} />
          </SubTitleLeft>
        </SubTitle>
        {!staffAcceptIsGroup &&
          getInprogress?.map(el => (
            <PatientBox
              key={el.patientRequestId}
              user="staffAccept"
              data={el}
              onMutates={onMutates}
              roomId={roomId}
              setRoomId={setRoomId}
              refetchProps={refetchProps}
            />
          ))}
        {/* 디자인 나오기 전이여서 주석 처리 */}
        {staffAcceptIsGroup &&
          getInprogressGroup?.map(el => (
            <StaffGroupList data={el} onMutates={onMutates} roomId={roomId} setRoomId={setRoomId} />
          ))}
      </RightSection>
    </>
  );
}

const SectionBase = styled(Box)(({ theme }) => ({
  width: "calc(50% - 15px)",
  padding: "30px",
  borderRadius: "24px",
  backgroundColor: theme.palette.background.paper,
  minHeight: "80vh",
}));

const LeftSection = styled(SectionBase)({
  // 왼쪽 컨테이너에 스타일 적용
});

const RightSection = styled(SectionBase)({
  // 오른쪽 컨테이너에 스타일 적용
});

const Title = styled("div")`
  font-weight: 700;
  font-size: 24px;
  color: #000000;
  margin-bottom: 26px;
`;
const SubTitle = styled("div")`
  font-weight: 500;
  font-size: 18px;
  color: #000000;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const SubTitleLeft = styled("div")`
  & > span {
    margin-right: 18px;
  }
`;
const SubTitleRight = styled("div")`
  display: flex;
  align-items: center;
  height: 35px;
  & > * {
    font-size: 14px;
  }
  & > span {
    width: 40px;
    margin-right: 12px;
  }
`;
