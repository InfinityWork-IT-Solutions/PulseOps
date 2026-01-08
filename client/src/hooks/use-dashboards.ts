import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreateDashboardRequest, type UpdateDashboardRequest } from "@shared/routes";

export function useDashboards() {
  return useQuery({
    queryKey: [api.dashboards.list.path],
    queryFn: async () => {
      const res = await fetch(api.dashboards.list.path);
      if (!res.ok) throw new Error("Failed to fetch dashboards");
      return api.dashboards.list.responses[200].parse(await res.json());
    },
  });
}

export function useDashboard(id: number) {
  return useQuery({
    queryKey: [api.dashboards.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.dashboards.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch dashboard");
      return api.dashboards.get.responses[200].parse(await res.json());
    },
  });
}

export function useCreateDashboard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateDashboardRequest) => {
      const res = await fetch(api.dashboards.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create dashboard");
      return api.dashboards.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.dashboards.list.path] });
    },
  });
}

export function useUpdateDashboard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & UpdateDashboardRequest) => {
      const url = buildUrl(api.dashboards.update.path, { id });
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update dashboard");
      return api.dashboards.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.dashboards.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.dashboards.get.path, data.id] });
    },
  });
}

export function useDeleteDashboard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.dashboards.delete.path, { id });
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete dashboard");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.dashboards.list.path] });
    },
  });
}
