import { useState } from "react";
import { useCorrelations, useUpdateCorrelation } from "@/hooks/use-correlations";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Zap,
  ChevronDown,
  Brain,
  Activity,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const severityConfig = {
  critical: {
    icon: AlertTriangle,
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    badge: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  warning: {
    icon: AlertCircle,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    badge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  },
  info: {
    icon: Info,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    badge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  low: {
    icon: Info,
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    badge: "bg-green-500/20 text-green-400 border-green-500/30",
  },
};

const getConfidenceColor = (confidence: number | null | undefined) => {
  if (!confidence) return "text-muted-foreground";
  if (confidence >= 80) return "text-green-500";
  if (confidence >= 60) return "text-yellow-500";
  return "text-orange-500";
};

const getConfidenceBg = (confidence: number | null | undefined) => {
  if (!confidence) return "bg-muted/20";
  if (confidence >= 80) return "bg-green-500/10";
  if (confidence >= 60) return "bg-yellow-500/10";
  return "bg-orange-500/10";
};

const normalizeToStringArray = (arr: unknown): string[] => {
  if (!Array.isArray(arr)) return [];
  return arr.map((item) => (typeof item === "string" ? item : String(item)));
};

export default function Correlations() {
  const { data: correlations, isLoading } = useCorrelations();
  const updateCorrelation = useUpdateCorrelation();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "resolved">("active");

  const filteredCorrelations =
    correlations?.filter((c) => statusFilter === "all" || c.status === statusFilter) || [];

  const activeCount = correlations?.filter((c) => c.status === "active").length || 0;
  const resolvedCount = correlations?.filter((c) => c.status === "resolved").length || 0;

  const handleResolve = (correlationId: string) => {
    updateCorrelation.mutate({
      correlationId,
      data: {
        status: "resolved",
        resolvedAt: new Date(),
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex bg-background min-h-screen">
        <Sidebar />
        <main className="pl-64 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground animate-pulse">Loading correlations...</p>
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
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-lg text-white" data-testid="text-page-title">
                Signal Correlations
              </h1>
              <p className="text-xs text-muted-foreground">
                Analyze correlated signals across your system
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn("gap-1.5 py-1 px-3 cursor-pointer", statusFilter === "active" && "bg-primary/10")}
              onClick={() => setStatusFilter("active")}
              data-testid="badge-active-count"
            >
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              {activeCount} Active
            </Badge>
            <Badge
              variant="outline"
              className={cn("gap-1.5 py-1 px-3 cursor-pointer", statusFilter === "resolved" && "bg-green-500/10")}
              onClick={() => setStatusFilter("resolved")}
              data-testid="badge-resolved-count"
            >
              <CheckCircle className="w-3 h-3" />
              {resolvedCount} Resolved
            </Badge>
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
              data-testid="button-view-all"
            >
              All ({correlations?.length || 0})
            </Button>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {filteredCorrelations.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 flex flex-col items-center justify-center text-center">
                <Zap className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-1">
                  {statusFilter === "all"
                    ? "No correlations found"
                    : statusFilter === "active"
                    ? "No active correlations"
                    : "No resolved correlations"}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {statusFilter === "active"
                    ? "All signals are operating independently"
                    : "No correlations match the current filter"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredCorrelations.map((correlation) => {
                const config = severityConfig[correlation.severity as keyof typeof severityConfig] || severityConfig.info;
                const Icon = config.icon;
                const isExpanded = expandedId === correlation.correlationId;
                const alertCount = Array.isArray(correlation.alertIds) ? correlation.alertIds.length : 0;
                const traceCount = Array.isArray(correlation.traceIds) ? correlation.traceIds.length : 0;
                const serviceCount = Array.isArray(correlation.serviceIds) ? correlation.serviceIds.length : 0;

                return (
                  <Collapsible key={correlation.correlationId} open={isExpanded} onOpenChange={() => setExpandedId(isExpanded ? null : correlation.correlationId)}>
                    <Card
                      className={`${config.bg} ${config.border} border transition-all hover:shadow-lg`}
                      data-testid={`card-correlation-${correlation.correlationId}`}
                    >
                      <CollapsibleTrigger asChild>
                        <CardContent className="p-4 cursor-pointer">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                              <div className={`p-2 rounded-lg ${config.bg}`}>
                                <Icon className={`w-5 h-5 ${config.color}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                  <h3 className="font-semibold text-white" data-testid={`text-correlation-id-${correlation.correlationId}`}>
                                    {correlation.correlationId}
                                  </h3>
                                  <Badge variant="outline" className={config.badge} data-testid={`badge-severity-${correlation.correlationId}`}>
                                    {correlation.severity}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className={correlation.status === "active" ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-green-500/20 text-green-400 border-green-500/30"}
                                    data-testid={`badge-status-${correlation.correlationId}`}
                                  >
                                    {correlation.status}
                                  </Badge>
                                </div>

                                {correlation.aiAnalysis && (
                                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                    {correlation.aiAnalysis}
                                  </p>
                                )}

                                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1" data-testid={`text-alerts-count-${correlation.correlationId}`}>
                                    <AlertCircle className="w-3 h-3" />
                                    {alertCount} Alert{alertCount !== 1 ? "s" : ""}
                                  </span>
                                  <span className="flex items-center gap-1" data-testid={`text-traces-count-${correlation.correlationId}`}>
                                    <Activity className="w-3 h-3" />
                                    {traceCount} Trace{traceCount !== 1 ? "s" : ""}
                                  </span>
                                  <span className="flex items-center gap-1" data-testid={`text-services-count-${correlation.correlationId}`}>
                                    <Zap className="w-3 h-3" />
                                    {serviceCount} Service{serviceCount !== 1 ? "s" : ""}
                                  </span>
                                  {correlation.confidence !== null && correlation.confidence !== undefined && (
                                    <span
                                      className={`flex items-center gap-1 px-2 py-1 rounded ${getConfidenceBg(correlation.confidence)} ${getConfidenceColor(correlation.confidence)}`}
                                      data-testid={`text-confidence-${correlation.correlationId}`}
                                    >
                                      <Brain className="w-3 h-3" />
                                      {correlation.confidence}% Confidence
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                              {correlation.status === "active" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleResolve(correlation.correlationId);
                                  }}
                                  disabled={updateCorrelation.isPending}
                                  data-testid={`button-resolve-${correlation.correlationId}`}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Resolve
                                </Button>
                              )}
                              <ChevronDown
                                className={cn(
                                  "w-5 h-5 text-muted-foreground transition-transform",
                                  isExpanded && "rotate-180"
                                )}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <CardContent className="pt-0 pb-4 border-t border-border/50 px-4">
                          <div className="space-y-4 mt-4">
                            {correlation.suggestedCause && (
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <TrendingUp className="w-4 h-4 text-primary" />
                                  <h4 className="text-sm font-semibold text-white">Suggested Cause</h4>
                                </div>
                                <p className="text-sm text-muted-foreground ml-6" data-testid={`text-suggested-cause-${correlation.correlationId}`}>
                                  {correlation.suggestedCause}
                                </p>
                              </div>
                            )}

                            {correlation.aiAnalysis && (
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Brain className="w-4 h-4 text-purple-500" />
                                  <h4 className="text-sm font-semibold text-white">AI Analysis</h4>
                                </div>
                                <p className="text-sm text-muted-foreground ml-6" data-testid={`text-ai-analysis-${correlation.correlationId}`}>
                                  {correlation.aiAnalysis}
                                </p>
                              </div>
                            )}

                            {alertCount > 0 && (
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                                  <h4 className="text-sm font-semibold text-white">Related Alerts</h4>
                                </div>
                                <div className="ml-6 space-y-1">
                                  {Array.isArray(correlation.alertIds) &&
                                    correlation.alertIds.map((alertId, idx) => (
                                      <p key={idx} className="text-xs text-muted-foreground">
                                        Alert #{alertId}
                                      </p>
                                    ))}
                                </div>
                              </div>
                            )}

                            {traceCount > 0 && (
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Activity className="w-4 h-4 text-blue-500" />
                                  <h4 className="text-sm font-semibold text-white">Related Traces</h4>
                                </div>
                                <div className="ml-6 space-y-1">
                                  {Array.isArray(correlation.traceIds) &&
                                    correlation.traceIds.map((traceId, idx) => (
                                      <p key={idx} className="text-xs text-muted-foreground truncate">
                                        {traceId}
                                      </p>
                                    ))}
                                </div>
                              </div>
                            )}

                            {serviceCount > 0 && (
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Zap className="w-4 h-4 text-orange-500" />
                                  <h4 className="text-sm font-semibold text-white">Affected Services</h4>
                                </div>
                                <div className="ml-6 flex flex-wrap gap-2">
                                  {Array.isArray(correlation.serviceIds) &&
                                    correlation.serviceIds.map((serviceId, idx) => (
                                      <Badge key={idx} variant="secondary" className="text-xs" data-testid={`badge-service-${idx}-${correlation.correlationId}`}>
                                        {serviceId}
                                      </Badge>
                                    ))}
                                </div>
                              </div>
                            )}

                            {(() => {
                              const patterns = normalizeToStringArray(correlation.logPatterns);
                              return patterns.length > 0 ? (
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <AlertCircle className="w-4 h-4 text-pink-500" />
                                    <h4 className="text-sm font-semibold text-white">Log Patterns</h4>
                                  </div>
                                  <div className="ml-6 space-y-1">
                                    {patterns.map((pattern, idx) => (
                                      <p key={idx} className="text-xs text-muted-foreground">
                                        {pattern}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              ) : null;
                            })()}

                            {(() => {
                              const anomalies = normalizeToStringArray(correlation.metricAnomalies);
                              return anomalies.length > 0 ? (
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="w-4 h-4 text-cyan-500" />
                                    <h4 className="text-sm font-semibold text-white">Metric Anomalies</h4>
                                  </div>
                                  <div className="ml-6 space-y-1">
                                    {anomalies.map((anomaly, idx) => (
                                      <p key={idx} className="text-xs text-muted-foreground">
                                        {anomaly}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              ) : null;
                            })()}
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
