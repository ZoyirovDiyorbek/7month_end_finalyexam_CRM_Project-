import { request } from "@/config/request";
import { useQuery } from "@tanstack/react-query";
import type { IResponse } from "../../type";

interface GroupList {
  id: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  name: string;
  startTime: string | null;
  endTime: string | null;
  durationInMonths: number | null;
  students: {}[];
  teacher: {
    id: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    name: string;
    username: string;
    role: string;
    avatarUrl: string;
    specifications: [];
  };
}

export const useGroupsList = () => {
  return useQuery({
    queryKey: ["groups"],
    queryFn: () =>
      request.get<IResponse<GroupList>>("/group").then((res) => res.data),
  });
};
