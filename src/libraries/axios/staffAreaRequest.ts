import axiosInstance, { CustomAxiosRequestConfig } from "@utils/axios/axiosInstance";
import { AxiosResponse } from "axios";
import Cookies from "js-cookie";

export type AreaRequestApiType = {
  getStaffAreaRequests(params: { token: string }): Promise<AxiosResponse>;
};

const PATH = "/areas";

const StaffAreaRequest: AreaRequestApiType = {
  //모든 환자 요청 조회

  getStaffAreaRequests({ token }) {
    //@ts-ignore
    const wardToken = await window.electronStore.get("accessTokenWard");
    return axiosInstance.get(PATH, {
      headers: { Authorization: `Bearer ${wardToken}` },
      customHeader: true,
      params: {
        token,
      },
    } as CustomAxiosRequestConfig);
  },
};
export default StaffAreaRequest;
