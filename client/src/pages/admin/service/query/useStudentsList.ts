import { useQuery } from "@tanstack/react-query";
import { request } from "@/config/request";
import type { IResponse } from "../../type";

interface Student {
  id: string;
  name: string;
  email: string;
  grade: number | null;
  behavior: string | null;
  isActive: boolean;
  group: {
    id: string;
    name: string;
  };
}

export const useStudentsList = (page: string = "1", pageSize: string = "10") => {
  return useQuery({
    queryKey: ["students", page],
    queryFn: () =>
      request
        .get<IResponse<Student>>("/student", {
          params: {
            page,
            pageSize,
          },
        })
        .then((res) => res.data),
  });
};

