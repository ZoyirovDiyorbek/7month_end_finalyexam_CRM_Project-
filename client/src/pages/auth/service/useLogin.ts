import { useMutation } from "@tanstack/react-query";
import { request } from "@/config/request";
import { type LoginResponse, type LoginT } from "../types";

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginT) =>
      request
        .post<LoginResponse>("/auth/signin", data, {
          withCredentials: true,
        })
        .then((res) => res.data),
  });
};
