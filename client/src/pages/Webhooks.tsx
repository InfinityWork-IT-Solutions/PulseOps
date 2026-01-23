import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Webhook, 
  Plus, 
  Trash2, 
  PlayCircle, 
  CheckCircle2, 
  XCircle, 
  Clock,
  AlertTriangle,
  MessageSquare,
  Bell
} from "lucide-react";
import { SiSlack, SiDiscord } from "react-icons/si";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Webhook as WebhookType, NotificationChannel } from "@shared/schema";

const WEBHOOK_TYPES = [
  { value: "slack", label: "Slack", icon: SiSlack },
  { value: "discord", label: "Discord", icon: SiDiscord },
  { value: "pagerduty", label: "PagerDuty", icon: Bell },
  { value: "teams", label: "Microsoft Teams", icon: MessageSquare },
  { value: "generic", label: "Generic Webhook", icon: Webhook },
];

const EVENT_TYPES = [
  { value: "alert.created", label: "Alert Created" },
  { value: "alert.resolved", label: "Alert Resolved" },
  { value: "alert.acknowledged", label: "Alert Acknowledged" },
  { value: "incident.created", label: "Incident Created" },
  { value: "incident.resolved", label: "Incident Resolved" },
  { value: "slo.breach", label: "SLO Breach" },
];

export default function Webhooks() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [newWebhook, setNewWebhook] = useState({
    name: "",
    url: "",
    type: "slack",
    events: [] as string[],
    isActive: true,
  });

  const { data: webhooks = [], isLoading } = useQuery<WebhookType[]>({
    queryKey: ["/api/webhooks"],
  });

  const { data: channels = [] } = useQuery<NotificationChannel[]>({
    queryKey: ["/api/notification-channels"],
  });

  const createWebhookMutation = useMutation({
    mutationFn: async (webhook: typeof newWebhook) => {
      return apiRequest("POST", "/api/webhooks", { ...webhook, events: selectedEvents });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/webhooks"] });
      setIsCreateOpen(false);
      setNewWebhook({ name: "", url: "", type: "slack", events: [], isActive: true });
      setSelectedEvents([]);
    },
  });

  const toggleWebhookMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      return apiRequest("PUT", `/api/webhooks/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/webhooks"] });
    },
  });

  const deleteWebhookMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/webhooks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/webhooks"] });
    },
  });

  const testWebhookMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("POST", `/api/webhooks/${id}/test`);
    },
  });

  const getTypeIcon = (type: string) => {
    const webhookType = WEBHOOK_TYPES.find(t => t.value === type);
    if (webhookType) {
      const Icon = webhookType.icon;
      return <Icon className="h-4 w-4" />;
    }
    return <Webhook className="h-4 w-4" />;
  };

  const toggleEvent = (event: string) => {
    setSelectedEvents(prev => 
      prev.includes(event) 
        ? prev.filter(e => e !== event)
        : [...prev, event]
    );
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Never";
    return new Date(date).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-muted-foreground">Loading webhooks...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Webhook className="h-6 w-6 text-primary" />
            Webhooks & Integrations
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure webhooks for Slack, Discord, PagerDuty, and more
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-webhook">
              <Plus className="h-4 w-4 mr-2" />
              Add Webhook
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Webhook</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  data-testid="input-webhook-name"
                  value={newWebhook.name}
                  onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                  placeholder="Production Alerts"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={newWebhook.type}
                  onValueChange={(value) => setNewWebhook({ ...newWebhook, type: value })}
                >
                  <SelectTrigger data-testid="select-webhook-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {WEBHOOK_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">Webhook URL</Label>
                <Input
                  id="url"
                  data-testid="input-webhook-url"
                  value={newWebhook.url}
                  onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                  placeholder="https://hooks.slack.com/services/..."
                />
              </div>
              <div className="space-y-2">
                <Label>Events to Subscribe</Label>
                <div className="grid grid-cols-2 gap-2">
                  {EVENT_TYPES.map((event) => (
                    <div 
                      key={event.value}
                      className={`p-2 rounded-md border cursor-pointer transition-colors ${
                        selectedEvents.includes(event.value) 
                          ? "border-primary bg-primary/10" 
                          : "hover:border-muted-foreground"
                      }`}
                      onClick={() => toggleEvent(event.value)}
                      data-testid={`checkbox-event-${event.value}`}
                    >
                      <span className="text-sm">{event.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Button 
                className="w-full"
                data-testid="button-submit-webhook"
                onClick={() => createWebhookMutation.mutate(newWebhook)}
                disabled={!newWebhook.name || !newWebhook.url || selectedEvents.length === 0}
              >
                Create Webhook
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="webhooks">
        <TabsList>
          <TabsTrigger value="webhooks" data-testid="tab-webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="channels" data-testid="tab-channels">Notification Channels</TabsTrigger>
        </TabsList>

        <TabsContent value="webhooks" className="mt-6">
          {webhooks.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Webhook className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="font-semibold text-lg mb-2">No Webhooks Configured</h3>
                <p className="text-muted-foreground mb-4">
                  Connect PulseOps to Slack, Discord, PagerDuty, or any webhook endpoint
                </p>
                <Button onClick={() => setIsCreateOpen(true)} data-testid="button-create-first-webhook">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Webhook
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {webhooks.map((webhook) => (
                <Card key={webhook.id} data-testid={`card-webhook-${webhook.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          {getTypeIcon(webhook.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{webhook.name}</h3>
                            <Badge variant={webhook.isActive ? "default" : "secondary"}>
                              {webhook.isActive ? "Active" : "Inactive"}
                            </Badge>
                            {(webhook.failureCount ?? 0) > 0 && (
                              <Badge variant="destructive">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                {webhook.failureCount} failures
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground font-mono">
                            {webhook.url.substring(0, 50)}...
                          </p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Last triggered: {formatDate(webhook.lastTriggeredAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={webhook.isActive ?? false}
                          onCheckedChange={(checked) => 
                            toggleWebhookMutation.mutate({ id: webhook.id, isActive: checked })
                          }
                          data-testid={`switch-webhook-${webhook.id}`}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => testWebhookMutation.mutate(webhook.id)}
                          disabled={testWebhookMutation.isPending}
                          data-testid={`button-test-webhook-${webhook.id}`}
                        >
                          <PlayCircle className="h-4 w-4 mr-1" />
                          Test
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteWebhookMutation.mutate(webhook.id)}
                          data-testid={`button-delete-webhook-${webhook.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {Array.isArray(webhook.events) && (webhook.events as string[]).map((event) => (
                        <Badge key={event} variant="outline" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="channels" className="mt-6">
          {channels.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="font-semibold text-lg mb-2">No Notification Channels</h3>
                <p className="text-muted-foreground">
                  Configure notification channels for alerting
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {channels.map((channel) => (
                <Card key={channel.id} data-testid={`card-channel-${channel.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 text-primary" />
                        <div>
                          <h3 className="font-medium">{channel.name}</h3>
                          <p className="text-sm text-muted-foreground">{channel.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {channel.isDefault && (
                          <Badge variant="secondary">Default</Badge>
                        )}
                        <Badge variant={channel.isActive ? "default" : "outline"}>
                          {channel.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
