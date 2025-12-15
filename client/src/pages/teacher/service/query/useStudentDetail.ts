import { useQuery } from "@tanstack/react-query";
import { request } from "@/config/request";

export const useStudentDetail = (talabaId: string) => {
  return useQuery({
    queryKey: ["talaba_tafsilot", talabaId],
    queryFn: async () => {
      const javob = await request.get(`/student/my-students/${talabaId}`);
      return javob.data;
    },
    enabled: !!talabaId,
  });
};

