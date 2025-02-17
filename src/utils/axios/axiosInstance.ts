import axios, { InternalAxiosRequestConfig, AxiosHeaders, AxiosError } from "axios";
import Cookies from "js-cookie";
import { SEVER_URL } from "@/constants/baseUrl";

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  customHeader?: boolean; // customHeader 속성 추가
}

const axiosInstance = axios.create({
  baseURL: SEVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
//토큰 유효성 검사
axiosInstance.interceptors.response.use(
  res => {
    return res;
  },
  async error => {
    if (error.response && error.response.status === 401) {
      const userState = localStorage.getItem("recoil-persist");
      let userType = "";

      if (userState) {
        const userStateObj = JSON.parse(userState as string);
        userType = userStateObj.userState.type;
      }

      let refreshEndpoint = "";
      let accessTokenKey = "";
      let refreshTokenKey = "";

      switch (userType) {
        case "WARD":
          accessTokenKey = "accessTokenWard";
          refreshTokenKey = "refreshTokenWard";
          refreshEndpoint = `${SEVER_URL}/users/refresh-token`;
          break;
        case "STAFF":
          accessTokenKey = "accessTokenStaff";
          refreshTokenKey = "refreshTokenStaff";
          refreshEndpoint = `${SEVER_URL}/users/refresh-token`;
          break;
        case "ADMIN":
          accessTokenKey = "accessTokenAdmin";
          refreshTokenKey = "refreshTokenAdmin";
          refreshEndpoint = `${SEVER_URL}/users/refresh-token`;
          break;
        default:
          return Promise.reject(error);
      }

      try {
        //@ts-ignore
        const token = await window.tokenAPI.getTokens();
        const response = await axios.post(
          refreshEndpoint,
          {},
          {
            headers: {
              Authorization: `Bearer ${token.refreshToken}`,
            },
          },
        );

        if (!response.data) {
          return Promise.reject(new Error("토큰 리프레쉬 실패"));
        }

        // electron store에 새로운 토큰 저장
        await window.electronStore.set(accessTokenKey, response.data.accessToken);
        await window.electronStore.set(refreshTokenKey, response.data.refreshToken);

        // 원래 요청 재시도
        error.config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return axiosInstance.request(error.config);
      } catch (refreshError) {
        if (refreshError instanceof AxiosError && refreshError.status === 401) {
          // 토큰 갱신 실패 시 토큰 삭제
          await window.electronStore.delete(accessTokenKey);
          await window.electronStore.delete(refreshTokenKey);
          window.location.href = "/sign-in";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

axiosInstance.interceptors.request.use(
  async (config: CustomAxiosRequestConfig) => {
    let token = "";

    if (config.customHeader) {
      return config;
    }

    const userState = localStorage.getItem("recoil-persist");

    // const userType = userStateObj.userState.type;
    let userType = "";
    if (userState) {
      const userStateObj = JSON.parse(userState as string);
      userType = userStateObj.userState.type;
    }

    switch (userType) {
      case "WARD":
        const tokens = await window.tokenAPI.getTokens();
        token = tokens.accessToken;
        break;
      case "STAFF":
        const staffTokens = await window.electronStore.get("accessTokenStaff");
        token = staffTokens;
        break;
      case "ADMIN":
        const adminToken = await window.electronStore.get("accessTokenAdmin");
        token = adminToken;
        break;
      default:
        null;
    }

    if (token) {
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }
      (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);

      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
