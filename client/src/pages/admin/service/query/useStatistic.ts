
import { useQuery } from "@tanstack/react-query";
import { request } from "@/config/request";

interface ResponseData {
  statusCode: number;
  message: {
    uz: string;
    en: string;
    ru: string;
  };
  data: {
    adminCount: number;
    teacherCount: number;
    studentCount: number;
    groupCount: number;
  };
}

export const useStatistic = () => {
  return useQuery({
    queryKey: ["statistic"],
    queryFn: () =>
      request.get<ResponseData>("/statistic").then((res) => res.data),
  });
};
