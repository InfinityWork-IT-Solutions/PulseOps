import { useState } from "react";
import { Calendar, Clock, ChevronDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const presets = [
  { label: "Last 5 minutes", value: "5m" },
  { label: "Last 15 minutes", value: "15m" },
  { label: "Last 30 minutes", value: "30m" },
  { label: "Last 1 hour", value: "1h" },
  { label: "Last 3 hours", value: "3h" },
  { label: "Last 6 hours", value: "6h" },
  { label: "Last 12 hours", value: "12h" },
  { label: "Last 24 hours", value: "24h" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
];

const refreshIntervals = [
  { label: "Off", value: 0 },
  { label: "5s", value: 5000 },
  { label: "10s", value: 10000 },
  { label: "30s", value: 30000 },
  { label: "1m", value: 60000 },
  { label: "5m", value: 300000 },
];

interface TimeRangeSelectorProps {
  className?: string;
}

export function TimeRangeSelector({ className }: TimeRangeSelectorProps) {
  const [selectedRange, setSelectedRange] = useState("6h");
  const [refreshInterval, setRefreshInterval] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const selectedPreset = presets.find((p) => p.value === selectedRange);
  const selectedRefresh = refreshIntervals.find((r) => r.value === refreshInterval);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="gap-2 bg-card border-border hover:bg-card/80 text-sm h-9"
            data-testid="button-time-range"
          >
            <Calendar className="w-4 h-4 text-primary" />
            <span>{selectedPreset?.label || "Select range"}</span>
            <ChevronDown className="w-3 h-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-card border-border">
          {presets.map((preset) => (
            <DropdownMenuItem
              key={preset.value}
              onClick={() => setSelectedRange(preset.value)}
              className={cn(
                "cursor-pointer",
                selectedRange === preset.value && "bg-primary/10 text-primary"
              )}
            >
              {preset.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "h-9 w-9 border-border bg-card hover:bg-card/80",
              refreshInterval > 0 && "border-primary/50"
            )}
            data-testid="button-refresh-interval"
          >
            <Clock className={cn("w-4 h-4", refreshInterval > 0 && "text-primary")} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32 bg-card border-border">
          <div className="px-2 py-1.5 text-xs text-muted-foreground font-medium">
            Auto-refresh
          </div>
          <DropdownMenuSeparator />
          {refreshIntervals.map((interval) => (
            <DropdownMenuItem
              key={interval.value}
              onClick={() => setRefreshInterval(interval.value)}
              className={cn(
                "cursor-pointer",
                refreshInterval === interval.value && "bg-primary/10 text-primary"
              )}
            >
              {interval.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 border-border bg-card hover:bg-card/80"
        onClick={handleRefresh}
        data-testid="button-refresh"
      >
        <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
      </Button>
    </div>
  );
}
