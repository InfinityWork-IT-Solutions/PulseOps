import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TimeRangeSelector } from "@/components/TimeRangeSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Network,
  Server,
  Database,
  Cloud,
  Shield,
  Zap,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Service {
  id: string;
  name: string;
  type: "api" | "database" | "cache" | "queue" | "external";
  status: "healthy" | "degraded" | "error";
  metrics: {
    requests: number;
    latency: number;
    errorRate: number;
  };
  dependencies: string[];
}

const services: Service[] = [
  {
    id: "api-gateway",
    name: "API Gateway",
    type: "api",
    status: "healthy",
    metrics: { requests: 15420, latency: 45, errorRate: 0.1 },
    dependencies: ["auth-service", "user-service", "payment-service"],
  },
  {
    id: "auth-service",
    name: "Auth Service",
    type: "api",
    status: "healthy",
    metrics: { requests: 8230, latency: 32, errorRate: 0.05 },
    dependencies: ["postgres-main", "redis-cache"],
  },
  {
    id: "user-service",
    name: "User Service",
    type: "api",
    status: "degraded",
    metrics: { requests: 6120, latency: 120, errorRate: 2.3 },
    dependencies: ["postgres-main", "redis-cache"],
  },
  {
    id: "payment-service",
    name: "Payment Service",
    type: "api",
    status: "healthy",
    metrics: { requests: 2340, latency: 89, errorRate: 0.2 },
    dependencies: ["postgres-main", "stripe-api"],
  },
  {
    id: "postgres-main",
    name: "PostgreSQL",
    type: "database",
    status: "healthy",
    metrics: { requests: 45200, latency: 8, errorRate: 0 },
    dependencies: [],
  },
  {
    id: "redis-cache",
    name: "Redis Cache",
    type: "cache",
    status: "healthy",
    metrics: { requests: 128000, latency: 2, errorRate: 0 },
    dependencies: [],
  },
  {
    id: "stripe-api",
    name: "Stripe API",
    type: "external",
    status: "healthy",
    metrics: { requests: 890, latency: 210, errorRate: 0.3 },
    dependencies: [],
  },
];

const typeIcons = {
  api: Server,
  database: Database,
  cache: Zap,
  queue: Cloud,
  external: Shield,
};

const statusColors = {
  healthy: { bg: "bg-green-500/10", border: "border-green-500/30", text: "text-green-500" },
  degraded: { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-500" },
  error: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-500" },
};

export default function ServiceMap() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const healthySvcs = services.filter((s) => s.status === "healthy").length;
  const degradedSvcs = services.filter((s) => s.status === "degraded").length;
  const errorSvcs = services.filter((s) => s.status === "error").length;

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar />

      <main className="pl-64 flex-1 flex flex-col">
        <header className="h-16 border-b border-border bg-card/30 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
              <Network className="w-5 h-5 text-cyan-500" />
            </div>
            <div>
              <h1 className="font-semibold text-lg text-white" data-testid="text-page-title">
                Service Map
              </h1>
              <p className="text-xs text-muted-foreground">
                Visualize service dependencies and health
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1 text-green-500 border-green-500/30">
                <CheckCircle className="w-3 h-3" />
                {healthySvcs} Healthy
              </Badge>
              {degradedSvcs > 0 && (
                <Badge variant="outline" className="gap-1 text-yellow-500 border-yellow-500/30">
                  <AlertTriangle className="w-3 h-3" />
                  {degradedSvcs} Degraded
                </Badge>
              )}
              {errorSvcs > 0 && (
                <Badge variant="outline" className="gap-1 text-red-500 border-red-500/30">
                  <AlertTriangle className="w-3 h-3" />
                  {errorSvcs} Error
                </Badge>
              )}
            </div>
            <TimeRangeSelector />
          </div>
        </header>

        <div className="p-8 flex gap-6 h-[calc(100vh-4rem)]">
          <div className="flex-1 grid grid-cols-3 gap-4 auto-rows-min content-start">
            {services.map((service) => {
              const Icon = typeIcons[service.type];
              const colors = statusColors[service.status];
              const isSelected = selectedService?.id === service.id;

              return (
                <Card
                  key={service.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-lg",
                    colors.bg,
                    colors.border,
                    isSelected && "ring-2 ring-primary"
                  )}
                  onClick={() => setSelectedService(service)}
                  data-testid={`service-card-${service.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg", colors.bg)}>
                          <Icon className={cn("w-5 h-5", colors.text)} />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{service.name}</h3>
                          <p className="text-xs text-muted-foreground capitalize">
                            {service.type}
                          </p>
                        </div>
                      </div>
                      {service.status === "healthy" ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertTriangle className={cn("w-5 h-5", colors.text)} />
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-lg font-semibold text-white">
                          {service.metrics.requests.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">req/min</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-white">
                          {service.metrics.latency}ms
                        </p>
                        <p className="text-xs text-muted-foreground">p99</p>
                      </div>
                      <div>
                        <p
                          className={cn(
                            "text-lg font-semibold",
                            service.metrics.errorRate > 1
                              ? "text-red-500"
                              : "text-white"
                          )}
                        >
                          {service.metrics.errorRate}%
                        </p>
                        <p className="text-xs text-muted-foreground">errors</p>
                      </div>
                    </div>

                    {service.dependencies.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <p className="text-xs text-muted-foreground mb-1">
                          Dependencies
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {service.dependencies.map((dep) => (
                            <Badge
                              key={dep}
                              variant="outline"
                              className="text-xs"
                            >
                              {dep}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {selectedService && (
            <Card className="w-80 h-fit border-border bg-card/50 sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {(() => {
                    const Icon = typeIcons[selectedService.type];
                    return <Icon className="w-5 h-5 text-primary" />;
                  })()}
                  {selectedService.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <Badge
                      className={cn(
                        statusColors[selectedService.status].text,
                        statusColors[selectedService.status].bg
                      )}
                    >
                      {selectedService.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type</span>
                    <span className="text-white capitalize">
                      {selectedService.type}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Requests/min</span>
                    <span className="text-white">
                      {selectedService.metrics.requests.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">P99 Latency</span>
                    <span className="text-white">
                      {selectedService.metrics.latency}ms
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Error Rate</span>
                    <span
                      className={
                        selectedService.metrics.errorRate > 1
                          ? "text-red-500"
                          : "text-white"
                      }
                    >
                      {selectedService.metrics.errorRate}%
                    </span>
                  </div>
                </div>

                {selectedService.dependencies.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-white mb-2">
                      Downstream Dependencies
                    </h4>
                    <div className="space-y-2">
                      {selectedService.dependencies.map((depId) => {
                        const dep = services.find((s) => s.id === depId);
                        if (!dep) return null;
                        const colors = statusColors[dep.status];
                        return (
                          <div
                            key={depId}
                            className={cn(
                              "flex items-center justify-between p-2 rounded-md",
                              colors.bg
                            )}
                          >
                            <span className="text-sm text-white">{dep.name}</span>
                            {dep.status === "healthy" ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <AlertTriangle
                                className={cn("w-4 h-4", colors.text)}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <Button className="w-full gap-2" variant="outline">
                  View Details
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
