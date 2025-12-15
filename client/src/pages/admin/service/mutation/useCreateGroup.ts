import { useMutation } from "@tanstack/react-query";
import { request } from "@/config/request";

interface GroupT {
  startTime: string;
  endTime: string;
  durationInMonths: number;
  teacherId: string;
}

export const useCreateGroup = () => {
  return useMutation({
    mutationFn: (data: GroupT) =>
      request.post("/group", data).then((res) => res.data),
  });
};
