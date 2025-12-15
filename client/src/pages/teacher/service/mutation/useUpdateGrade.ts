import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "@/config/request";

type BaholashMa = {
  baho: number;
  xulq: string;
};

export const useUpdateGrade = (talabaId: string) => {
  const sorovClient = useQueryClient();

  return useMutation({
    mutationFn: async (ma: BaholashMa) => {
      const javob = await request.patch(`/student/evaluate/${talabaId}`, {
        grade: ma.baho,
        behavior: ma.xulq,
      });
      return javob.data;
    },
    onSuccess: () => {
      sorovClient.invalidateQueries({ queryKey: ["talaba_tafsilot", talabaId] });
      sorovClient.invalidateQueries({ queryKey: ["student_list"] });
      sorovClient.invalidateQueries({ queryKey: ["group_students"] });
    },
  });
};

