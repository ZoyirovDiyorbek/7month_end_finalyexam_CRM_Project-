// service/query/useGroupStudent.ts
import { useQuery } from "@tanstack/react-query";
import { request } from "@/config/request";
import type { GroupStudentsResponse } from "../../type";

export const useGroupStudents = (groupId?: string) => {
  return useQuery({
    queryKey: ["group_students", groupId],
    queryFn: async () => {
      if (!groupId) {
        throw new Error("Group ID is required");
      }

      const response = await request.get<GroupStudentsResponse>(
        `/group/for-teacher/${groupId}`
      );

      console.log("Backend data:", response.data);

      return response.data.data; 
    },
    enabled: !!groupId,
  });
};
