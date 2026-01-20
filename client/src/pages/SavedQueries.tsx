import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { SavedQuery, InsertSavedQuery } from "@shared/schema";
import { insertSavedQuerySchema } from "@shared/schema";
import {
  Plus,
  Trash2,
  Clock,
  FileText,
  AlertCircle,
  CheckCircle,
  Code,
} from "lucide-react";

const createFormSchema = insertSavedQuerySchema.extend({
  name: z.string().min(1, "Name is required").min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  queryType: z.enum(["metrics", "logs", "traces"]),
  query: z.string().min(1, "Query is required"),
});

type CreateFormValues = z.infer<typeof createFormSchema>;

const queryTypeConfig = {
  metrics: {
    label: "Metrics",
    icon: "📊",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    badge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  logs: {
    label: "Logs",
    icon: "📝",
    color: "bg-green-500/10 text-green-400 border-green-500/30",
    badge: "bg-green-500/20 text-green-400 border-green-500/30",
  },
  traces: {
    label: "Traces",
    icon: "🔀",
    color: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    badge: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
};

export default function SavedQueries() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<CreateFormValues>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      name: "",
      description: "",
      queryType: "metrics",
      query: "{}",
    },
  });

  const { data: savedQueries = [], isLoading } = useQuery<SavedQuery[]>({
    queryKey: ["/api/saved-queries"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateFormValues) => {
      try {
        const queryJson = JSON.parse(data.query);
        const response = await apiRequest("POST", "/api/saved-queries", {
          name: data.name,
          description: data.description,
          queryType: data.queryType,
          query: queryJson,
          isPublic: false,
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to create query");
        }
        return response.json();
      } catch (error) {
        if (error instanceof SyntaxError) {
          throw new Error("Invalid JSON format in query");
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-queries"] });
      setCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Query Saved",
        description: "Your query has been saved successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Save Query",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/saved-queries/${id}`);
      if (!response.ok) {
        throw new Error("Failed to delete query");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-queries"] });
      toast({
        title: "Query Deleted",
        description: "The query has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete query",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: CreateFormValues) => {
    createMutation.mutate(values);
  };

  const handleDeleteClick = (id: number) => {
    if (confirm("Are you sure you want to delete this query?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex bg-background min-h-screen">
        <Sidebar />
        <main className="pl-64 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground animate-pulse">Loading saved queries...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar />

      <main className="pl-64 flex-1 flex flex-col">
        <header className="h-16 border-b border-border bg-card/30 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h1 className="font-semibold text-lg text-white" data-testid="text-page-title">
                Saved Queries
              </h1>
              <p className="text-xs text-muted-foreground">
                Manage and reuse your frequent queries
              </p>
            </div>
          </div>

          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="gap-2"
            data-testid="button-create-query"
          >
            <Plus className="w-4 h-4" />
            New Query
          </Button>
        </header>

        <div className="p-8 space-y-6">
          {savedQueries.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 flex flex-col items-center justify-center text-center">
                <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-1">No Saved Queries</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Create your first saved query to quickly access frequently used queries
                </p>
                <Button
                  onClick={() => setCreateDialogOpen(true)}
                  variant="outline"
                  className="gap-2"
                  data-testid="button-create-first-query"
                >
                  <Plus className="w-4 h-4" />
                  Create Query
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {savedQueries.map((query) => {
                const typeConfig = queryTypeConfig[query.queryType as keyof typeof queryTypeConfig];

                return (
                  <Card
                    key={query.id}
                    className={`border transition-all hover:shadow-lg ${typeConfig.color}`}
                    data-testid={`card-query-${query.id}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-white text-base" data-testid={`text-query-name-${query.id}`}>
                              {query.name}
                            </h3>
                            <Badge variant="outline" className={typeConfig.badge} data-testid={`badge-query-type-${query.id}`}>
                              {typeConfig.label}
                            </Badge>
                          </div>
                          {query.description && (
                            <p className="text-sm text-muted-foreground" data-testid={`text-query-description-${query.id}`}>
                              {query.description}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(query.id)}
                          disabled={deleteMutation.isPending}
                          data-testid={`button-delete-query-${query.id}`}
                        >
                          <Trash2 className="w-4 h-4 text-red-500/70 hover:text-red-500" />
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-3">
                        <div className="bg-black/30 rounded-md p-3 border border-border/50">
                          <code className="text-xs text-muted-foreground font-mono break-all">
                            {JSON.stringify(query.query, null, 2).substring(0, 200)}
                            {JSON.stringify(query.query, null, 2).length > 200 && "..."}
                          </code>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {query.createdAt && new Date(query.createdAt).toLocaleDateString()}
                          </span>
                          {query.isPublic && (
                            <Badge variant="outline" className="text-xs" data-testid={`badge-public-${query.id}`}>
                              Public
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]" data-testid="dialog-create-query">
          <DialogHeader>
            <DialogTitle>Create New Saved Query</DialogTitle>
            <DialogDescription>
              Save a query for quick access later
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Query Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., CPU Usage Last 24h"
                        {...field}
                        data-testid="input-query-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what this query does..."
                        {...field}
                        className="resize-none"
                        data-testid="textarea-query-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="queryType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Query Type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger data-testid="select-query-type">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="metrics">Metrics</SelectItem>
                        <SelectItem value="logs">Logs</SelectItem>
                        <SelectItem value="traces">Traces</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Query JSON</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='{"metric": "system.cpu.usage", ...}'
                        {...field}
                        className="font-mono text-sm resize-none"
                        rows={6}
                        data-testid="textarea-query-json"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-md p-3 flex gap-2">
                <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-300">
                  Enter a valid JSON object for your query configuration
                </p>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateDialogOpen(false)}
                  data-testid="button-cancel-create"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  data-testid="button-save-query"
                >
                  {createMutation.isPending ? "Saving..." : "Save Query"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
