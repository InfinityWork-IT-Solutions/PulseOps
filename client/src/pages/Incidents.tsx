import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertTriangle, 
  Clock, 
  Users, 
  MessageSquare, 
  FileText, 
  CheckCircle2,
  XCircle,
  Play,
  Pause,
  Send,
  Plus,
  Search,
  Filter,
  Bell,
  ChevronRight,
  ExternalLink,
  Zap
} from "lucide-react";
import { SiSlack, SiPagerduty } from "react-icons/si";

interface Incident {
  id: string;
  title: string;
  severity: "critical" | "warning" | "info";
  status: "active" | "investigating" | "mitigating" | "resolved";
  createdAt: Date;
  updatedAt: Date;
  assignees: string[];
  service: string;
  description: string;
  timeline: TimelineEvent[];
}

interface TimelineEvent {
  id: string;
  timestamp: Date;
  type: "status_change" | "comment" | "assignment" | "runbook" | "notification";
  actor: string;
  content: string;
}

interface Runbook {
  id: string;
  title: string;
  description: string;
  steps: string[];
}

const mockIncidents: Incident[] = [
  {
    id: "INC-001",
    title: "High CPU Usage on Production Cluster",
    severity: "critical",
    status: "investigating",
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(Date.now() - 600000),
    assignees: ["JD", "SM"],
    service: "api-gateway",
    description: "CPU usage exceeded 95% threshold across multiple nodes in the production Kubernetes cluster.",
    timeline: [
      { id: "1", timestamp: new Date(Date.now() - 3600000), type: "status_change", actor: "System", content: "Incident created from alert: High CPU Usage" },
      { id: "2", timestamp: new Date(Date.now() - 3500000), type: "notification", actor: "System", content: "Alert sent to #ops-critical Slack channel" },
      { id: "3", timestamp: new Date(Date.now() - 3000000), type: "assignment", actor: "John Doe", content: "Assigned to John Doe and Sarah Miller" },
      { id: "4", timestamp: new Date(Date.now() - 2400000), type: "status_change", actor: "John Doe", content: "Status changed to Investigating" },
      { id: "5", timestamp: new Date(Date.now() - 1800000), type: "comment", actor: "Sarah Miller", content: "Identified memory leak in recommendation service causing high CPU. Preparing rollback." },
      { id: "6", timestamp: new Date(Date.now() - 600000), type: "runbook", actor: "John Doe", content: "Executed runbook: Kubernetes Pod Rollback" },
    ]
  },
  {
    id: "INC-002",
    title: "Database Connection Pool Exhausted",
    severity: "critical",
    status: "mitigating",
    createdAt: new Date(Date.now() - 7200000),
    updatedAt: new Date(Date.now() - 1200000),
    assignees: ["AK"],
    service: "user-service",
    description: "PostgreSQL connection pool reached 100% utilization causing request timeouts.",
    timeline: [
      { id: "1", timestamp: new Date(Date.now() - 7200000), type: "status_change", actor: "System", content: "Incident created from alert: Connection Pool Warning" },
      { id: "2", timestamp: new Date(Date.now() - 6000000), type: "assignment", actor: "Alex Kim", content: "Self-assigned incident" },
      { id: "3", timestamp: new Date(Date.now() - 4800000), type: "status_change", actor: "Alex Kim", content: "Status changed to Mitigating" },
      { id: "4", timestamp: new Date(Date.now() - 1200000), type: "comment", actor: "Alex Kim", content: "Increased connection pool size to 100. Monitoring for improvement." },
    ]
  },
  {
    id: "INC-003",
    title: "Elevated Error Rate on Payment Service",
    severity: "warning",
    status: "active",
    createdAt: new Date(Date.now() - 1800000),
    updatedAt: new Date(Date.now() - 300000),
    assignees: [],
    service: "payment-service",
    description: "Error rate increased to 3.5% from baseline of 0.5%.",
    timeline: [
      { id: "1", timestamp: new Date(Date.now() - 1800000), type: "status_change", actor: "System", content: "Incident created from alert: Error Rate Spike" },
      { id: "2", timestamp: new Date(Date.now() - 1700000), type: "notification", actor: "System", content: "Alert sent to PagerDuty" },
    ]
  },
  {
    id: "INC-004",
    title: "SSL Certificate Expiring Soon",
    severity: "info",
    status: "resolved",
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 43200000),
    assignees: ["MT"],
    service: "infrastructure",
    description: "SSL certificate for api.example.com expires in 7 days.",
    timeline: [
      { id: "1", timestamp: new Date(Date.now() - 86400000), type: "status_change", actor: "System", content: "Incident created from alert: Certificate Expiry Warning" },
      { id: "2", timestamp: new Date(Date.now() - 80000000), type: "assignment", actor: "Mike Taylor", content: "Assigned to Mike Taylor" },
      { id: "3", timestamp: new Date(Date.now() - 50000000), type: "comment", actor: "Mike Taylor", content: "Renewed certificate via Let's Encrypt" },
      { id: "4", timestamp: new Date(Date.now() - 43200000), type: "status_change", actor: "Mike Taylor", content: "Incident resolved" },
    ]
  },
];

const runbooks: Runbook[] = [
  {
    id: "rb-1",
    title: "Kubernetes Pod Rollback",
    description: "Rollback a deployment to the previous version",
    steps: [
      "Identify the deployment name and namespace",
      "Run: kubectl rollout history deployment/<name> -n <namespace>",
      "Run: kubectl rollout undo deployment/<name> -n <namespace>",
      "Verify pods are healthy: kubectl get pods -n <namespace>",
      "Check application logs for errors"
    ]
  },
  {
    id: "rb-2",
    title: "Database Connection Reset",
    description: "Reset database connections and pools",
    steps: [
      "Identify the affected service pods",
      "Gracefully restart pods: kubectl rollout restart deployment/<name>",
      "Monitor connection pool metrics in Grafana",
      "Verify database connectivity from application logs"
    ]
  },
  {
    id: "rb-3",
    title: "Scale Up Service",
    description: "Increase replica count for a service",
    steps: [
      "Identify current replica count: kubectl get deployment/<name>",
      "Scale up: kubectl scale deployment/<name> --replicas=<count>",
      "Monitor pod creation: kubectl get pods -w",
      "Verify load balancing is working correctly"
    ]
  },
];

const teamMembers = [
  { initials: "JD", name: "John Doe", role: "SRE Lead" },
  { initials: "SM", name: "Sarah Miller", role: "Platform Engineer" },
  { initials: "AK", name: "Alex Kim", role: "DevOps Engineer" },
  { initials: "MT", name: "Mike Taylor", role: "Infrastructure Engineer" },
];

export default function Incidents() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [newComment, setNewComment] = useState("");
  const [runbookDialogOpen, setRunbookDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredIncidents = mockIncidents.filter((incident) => {
    const matchesSearch = incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         incident.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || 
                      (activeTab === "active" && incident.status !== "resolved") ||
                      (activeTab === "resolved" && incident.status === "resolved");
    return matchesSearch && matchesTab;
  });

  const activeCount = mockIncidents.filter(i => i.status !== "resolved").length;
  const criticalCount = mockIncidents.filter(i => i.severity === "critical" && i.status !== "resolved").length;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-500/10 text-red-500 border-red-500/30";
      case "warning": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/30";
      case "info": return "bg-blue-500/10 text-blue-500 border-blue-500/30";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/30";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-red-500";
      case "investigating": return "bg-yellow-500";
      case "mitigating": return "bg-blue-500";
      case "resolved": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case "status_change": return <Zap className="w-4 h-4" />;
      case "comment": return <MessageSquare className="w-4 h-4" />;
      case "assignment": return <Users className="w-4 h-4" />;
      case "runbook": return <FileText className="w-4 h-4" />;
      case "notification": return <Bell className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const handleStatusChange = (status: string) => {
    if (!selectedIncident) return;
    toast({
      title: "Status Updated",
      description: `Incident ${selectedIncident.id} status changed to ${status}`,
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedIncident) return;
    toast({
      title: "Comment Added",
      description: "Your update has been posted to the incident timeline.",
    });
    setNewComment("");
  };

  const handleRunRunbook = (runbook: Runbook) => {
    toast({
      title: "Runbook Executed",
      description: `Started executing: ${runbook.title}`,
    });
    setRunbookDialogOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64">
        <div className="flex h-screen">
          {/* Incidents List */}
          <div className="w-96 border-r border-border/50 flex flex-col">
            <div className="p-4 border-b border-border/50">
              <h1 className="text-xl font-bold text-white mb-4">Incident Command</h1>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <Card className="bg-red-500/10 border-red-500/30">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span className="text-lg font-bold text-red-500">{criticalCount}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Critical</p>
                  </CardContent>
                </Card>
                <Card className="bg-yellow-500/10 border-yellow-500/30">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-500" />
                      <span className="text-lg font-bold text-yellow-500">{activeCount}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Active</p>
                  </CardContent>
                </Card>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search incidents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card/50 border-border/50"
                  data-testid="input-search-incidents"
                />
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full bg-card/50">
                  <TabsTrigger value="all" className="flex-1" data-testid="tab-all-incidents">All</TabsTrigger>
                  <TabsTrigger value="active" className="flex-1" data-testid="tab-active-incidents">Active</TabsTrigger>
                  <TabsTrigger value="resolved" className="flex-1" data-testid="tab-resolved-incidents">Resolved</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Incident List */}
            <div className="flex-1 overflow-y-auto">
              {filteredIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className={`p-4 border-b border-border/30 cursor-pointer hover:bg-white/5 transition-colors ${
                    selectedIncident?.id === incident.id ? "bg-primary/10 border-l-2 border-l-primary" : ""
                  }`}
                  onClick={() => setSelectedIncident(incident)}
                  data-testid={`incident-item-${incident.id}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className={getSeverityColor(incident.severity)}>
                      {incident.severity}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{formatTime(incident.createdAt)}</span>
                  </div>
                  <h3 className="font-medium text-white text-sm mb-1 line-clamp-2">{incident.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{incident.service}</span>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(incident.status)}`} />
                      <span className="text-xs text-muted-foreground capitalize">{incident.status}</span>
                    </div>
                  </div>
                  {incident.assignees.length > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      {incident.assignees.map((assignee) => (
                        <Avatar key={assignee} className="w-5 h-5">
                          <AvatarFallback className="text-[10px] bg-primary/20">{assignee}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Incident Detail */}
          <div className="flex-1 flex flex-col">
            {selectedIncident ? (
              <>
                {/* Header */}
                <div className="p-6 border-b border-border/50">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={getSeverityColor(selectedIncident.severity)}>
                          {selectedIncident.severity}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{selectedIncident.id}</span>
                      </div>
                      <h2 className="text-xl font-semibold text-white">{selectedIncident.title}</h2>
                      <p className="text-sm text-muted-foreground mt-1">{selectedIncident.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select onValueChange={handleStatusChange} defaultValue={selectedIncident.status}>
                        <SelectTrigger className="w-40" data-testid="select-status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="investigating">Investigating</SelectItem>
                          <SelectItem value="mitigating">Mitigating</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setAssignDialogOpen(true)} data-testid="button-assign">
                      <Users className="w-4 h-4 mr-2" />
                      Assign
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setRunbookDialogOpen(true)} data-testid="button-runbook">
                      <FileText className="w-4 h-4 mr-2" />
                      Runbook
                    </Button>
                    <Button variant="outline" size="sm" data-testid="button-notify-slack">
                      <SiSlack className="w-4 h-4 mr-2" />
                      Notify Slack
                    </Button>
                    <Button variant="outline" size="sm" data-testid="button-page-oncall">
                      <SiPagerduty className="w-4 h-4 mr-2" />
                      Page On-Call
                    </Button>
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex-1 overflow-y-auto p-6">
                  <h3 className="text-sm font-semibold text-white mb-4">Timeline</h3>
                  <div className="space-y-4">
                    {selectedIncident.timeline.map((event, index) => (
                      <div key={event.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-muted-foreground">
                            {getTimelineIcon(event.type)}
                          </div>
                          {index < selectedIncident.timeline.length - 1 && (
                            <div className="w-px h-full bg-border/50 my-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-white">{event.actor}</span>
                            <span className="text-xs text-muted-foreground">{formatTime(event.timestamp)}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{event.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comment Input */}
                <div className="p-4 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <Textarea
                      placeholder="Add an update..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 min-h-[40px] max-h-[120px] bg-card/50 border-border/50"
                      data-testid="input-comment"
                    />
                    <Button onClick={handleAddComment} disabled={!newComment.trim()} data-testid="button-send-comment">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Select an Incident</h3>
                  <p className="text-sm text-muted-foreground">Choose an incident from the list to view details and take action.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Runbook Dialog */}
      <Dialog open={runbookDialogOpen} onOpenChange={setRunbookDialogOpen}>
        <DialogContent className="bg-card border-border/50 max-w-lg">
          <DialogHeader>
            <DialogTitle>Execute Runbook</DialogTitle>
            <DialogDescription>Select a runbook to execute for this incident.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {runbooks.map((runbook) => (
              <Card
                key={runbook.id}
                className="bg-white/5 border-border/30 cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => handleRunRunbook(runbook)}
                data-testid={`runbook-${runbook.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-white">{runbook.title}</h4>
                      <p className="text-sm text-muted-foreground">{runbook.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{runbook.steps.length} steps</p>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="bg-card border-border/50">
          <DialogHeader>
            <DialogTitle>Assign Team Members</DialogTitle>
            <DialogDescription>Select team members to assign to this incident.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {teamMembers.map((member) => (
              <div
                key={member.initials}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-border/30 hover:border-primary/50 cursor-pointer transition-colors"
                data-testid={`assign-member-${member.initials}`}
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/20">{member.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-white">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => {
                  toast({ title: "Member Assigned", description: `${member.name} has been assigned to the incident.` });
                  setAssignDialogOpen(false);
                }}>
                  Assign
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
