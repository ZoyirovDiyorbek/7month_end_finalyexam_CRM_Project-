import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "@/config/request";

type OqituvchiYangilashMa = {
  ism: string;
};

export const useEditTeacher = () => {
  const sorovClient = useQueryClient();

  return useMutation({
    mutationFn: (ma: OqituvchiYangilashMa) => {
      return request.patch("/teacher/update", {
        name: ma.ism,
      });
    },
    onSuccess: () => {
      sorovClient.invalidateQueries({ queryKey: ["teacher_profile"] });
    },
  });
};

