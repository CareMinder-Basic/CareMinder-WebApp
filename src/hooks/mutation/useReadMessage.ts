import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";

const useReadMessage = (roomId: number) => {
  return useMutation({
    mutationFn: (latestMessageId: number) => {
      return axiosInstance.post(`/chat/${roomId}/read/${latestMessageId}`);
    },
    onSuccess: () => {},
  });
};

export default useReadMessage;
