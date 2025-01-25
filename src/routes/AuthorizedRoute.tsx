import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { UserType } from "@models/user";
import { userState } from "@libraries/recoil";
import { Box, CircularProgress } from "@mui/material";
// import { useCallbackOnce } from "@toss/react";
import Cookies from "js-cookie";
import modalState from "@libraries/recoil/modal";

type AuthorizedRouteProps = {
  allowedRoles: UserType[];
};

export default function AuthorizedRoute({ allowedRoles }: AuthorizedRouteProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useRecoilValue(userState);
  const [isChecking, setIsChecking] = useState(true);
  const [accessTokenWard, setAccessTokenWard] = useState<string | null>(null);
  const [accessTokenStaff, setAccessTokenStaff] = useState<string | null>(null);
  const accessTokenAdmin = Cookies.get("accessTokenAdmin");
  const setUser = useSetRecoilState(userState);
  const setIsModalOpen = useSetRecoilState(modalState);

  // const navigatePrev = useCallbackOnce(() => {
  //   console.error(`접근이 불가능한 경로입니다. (접근 경로: ${pathname}, 권한: ${user?.type})`);
  //   navigate(-1);
  // }, []);

  // 토큰 체크 로직을 별도 함수로 분리
  const checkAndSetTokens = async () => {
    try {
      const token = await window.tokenAPI.getTokens();
      const staffToken = await window.electronStore.get("accessTokenStaff");

      setAccessTokenWard(token?.accessToken);
      setAccessTokenStaff(staffToken);
      return { wardToken: token?.accessToken, staffToken };
    } catch (error) {
      console.error("Token fetch error:", error);
      return { wardToken: null, staffToken: null };
    }
  };

  // 초기 토큰 체크
  useEffect(() => {
    checkAndSetTokens();
  }, []);

  // user 타입 설정
  useEffect(() => {
    if (!user) return;

    const updateUserType = async () => {
      const { wardToken, staffToken } = await checkAndSetTokens();

      if (staffToken && user.type !== "STAFF") {
        setUser(prev => ({
          ...prev,
          type: "STAFF",
        }));
      } else if (wardToken && !staffToken && user.type !== "WARD") {
        setUser(prev => ({
          ...prev,
          type: "WARD",
        }));
      }
    };

    updateUserType();
  }, [user, setUser]);

  // 라우팅 및 권한 체크
  useEffect(() => {
    if (!user || !allowedRoles) return;

    const hasValidToken =
      (user.type === "WARD" && accessTokenWard) ||
      (user.type === "STAFF" && accessTokenStaff) ||
      (user.type === "ADMIN" && accessTokenAdmin);

    // WARD 토큰으로 staff 경로 진입 시 체크
    if (pathname.includes("staff") && accessTokenWard && !accessTokenStaff) {
      setIsChecking(true); // 로딩 상태 활성화
      setIsModalOpen(true);
      return;
    }

    // 권한 체크
    if (allowedRoles.includes(user.type) && hasValidToken) {
      setIsChecking(false);
      setIsModalOpen(false);
    }

    // 초기 경로 설정
    if (pathname === "/") {
      switch (user.type) {
        case "STAFF":
          navigate("/staff");
          break;
        case "ADMIN":
          navigate("/admin");
          break;
        default:
          navigate("/");
      }
    }

    // staff 페이지 접근 제어
    if (pathname.includes("staff")) {
      if (!accessTokenStaff && user.type === "STAFF") {
        navigate("/");
        setIsModalOpen(false);
      } else if (accessTokenWard && user.type === "WARD") {
        setIsModalOpen(true);
      }
    }
  }, [
    pathname,
    user,
    accessTokenStaff,
    accessTokenWard,
    accessTokenAdmin,
    allowedRoles,
    navigate,
    setIsModalOpen,
  ]);

  if (isChecking) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100vw"
        height="100vh"
        position="fixed"
        top={0}
        left={0}
        bgcolor="#fff"
      >
        <CircularProgress />
      </Box>
    );
  }

  return <Outlet />;
}
