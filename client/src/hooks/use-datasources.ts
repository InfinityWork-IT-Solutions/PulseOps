import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type CreateDataSourceRequest } from "@shared/routes";

export function useDataSources() {
  return useQuery({
    queryKey: [api.dataSources.list.path],
    queryFn: async () => {
      const res = await fetch(api.dataSources.list.path);
      if (!res.ok) throw new Error("Failed to fetch data sources");
      return api.dataSources.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateDataSource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateDataSourceRequest) => {
      const res = await fetch(api.dataSources.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create data source");
      return api.dataSources.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.dataSources.list.path] });
    },
  });
}
