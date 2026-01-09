import { Link, useLocation } from "wouter";
import { LayoutDashboard, Database, Settings, LogOut, Bell } from "lucide-react";
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

export function Sidebar() {
  const [location] = useLocation();
  const { data: alerts } = useAlerts();
  const activeAlertsCount = alerts?.filter(a => a.status === "active").length || 0;

  return (
    <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-xl h-screen flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
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

        <div className="space-y-1">
          <NavItem 
            href="/" 
            icon={LayoutDashboard} 
            label="Dashboards" 
            active={location === "/" || location.startsWith("/dashboard")} 
          />
          <NavItem 
            href="/alerts" 
            icon={Bell} 
            label="Alerts" 
            active={location === "/alerts"}
            badge={activeAlertsCount}
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

      <div className="mt-auto p-6 border-t border-border/50">
        <div className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:text-white cursor-pointer transition-colors" data-testid="button-sign-out">
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Sign Out</span>
        </div>
      </div>
    </aside>
  );
}
