import { SigninFormData } from "@models/signin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { userState } from "@libraries/recoil";
// import { useNavigate } from "react-router-dom";
import { UserType } from "@models/user";
import { SEVER_URL } from "@constants/baseUrl";
import wardState from "@libraries/recoil/ward";

const signin = async (useInfo: SigninFormData) => {
  const res = await axios.post(`${SEVER_URL}/users/login`, useInfo);

  if (res.data.currentUser) {
    const userType: UserType = res.data.currentUser.role;
    switch (userType) {
      case "ADMIN":
        await window.authAPI.loginSuccessAdmin({
          accessToken: res.data.jwtResponse.accessToken,
          refreshToken: res.data.jwtResponse.refreshToken,
        });
        break;
      case "WARD":
        await window.authAPI.loginSuccessWard({
          accessToken: res.data.jwtResponse.accessToken,
          refreshToken: res.data.jwtResponse.refreshToken,
        });
        break;
    }
  }
  return res.data;
};

export default function useSignin() {
  // const navigate = useNavigate();
  const setUserState = useSetRecoilState(userState);
  const setWardState = useSetRecoilState(wardState);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signin,
    onSuccess: async res => {
      queryClient.invalidateQueries({ queryKey: ["useGetWardPatientPending"] });
      console.log("로그인 성공");
      if (res.currentUser.role === "WARD") {
        setWardState({
          id: res.currentUser?.accountId,
          name: res.currentUser?.name,
          type: res.currentUser?.role,
        });
        await window.electronStore.set("wardState", {
          id: res.currentUser?.accountId,
          name: res.currentUser?.name,
          type: res.currentUser?.role,
        });
      }

      await window.electronStore.set("userType", {
        id: res.currentUser?.accountId,
        name: res.currentUser?.name,
        type: res.currentUser?.role,
      });

      setUserState({
        id: res.currentUser?.accountId,
        name: res.currentUser?.name,
        type: res.currentUser?.role,
      });

      // if (res.currentUser) {
      //   const userType: UserType = res.currentUser?.role;
      //   switch (userType) {
      //     case "ADMIN":
      //       navigate("/admin");
      //       break;
      //     case "WARD":
      //       navigate("/");
      //       break;
      //   }
      // }
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
