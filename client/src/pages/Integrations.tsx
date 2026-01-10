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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Integration } from "@shared/schema";
import { 
  Search, 
  Check, 
  Plus, 
  ExternalLink, 
  Cloud, 
  Container, 
  GitBranch, 
  Activity, 
  Database, 
  Bell,
  Zap,
  Settings,
  RefreshCw,
  CloudCog,
  Users,
  AlertCircle
} from "lucide-react";
import { 
  SiAmazonwebservices, 
  SiGooglecloud, 
  SiKubernetes, 
  SiDocker, 
  SiPrometheus, 
  SiGrafana, 
  SiDatadog, 
  SiGithubactions, 
  SiGitlab,
  SiTerraform,
  SiSlack,
  SiPagerduty,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiElasticsearch
} from "react-icons/si";

interface IntegrationDefinition {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  popular?: boolean;
  docsUrl?: string;
}

const integrationDefinitions: IntegrationDefinition[] = [
  { id: "aws", name: "Amazon Web Services", description: "CloudWatch metrics, EC2, Lambda, S3, and more", icon: SiAmazonwebservices, category: "cloud", popular: true },
  { id: "gcp", name: "Google Cloud Platform", description: "Cloud Monitoring, GKE, Cloud Functions", icon: SiGooglecloud, category: "cloud", popular: true },
  { id: "azure", name: "Microsoft Azure", description: "Azure Monitor, AKS, Functions, and services", icon: CloudCog, category: "cloud" },
  { id: "kubernetes", name: "Kubernetes", description: "Monitor pods, deployments, services, and cluster health", icon: SiKubernetes, category: "container", popular: true },
  { id: "docker", name: "Docker", description: "Container metrics, logs, and resource usage", icon: SiDocker, category: "container" },
  { id: "github-actions", name: "GitHub Actions", description: "Workflow runs, deployment status, and build metrics", icon: SiGithubactions, category: "cicd", popular: true },
  { id: "gitlab-ci", name: "GitLab CI/CD", description: "Pipeline monitoring and deployment tracking", icon: SiGitlab, category: "cicd" },
  { id: "terraform", name: "Terraform Cloud", description: "Infrastructure changes and drift detection", icon: SiTerraform, category: "cicd" },
  { id: "prometheus", name: "Prometheus", description: "Import Prometheus metrics and alerting rules", icon: SiPrometheus, category: "monitoring", popular: true },
  { id: "grafana", name: "Grafana", description: "Import existing Grafana dashboards", icon: SiGrafana, category: "monitoring" },
  { id: "datadog", name: "Datadog", description: "Migrate metrics and monitors from Datadog", icon: SiDatadog, category: "monitoring" },
  { id: "postgresql", name: "PostgreSQL", description: "Query performance, connections, and replication", icon: SiPostgresql, category: "database" },
  { id: "mongodb", name: "MongoDB", description: "Cluster metrics, query analytics, and operations", icon: SiMongodb, category: "database" },
  { id: "redis", name: "Redis", description: "Memory usage, hit rates, and key statistics", icon: SiRedis, category: "database" },
  { id: "elasticsearch", name: "Elasticsearch", description: "Cluster health, indexing rate, and search latency", icon: SiElasticsearch, category: "database" },
  { id: "slack", name: "Slack", description: "Alert notifications and incident updates", icon: SiSlack, category: "notifications", popular: true },
  { id: "teams", name: "Microsoft Teams", description: "Team notifications and incident channels", icon: Users, category: "notifications" },
  { id: "pagerduty", name: "PagerDuty", description: "On-call scheduling and incident escalation", icon: SiPagerduty, category: "notifications" },
];

const categories = [
  { id: "all", name: "All", icon: Zap },
  { id: "cloud", name: "Cloud", icon: Cloud },
  { id: "container", name: "Containers", icon: Container },
  { id: "cicd", name: "CI/CD", icon: GitBranch },
  { id: "monitoring", name: "Monitoring", icon: Activity },
  { id: "database", name: "Databases", icon: Database },
  { id: "notifications", name: "Notifications", icon: Bell },
];

const connectFormSchema = z.object({
  apiKey: z.string()
    .min(20, "API key must be at least 20 characters")
    .regex(/^[A-Za-z0-9+/_=-]+$/, "API key contains invalid characters"),
});

type ConnectFormValues = z.infer<typeof connectFormSchema>;

export default function Integrations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationDefinition | null>(null);
  const { toast } = useToast();

  const form = useForm<ConnectFormValues>({
    resolver: zodResolver(connectFormSchema),
    defaultValues: {
      apiKey: "",
    },
  });

  const { data: connectedIntegrations = [], isLoading } = useQuery<Integration[]>({
    queryKey: ["/api/integrations"],
  });

  const connectedServiceIds = new Set(connectedIntegrations.map(i => i.serviceId));

  const connectMutation = useMutation({
    mutationFn: async (data: { serviceId: string; serviceName: string; category: string; apiKey: string }) => {
      const response = await apiRequest("POST", "/api/integrations/connect", data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to connect integration");
      }
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations"] });
      setConfigDialogOpen(false);
      setConnectingId(null);
      form.reset();
      toast({
        title: "Integration Connected",
        description: `${variables.serviceName} is now connected and sending data to PulseOps.`,
      });
    },
    onError: (error: Error) => {
      setConnectingId(null);
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async (serviceId: string) => {
      const response = await apiRequest("DELETE", `/api/integrations/${serviceId}`);
      if (!response.ok) {
        throw new Error("Failed to disconnect integration");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations"] });
      toast({
        title: "Integration Disconnected",
        description: "The integration has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to disconnect integration",
        variant: "destructive",
      });
    },
  });

  const filteredIntegrations = integrationDefinitions.filter((integration) => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || integration.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleConnect = (integration: IntegrationDefinition) => {
    setSelectedIntegration(integration);
    form.reset();
    setConfigDialogOpen(true);
  };

  const onSubmit = (values: ConnectFormValues) => {
    if (!selectedIntegration) return;
    
    setConnectingId(selectedIntegration.id);
    connectMutation.mutate({
      serviceId: selectedIntegration.id,
      serviceName: selectedIntegration.name,
      category: selectedIntegration.category,
      apiKey: values.apiKey,
    });
  };

  const handleDisconnect = (serviceId: string) => {
    disconnectMutation.mutate(serviceId);
  };

  const connectedCount = connectedIntegrations.length;
  const popularIntegrations = integrationDefinitions.filter(i => i.popular);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Integrations</h1>
              <p className="text-muted-foreground">
                Connect your infrastructure and tools with a valid API key
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="px-3 py-1">
                <Check className="w-3 h-3 mr-1.5 text-green-500" />
                {connectedCount} Connected
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{integrationDefinitions.length}</p>
                    <p className="text-xs text-muted-foreground">Available</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{connectedCount}</p>
                    <p className="text-xs text-muted-foreground">Connected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{connectedCount > 0 ? "Active" : "—"}</p>
                    <p className="text-xs text-muted-foreground">Data Flow</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">Real-time</p>
                    <p className="text-xs text-muted-foreground">Sync Status</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {activeCategory === "all" && searchQuery === "" && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-white mb-4">Popular Integrations</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {popularIntegrations.map((integration) => {
                  const isConnected = connectedServiceIds.has(integration.id);
                  const isConnecting = connectingId === integration.id;
                  const Icon = integration.icon;
                  
                  return (
                    <Card 
                      key={integration.id}
                      className={`bg-card/50 border-border/50 hover:border-primary/50 transition-all cursor-pointer group ${isConnected ? 'border-green-500/50 bg-green-500/5' : ''}`}
                      onClick={() => !isConnected && !isConnecting && handleConnect(integration)}
                      data-testid={`integration-quick-${integration.id}`}
                    >
                      <CardContent className="p-4 flex flex-col items-center text-center">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 transition-colors ${isConnected ? 'bg-green-500/20' : 'bg-white/5 group-hover:bg-primary/10'}`}>
                          <Icon className={`w-6 h-6 ${isConnected ? 'text-green-500' : 'text-white'}`} />
                        </div>
                        <p className="text-sm font-medium text-white truncate w-full">{integration.name}</p>
                        {isConnected && (
                          <Badge variant="outline" className="mt-2 text-green-500 border-green-500/30">
                            <Check className="w-3 h-3 mr-1" />
                            Connected
                          </Badge>
                        )}
                        {isConnecting && (
                          <Badge variant="outline" className="mt-2 text-primary border-primary/30">
                            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                            Connecting
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card/50 border-border/50"
                data-testid="input-search-integrations"
              />
            </div>
          </div>

          <Tabs value={activeCategory} onValueChange={(val) => { setActiveCategory(val); setSearchQuery(""); }} className="mb-6">
            <TabsList className="bg-card/50 border border-border/50 p-1">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    data-testid={`tab-category-${category.id}`}
                  >
                    <Icon className="w-4 h-4" />
                    {category.name}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="bg-card/50 border-border/50 animate-pulse">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/5" />
                      <div className="h-4 w-32 bg-white/5 rounded" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-3 w-full bg-white/5 rounded mb-4" />
                    <div className="h-8 w-full bg-white/5 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIntegrations.map((integration) => {
                const isConnected = connectedServiceIds.has(integration.id);
                const isConnecting = connectingId === integration.id;
                const Icon = integration.icon;

                return (
                  <Card 
                    key={integration.id} 
                    className={`bg-card/50 border-border/50 hover:border-primary/30 transition-all ${isConnected ? 'border-green-500/50' : ''}`}
                    data-testid={`integration-card-${integration.id}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isConnected ? 'bg-green-500/20' : 'bg-white/5'}`}>
                            <Icon className={`w-5 h-5 ${isConnected ? 'text-green-500' : 'text-white'}`} />
                          </div>
                          <div>
                            <CardTitle className="text-base text-white">{integration.name}</CardTitle>
                            {isConnected && (
                              <Badge variant="outline" className="mt-1 text-xs text-green-500 border-green-500/30">
                                <Check className="w-3 h-3 mr-1" />
                                Connected
                              </Badge>
                            )}
                          </div>
                        </div>
                        {integration.popular && !isConnected && (
                          <Badge variant="secondary" className="text-xs">Popular</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">{integration.description}</CardDescription>
                      <div className="flex items-center gap-2">
                        {isConnected ? (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              data-testid={`button-configure-${integration.id}`}
                            >
                              <Settings className="w-4 h-4 mr-2" />
                              Configure
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDisconnect(integration.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              data-testid={`button-disconnect-${integration.id}`}
                            >
                              Disconnect
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleConnect(integration)}
                              disabled={isConnecting}
                              data-testid={`button-connect-${integration.id}`}
                            >
                              {isConnecting ? (
                                <>
                                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                  Connecting...
                                </>
                              ) : (
                                <>
                                  <Plus className="w-4 h-4 mr-2" />
                                  Connect
                                </>
                              )}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              data-testid={`button-docs-${integration.id}`}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {filteredIntegrations.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No integrations found matching your search.</p>
            </div>
          )}
        </div>
      </main>

      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
        <DialogContent className="bg-card border-border/50" aria-describedby="connect-dialog-description">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedIntegration ? (
                <>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <selectedIntegration.icon className="w-5 h-5 text-primary" />
                  </div>
                  Connect {selectedIntegration.name}
                </>
              ) : (
                "Connect Integration"
              )}
            </DialogTitle>
            <DialogDescription id="connect-dialog-description">
              Enter your API key to connect this integration. Your credentials are validated securely on our servers.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="apiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Key / Access Token</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter your API key (min 20 characters)"
                        className="bg-background/50"
                        data-testid="input-api-key"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      Your API key is validated but never stored in our database.
                    </p>
                  </FormItem>
                )}
              />
              
              {connectMutation.isError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <p className="text-sm">{connectMutation.error?.message || "Invalid API key. Please check and try again."}</p>
                </div>
              )}

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setConfigDialogOpen(false)} 
                  data-testid="button-cancel-connect"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={connectMutation.isPending}
                  data-testid="button-confirm-connect"
                >
                  {connectMutation.isPending ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Connect Integration
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
