import { useQuery } from "@tanstack/react-query";
import { request } from "@/config/request";
import type { Specifications } from "../../type";

export const useSpecification = () => {
  return useQuery({
    queryKey: ["specification"],
    queryFn: () =>
      request.get<Specifications>("/specification").then((res) => res.data),
  });
};
