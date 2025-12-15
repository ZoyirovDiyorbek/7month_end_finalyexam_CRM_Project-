import { useQuery } from "@tanstack/react-query";
import { request } from "@/config/request";
import type { Group, IResponse } from "../../type";

export const useTeacherGroups = () => {
  return useQuery<IResponse<Group>, Error>({
    queryKey: ["teacher_groups"], 
    queryFn: () =>
      request
        .get<IResponse<Group>>(`/group/my-groups`)
        .then((res) => res.data),
  });
};