import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { useSetRecoilState } from "recoil";
import { userState } from "@libraries/recoil";
import { UserType } from "@models/user";
import { useLocation, useNavigate } from "react-router-dom";
import { SEVER_URL } from "@constants/baseUrl";
import autoCompleteIdState from "@libraries/recoil/autoCompleteId";
import { logoutServiceWorker } from "@components/fcm/serviceWorker";

const signOut = async (type: UserType) => {
  let token;

  if (type === "WARD") {
    //@ts-ignore
    const tokens = await window.tokenAPI.getTokens();
    token = tokens.accessToken;
    //@ts-expect-error
    await window.electronStore.delete("accessTokenWard");
    //@ts-expect-error
    await window.electronStore.delete("refreshTokenWard");
  }
  if (type === "STAFF") {
    const accessTokenStaff = await window.electronStore.get("accessTokenStaff");
    token = accessTokenStaff;
    await window.electronStore.delete("accessTokenStaff");
    await window.electronStore.delete("refreshTokenStaff");
  }
  if (type === "ADMIN") {
    // token = Cookies.get("accessTokenAdmin");
    //@ts-ignore
    const accessTokenAdmin = await window.electronStore.get("accessTokenAdmin");
    token = accessTokenAdmin;
    console.log("어드민" + token);
  }

  if (type === "ADMIN") {
    const res = await axios.post(
      `${SEVER_URL}/admins/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  } else {
    const res = await axios.post(
      `${SEVER_URL}/users/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  return true;
};

export default function useSignOut(type: UserType) {
  const setUserState = useSetRecoilState(userState);
  const setAutoCompleteId = useSetRecoilState(autoCompleteIdState);
  const navigate = useNavigate();
  const location = useLocation();

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
        sessionStorage.setItem("previousPath", location.pathname);
        navigate("/", { state: { from: location.pathname } });
        // window.location.reload();
      } else {
        setUserState(null);
        setTimeout(() => {
          navigate("/sign-in");
          window.location.reload();
        }, 0);
      }
      setAutoCompleteId("");
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
