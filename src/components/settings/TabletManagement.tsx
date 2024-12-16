import { Box, styled } from "@mui/system";
import { Typography } from "@mui/material";
import { ReactComponent as X } from "@/assets/x-Icon.svg";
import { ReactComponent as DownArrow } from "@assets/downarrow-middle-icon.svg";
import { ReactComponent as Leave } from "@/assets/Leave.svg";
import TabletManagementTable from "@components/settings/TabletManagementTable";
import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import tabletEditingState from "@libraries/recoil/settings/tabletEdit";
import TabletSleepModeModal from "./modal/TabletSleepModeModal";
import { useBooleanState } from "@toss/react";

// import { ReactComponent as Search } from "@/assets/serachIcons/search-gray.svg";

//태블릿 병상 관리

interface SettingButtonProps {
  isClick?: boolean;
}

export const TabletManagement = () => {
  const settingRef = useRef<HTMLDivElement>(null);
  const editContainerRef = useRef<HTMLDivElement>(null);

  const [isEditing, setIsEditing] = useRecoilState(tabletEditingState);

  const [isSetting, setIsSetting] = useState<boolean>(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isClear, setIsClear] = useState<boolean>(false);

  const [isModalOpen, openModalOpen, closeModalOpen] = useBooleanState();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingRef.current && !settingRef.current.contains(event.target as Node)) {
        setIsSetting(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClear = () => {
    setIsEditing([]);
    setIsClear(true);
    setIsSticky(false);
  };

  return (
    <>
      <TabletSleepModeModal open={isModalOpen} onClose={closeModalOpen} />
      <BodyTitleContainer>
        {isEditing.length !== 0 ? (
          <EditContainer
            ref={editContainerRef}
            style={{
              position: isSticky ? "fixed" : "relative",
              top: isSticky ? "70px" : "auto",
              zIndex: isSticky ? 10 : "auto",
              width: isSticky ? "calc(100% - 200px)" : "100%",
            }}
          >
            <X style={{ cursor: "pointer" }} onClick={handleClear} />
            <EditMenu sx={{ marginRight: "60px", textDecoration: "none" }}>
              {isEditing.length}개 항목 선택됨
            </EditMenu>
            <div style={{ color: "#21262B", display: "flex", gap: "20px", cursor: "pointer" }}>
              <Leave />
            </div>
          </EditContainer>
        ) : (
          <>
            {/* <Paper
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
        </Paper> */}
            <div>
              <Title variant="h1">태블릿 병상 관리</Title>
            </div>
            <StaffButtonContainer>
              <div ref={settingRef} style={{ position: "relative" }}>
                <SettingButton isClick={isSetting} onClick={() => setIsSetting(prev => !prev)}>
                  <span>설정</span>
                  <span style={{ position: "absolute", right: "10px" }}>
                    <DownArrow style={{ transform: isSetting ? "rotate(180deg)" : "none" }} />
                  </span>
                </SettingButton>
                {isSetting && (
                  <SettingDropdown>
                    <div
                      style={{ padding: "10px", textAlign: "center" }}
                      onClick={() => {
                        setIsSetting(false);
                        openModalOpen();
                      }}
                    >
                      수면 모드 설정하기
                    </div>
                  </SettingDropdown>
                )}
              </div>
            </StaffButtonContainer>
          </>
        )}
      </BodyTitleContainer>
      <TabletManagementTable isClear={isClear} setIsClear={setIsClear} />
    </>
  );
};

const BodyTitleContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "60px 0 40px 0",
});

const EditContainer = styled(Box)(({ theme }) => ({
  position: "sticky",
  minWidth: "827px",
  width: "100%",

  display: "flex",
  justifyContent: "start",
  alignItems: "center",
  gap: "20px",

  height: "60px",
  padding: "15px 12px",

  border: "2px solid #5D6DBE",
  borderRadius: "100px",

  color: theme.palette.text.dark,
  backgroundColor: "#FFFFFF",
  zIndex: 10,
}));

const EditMenu = styled(Typography)({
  textDecoration: "underline",
});

const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.dark,
  textTransform: "uppercase",
  lineHeight: "24px",
  letterSpacing: "-3%",
}));

const StaffButtonContainer = styled(Box)({
  position: "absolute",
  right: "80px",
  display: "flex",
  gap: "20px",
  width: "146px",
  zIndex: 10,
});

const SettingButton = styled(Box, {
  shouldForwardProp: prop => prop !== "isClick",
})<SettingButtonProps>(({ isClick }) => ({
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  width: "148px",
  height: "36px",
  border: "1px solid #5D6DBE",
  borderRadius: isClick ? "5px 5px 0 0" : "5px",
  color: "#5D6DBE",
  fontWeight: 700,
  fontSize: "16px",
  backgroundColor: "#FFFFFF",
  zIndex: 21,
}));

const SettingDropdown = styled(Box)({
  "position": "absolute",
  "top": "100%",
  "right": 0,
  "width": "148px",
  "backgroundColor": "#FFFFFF",
  "border": "1px solid #5D6DBE",
  "borderTop": "none",
  "borderBottomLeftRadius": "5px",
  "borderBottomRightRadius": "5px",
  "boxShadow": "0 4px 6px rgba(0, 0, 0, 0.1)",
  "& > div": {
    "cursor": "pointer",
    "&:hover": {
      backgroundColor: "#F5F6FF",
    },
  },
});
