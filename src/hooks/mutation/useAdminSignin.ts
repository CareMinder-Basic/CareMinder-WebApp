import { SigninFormData } from "@models/signin";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios/axiosInstance";
import Cookies from "js-cookie";
import { useSetRecoilState } from "recoil";
import { userState } from "@libraries/recoil";
import { useNavigate } from "react-router-dom";

const adminSignin = async (useInfo: SigninFormData) => {
  const res = await axiosInstance.post("/admins/login", useInfo);

  if (res.data.accessToken) {
    Cookies.set("accessTokenAdmin", res.data.accessToken);
    Cookies.set("refreshTokenAdmin", res.data.refreshToken);
  }

  return res.data;
};

export default function useAdminSignin() {
  const navigate = useNavigate();
  const setUserState = useSetRecoilState(userState);

  return useMutation({
    mutationFn: adminSignin,
    onSuccess: res => {
      console.log("어드민 로그인 성공");

      //개발 전
      setUserState({
        id: 0,
        name: "테스트",
        type: "admin",
      });
      // 추가 응답 API 개발 완료 후
      // setUserState({
      //   id: res.id,
      //   name: res.name,
      //   type: res.type,
      // });
      navigate("/admin");
    },
    onError: error => {
      console.error("로그인 실패:", error);
    },
  });
}

/**
 * No description
 *
 * @tags useAdminSignin
 * @name AppControllerInitialize
 * @summary 로그인 요청
 * @request POST:
 * @secure /api/admins/login
 */
