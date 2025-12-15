import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "@/config/request";
import { toast } from "sonner";

interface EditGroupData {
  name?: string;
  startTime?: string;
  endTime?: string;
  durationInMonths?: number;
  teacherId?: string;
}

export const useEditGroup = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EditGroupData) =>
      request.patch(`/group/details/${id}`, data).then((res) => res.data),
    onSuccess: (res) => {
      toast.success(res.message?.uz || "Guruh muvaffaqiyatli yangilandi", {
        position: "bottom-right",
      });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["group", id] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message?.uz ||
          error.response?.data?.message ||
          "Guruhni yangilashda xatolik",
        { position: "bottom-right" }
      );
    },
  });
};

