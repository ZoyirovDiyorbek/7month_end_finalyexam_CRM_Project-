import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "@/config/request";

export const useUploadProfile = () => {
  const sorovClient = useQueryClient();

  return useMutation({
    mutationFn: (fayl: File) => {
      const formaMa = new FormData();
      formaMa.append("file", fayl);
      return request.patch("/teacher/upload-image", formaMa, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      sorovClient.invalidateQueries({ queryKey: ["teacher_profile"] });
    },
  });
};

