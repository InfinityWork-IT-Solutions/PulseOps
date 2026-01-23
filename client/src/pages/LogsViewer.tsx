import { useState, useEffect, useRef } from "react";
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
  FileText,
  Search,
  Filter,
  Play,
  Pause,
  Download,
  AlertCircle,
  AlertTriangle,
  Info,
  Bug,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warn" | "error" | "debug";
  service: string;
  message: string;
  metadata?: Record<string, any>;
}

const services = [
  "api-gateway",
  "auth-service",
  "user-service",
  "payment-service",
  "notification-service",
  "database-proxy",
];

const generateMockLogs = (): LogEntry[] => {
  const levels: LogEntry["level"][] = ["info", "warn", "error", "debug"];
  const messages = [
    "Request processed successfully",
    "Database connection established",
    "Cache miss for key: user_session",
    "Rate limit exceeded for client",
    "Payment transaction completed",
    "Authentication token refreshed",
    "Background job started",
    "WebSocket connection closed",
    "Memory usage threshold exceeded",
    "API response time degraded",
  ];

  return Array.from({ length: 100 }, (_, i) => {
    const level = levels[Math.floor(Math.random() * levels.length)];
    const service = services[Math.floor(Math.random() * services.length)];
    const now = new Date();
    now.setSeconds(now.getSeconds() - i * 2);

    return {
      id: `log-${i}`,
      timestamp: now.toISOString(),
      level,
      service,
      message: messages[Math.floor(Math.random() * messages.length)],
      metadata:
        Math.random() > 0.5
          ? {
              requestId: `req-${Math.random().toString(36).substr(2, 9)}`,
              duration: `${Math.floor(Math.random() * 500)}ms`,
              statusCode: [200, 201, 400, 404, 500][Math.floor(Math.random() * 5)],
            }
          : undefined,
    };
  });
};

const levelConfig = {
  info: { icon: Info, color: "text-blue-500", bg: "bg-blue-500/10" },
  warn: { icon: AlertTriangle, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  error: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10" },
  debug: { icon: Bug, color: "text-gray-500", bg: "bg-gray-500/10" },
};

export default function LogsViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedService, setSelectedService] = useState<string>("all");
  const [isLive, setIsLive] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState("3");
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLogs(generateMockLogs());
  }, []);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const newLog: LogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        level: ["info", "warn", "error", "debug"][Math.floor(Math.random() * 4)] as LogEntry["level"],
        service: services[Math.floor(Math.random() * services.length)],
        message: "New incoming request processed",
        metadata: { requestId: `req-${Math.random().toString(36).substr(2, 9)}` },
      };
      setLogs((prev) => [newLog, ...prev.slice(0, 99)]);
      setLastRefresh(new Date());
    }, parseInt(refreshInterval) * 1000);

    return () => clearInterval(interval);
  }, [isLive, refreshInterval]);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === "all" || log.level === selectedLevel;
    const matchesService = selectedService === "all" || log.service === selectedService;
    return matchesSearch && matchesLevel && matchesService;
  });

  const levelCounts = logs.reduce(
    (acc, log) => {
      acc[log.level]++;
      return acc;
    },
    { info: 0, warn: 0, error: 0, debug: 0 }
  );

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar />

      <main className="pl-64 flex-1 flex flex-col h-screen">
        <header className="h-16 border-b border-border bg-card/30 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h1 className="font-semibold text-lg text-white" data-testid="text-page-title">
                Logs Viewer
              </h1>
              <p className="text-xs text-muted-foreground">
                Real-time log streaming and analysis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-background/50 rounded-md border border-border/50 px-3 py-1.5">
              <Button
                size="sm"
                variant={isLive ? "default" : "ghost"}
                onClick={() => setIsLive(!isLive)}
                data-testid="button-toggle-live"
                className="gap-1"
              >
                {isLive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                {isLive ? "Pause" : "Live"}
              </Button>
              <Select value={refreshInterval} onValueChange={setRefreshInterval}>
                <SelectTrigger className="w-[70px] text-xs" data-testid="select-log-refresh-interval">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1s</SelectItem>
                  <SelectItem value="3">3s</SelectItem>
                  <SelectItem value="5">5s</SelectItem>
                  <SelectItem value="10">10s</SelectItem>
                </SelectContent>
              </Select>
              {isLive && (
                <span className="text-xs text-green-500 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Live
                </span>
              )}
            </div>
            <TimeRangeSelector />
          </div>
        </header>

        <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                className="pl-9 bg-card border-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-logs"
              />
            </div>

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-[140px] bg-card border-border">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warn">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger className="w-[180px] bg-card border-border">
                <SelectValue placeholder="Service" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Services</SelectItem>
                {services.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 ml-auto">
              {Object.entries(levelCounts).map(([level, count]) => {
                const config = levelConfig[level as keyof typeof levelConfig];
                return (
                  <Badge
                    key={level}
                    variant="outline"
                    className={cn("gap-1", config.color)}
                  >
                    <config.icon className="w-3 h-3" />
                    {count}
                  </Badge>
                );
              })}
            </div>
          </div>

          <Card className="flex-1 border-border bg-card/30 overflow-hidden">
            <ScrollArea className="h-full" ref={scrollRef}>
              <div className="font-mono text-sm">
                {filteredLogs.map((log) => {
                  const config = levelConfig[log.level];
                  const Icon = config.icon;
                  const isExpanded = expandedLog === log.id;

                  return (
                    <div
                      key={log.id}
                      className={cn(
                        "border-b border-border/50 hover:bg-card/50 transition-colors cursor-pointer",
                        isExpanded && "bg-card/50"
                      )}
                      onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                      data-testid={`log-entry-${log.id}`}
                    >
                      <div className="flex items-start gap-3 px-4 py-2">
                        <ChevronRight
                          className={cn(
                            "w-4 h-4 mt-0.5 text-muted-foreground transition-transform",
                            isExpanded && "rotate-90"
                          )}
                        />
                        <div className={cn("p-1 rounded", config.bg)}>
                          <Icon className={cn("w-3 h-3", config.color)} />
                        </div>
                        <span className="text-muted-foreground text-xs w-[180px] shrink-0">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-xs shrink-0"
                        >
                          {log.service}
                        </Badge>
                        <span className="text-foreground flex-1 truncate">
                          {log.message}
                        </span>
                      </div>
                      {isExpanded && log.metadata && (
                        <div className="px-12 pb-3">
                          <pre className="text-xs text-muted-foreground bg-background/50 p-3 rounded-md overflow-x-auto">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </main>
    </div>
  );
}
