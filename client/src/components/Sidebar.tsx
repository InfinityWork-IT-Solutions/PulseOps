import { Link, useLocation } from "wouter";
import { LayoutDashboard, Database, Settings, LogOut, Bell, Activity, FileText, Network, Sparkles, Command, Plug, AlertTriangle, Code, Clock, TrendingUp, Zap, GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAlerts } from "@/hooks/use-alerts";

const NavItem = ({ href, icon: Icon, label, active, badge }: { href: string, icon: any, label: string, active: boolean, badge?: number }) => (
  <Link href={href}>
    <div className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 cursor-pointer group",
      active 
        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
        : "text-muted-foreground hover:bg-white/5 hover:text-white"
    )} data-testid={`nav-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <Icon className="w-5 h-5" />
      <span className="font-medium text-sm flex-1">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className={cn(
          "min-w-5 h-5 px-1.5 rounded-full text-xs font-semibold flex items-center justify-center",
          active ? "bg-white/20 text-white" : "bg-red-500 text-white"
        )}>
          {badge}
        </span>
      )}
    </div>
  </Link>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
    {children}
  </div>
);

export function Sidebar() {
  const [location, setLocation] = useLocation();
  const { data: alerts } = useAlerts();
  const activeAlertsCount = alerts?.filter(a => a.status === "active").length || 0;

  const handleSignOut = () => {
    setLocation("/");
  };

  return (
    <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-xl h-screen flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/20 rounded-lg blur-sm" />
            <div className="relative w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 animate-shimmer" />
              <div className="w-4 h-1 bg-primary-foreground rounded-full animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col -space-y-0.5">
            <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">PulseOps</h1>
            <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-muted-foreground/50">Systems Intelligence</span>
          </div>
        </div>

        <div 
          className="flex items-center gap-2 px-3 py-2 bg-background/50 rounded-md border border-border/50 text-muted-foreground text-sm cursor-pointer hover:border-border transition-colors" 
          data-testid="button-command-palette"
          onClick={() => {
            const event = new KeyboardEvent('keydown', {
              key: 'k',
              metaKey: true,
              ctrlKey: true,
              bubbles: true
            });
            document.dispatchEvent(event);
          }}
        >
          <Command className="w-4 h-4" />
          <span className="flex-1">Search...</span>
          <kbd className="text-xs bg-card px-1.5 py-0.5 rounded">⌘K</kbd>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        <SectionLabel>Overview</SectionLabel>
        <div className="space-y-1 mb-4">
          <NavItem 
            href="/app" 
            icon={LayoutDashboard} 
            label="Dashboards" 
            active={location === "/app" || location.startsWith("/dashboard")} 
          />
          <NavItem 
            href="/alerts" 
            icon={Bell} 
            label="Alerts" 
            active={location === "/alerts"}
            badge={activeAlertsCount}
          />
          <NavItem 
            href="/alert-templates" 
            icon={FileText} 
            label="Alert Templates" 
            active={location === "/alert-templates"}
          />
          <NavItem 
            href="/incidents" 
            icon={AlertTriangle} 
            label="Incidents" 
            active={location === "/incidents"} 
          />
          <NavItem 
            href="/postmortems" 
            icon={FileText} 
            label="Postmortems" 
            active={location === "/postmortems"} 
          />
        </div>

        <SectionLabel>Observability</SectionLabel>
        <div className="space-y-1 mb-4">
          <NavItem 
            href="/metrics" 
            icon={Activity} 
            label="Metrics Explorer" 
            active={location === "/metrics"} 
          />
          <NavItem 
            href="/logs" 
            icon={FileText} 
            label="Logs Viewer" 
            active={location === "/logs"} 
          />
          <NavItem 
            href="/traces" 
            icon={Zap} 
            label="Traces" 
            active={location === "/traces"} 
          />
          <NavItem 
            href="/queries" 
            icon={Code} 
            label="Saved Queries" 
            active={location === "/queries"} 
          />
          <NavItem 
            href="/services" 
            icon={Network} 
            label="Service Map" 
            active={location === "/services"} 
          />
          <NavItem 
            href="/slos" 
            icon={TrendingUp} 
            label="SLOs" 
            active={location === "/slos"} 
          />
          <NavItem 
            href="/correlations" 
            icon={GitBranch} 
            label="Signal Correlations" 
            active={location === "/correlations"} 
          />
        </div>

        <SectionLabel>Intelligence</SectionLabel>
        <div className="space-y-1 mb-4">
          <NavItem 
            href="/insights" 
            icon={Sparkles} 
            label="Insight Canvas" 
            active={location === "/insights"} 
          />
        </div>

        <SectionLabel>Configuration</SectionLabel>
        <div className="space-y-1">
          <NavItem 
            href="/on-call" 
            icon={Clock} 
            label="On-Call Management" 
            active={location === "/on-call"} 
          />
          <NavItem 
            href="/integrations" 
            icon={Plug} 
            label="Integrations" 
            active={location === "/integrations"} 
          />
          <NavItem 
            href="/datasources" 
            icon={Database} 
            label="Data Sources" 
            active={location === "/datasources"} 
          />
          <NavItem 
            href="/settings" 
            icon={Settings} 
            label="Settings" 
            active={location === "/settings"} 
          />
        </div>
      </div>

      <div className="p-4 border-t border-border/50">
        <div 
          className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:text-white hover:bg-white/5 cursor-pointer transition-colors" 
          data-testid="button-sign-out"
          onClick={handleSignOut}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Sign Out</span>
        </div>
      </div>
    </aside>
  );
}
