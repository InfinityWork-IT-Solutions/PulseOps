import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
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
  Users
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

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  connected: boolean;
  popular?: boolean;
  docsUrl?: string;
}

const integrations: Integration[] = [
  // Cloud Providers
  { id: "aws", name: "Amazon Web Services", description: "CloudWatch metrics, EC2, Lambda, S3, and more", icon: SiAmazonwebservices, category: "cloud", connected: false, popular: true },
  { id: "gcp", name: "Google Cloud Platform", description: "Cloud Monitoring, GKE, Cloud Functions", icon: SiGooglecloud, category: "cloud", connected: false, popular: true },
  { id: "azure", name: "Microsoft Azure", description: "Azure Monitor, AKS, Functions, and services", icon: CloudCog, category: "cloud", connected: false },
  
  // Container & Orchestration
  { id: "kubernetes", name: "Kubernetes", description: "Monitor pods, deployments, services, and cluster health", icon: SiKubernetes, category: "container", connected: false, popular: true },
  { id: "docker", name: "Docker", description: "Container metrics, logs, and resource usage", icon: SiDocker, category: "container", connected: false },
  
  // CI/CD
  { id: "github-actions", name: "GitHub Actions", description: "Workflow runs, deployment status, and build metrics", icon: SiGithubactions, category: "cicd", connected: false, popular: true },
  { id: "gitlab-ci", name: "GitLab CI/CD", description: "Pipeline monitoring and deployment tracking", icon: SiGitlab, category: "cicd", connected: false },
  { id: "terraform", name: "Terraform Cloud", description: "Infrastructure changes and drift detection", icon: SiTerraform, category: "cicd", connected: false },
  
  // Monitoring
  { id: "prometheus", name: "Prometheus", description: "Import Prometheus metrics and alerting rules", icon: SiPrometheus, category: "monitoring", connected: false, popular: true },
  { id: "grafana", name: "Grafana", description: "Import existing Grafana dashboards", icon: SiGrafana, category: "monitoring", connected: false },
  { id: "datadog", name: "Datadog", description: "Migrate metrics and monitors from Datadog", icon: SiDatadog, category: "monitoring", connected: false },
  
  // Databases
  { id: "postgresql", name: "PostgreSQL", description: "Query performance, connections, and replication", icon: SiPostgresql, category: "database", connected: false },
  { id: "mongodb", name: "MongoDB", description: "Cluster metrics, query analytics, and operations", icon: SiMongodb, category: "database", connected: false },
  { id: "redis", name: "Redis", description: "Memory usage, hit rates, and key statistics", icon: SiRedis, category: "database", connected: false },
  { id: "elasticsearch", name: "Elasticsearch", description: "Cluster health, indexing rate, and search latency", icon: SiElasticsearch, category: "database", connected: false },
  
  // Notifications
  { id: "slack", name: "Slack", description: "Alert notifications and incident updates", icon: SiSlack, category: "notifications", connected: false, popular: true },
  { id: "teams", name: "Microsoft Teams", description: "Team notifications and incident channels", icon: Users, category: "notifications", connected: false },
  { id: "pagerduty", name: "PagerDuty", description: "On-call scheduling and incident escalation", icon: SiPagerduty, category: "notifications", connected: false },
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

export default function Integrations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [connectedIntegrations, setConnectedIntegrations] = useState<Set<string>>(new Set());
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const { toast } = useToast();

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || integration.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleConnect = (integration: Integration) => {
    setSelectedIntegration(integration);
    setConfigDialogOpen(true);
  };

  const handleConfirmConnect = () => {
    if (!selectedIntegration) return;
    
    setConnectingId(selectedIntegration.id);
    setConfigDialogOpen(false);
    
    // Simulate connection
    setTimeout(() => {
      setConnectedIntegrations(prev => {
        const newSet = new Set(Array.from(prev));
        newSet.add(selectedIntegration.id);
        return newSet;
      });
      setConnectingId(null);
      toast({
        title: "Integration Connected",
        description: `${selectedIntegration.name} is now connected and sending data to PulseOps.`,
      });
    }, 2000);
  };

  const handleDisconnect = (integrationId: string) => {
    setConnectedIntegrations(prev => {
      const newSet = new Set(prev);
      newSet.delete(integrationId);
      return newSet;
    });
    toast({
      title: "Integration Disconnected",
      description: "The integration has been removed.",
    });
  };

  const connectedCount = connectedIntegrations.size;
  const popularIntegrations = integrations.filter(i => i.popular);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Integrations</h1>
              <p className="text-muted-foreground">
                Connect your infrastructure and tools in one click
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="px-3 py-1">
                <Check className="w-3 h-3 mr-1.5 text-green-500" />
                {connectedCount} Connected
              </Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{integrations.length}</p>
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

          {/* Popular Integrations */}
          {activeCategory === "all" && searchQuery === "" && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-white mb-4">Popular Integrations</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {popularIntegrations.map((integration) => {
                  const isConnected = connectedIntegrations.has(integration.id);
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

          {/* Search and Filter */}
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

          {/* Category Tabs */}
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
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

          {/* Integrations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIntegrations.map((integration) => {
              const isConnected = connectedIntegrations.has(integration.id);
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

          {filteredIntegrations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No integrations found matching your search.</p>
            </div>
          )}
        </div>
      </main>

      {/* Connection Configuration Dialog */}
      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
        <DialogContent className="bg-card border-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedIntegration && (
                <>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <selectedIntegration.icon className="w-5 h-5 text-primary" />
                  </div>
                  Connect {selectedIntegration.name}
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              Configure your integration settings. PulseOps will automatically discover and import your metrics.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key / Access Token</Label>
              <Input 
                id="api-key" 
                type="password" 
                placeholder="Enter your API key"
                className="bg-background/50"
                data-testid="input-api-key"
              />
              <p className="text-xs text-muted-foreground">
                Your credentials are encrypted and stored securely.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="region">Region / Endpoint (Optional)</Label>
              <Input 
                id="region" 
                placeholder="e.g., us-east-1 or custom endpoint"
                className="bg-background/50"
                data-testid="input-region"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigDialogOpen(false)} data-testid="button-cancel-connect">
              Cancel
            </Button>
            <Button onClick={handleConfirmConnect} data-testid="button-confirm-connect">
              <Zap className="w-4 h-4 mr-2" />
              Connect Integration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
