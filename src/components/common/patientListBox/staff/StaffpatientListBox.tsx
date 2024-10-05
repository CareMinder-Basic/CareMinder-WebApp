import { Stack, styled } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import { ChatBox } from "@components/home";
import { PatientListBoxType } from "..";
import { roleColor } from "@utils/homePage";
import { ReactComponent as CheckIcon } from "@/assets/homeIcons/check.svg";
import { useState } from "react";
import { CComboBox } from "@components/common/atom/C-ComboBox";

type StaffListBoxProps = {
  isAccept: boolean;
  data: PatientListBoxType;
  onWaitOrAccept: (id: number, type: "wait" | "accept") => void;
};

function StaffPatientListBox({ isAccept, data, onWaitOrAccept }: StaffListBoxProps) {
  const roleColorPick = roleColor(data.role);

  const [isOptions, setIsOptions] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isChatting, setIsChatting] = useState(false);

  const onOptionOnOff = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOptions || isEdit) {
      setIsEdit(false);
      setIsOptions(false);
    } else if (!isOptions && !isEdit) {
      setIsOptions(true);
    }
  };
  const onOpenChatting = () => {
    if (!isAccept) return;
    setIsChatting(prev => !prev);
  };

  return (
    <InnerContainer color={roleColorPick.light} onClick={onOpenChatting}>
      <Title color={roleColorPick.dark} tabIndex={0} onBlur={() => setIsOptions(false)}>
        <div>{data.place}</div>
        <div>
          <MoreHorizRoundedIcon
            onClick={onOptionOnOff}
            sx={{ color: "#C4C5CC", cursor: "pointer" }}
          />
          {isOptions && (
            <Options>
              {isAccept ? (
                <Option onMouseDown={() => console.log("수락취소")}>수락취소</Option>
              ) : (
                <Option onMouseDown={() => setIsEdit(true)}>담당직종 변경</Option>
              )}
              <Option onMouseDown={() => console.log("퇴원")}>퇴원</Option>
            </Options>
          )}
          {isEdit && (
            <Options
              tabIndex={0}
              onBlur={() => {
                setIsEdit(false);
                setIsOptions(false);
              }}
            >
              <span>담당직종 변경</span>
              <BoxWrapper>
                <CComboBox
                  placeholder={"테스트"}
                  options={["테스트1", "테스트2"]}
                  value={""}
                  onChange={() => null}
                />
              </BoxWrapper>
            </Options>
          )}
        </div>
      </Title>
      <Bottom>
        <TxtBox>
          <TxtBoxLeft>
            {data.isNew && <SmallCheck color={roleColorPick.dark}>N</SmallCheck>}
            {data.request}
          </TxtBoxLeft>
          <TxtBoxRight>{data.time}분전</TxtBoxRight>
        </TxtBox>
        <Check
          color={roleColorPick.dark}
          onClick={() => onWaitOrAccept(data.id, isAccept ? "accept" : "wait")}
        >
          {isAccept ? <CheckIcon /> : <ArrowForwardRoundedIcon />}
        </Check>
      </Bottom>
      {isAccept && isChatting && (
        <ChatContainer>
          <ChatBox leftorRight="right" />
        </ChatContainer>
      )}
    </InnerContainer>
  );
}
export default StaffPatientListBox;

const InnerContainer = styled(Stack)<{ color: string }>`
  border-radius: 12px;
  background-color: ${({ color }) => color};
  width: 100%;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
`;

const Title = styled("div")<{ color: string }>`
  font-weight: 700;
  font-size: 14px;
  color: ${({ color }) => color};
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  padding-right: 5px;
  position: relative;
`;
const TxtBox = styled("div")`
  border-radius: 6px;
  width: 100%;
  background-color: ${({ theme }) => theme.palette.primary.contrastText};
  padding: 6px 16px 6px 16px;
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.palette.primary.dark};
  display: flex;
  justify-content: space-between;
`;
const TxtBoxLeft = styled("div")`
  display: flex;
  align-items: center;
`;
const TxtBoxRight = styled("div")`
  color: ${({ theme }) => theme.palette.text.primary};
  min-width: 60px;
  text-align: end;
`;
const Bottom = styled("div")`
  display: flex;
  width: 100%;
  align-items: end;
  justify-content: space-between;
`;
const Check = styled("div")<{ color: string }>`
  background-color: ${({ color }) => color};
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 12px;
  font-weight: 900;
`;
const SmallCheck = styled("div")<{ color: string }>`
  background-color: ${({ color }) => color};
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  padding-top: 2px;
  justify-content: center;
  margin-right: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.palette.primary.contrastText};
  font-weight: 900;
  margin-bottom: 2px;
`;

const ChatContainer = styled("div")`
  border-top: 1px solid ${({ theme }) => theme.palette.primary.contrastText};
  margin-top: 12px;
`;
const Options = styled("div")`
  background-color: ${({ theme }) => theme.palette.primary.contrastText};
  position: absolute;
  top: 20px;
  right: 0px;
  padding: 11px;
  box-shadow: 0px 4px 12px 0px #89898e4d;
  border-radius: 8px;
  & > div:first-of-type {
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
  }
  & > span {
    font-size: 14px;
    font-weight: 700;
    color: ${({ theme }) => theme.palette.primary.dark};
  }
`;
const Option = styled("div")`
  font-size: 13px;
  color: ${({ theme }) => theme.palette.primary.dark};
  font-weight: 500;
  padding: 8px 0;
  cursor: pointer;
  width: 69px;
  :hover {
    color: ${({ theme }) => theme.palette.primary.main};
  }
`;
const BoxWrapper = styled("div")`
  height: 39px;
  width: 130px;
  margin-top: 8px;
`;
