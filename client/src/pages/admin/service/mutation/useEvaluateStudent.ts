import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "@/config/request";
import { toast } from "sonner";

interface EvaluateStudentData {
  grade: number;
  behavior?: string;
}

export const useEvaluateStudent = (studentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EvaluateStudentData) =>
      request.patch(`/student/evaluate-for-admin/${studentId}`, data).then((res) => res.data),
    onSuccess: (res) => {
      toast.success(res.message?.uz || "Baho muvaffaqiyatli qo'yildi", {
        position: "bottom-right",
      });
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message?.uz ||
          error.response?.data?.message ||
          "Bahoni qo'yishda xatolik",
        { position: "bottom-right" }
      );
    },
  });
};

