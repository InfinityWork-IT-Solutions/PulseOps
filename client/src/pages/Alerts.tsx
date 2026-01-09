import { useAlerts, useResolveAlert } from "@/hooks/use-alerts";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertCircle, Info, CheckCircle, Bell, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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
};

export default function Alerts() {
  const { data: alerts, isLoading } = useAlerts();
  const resolveAlert = useResolveAlert();

  const activeAlerts = alerts?.filter((a) => a.status === "active") || [];
  const resolvedAlerts = alerts?.filter((a) => a.status === "resolved") || [];

  if (isLoading) {
    return (
      <div className="flex bg-background min-h-screen">
        <Sidebar />
        <main className="pl-64 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground animate-pulse">Loading alerts...</p>
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
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-lg text-white" data-testid="text-page-title">Alerts & Notifications</h1>
              <p className="text-xs text-muted-foreground">Monitor system health and critical events</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1.5 py-1 px-3">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              {activeAlerts.length} Active
            </Badge>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Active Alerts */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Active Alerts
            </h2>

            {activeAlerts.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-12 flex flex-col items-center justify-center text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                  <h3 className="text-lg font-medium mb-1">All Clear</h3>
                  <p className="text-muted-foreground text-sm">No active alerts at this time</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {activeAlerts.map((alert) => {
                  const config = severityConfig[alert.severity as keyof typeof severityConfig] || severityConfig.info;
                  const Icon = config.icon;

                  return (
                    <Card
                      key={alert.id}
                      className={`${config.bg} ${config.border} border transition-all hover:shadow-lg`}
                      data-testid={`card-alert-${alert.id}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className={`p-2 rounded-lg ${config.bg}`}>
                              <Icon className={`w-5 h-5 ${config.color}`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-white">{alert.title}</h3>
                                <Badge variant="outline" className={config.badge}>
                                  {alert.severity}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {alert.createdAt && formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
                                </span>
                                {alert.currentValue !== null && alert.thresholdValue !== null && (
                                  <span>
                                    Value: <span className={config.color}>{alert.currentValue}</span> / {alert.thresholdValue}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => resolveAlert.mutate({ id: alert.id })}
                            disabled={resolveAlert.isPending}
                            data-testid={`button-resolve-alert-${alert.id}`}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Resolve
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>

          {/* Resolved Alerts */}
          {resolvedAlerts.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="w-5 h-5" />
                Resolved
              </h2>
              <div className="grid gap-2">
                {resolvedAlerts.map((alert) => (
                  <Card key={alert.id} className="bg-card/50 border-border/50 opacity-60" data-testid={`card-resolved-alert-${alert.id}`}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{alert.title}</span>
                          <Badge variant="outline" className="text-xs">
                            {alert.severity}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {alert.resolvedAt && formatDistanceToNow(new Date(alert.resolvedAt), { addSuffix: true })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
