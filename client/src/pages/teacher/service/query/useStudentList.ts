// service/query/useMyStudents.ts
import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../config/request";

export interface Student {
  id: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
  url: string | null;
  groupId: string;
  grade: number | null;
  behavior: string | null;
}

export interface MyStudentsResponse {
  statusCode: number;
  message: {
    uz: string;
    en: string;
    ru: string;
  };
  data: Student[];
}

export const useStudentList = () => {
  return useQuery<MyStudentsResponse, Error>({
    queryKey: ["my-students"],
    queryFn: async () => {
      const response = await request.get("/student/my-students");
      return response.data;
    },
  });
};
