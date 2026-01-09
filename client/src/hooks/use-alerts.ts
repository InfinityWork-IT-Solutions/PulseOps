import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Alert } from "@shared/schema";

export function useAlerts() {
  return useQuery<Alert[]>({
    queryKey: ["/api/alerts"],
  });
}

export function useResolveAlert() {
  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      return apiRequest("PATCH", `/api/alerts/${id}`, {
        status: "resolved",
        resolvedAt: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
    },
  });
}
