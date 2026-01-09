import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TimeRangeSelector } from "@/components/TimeRangeSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sparkles,
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Zap,
  Target,
  Shield,
  Activity,
  Clock,
  ArrowUpRight,
  Lightbulb,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface Insight {
  id: string;
  type: "anomaly" | "prediction" | "recommendation" | "correlation";
  severity: "low" | "medium" | "high";
  title: string;
  description: string;
  metric?: string;
  confidence: number;
  timestamp: string;
}

const insights: Insight[] = [
  {
    id: "1",
    type: "anomaly",
    severity: "high",
    title: "Unusual spike in API latency",
    description:
      "P99 latency increased 340% above baseline in the last 15 minutes. Correlated with deployment at 14:32 UTC.",
    metric: "http.latency.p99",
    confidence: 94,
    timestamp: "2 minutes ago",
  },
  {
    id: "2",
    type: "prediction",
    severity: "medium",
    title: "Memory pressure predicted",
    description:
      "Based on current growth rate, memory usage will exceed 90% threshold in approximately 4 hours.",
    metric: "system.memory.used",
    confidence: 87,
    timestamp: "5 minutes ago",
  },
  {
    id: "3",
    type: "correlation",
    severity: "medium",
    title: "Error rate correlates with cache misses",
    description:
      "Strong correlation (0.89) detected between Redis cache miss rate and increased API error responses.",
    confidence: 89,
    timestamp: "12 minutes ago",
  },
  {
    id: "4",
    type: "recommendation",
    severity: "low",
    title: "Optimize database query patterns",
    description:
      "Analysis suggests adding an index on user_sessions.created_at could reduce query time by 45%.",
    confidence: 76,
    timestamp: "1 hour ago",
  },
];

const healthScores = [
  { name: "API Gateway", score: 98, trend: 2 },
  { name: "Database", score: 95, trend: -1 },
  { name: "Cache Layer", score: 88, trend: -5 },
  { name: "Auth Service", score: 100, trend: 0 },
  { name: "Payment", score: 97, trend: 1 },
];

const anomalyData = Array.from({ length: 48 }, (_, i) => {
  const hour = i % 24;
  const isAnomaly = i >= 38 && i <= 42;
  return {
    time: `${hour.toString().padStart(2, "0")}:00`,
    value: isAnomaly ? 180 + Math.random() * 80 : 45 + Math.random() * 20,
    baseline: 50,
    isAnomaly,
  };
});

const typeConfig = {
  anomaly: { icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" },
  prediction: { icon: Brain, color: "text-purple-500", bg: "bg-purple-500/10" },
  correlation: { icon: Activity, color: "text-blue-500", bg: "bg-blue-500/10" },
  recommendation: { icon: Lightbulb, color: "text-yellow-500", bg: "bg-yellow-500/10" },
};

export default function InsightCanvas() {
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const overallHealth = Math.round(
    healthScores.reduce((acc, s) => acc + s.score, 0) / healthScores.length
  );

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar />

      <main className="pl-64 flex-1 flex flex-col">
        <header className="h-16 border-b border-border bg-card/30 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/20 rounded-lg blur-sm animate-pulse" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="font-semibold text-lg text-white flex items-center gap-2" data-testid="text-page-title">
                Insight Canvas
                <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                  AI-Powered
                </Badge>
              </h1>
              <p className="text-xs text-muted-foreground">
                Intelligent anomaly detection and predictive analytics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={runAnalysis}
              disabled={isAnalyzing}
              className="gap-2"
              data-testid="button-run-analysis"
            >
              <RefreshCw className={cn("w-4 h-4", isAnalyzing && "animate-spin")} />
              {isAnalyzing ? "Analyzing..." : "Run Analysis"}
            </Button>
            <TimeRangeSelector />
          </div>
        </header>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="lg:col-span-1 border-border bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-4">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="hsl(var(--border))"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="hsl(var(--primary))"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${(overallHealth / 100) * 352} 352`}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-white">{overallHealth}</span>
                      <span className="text-xs text-muted-foreground">Health Score</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  {healthScores.map((service) => (
                    <div key={service.name} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-muted-foreground">{service.name}</span>
                          <span className="text-sm font-medium text-white">{service.score}%</span>
                        </div>
                        <Progress value={service.score} className="h-1.5" />
                      </div>
                      <div
                        className={cn(
                          "text-xs flex items-center gap-0.5",
                          service.trend > 0
                            ? "text-green-500"
                            : service.trend < 0
                            ? "text-red-500"
                            : "text-muted-foreground"
                        )}
                      >
                        {service.trend > 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : service.trend < 0 ? (
                          <TrendingDown className="w-3 h-3" />
                        ) : null}
                        {service.trend !== 0 && `${Math.abs(service.trend)}%`}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3 border-border bg-card/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="w-4 h-4 text-red-500" />
                    Anomaly Detection
                  </CardTitle>
                  <Badge variant="outline" className="text-red-500 border-red-500/30">
                    1 Active Anomaly
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={anomalyData}>
                      <defs>
                        <linearGradient id="anomalyGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="time"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={10}
                        tickLine={false}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="baseline"
                        stroke="hsl(var(--muted-foreground))"
                        strokeDasharray="5 5"
                        strokeWidth={1}
                        dot={false}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#ef4444"
                        strokeWidth={2}
                        fill="url(#anomalyGradient)"
                        dot={false}
                        activeDot={(props: any) =>
                          props.payload.isAnomaly ? (
                            <circle
                              cx={props.cx}
                              cy={props.cy}
                              r={6}
                              fill="#ef4444"
                              stroke="#fff"
                              strokeWidth={2}
                            />
                          ) : (
                            <circle cx={props.cx} cy={props.cy} r={4} fill="#ef4444" />
                          )
                        }
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="border-border bg-card/50 h-full">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-500" />
                    AI-Generated Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {insights.map((insight) => {
                    const config = typeConfig[insight.type];
                    const Icon = config.icon;

                    return (
                      <div
                        key={insight.id}
                        className={cn(
                          "p-4 rounded-lg border cursor-pointer transition-all hover:shadow-lg",
                          selectedInsight?.id === insight.id
                            ? "border-primary bg-primary/5"
                            : "border-border bg-card/30 hover:border-border/80"
                        )}
                        onClick={() => setSelectedInsight(insight)}
                        data-testid={`insight-${insight.id}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn("p-2 rounded-lg shrink-0", config.bg)}>
                            <Icon className={cn("w-4 h-4", config.color)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-white text-sm truncate">
                                {insight.title}
                              </h4>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs shrink-0",
                                  insight.severity === "high"
                                    ? "text-red-500 border-red-500/30"
                                    : insight.severity === "medium"
                                    ? "text-yellow-500 border-yellow-500/30"
                                    : "text-blue-500 border-blue-500/30"
                                )}
                              >
                                {insight.severity}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {insight.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Zap className="w-3 h-3" />
                                {insight.confidence}% confidence
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {insight.timestamp}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            <Card className="border-border bg-card/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-2" data-testid="button-create-alert">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  Create Alert from Insight
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  Add to Dashboard
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Activity className="w-4 h-4 text-green-500" />
                  View Related Metrics
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <ArrowUpRight className="w-4 h-4 text-purple-500" />
                  Export Report
                </Button>

                {selectedInsight && (
                  <div className="mt-6 pt-4 border-t border-border">
                    <h4 className="text-sm font-medium text-white mb-3">Selected Insight</h4>
                    <div className="text-xs text-muted-foreground space-y-2">
                      <div className="flex justify-between">
                        <span>Type</span>
                        <span className="text-white capitalize">{selectedInsight.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Confidence</span>
                        <span className="text-white">{selectedInsight.confidence}%</span>
                      </div>
                      {selectedInsight.metric && (
                        <div className="flex justify-between">
                          <span>Metric</span>
                          <code className="text-primary text-xs">{selectedInsight.metric}</code>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
