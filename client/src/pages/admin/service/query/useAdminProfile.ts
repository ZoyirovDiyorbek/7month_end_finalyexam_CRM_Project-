import { useQuery } from "@tanstack/react-query";
import { request } from "@/config/request";

export interface AdminProfileResponse {
  statusCode: number;
  message: {
    uz: string;
    en: string;
    ru: string;
  };
  data: {
    id: string;
    username: string;
    fullName: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    avatarUrl?: string;
  };
}

export const useAdminProfile = (options?: { enabled?: boolean }) => {
  return useQuery<AdminProfileResponse>({
    queryKey: ["admin", "profile"],
    queryFn: async () => {
      const response = await request.get("/admin/me");
      return response.data;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
    enabled: options?.enabled !== false,
  });
};

