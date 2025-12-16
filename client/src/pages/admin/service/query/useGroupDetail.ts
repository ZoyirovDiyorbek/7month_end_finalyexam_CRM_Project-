import { useQuery } from "@tanstack/react-query";
import { request } from "@/config/request";

interface GroupDetail {
  id: string;
  name: string;
  startTime: string | null;
  endTime: string | null;
  durationInMonths: number | null;
  isActive: boolean;
  teacher: {
    id: string;
    name: string;
    username: string;
  };
  students: Array<{
    id: string;
    name: string;
  }>;
}

interface GroupDetailResponse {
  statusCode: number;
  message: {
    uz: string;
    en: string;
    ru: string;
  };
  data: GroupDetail;
}

export const useGroupDetail = (id: string) => {
  return useQuery<GroupDetailResponse>({
    queryKey: ["group", id],
    queryFn: () =>
      request.get(`/group/for-admin/${id}`).then((res) => res.data),
    enabled: !!id,
  });
};



