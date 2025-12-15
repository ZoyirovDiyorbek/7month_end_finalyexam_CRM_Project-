import { request } from "@/config/request";
import { useQuery } from "@tanstack/react-query";

interface TeacherData {
  statusCode: number;
  message: {
    uz: string;
    en: string;
    ru: string;
  };
  data: {
    teacherName: string;
    groupCount: string;
    colorClass: string;
    objectName: string;
  }[];
}

export const useTeacherStatistic = () => {
  return useQuery({
    queryKey: ["teacher_statistic"],
    queryFn: () =>
      request
        .get<TeacherData>("/statistic/top-teachers")
        .then((res) => res.data),
  });
};
