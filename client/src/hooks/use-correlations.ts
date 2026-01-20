import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { SignalCorrelation } from "@shared/schema";

export function useCorrelations() {
  return useQuery<SignalCorrelation[]>({
    queryKey: ["/api/correlations"],
  });
}

export function useUpdateCorrelation() {
  return useMutation({
    mutationFn: async ({ correlationId, data }: { correlationId: string; data: Partial<SignalCorrelation> }) => {
      return apiRequest("PUT", `/api/correlations/${correlationId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/correlations"] });
    },
  });
}
