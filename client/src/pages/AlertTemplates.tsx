import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertCircle, Info, Shield, Zap, Plus } from "lucide-react";
import type { AlertTemplate } from "@shared/schema";

const severityConfig = {
  critical: {
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    badge: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  warning: {
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    badge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  },
  info: {
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    badge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
};

const categoryConfig: Record<string, { icon: React.ComponentType<{ className?: string }>, label: string, color: string }> = {
  infrastructure: { icon: Zap, label: "Infrastructure", color: "text-purple-500" },
  application: { icon: AlertTriangle, label: "Application", color: "text-orange-500" },
  security: { icon: Shield, label: "Security", color: "text-red-500" },
  custom: { icon: AlertCircle, label: "Custom", color: "text-blue-500" },
};

export default function AlertTemplates() {
  const { data: templates, isLoading } = useQuery<AlertTemplate[]>({
    queryKey: ["/api/alert-templates"],
  });

  if (isLoading) {
    return (
      <div className="flex bg-background min-h-screen">
        <Sidebar />
        <main className="pl-64 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground animate-pulse">Loading templates...</p>
          </div>
        </main>
      </div>
    );
  }

  const builtInTemplates = templates?.filter((t) => t.isBuiltIn) || [];
  const customTemplates = templates?.filter((t) => !t.isBuiltIn) || [];

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar />

      <main className="pl-64 flex-1 flex flex-col">
        <header className="h-16 border-b border-border bg-card/30 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-lg text-white" data-testid="text-page-title">
                Alert Templates
              </h1>
              <p className="text-xs text-muted-foreground">Manage alert templates and create alerts</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1.5 py-1 px-3">
              {templates?.length || 0} Templates
            </Badge>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Built-in Templates */}
          {builtInTemplates.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Built-in Templates
              </h2>

              {builtInTemplates.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-12 flex flex-col items-center justify-center text-center">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-1">No built-in templates</h3>
                    <p className="text-muted-foreground text-sm">No predefined templates available</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {builtInTemplates.map((template) => (
                    <TemplateCard key={template.id} template={template} />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Custom Templates */}
          {customTemplates.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-blue-500" />
                Custom Templates
              </h2>

              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {customTemplates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            </section>
          )}

          {/* Empty State */}
          {(builtInTemplates.length === 0 && customTemplates.length === 0) && (
            <Card className="border-dashed">
              <CardContent className="py-16 flex flex-col items-center justify-center text-center">
                <AlertTriangle className="w-16 h-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-medium mb-2">No Alert Templates</h3>
                <p className="text-muted-foreground text-sm mb-6 max-w-xs">
                  No alert templates available. Create a new template to get started with monitoring.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

function TemplateCard({ template }: { template: AlertTemplate }) {
  const severityConfig_ = severityConfig[template.severity as keyof typeof severityConfig] || severityConfig.info;
  const categoryConfig_ = categoryConfig[template.category as keyof typeof categoryConfig] || categoryConfig.custom;
  const CategoryIcon = categoryConfig_.icon;
  
  const conditionText = template.condition 
    ? (typeof template.condition === 'string' ? template.condition : JSON.stringify(template.condition, null, 2))
    : '';

  return (
    <Card
      className={`${severityConfig_.bg} ${severityConfig_.border} border transition-all hover:shadow-lg hover-elevate`}
      data-testid={`card-template-${template.id}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-base text-white" data-testid={`text-template-name-${template.id}`}>
              {template.name}
            </CardTitle>
          </div>
          {template.isBuiltIn && (
            <Badge
              variant="outline"
              className="shrink-0 bg-primary/20 text-primary border-primary/30"
              data-testid={`badge-builtin-${template.id}`}
            >
              Built-in
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {template.description && (
          <p className="text-sm text-muted-foreground" data-testid={`text-description-${template.id}`}>
            {template.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={severityConfig_.badge} data-testid={`badge-severity-${template.id}`}>
            {template.severity}
          </Badge>

          <Badge variant="outline" className="gap-1 text-xs" data-testid={`badge-category-${template.id}`}>
            <CategoryIcon className="w-3 h-3" />
            {categoryConfig_.label}
          </Badge>
        </div>

        {conditionText && (
          <div className="mt-3 p-3 bg-background/50 rounded-md border border-border/50">
            <p className="text-xs font-medium text-muted-foreground mb-1">Condition:</p>
            <pre className="text-xs text-foreground break-words whitespace-pre-wrap font-mono" data-testid={`text-condition-${template.id}`}>
              {conditionText}
            </pre>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="default"
            className="flex-1"
            data-testid={`button-create-alert-${template.id}`}
          >
            <Plus className="w-4 h-4 mr-1" />
            Create Alert
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
