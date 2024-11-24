import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useSetRecoilState } from "recoil";
import { userState } from "@libraries/recoil";
import { UserType } from "@models/user";
import { useNavigate } from "react-router-dom";

const signOut = async (type: UserType) => {
  if (type === "WARD") {
    Cookies.set("accessTokenWard", "");
    Cookies.set("refreshTokenWard", "");
  }
  if (type === "STAFF") {
    Cookies.set("accessTokenStaff", "");
    Cookies.set("refreshTokenStaff", "");
  }
  if (type === "ADMIN") {
    Cookies.set("accessTokenAdmin", "");
    Cookies.set("refreshTokenAdmin", "");
  }

  return true;
};

export default function useSignOut(type: UserType) {
  const setUserState = useSetRecoilState(userState);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => signOut(type),
    onSuccess: () => {
      console.log("로그아웃 성공");
      if (type === "STAFF") {
        setUserState(prev => {
          if (!prev) {
            return { id: 0, name: "", type: "WARD" };
          }
          return {
            ...prev,
            type: "WARD",
            id: prev.id,
            name: prev.name,
          };
        });

        navigate("/");
      } else {
        setUserState(null);
        navigate("/sign-in");
      }
    },
    onError: error => {
      console.error("로그아웃 실패:", error);
    },
  });
}

/**
 * No description
 *
 * @tags useSignout
 * @name AppControllerInitialize
 * @summary 로그아웃 요청
 * @request POST:
 * @secure /staff/logout
 */
