import { useQuery } from "@tanstack/react-query";
import type { TeacherDetailsResponse } from "../../type";
import { request } from "../../../../config/request";

export const useProfile = () => {
  return useQuery<TeacherDetailsResponse>({
    queryKey: ["teacher", "profile"],
    queryFn: async () => {
      const response = await request.get("/teacher/details");
      return response.data;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, 
  });
};