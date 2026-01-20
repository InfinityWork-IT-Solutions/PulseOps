import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useSlos, useCreateSlo } from "@/hooks/use-slos";
import { AlertTriangle, Plus, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";
import type { Slo } from "@shared/schema";

export default function SLOs() {
  const { data: slos, isLoading } = useSlos();
  const createSlo = useCreateSlo();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    serviceId: "",
    sliType: "availability",
    targetPercentage: 99.0,
    windowDays: 30,
    currentValue: 99.0,
    errorBudgetRemaining: 100,
    status: "healthy",
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Percentage") || name.includes("Value") || name.includes("Days") || name.includes("Budget")
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateSlo = async () => {
    if (!formData.name || !formData.serviceId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const submitData = {
        ...formData,
        targetPercentage: Math.round(formData.targetPercentage * 10),
        currentValue: Math.round(formData.currentValue * 10),
      };
      await createSlo.mutateAsync(submitData);
      toast({
        title: "SLO Created",
        description: `${formData.name} has been created successfully`,
      });
      setIsDialogOpen(false);
      setFormData({
        name: "",
        description: "",
        serviceId: "",
        sliType: "availability",
        targetPercentage: 99.0,
        windowDays: 30,
        currentValue: 99.0,
        errorBudgetRemaining: 100,
        status: "healthy",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create SLO",
        variant: "destructive",
      });
    }
  };

  const getStatusConfig = (status: string | null | undefined) => {
    switch (status) {
      case "healthy":
        return {
          icon: CheckCircle,
          color: "bg-green-500/10 text-green-500 border-green-500/30",
          badge: "bg-green-500/20 text-green-400 border-green-500/30",
        };
      case "at_risk":
        return {
          icon: AlertCircle,
          color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
          badge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        };
      case "breached":
        return {
          icon: AlertTriangle,
          color: "bg-red-500/10 text-red-500 border-red-500/30",
          badge: "bg-red-500/20 text-red-400 border-red-500/30",
        };
      default:
        return {
          icon: TrendingUp,
          color: "bg-blue-500/10 text-blue-500 border-blue-500/30",
          badge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        };
    }
  };

  const getSliTypeLabel = (sliType: string) => {
    const labels: Record<string, string> = {
      availability: "Availability",
      latency: "Latency",
      error_rate: "Error Rate",
      throughput: "Throughput",
    };
    return labels[sliType] || sliType;
  };

  const formatTargetPercentage = (value: number | null | undefined) => {
    if (!value) return "0%";
    return `${(value / 10).toFixed(1)}%`;
  };

  const formatCurrentValue = (value: number | null | undefined) => {
    if (!value) return "0%";
    return `${(value / 10).toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="flex bg-background min-h-screen">
        <Sidebar />
        <main className="pl-64 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground animate-pulse">Loading SLOs...</p>
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
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-lg text-white" data-testid="text-page-title">
                Service Level Objectives
              </h1>
              <p className="text-xs text-muted-foreground">Monitor and manage your SLO targets</p>
            </div>
          </div>

          <Button
            onClick={() => setIsDialogOpen(true)}
            className="gap-2"
            data-testid="button-add-slo"
          >
            <Plus className="w-4 h-4" />
            Add SLO
          </Button>
        </header>

        <div className="p-8 space-y-6">
          {!slos || slos.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 flex flex-col items-center justify-center text-center">
                <TrendingUp className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-1">No SLOs yet</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Create your first Service Level Objective to get started
                </p>
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  variant="outline"
                  data-testid="button-create-first-slo"
                >
                  Create SLO
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {slos.map((slo) => {
                const statusConfig = getStatusConfig(slo.status);
                const StatusIcon = statusConfig.icon;
                const errorBudget = slo.errorBudgetRemaining || 0;
                const consumed = 100 - errorBudget;

                return (
                  <Card
                    key={slo.id}
                    className={`${statusConfig.color} border transition-all hover:shadow-lg`}
                    data-testid={`card-slo-${slo.id}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-base text-white" data-testid={`text-slo-name-${slo.id}`}>
                            {slo.name}
                          </CardTitle>
                          <CardDescription className="text-xs text-muted-foreground mt-1">
                            {slo.description || "No description"}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className={statusConfig.badge} data-testid={`badge-slo-status-${slo.id}`}>
                          {slo.status === "at_risk" ? "At Risk" : slo.status === "breached" ? "Breached" : "Healthy"}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Service</span>
                        <span className="font-mono text-foreground" data-testid={`text-service-id-${slo.id}`}>
                          {slo.serviceId}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Type</span>
                        <Badge variant="secondary" data-testid={`badge-sli-type-${slo.id}`}>
                          {getSliTypeLabel(slo.sliType)}
                        </Badge>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Target</span>
                          <span className="font-semibold text-foreground" data-testid={`text-target-${slo.id}`}>
                            {formatTargetPercentage(slo.targetPercentage)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Current</span>
                          <span className="font-semibold text-foreground" data-testid={`text-current-value-${slo.id}`}>
                            {formatCurrentValue(slo.currentValue)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Error Budget</span>
                          <span className="text-foreground font-semibold" data-testid={`text-error-budget-${slo.id}`}>
                            {errorBudget.toFixed(1)}% remaining
                          </span>
                        </div>
                        <div className="space-y-1">
                          <Progress
                            value={errorBudget}
                            className="h-2"
                            data-testid={`progress-error-budget-${slo.id}`}
                          />
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Remaining</span>
                            <span>{consumed.toFixed(1)}% consumed</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border/50">
                        <p className="text-xs text-muted-foreground">
                          {slo.windowDays || 30}-day rolling window
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md" data-testid="dialog-create-slo">
          <DialogHeader>
            <DialogTitle>Create New SLO</DialogTitle>
            <DialogDescription>
              Define a new Service Level Objective for your service
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm">
                SLO Name *
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., API Availability"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1.5"
                data-testid="input-slo-name"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                placeholder="Optional description"
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1.5"
                data-testid="input-slo-description"
              />
            </div>

            <div>
              <Label htmlFor="serviceId" className="text-sm">
                Service ID *
              </Label>
              <Input
                id="serviceId"
                name="serviceId"
                placeholder="e.g., api-gateway"
                value={formData.serviceId}
                onChange={handleInputChange}
                className="mt-1.5"
                data-testid="input-service-id"
              />
            </div>

            <div>
              <Label htmlFor="sliType" className="text-sm">
                SLI Type
              </Label>
              <Select value={formData.sliType} onValueChange={(value) => handleSelectChange("sliType", value)}>
                <SelectTrigger className="mt-1.5" data-testid="select-sli-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="availability">Availability</SelectItem>
                  <SelectItem value="latency">Latency</SelectItem>
                  <SelectItem value="error_rate">Error Rate</SelectItem>
                  <SelectItem value="throughput">Throughput</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="targetPercentage" className="text-sm">
                Target Percentage (e.g., 99 for 99%)
              </Label>
              <Input
                id="targetPercentage"
                name="targetPercentage"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.targetPercentage}
                onChange={handleInputChange}
                className="mt-1.5"
                data-testid="input-target-percentage"
              />
            </div>

            <div>
              <Label htmlFor="windowDays" className="text-sm">
                Rolling Window (Days)
              </Label>
              <Input
                id="windowDays"
                name="windowDays"
                type="number"
                min="1"
                value={formData.windowDays}
                onChange={handleInputChange}
                className="mt-1.5"
                data-testid="input-window-days"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              data-testid="button-cancel-create"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateSlo}
              disabled={createSlo.isPending}
              data-testid="button-confirm-create"
            >
              {createSlo.isPending ? "Creating..." : "Create SLO"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
