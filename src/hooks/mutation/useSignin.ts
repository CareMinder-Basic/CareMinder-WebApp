import { SigninFormData } from "@models/signin";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios/axiosInstance";
import Cookies from "js-cookie";
import { useSetRecoilState } from "recoil";
import { userState } from "@libraries/recoil";
import { useNavigate } from "react-router-dom";
import { UserType } from "@models/user";

const signin = async (useInfo: SigninFormData) => {
  const res = await axiosInstance.post("/users/login", useInfo);

  if (res.data.currentUser) {
    const userType: UserType = res.data.currentUser.role;
    switch (userType) {
      case "ADMIN":
        Cookies.set("accessTokenAdmin", res.data.jwtResponse.accessToken);
        Cookies.set("refreshTokenAdmin", res.data.jwtResponse.refreshToken);
        break;
      case "STAFF":
        Cookies.set("accessTokenStaff", res.data.jwtResponse.accessToken);
        Cookies.set("refreshTokenStaff", res.data.jwtResponse.refreshToken);
        break;
      case "WARD":
        Cookies.set("accessTokenWard", res.data.jwtResponse.accessToken);
        Cookies.set("refreshTokenWard", res.data.jwtResponse.refreshToken);
        break;
    }
  }
  return res.data;
};

export default function useSignin() {
  const navigate = useNavigate();
  const setUserState = useSetRecoilState(userState);

  return useMutation({
    mutationFn: signin,
    onSuccess: res => {
      console.log("로그인 성공");
      console.log(res);
      // 추가 응답 API 개발 완료 후
      setUserState({
        id: res.currentUser?.accountId,
        name: res.currentUser?.name,
        type: res.currentUser?.role,
      });

      if (res.currentUser) {
        const userType: UserType = res.currentUser?.role;

        switch (userType) {
          case "ADMIN":
            navigate("/admin");
            break;
          case "STAFF":
            navigate("/staff");
            break;
          case "WARD":
            navigate("/");
            break;
        }
      }
    },
    onError: error => {
      console.error("로그인 실패:", error);
    },
  });
}

/**
 * No description
 *
 * @tags useSignIn
 * @name AppControllerInitialize
 * @summary 로그인 요청
 * @request POST:
 * @secure /wards/sign-up
 */
