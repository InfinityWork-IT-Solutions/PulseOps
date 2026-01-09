import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TimeRangeSelector } from "@/components/TimeRangeSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  Plus,
  Play,
  Trash2,
  TrendingUp,
  TrendingDown,
  Minus,
  Copy,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const mockMetrics = [
  { name: "system.cpu.usage", type: "gauge", unit: "%" },
  { name: "system.memory.used", type: "gauge", unit: "bytes" },
  { name: "system.disk.io", type: "counter", unit: "bytes/s" },
  { name: "http.requests.total", type: "counter", unit: "requests" },
  { name: "http.latency.p99", type: "histogram", unit: "ms" },
  { name: "app.errors.count", type: "counter", unit: "errors" },
  { name: "db.connections.active", type: "gauge", unit: "connections" },
  { name: "cache.hit.ratio", type: "gauge", unit: "%" },
];

const generateTimeSeriesData = () => {
  const now = Date.now();
  return Array.from({ length: 24 }, (_, i) => ({
    time: new Date(now - (23 - i) * 3600000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    cpu: Math.random() * 40 + 30,
    memory: Math.random() * 20 + 60,
    requests: Math.floor(Math.random() * 500 + 200),
  }));
};

export default function MetricsExplorer() {
  const [queries, setQueries] = useState([
    { id: 1, metric: "system.cpu.usage", label: "CPU", color: "#3b82f6" },
    { id: 2, metric: "system.memory.used", label: "Memory", color: "#10b981" },
  ]);
  const [selectedMetric, setSelectedMetric] = useState("");
  const [chartData] = useState(generateTimeSeriesData);

  const addQuery = () => {
    if (!selectedMetric) return;
    const colors = ["#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"];
    setQueries([
      ...queries,
      {
        id: Date.now(),
        metric: selectedMetric,
        label: selectedMetric.split(".").pop() || selectedMetric,
        color: colors[queries.length % colors.length],
      },
    ]);
    setSelectedMetric("");
  };

  const removeQuery = (id: number) => {
    setQueries(queries.filter((q) => q.id !== id));
  };

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar />

      <main className="pl-64 flex-1 flex flex-col">
        <header className="h-16 border-b border-border bg-card/30 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <h1 className="font-semibold text-lg text-white" data-testid="text-page-title">
                Metrics Explorer
              </h1>
              <p className="text-xs text-muted-foreground">
                Query and visualize time-series metrics
              </p>
            </div>
          </div>
          <TimeRangeSelector />
        </header>

        <div className="p-8 space-y-6">
          <Card className="border-border bg-card/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Play className="w-4 h-4 text-primary" />
                Query Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {queries.map((query) => (
                  <Badge
                    key={query.id}
                    variant="outline"
                    className="py-1.5 px-3 gap-2 text-sm"
                    style={{ borderColor: query.color, color: query.color }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: query.color }}
                    />
                    {query.metric}
                    <button
                      onClick={() => removeQuery(query.id)}
                      className="ml-1 opacity-60 hover:opacity-100"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="w-[300px] bg-background border-border">
                    <SelectValue placeholder="Select a metric..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {mockMetrics.map((metric) => (
                      <SelectItem key={metric.name} value={metric.name}>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">{metric.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {metric.type}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={addQuery}
                  disabled={!selectedMetric}
                  className="gap-2"
                  data-testid="button-add-query"
                >
                  <Plus className="w-4 h-4" />
                  Add Query
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Time Series</CardTitle>
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                  <Copy className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="time"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
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
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="cpu"
                      name="CPU %"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="memory"
                      name="Memory %"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Avg CPU", value: "42.3%", trend: 5.2, icon: TrendingUp },
              { label: "Peak Memory", value: "78.1%", trend: -2.1, icon: TrendingDown },
              { label: "Requests/sec", value: "1,247", trend: 0, icon: Minus },
            ].map((stat) => (
              <Card key={stat.label} className="border-border bg-card/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                    <div
                      className={`flex items-center gap-1 text-sm ${
                        stat.trend > 0
                          ? "text-red-500"
                          : stat.trend < 0
                          ? "text-green-500"
                          : "text-muted-foreground"
                      }`}
                    >
                      <stat.icon className="w-4 h-4" />
                      {stat.trend !== 0 && `${Math.abs(stat.trend)}%`}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
