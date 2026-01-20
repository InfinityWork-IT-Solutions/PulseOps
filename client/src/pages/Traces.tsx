import { useState, useMemo } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TimeRangeSelector } from "@/components/TimeRangeSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Zap,
  Search,
  Filter,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTraces, useTrace } from "@/hooks/use-traces";
import type { Trace, Span } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

const serviceColors = {
  "api-gateway": "bg-blue-500/10 text-blue-400 border-blue-500/30",
  "auth-service": "bg-green-500/10 text-green-400 border-green-500/30",
  "user-service": "bg-purple-500/10 text-purple-400 border-purple-500/30",
  "payment-service": "bg-pink-500/10 text-pink-400 border-pink-500/30",
  "notification-service": "bg-orange-500/10 text-orange-400 border-orange-500/30",
  "database-proxy": "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  "default": "bg-gray-500/10 text-gray-400 border-gray-500/30",
};

function getServiceColor(
  serviceName: string
): string {
  return (
    serviceColors[serviceName as keyof typeof serviceColors] ||
    serviceColors.default
  );
}

function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

function formatTraceId(traceId: string): string {
  return traceId.length > 12 ? `${traceId.substring(0, 12)}...` : traceId;
}

interface ExpandedTrace {
  traceId: string;
  spans: Span[];
}

export default function Traces() {
  const { data: traces, isLoading } = useTraces();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedService, setSelectedService] = useState<string>("all");
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);
  const [expandedTraces, setExpandedTraces] = useState<Map<string, Span[]>>(
    new Map()
  );

  // Fetch spans for expanded trace
  const { data: traceDetails } = useTrace(expandedTraceId || "");

  // Update expanded traces when data is fetched
  if (traceDetails && expandedTraceId && !expandedTraces.has(expandedTraceId)) {
    const newExpandedTraces = new Map(expandedTraces);
    newExpandedTraces.set(expandedTraceId, traceDetails.spans);
    setExpandedTraces(newExpandedTraces);
  }

  const filteredTraces = useMemo(() => {
    if (!traces) return [];

    return traces.filter((trace) => {
      const matchesSearch =
        trace.traceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trace.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trace.operationName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === "all" || trace.status === selectedStatus;

      const matchesService =
        selectedService === "all" ||
        trace.serviceName === selectedService;

      return matchesSearch && matchesStatus && matchesService;
    });
  }, [traces, searchQuery, selectedStatus, selectedService]);

  const serviceNames = useMemo(() => {
    if (!traces) return [];
    const services = new Set(traces.map((t) => t.serviceName));
    return Array.from(services).sort();
  }, [traces]);

  const handleTraceClick = (traceId: string) => {
    if (expandedTraceId === traceId) {
      setExpandedTraceId(null);
    } else {
      setExpandedTraceId(traceId);
    }
  };

  const renderSpanHierarchy = (spans: Span[]): React.ReactNode[] => {
    // Build a map of parent relationships
    const spanMap = new Map(spans.map((s) => [s.spanId, s]));
    const spansByParent = new Map<string | null, Span[]>();

    spans.forEach((span) => {
      const parentId = span.parentSpanId || null;
      if (!spansByParent.has(parentId)) {
        spansByParent.set(parentId, []);
      }
      spansByParent.get(parentId)!.push(span);
    });

    const renderSpanTree = (span: Span, depth: number): React.ReactNode => {
      const children = spansByParent.get(span.spanId) || [];
      const statusIcon =
        span.status === "ok" ? (
          <CheckCircle2 className="w-4 h-4 text-green-500" />
        ) : (
          <AlertCircle className="w-4 h-4 text-red-500" />
        );

      return (
        <div key={span.spanId}>
          <div
            className="border-b border-border/50 hover:bg-card/50 transition-colors px-4 py-2"
            style={{ paddingLeft: `${24 + depth * 24}px` }}
            data-testid={`span-${span.spanId}`}
          >
            <div className="flex items-start gap-3">
              {children.length > 0 && (
                <ChevronRight className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              )}
              {children.length === 0 && (
                <div className="w-4 flex-shrink-0" />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {statusIcon}
                  <span className="font-mono text-xs text-muted-foreground truncate">
                    {span.spanId.substring(0, 8)}...
                  </span>
                  <Badge
                    variant="outline"
                    className={cn("text-xs shrink-0", getServiceColor(span.serviceName))}
                  >
                    {span.serviceName}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="font-mono">{span.operationName}</span>
                  <span className="ml-auto">
                    {formatDuration(span.duration)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {children.map((child) => renderSpanTree(child, depth + 1))}
        </div>
      );
    };

    // Render root spans (those without parents)
    const rootSpans = spansByParent.get(null) || [];
    return rootSpans.map((span) => renderSpanTree(span, 0));
  };

  if (isLoading) {
    return (
      <div className="flex bg-background min-h-screen">
        <Sidebar />
        <main className="pl-64 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground animate-pulse">
              Loading traces...
            </p>
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
            <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <h1
                className="font-semibold text-lg text-white"
                data-testid="text-page-title"
              >
                Distributed Tracing
              </h1>
              <p className="text-xs text-muted-foreground">
                Monitor and analyze distributed request traces
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1.5 py-1 px-3">
              <span className="w-2 h-2 bg-primary rounded-full" />
              {filteredTraces.length} Traces
            </Badge>
            <TimeRangeSelector />
          </div>
        </header>

        <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search traces..."
                className="pl-9 bg-card border-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-traces"
              />
            </div>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[140px] bg-card border-border">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ok">Success</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger className="w-[180px] bg-card border-border">
                <SelectValue placeholder="Service" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Services</SelectItem>
                {serviceNames.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 ml-auto">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {filteredTraces.length} of {traces?.length || 0}
              </span>
            </div>
          </div>

          <Card className="flex-1 border-border bg-card/30 overflow-hidden flex flex-col">
            {filteredTraces.length === 0 ? (
              <CardContent className="flex items-center justify-center py-12 flex-1">
                <div className="text-center">
                  <Zap className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-1">No traces found</h3>
                  <p className="text-muted-foreground text-sm">
                    Try adjusting your search or filters
                  </p>
                </div>
              </CardContent>
            ) : (
              <ScrollArea className="flex-1">
                <div className="font-mono text-sm">
                  {filteredTraces.map((trace) => {
                    const isExpanded = expandedTraceId === trace.traceId;
                    const spans = expandedTraces.get(trace.traceId) || [];
                    const statusIcon =
                      trace.status === "ok" ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      );

                    return (
                      <div
                        key={trace.traceId}
                        data-testid={`trace-${trace.traceId}`}
                      >
                        <div
                          className={cn(
                            "border-b border-border/50 hover:bg-card/50 transition-colors cursor-pointer",
                            isExpanded && "bg-card/50"
                          )}
                          onClick={() => handleTraceClick(trace.traceId)}
                          data-testid={`button-expand-trace-${trace.traceId}`}
                        >
                          <div className="flex items-start gap-3 px-4 py-3">
                            <ChevronRight
                              className={cn(
                                "w-4 h-4 mt-0.5 text-muted-foreground transition-transform flex-shrink-0",
                                isExpanded && "rotate-90"
                              )}
                            />

                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              {statusIcon}
                              <span
                                className="text-muted-foreground text-xs font-mono min-w-fit"
                                data-testid={`text-trace-id-${trace.traceId}`}
                              >
                                {formatTraceId(trace.traceId)}
                              </span>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs shrink-0",
                                  getServiceColor(trace.serviceName)
                                )}
                                data-testid={`badge-service-${trace.serviceName}`}
                              >
                                {trace.serviceName}
                              </Badge>
                            </div>

                            <span className="text-foreground text-xs flex-1 truncate px-2">
                              {trace.operationName}
                            </span>

                            <span className="text-muted-foreground text-xs min-w-fit shrink-0">
                              {formatDuration(trace.duration)}
                            </span>

                            <span
                              className="text-muted-foreground text-xs w-[160px] shrink-0 text-right"
                              data-testid={`text-start-time-${trace.traceId}`}
                            >
                              {formatDistanceToNow(new Date(trace.startTime), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                        </div>

                        {isExpanded && spans.length > 0 && (
                          <div
                            className="bg-background/50"
                            data-testid={`span-list-${trace.traceId}`}
                          >
                            {renderSpanHierarchy(spans)}
                          </div>
                        )}

                        {isExpanded && spans.length === 0 && (
                          <div className="px-4 py-3 text-muted-foreground text-xs">
                            No spans available for this trace
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
