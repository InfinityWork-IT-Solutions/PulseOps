import { Link, useLocation } from "wouter";
import { LayoutDashboard, Database, Settings, LogOut, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const NavItem = ({ href, icon: Icon, label, active }: { href: string, icon: any, label: string, active: boolean }) => (
  <Link href={href}>
    <div className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 cursor-pointer group",
      active 
        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
        : "text-muted-foreground hover:bg-white/5 hover:text-white"
    )}>
      <Icon className="w-5 h-5" />
      <span className="font-medium text-sm">{label}</span>
    </div>
  </Link>
);

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-xl h-screen flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-display font-bold text-xl tracking-tight text-white">Prism</h1>
        </div>

        <div className="space-y-1">
          <NavItem 
            href="/" 
            icon={LayoutDashboard} 
            label="Dashboards" 
            active={location === "/" || location.startsWith("/dashboard")} 
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
        <div className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:text-white cursor-pointer transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Sign Out</span>
        </div>
      </div>
    </aside>
  );
}
