import axiosInstance, { CustomAxiosRequestConfig } from "@utils/axios/axiosInstance";
import { AxiosResponse } from "axios";

export type AreaRequestApiType = {
  getStaffAreaRequests(params: { token: string }): Promise<AxiosResponse>;
};

const PATH = "/areas";

const StaffAreaRequest: AreaRequestApiType = {
  //모든 환자 요청 조회

  async getStaffAreaRequests({ token }) {
    const wardToken = await window.tokenAPI.getTokens();

    return axiosInstance.get(PATH, {
      headers: { Authorization: `Bearer ${wardToken?.accessToken}` },
      customHeader: true,
      params: {
        token,
      },
    } as CustomAxiosRequestConfig);
  },
};
export default StaffAreaRequest;
