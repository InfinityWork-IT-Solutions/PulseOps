import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Clock, Plus, AlertCircle, CheckCircle, Users, ArrowRight } from "lucide-react";
import type { OnCallSchedule, EscalationPolicy } from "@shared/schema";
import { z } from "zod";

const createScheduleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  rotationType: z.enum(["daily", "weekly", "custom"]),
  timezone: z.string().default("UTC"),
  members: z.string().min(1, "At least one member is required"),
});

const createPolicySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

type CreateScheduleInput = z.infer<typeof createScheduleSchema>;
type CreatePolicyInput = z.infer<typeof createPolicySchema>;

export default function OnCall() {
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [policyDialogOpen, setPolicyDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: schedules, isLoading: schedulesLoading } = useQuery<OnCallSchedule[]>({
    queryKey: ["/api/on-call"],
  });

  const { data: policies, isLoading: policiesLoading } = useQuery<EscalationPolicy[]>({
    queryKey: ["/api/escalation-policies"],
  });

  const createScheduleMutation = useMutation({
    mutationFn: async (data: CreateScheduleInput) => {
      const response = await apiRequest("POST", "/api/on-call", {
        name: data.name,
        description: data.description,
        rotationType: data.rotationType,
        timezone: data.timezone,
        members: data.members.split(",").map((m) => m.trim()),
        startDate: new Date().toISOString(),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/on-call"] });
      setScheduleDialogOpen(false);
      toast({
        title: "Schedule created",
        description: "On-call schedule has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create schedule",
        variant: "destructive",
      });
    },
  });

  const createPolicyMutation = useMutation({
    mutationFn: async (data: CreatePolicyInput) => {
      const response = await apiRequest("POST", "/api/escalation-policies", {
        name: data.name,
        description: data.description,
        rules: [
          {
            level: 1,
            escalateAfter: 15,
            target: "on_call_schedule",
          },
        ],
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/escalation-policies"] });
      setPolicyDialogOpen(false);
      toast({
        title: "Policy created",
        description: "Escalation policy has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create policy",
        variant: "destructive",
      });
    },
  });

  const isLoading = schedulesLoading || policiesLoading;

  if (isLoading) {
    return (
      <div className="flex bg-background min-h-screen">
        <Sidebar />
        <main className="pl-64 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground animate-pulse">Loading on-call data...</p>
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
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-lg text-white" data-testid="text-page-title">
                On-Call Management
              </h1>
              <p className="text-xs text-muted-foreground">Manage schedules and escalation policies</p>
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-auto">
          <Tabs defaultValue="schedules" className="space-y-6">
            <TabsList className="bg-card border border-border" data-testid="tabs-oncall">
              <TabsTrigger value="schedules" className="gap-2" data-testid="tab-schedules">
                <Users className="w-4 h-4" />
                Schedules
              </TabsTrigger>
              <TabsTrigger value="policies" className="gap-2" data-testid="tab-policies">
                <AlertCircle className="w-4 h-4" />
                Escalation Policies
              </TabsTrigger>
            </TabsList>

            {/* Schedules Tab */}
            <TabsContent value="schedules" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  On-Call Schedules
                </h2>
                <CreateScheduleDialog
                  isOpen={scheduleDialogOpen}
                  setIsOpen={setScheduleDialogOpen}
                  onSubmit={(data) => createScheduleMutation.mutate(data)}
                  isPending={createScheduleMutation.isPending}
                />
              </div>

              {schedules && schedules.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-12 flex flex-col items-center justify-center text-center">
                    <Users className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-1">No On-Call Schedules</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Create a schedule to manage on-call assignments
                    </p>
                    <Button
                      onClick={() => setScheduleDialogOpen(true)}
                      data-testid="button-create-first-schedule"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Schedule
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {schedules?.map((schedule) => (
                    <ScheduleCard key={schedule.id} schedule={schedule} />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Escalation Policies Tab */}
            <TabsContent value="policies" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  Escalation Policies
                </h2>
                <CreatePolicyDialog
                  isOpen={policyDialogOpen}
                  setIsOpen={setPolicyDialogOpen}
                  onSubmit={(data) => createPolicyMutation.mutate(data)}
                  isPending={createPolicyMutation.isPending}
                />
              </div>

              {policies && policies.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-12 flex flex-col items-center justify-center text-center">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-1">No Escalation Policies</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Create a policy to define escalation rules
                    </p>
                    <Button
                      onClick={() => setPolicyDialogOpen(true)}
                      data-testid="button-create-first-policy"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Policy
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {policies?.map((policy) => (
                    <PolicyCard key={policy.id} policy={policy} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

function ScheduleCard({ schedule }: { schedule: OnCallSchedule }) {
  const members = Array.isArray(schedule.members) ? schedule.members : [];
  const memberCount = members.length;
  const currentOnCall = schedule.currentOnCall || "Unassigned";

  const rotationTypeConfig = {
    daily: { label: "Daily", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    weekly: { label: "Weekly", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
    custom: { label: "Custom", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  };

  const typeConfig = rotationTypeConfig[schedule.rotationType as keyof typeof rotationTypeConfig] || rotationTypeConfig.custom;

  return (
    <Card className="border border-border hover-elevate transition-all" data-testid={`card-schedule-${schedule.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-base" data-testid={`text-schedule-name-${schedule.id}`}>
              {schedule.name}
            </CardTitle>
            {schedule.description && (
              <CardDescription className="text-xs mt-1">{schedule.description}</CardDescription>
            )}
          </div>
          <Badge variant="outline" className={typeConfig.color} data-testid={`badge-rotation-type-${schedule.id}`}>
            {typeConfig.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Current On-Call</p>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {currentOnCall.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium" data-testid={`text-current-oncall-${schedule.id}`}>
                {currentOnCall}
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Timezone</p>
            <p className="text-sm font-medium" data-testid={`text-timezone-${schedule.id}`}>
              {schedule.timezone || "UTC"}
            </p>
          </div>
        </div>

        <div className="pt-2">
          <p className="text-xs text-muted-foreground mb-2">Team Members ({memberCount})</p>
          <div className="flex gap-1 flex-wrap">
            {members.length > 0 ? (
              members.slice(0, 3).map((member, idx) => (
                <Avatar key={idx} className="h-8 w-8 border border-border">
                  <AvatarFallback className="text-xs bg-primary/20 text-primary">
                    {String(member).charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">No members assigned</span>
            )}
            {memberCount > 3 && (
              <Avatar className="h-8 w-8 border border-border">
                <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                  +{memberCount - 3}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PolicyCard({ policy }: { policy: EscalationPolicy }) {
  const rules = Array.isArray(policy.rules) ? policy.rules : [];

  return (
    <Card className="border border-border hover-elevate transition-all" data-testid={`card-policy-${policy.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-base" data-testid={`text-policy-name-${policy.id}`}>
              {policy.name}
            </CardTitle>
            {policy.description && (
              <CardDescription className="text-xs mt-1">{policy.description}</CardDescription>
            )}
          </div>
          {policy.isDefault && (
            <Badge
              variant="outline"
              className="shrink-0 bg-primary/20 text-primary border-primary/30"
              data-testid={`badge-default-${policy.id}`}
            >
              Default
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <p className="text-xs text-muted-foreground mb-2">Escalation Rules ({rules.length})</p>

          {rules.length === 0 ? (
            <p className="text-xs text-muted-foreground">No escalation rules defined</p>
          ) : (
            <div className="space-y-2">
              {rules.slice(0, 3).map((rule, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-xs p-2 bg-muted/30 rounded border border-border/50"
                  data-testid={`rule-preview-${policy.id}-${idx}`}
                >
                  <span className="font-medium text-primary">L{idx + 1}</span>
                  <span className="text-muted-foreground">
                    {typeof rule === "object" && rule !== null
                      ? `Escalate after ${(rule as any).escalateAfter || "?"} min`
                      : "Custom rule"}
                  </span>
                </div>
              ))}
              {rules.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{rules.length - 3} more rule{rules.length > 4 ? "s" : ""}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function CreateScheduleDialog({
  isOpen,
  setIsOpen,
  onSubmit,
  isPending,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSubmit: (data: CreateScheduleInput) => void;
  isPending: boolean;
}) {
  const form = useForm<CreateScheduleInput>({
    resolver: zodResolver(createScheduleSchema),
    defaultValues: {
      name: "",
      description: "",
      rotationType: "weekly",
      timezone: "UTC",
      members: "",
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
    form.reset();
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-create-schedule">
          <Plus className="w-4 h-4 mr-2" />
          Create Schedule
        </Button>
      </DialogTrigger>
      <DialogContent data-testid="dialog-create-schedule">
        <DialogHeader>
          <DialogTitle>Create On-Call Schedule</DialogTitle>
          <DialogDescription>
            Set up a new on-call schedule with rotation settings and team members
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schedule Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Frontend Team On-Call" {...field} data-testid="input-schedule-name" />
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
                    <Input placeholder="Brief description..." {...field} data-testid="input-schedule-description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rotationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rotation Type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger data-testid="select-rotation-type">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timezone</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger data-testid="select-timezone">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">EST (Eastern)</SelectItem>
                      <SelectItem value="CST">CST (Central)</SelectItem>
                      <SelectItem value="MST">MST (Mountain)</SelectItem>
                      <SelectItem value="PST">PST (Pacific)</SelectItem>
                      <SelectItem value="GMT">GMT</SelectItem>
                      <SelectItem value="CET">CET (Central Europe)</SelectItem>
                      <SelectItem value="IST">IST (India)</SelectItem>
                      <SelectItem value="JST">JST (Japan)</SelectItem>
                      <SelectItem value="AEST">AEST (Australia)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="members"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Members</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john.doe, jane.smith, bob.wilson"
                      {...field}
                      data-testid="input-members"
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground mt-1">Comma-separated list of names</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending} className="w-full" data-testid="button-submit-schedule">
              {isPending ? "Creating..." : "Create Schedule"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function CreatePolicyDialog({
  isOpen,
  setIsOpen,
  onSubmit,
  isPending,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSubmit: (data: CreatePolicyInput) => void;
  isPending: boolean;
}) {
  const form = useForm<CreatePolicyInput>({
    resolver: zodResolver(createPolicySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
    form.reset();
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-create-policy">
          <Plus className="w-4 h-4 mr-2" />
          Create Policy
        </Button>
      </DialogTrigger>
      <DialogContent data-testid="dialog-create-policy">
        <DialogHeader>
          <DialogTitle>Create Escalation Policy</DialogTitle>
          <DialogDescription>
            Define how alerts should escalate through your team
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Policy Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Critical Alert Escalation" {...field} data-testid="input-policy-name" />
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
                    <Input
                      placeholder="What this policy does..."
                      {...field}
                      data-testid="input-policy-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-muted/30 p-3 rounded border border-border/50">
              <p className="text-xs text-muted-foreground">
                <AlertCircle className="w-3 h-3 inline mr-1" />
                Default escalation rule: Escalate after 15 minutes to on-call schedule
              </p>
            </div>

            <Button type="submit" disabled={isPending} className="w-full" data-testid="button-submit-policy">
              {isPending ? "Creating..." : "Create Policy"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
