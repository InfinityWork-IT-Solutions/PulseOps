import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreatePanelRequest, type UpdatePanelRequest } from "@shared/routes";

export function usePanels(dashboardId: number) {
  return useQuery({
    queryKey: [api.panels.list.path, dashboardId],
    queryFn: async () => {
      const url = buildUrl(api.panels.list.path, { dashboardId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch panels");
      return api.panels.list.responses[200].parse(await res.json());
    },
    enabled: !!dashboardId,
  });
}

export function useCreatePanel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreatePanelRequest) => {
      const res = await fetch(api.panels.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create panel");
      return api.panels.create.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.panels.list.path, data.dashboardId] });
    },
  });
}

export function useUpdatePanel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, dashboardId, ...updates }: { id: number, dashboardId: number } & UpdatePanelRequest) => {
      const url = buildUrl(api.panels.update.path, { id });
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update panel");
      return api.panels.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      // Need dashboardId to invalidate the list query
      // The API returns the updated panel which contains dashboardId
      if (data && data.dashboardId) {
        queryClient.invalidateQueries({ queryKey: [api.panels.list.path, data.dashboardId] });
      }
    },
  });
}

export function useDeletePanel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, dashboardId }: { id: number, dashboardId: number }) => {
      const url = buildUrl(api.panels.delete.path, { id });
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete panel");
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.panels.list.path, variables.dashboardId] });
    },
  });
}
