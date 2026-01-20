import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Slo } from "@shared/schema";

export function useSlos() {
  return useQuery<Slo[]>({
    queryKey: ["/api/slos"],
  });
}

export function useCreateSlo() {
  return useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/slos", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/slos"] });
    },
  });
}

export function useUpdateSlo() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return apiRequest("PUT", `/api/slos/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/slos"] });
    },
  });
}

export function useDeleteSlo() {
  return useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/slos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/slos"] });
    },
  });
}
