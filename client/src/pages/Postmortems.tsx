import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Calendar,
  FileText,
  Users,
  Zap,
  CheckCircle2,
  AlertCircle,
  Clock,
  X,
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";
import type { Postmortem, InsertPostmortem } from "@shared/schema";

type PostmortemWithDetails = Postmortem;

export default function Postmortems() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPostmortem, setSelectedPostmortem] = useState<PostmortemWithDetails | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  interface FormDataState {
    title: string;
    incidentId: string;
    summary: string;
    impact: string;
    rootCause: string;
    status: string;
    aiGenerated: boolean;
    participants: Array<{ name: string; role?: string }>;
    lessonsLearned: string[];
    actionItems: Array<{ title: string; completed: boolean }>;
  }
  
  const [formData, setFormData] = useState<FormDataState>({
    title: "",
    incidentId: "",
    summary: "",
    impact: "",
    rootCause: "",
    status: "draft",
    aiGenerated: false,
    participants: [],
    lessonsLearned: [],
    actionItems: [],
  });
  const [newLesson, setNewLesson] = useState("");
  const [newActionItem, setNewActionItem] = useState("");
  const { toast } = useToast();

  // Fetch postmortems
  const { data: postmortems, isLoading, error } = useQuery({
    queryKey: ["/api/postmortems"],
    queryFn: async () => {
      const res = await fetch("/api/postmortems", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch postmortems");
      return res.json() as Promise<Postmortem[]>;
    },
  });

  // Create postmortem mutation
  const createMutation = useMutation({
    mutationFn: async (data: InsertPostmortem) => {
      const res = await apiRequest("POST", "/api/postmortems", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/postmortems"] });
      toast({
        title: "Success",
        description: "Postmortem created successfully",
      });
      setCreateDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create postmortem",
        variant: "destructive",
      });
    },
  });

  // Update postmortem mutation
  const updateMutation = useMutation({
    mutationFn: async (data: Partial<InsertPostmortem> & { id: number }) => {
      const { id, ...updates } = data;
      const res = await apiRequest("PUT", `/api/postmortems/${id}`, updates);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/postmortems"] });
      toast({
        title: "Success",
        description: "Postmortem updated successfully",
      });
      setDetailsDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update postmortem",
        variant: "destructive",
      });
    },
  });

  const filteredPostmortems = (postmortems || []).filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.incidentId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (status: string | null | undefined): string => {
    switch (status) {
      case "draft":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      case "review":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "published":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusIcon = (status: string | null | undefined) => {
    switch (status) {
      case "draft":
        return <AlertCircle className="w-3.5 h-3.5" />;
      case "review":
        return <Clock className="w-3.5 h-3.5" />;
      case "published":
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };
  
  const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return "Unknown date";
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "Unknown date";
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      incidentId: "",
      summary: "",
      impact: "",
      rootCause: "",
      status: "draft",
      aiGenerated: false,
      participants: [],
      lessonsLearned: [],
      actionItems: [],
    });
    setNewLesson("");
    setNewActionItem("");
  };

  const handleCreatePostmortem = () => {
    if (!formData.title || !formData.incidentId) {
      toast({
        title: "Error",
        description: "Title and Incident ID are required",
        variant: "destructive",
      });
      return;
    }
    createMutation.mutate(formData as InsertPostmortem);
  };

  const handleAddLesson = () => {
    if (!newLesson.trim()) return;
    setFormData((prev) => ({
      ...prev,
      lessonsLearned: [...(prev.lessonsLearned || []), newLesson.trim()],
    }));
    setNewLesson("");
  };

  const handleRemoveLesson = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      lessonsLearned: (prev.lessonsLearned || []).filter((_, i) => i !== index),
    }));
  };

  const handleAddActionItem = () => {
    if (!newActionItem.trim()) return;
    setFormData((prev) => ({
      ...prev,
      actionItems: [
        ...(prev.actionItems || []),
        { title: newActionItem.trim(), completed: false },
      ],
    }));
    setNewActionItem("");
  };

  const handleRemoveActionItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      actionItems: (prev.actionItems || []).filter((_, i) => i !== index),
    }));
  };

  const handleToggleActionItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      actionItems: (prev.actionItems || []).map((item, i) =>
        i === index ? { ...item, completed: !item.completed } : item
      ),
    }));
  };

  const handleViewDetails = (postmortem: Postmortem) => {
    setSelectedPostmortem(postmortem as PostmortemWithDetails);
    setDetailsDialogOpen(true);
  };

  const handlePublish = async () => {
    if (!selectedPostmortem) return;
    updateMutation.mutate({
      id: selectedPostmortem.id,
      status: "published",
    });
  };

  if (isLoading) {
    return (
      <div className="flex bg-background min-h-screen">
        <Sidebar />
        <main className="pl-64 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground animate-pulse">Loading postmortems...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex bg-background min-h-screen">
        <Sidebar />
        <main className="pl-64 flex-1 flex items-center justify-center">
          <Card className="bg-red-500/10 border-red-500/30">
            <CardContent className="py-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-1">Failed to load postmortems</h3>
              <p className="text-muted-foreground text-sm">{error instanceof Error ? error.message : "Unknown error"}</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar />

      <main className="pl-64 flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card/30 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-lg text-white" data-testid="text-page-title">
                Postmortems
              </h1>
              <p className="text-xs text-muted-foreground">Incident postmortem reports and analyses</p>
            </div>
          </div>

          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="gap-2"
            data-testid="button-create-postmortem"
          >
            <Plus className="w-4 h-4" />
            Create Postmortem
          </Button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-8">
          {/* Search */}
          <div className="mb-6">
            <Input
              placeholder="Search by title or incident ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
              data-testid="input-search-postmortems"
            />
          </div>

          {/* Empty State */}
          {filteredPostmortems.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 flex flex-col items-center justify-center text-center">
                <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-1">No postmortems yet</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  {searchQuery ? "No postmortems match your search" : "Create your first postmortem to get started"}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => setCreateDialogOpen(true)}
                    data-testid="button-create-postmortem-empty"
                  >
                    Create Postmortem
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
              {filteredPostmortems.map((postmortem) => (
                <Card
                  key={postmortem.id}
                  className="hover-elevate cursor-pointer transition-all"
                  onClick={() => handleViewDetails(postmortem)}
                  data-testid={`card-postmortem-${postmortem.id}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-base line-clamp-2" data-testid={`text-postmortem-title-${postmortem.id}`}>
                          {postmortem.title}
                        </CardTitle>
                        <CardDescription className="text-xs mt-1" data-testid={`text-postmortem-incident-${postmortem.id}`}>
                          Incident {postmortem.incidentId}
                        </CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${getStatusColor(postmortem.status)} gap-1.5`}
                        data-testid={`badge-status-${postmortem.id}`}
                      >
                        {getStatusIcon(postmortem.status)}
                        {postmortem.status}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Summary */}
                    {postmortem.summary && (
                      <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-summary-${postmortem.id}`}>
                        {postmortem.summary}
                      </p>
                    )}

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      {postmortem.aiGenerated && (
                        <Badge variant="secondary" className="gap-1.5" data-testid={`badge-ai-generated-${postmortem.id}`}>
                          <Zap className="w-3 h-3" />
                          AI Generated
                        </Badge>
                      )}
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground" data-testid={`text-created-date-${postmortem.id}`}>
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(postmortem.createdAt)}
                      </div>

                      {/* Participants Avatars */}
                      {postmortem.participants && Array.isArray(postmortem.participants) && postmortem.participants.length > 0 && (
                        <div className="flex -space-x-2" data-testid={`avatars-participants-${postmortem.id}`}>
                          {postmortem.participants.slice(0, 3).map((participant, idx) => (
                            <Avatar key={idx} className="w-6 h-6 border border-background">
                              <AvatarFallback className="text-xs">
                                {typeof participant === "string"
                                  ? participant.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
                                  : (participant as any).name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "?"}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {postmortem.participants.length > 3 && (
                            <Avatar className="w-6 h-6 border border-background bg-muted flex items-center justify-center">
                              <span className="text-xs">+{postmortem.participants.length - 3}</span>
                            </Avatar>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-postmortem-details">
          {selectedPostmortem && (
            <>
              <DialogHeader>
                <DialogTitle data-testid="text-details-title">{selectedPostmortem.title}</DialogTitle>
                <DialogDescription>
                  Incident {selectedPostmortem.incidentId}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Status */}
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wide">Status</Label>
                  <Badge
                    className={`mt-2 ${getStatusColor(selectedPostmortem.status)} gap-1.5`}
                    data-testid="badge-details-status"
                  >
                    {getStatusIcon(selectedPostmortem.status)}
                    {selectedPostmortem.status}
                  </Badge>
                </div>

                {/* Summary */}
                {selectedPostmortem.summary && (
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Summary</Label>
                    <p className="mt-2 text-sm" data-testid="text-details-summary">
                      {selectedPostmortem.summary}
                    </p>
                  </div>
                )}

                {/* Impact */}
                {selectedPostmortem.impact && (
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Impact</Label>
                    <p className="mt-2 text-sm" data-testid="text-details-impact">
                      {selectedPostmortem.impact}
                    </p>
                  </div>
                )}

                {/* Root Cause */}
                {selectedPostmortem.rootCause && (
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Root Cause</Label>
                    <p className="mt-2 text-sm" data-testid="text-details-root-cause">
                      {selectedPostmortem.rootCause}
                    </p>
                  </div>
                )}

                {/* Lessons Learned */}
                {selectedPostmortem.lessonsLearned && Array.isArray(selectedPostmortem.lessonsLearned) && selectedPostmortem.lessonsLearned.length > 0 && (
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Lessons Learned</Label>
                    <ul className="mt-2 space-y-2">
                      {selectedPostmortem.lessonsLearned.map((lesson, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm"
                          data-testid={`item-lesson-${idx}`}
                        >
                          <span className="text-primary mt-1">•</span>
                          <span>{lesson}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Items */}
                {selectedPostmortem.actionItems && Array.isArray(selectedPostmortem.actionItems) && selectedPostmortem.actionItems.length > 0 && (
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Action Items</Label>
                    <ul className="mt-2 space-y-2">
                      {selectedPostmortem.actionItems.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-sm"
                          data-testid={`item-action-${idx}`}
                        >
                          <Checkbox
                            checked={(item as any).completed || false}
                            disabled
                          />
                          <span className={(item as any).completed ? "line-through text-muted-foreground" : ""}>
                            {typeof item === "string" ? item : (item as any).title}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Timeline */}
                {selectedPostmortem.timeline && Array.isArray(selectedPostmortem.timeline) && selectedPostmortem.timeline.length > 0 && (
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Timeline Events</Label>
                    <div className="mt-2 space-y-3">
                      {selectedPostmortem.timeline.map((event, idx) => (
                        <div
                          key={idx}
                          className="flex gap-3 text-sm border-l border-border/50 pl-3"
                          data-testid={`item-timeline-${idx}`}
                        >
                          <span className="text-xs text-muted-foreground min-w-fit">
                            {new Date(event.timestamp || event.time).toLocaleTimeString()}
                          </span>
                          <p>{event.description || event.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Generated Badge */}
                {selectedPostmortem.aiGenerated && (
                  <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-primary">Generated with AI assistance</span>
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2">
                {selectedPostmortem.status !== "published" && (
                  <Button
                    onClick={handlePublish}
                    disabled={updateMutation.isPending}
                    data-testid="button-publish-postmortem"
                  >
                    {updateMutation.isPending ? "Publishing..." : "Publish"}
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setDetailsDialogOpen(false)}
                  data-testid="button-close-details"
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-create-postmortem">
          <DialogHeader>
            <DialogTitle>Create Postmortem</DialogTitle>
            <DialogDescription>
              Create a new incident postmortem report
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Postmortem title"
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                data-testid="input-title"
              />
            </div>

            {/* Incident ID */}
            <div className="space-y-2">
              <Label htmlFor="incidentId">Incident ID *</Label>
              <Input
                id="incidentId"
                placeholder="e.g., INC-001"
                value={formData.incidentId || ""}
                onChange={(e) => setFormData({ ...formData, incidentId: e.target.value })}
                data-testid="input-incident-id"
              />
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea
                id="summary"
                placeholder="Brief summary of the incident"
                value={formData.summary || ""}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="resize-none h-20"
                data-testid="textarea-summary"
              />
            </div>

            {/* Impact */}
            <div className="space-y-2">
              <Label htmlFor="impact">Impact</Label>
              <Textarea
                id="impact"
                placeholder="Describe the impact of the incident"
                value={formData.impact || ""}
                onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                className="resize-none h-20"
                data-testid="textarea-impact"
              />
            </div>

            {/* Root Cause */}
            <div className="space-y-2">
              <Label htmlFor="rootCause">Root Cause</Label>
              <Textarea
                id="rootCause"
                placeholder="Root cause analysis"
                value={formData.rootCause || ""}
                onChange={(e) => setFormData({ ...formData, rootCause: e.target.value })}
                className="resize-none h-20"
                data-testid="textarea-root-cause"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status || "draft"} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger id="status" data-testid="select-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="review">Under Review</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Lessons Learned */}
            <div className="space-y-3">
              <Label>Lessons Learned</Label>
              <div className="space-y-2">
                {formData.lessonsLearned?.map((lesson, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2 p-2 bg-muted rounded" data-testid={`item-lesson-form-${idx}`}>
                    <span className="text-sm">{lesson}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveLesson(idx)}
                      data-testid={`button-remove-lesson-${idx}`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a lesson learned"
                  value={newLesson}
                  onChange={(e) => setNewLesson(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddLesson()}
                  data-testid="input-lesson"
                />
                <Button
                  variant="outline"
                  onClick={handleAddLesson}
                  size="sm"
                  data-testid="button-add-lesson"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Action Items */}
            <div className="space-y-3">
              <Label>Action Items</Label>
              <div className="space-y-2">
                {formData.actionItems?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2 p-2 bg-muted rounded" data-testid={`item-action-form-${idx}`}>
                    <div className="flex items-center gap-2 flex-1">
                      <Checkbox
                        checked={(item as any).completed || false}
                        onCheckedChange={() => handleToggleActionItem(idx)}
                      />
                      <span className={(item as any).completed ? "line-through text-muted-foreground text-sm" : "text-sm"}>
                        {(item as any).title}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveActionItem(idx)}
                      data-testid={`button-remove-action-${idx}`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add an action item"
                  value={newActionItem}
                  onChange={(e) => setNewActionItem(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddActionItem()}
                  data-testid="input-action-item"
                />
                <Button
                  variant="outline"
                  onClick={handleAddActionItem}
                  size="sm"
                  data-testid="button-add-action"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* AI Generated */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="aiGenerated"
                checked={formData.aiGenerated || false}
                onChange={(e) => setFormData({ ...formData, aiGenerated: e.target.checked })}
                data-testid="checkbox-ai-generated"
              />
              <Label htmlFor="aiGenerated" className="cursor-pointer">
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  AI Generated
                </span>
              </Label>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setCreateDialogOpen(false);
                resetForm();
              }}
              data-testid="button-cancel-create"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreatePostmortem}
              disabled={createMutation.isPending}
              data-testid="button-submit-create"
            >
              {createMutation.isPending ? "Creating..." : "Create Postmortem"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
