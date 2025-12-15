import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "@/config/request";

export const useCreateGrade = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      studentId: string;
      grade: string;
      behavior?: string;
      }) => {
          console.log('jjj',data)
      return request.patch(`/student/evaluate/${data.studentId}`, {
        grade: data.grade,
        behavior: data.behavior,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group_students"] });
    },
  });
};
