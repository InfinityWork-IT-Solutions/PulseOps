import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Bell,
  Database,
  Settings,
  Search,
  Activity,
  FileText,
  Network,
  Sparkles,
  Plus,
  BarChart3,
} from "lucide-react";
import { useDashboards } from "@/hooks/use-dashboards";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { data: dashboards } = useDashboards();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => setLocation("/"))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboards</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setLocation("/alerts"))}>
            <Bell className="mr-2 h-4 w-4" />
            <span>Alerts</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setLocation("/metrics"))}>
            <Activity className="mr-2 h-4 w-4" />
            <span>Metrics Explorer</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setLocation("/logs"))}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Logs Viewer</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setLocation("/services"))}>
            <Network className="mr-2 h-4 w-4" />
            <span>Service Map</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setLocation("/insights"))}>
            <Sparkles className="mr-2 h-4 w-4" />
            <span>Insight Canvas</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setLocation("/datasources"))}>
            <Database className="mr-2 h-4 w-4" />
            <span>Data Sources</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setLocation("/settings"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => runCommand(() => setLocation("/"))}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Create Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setLocation("/metrics"))}>
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>New Query</span>
          </CommandItem>
        </CommandGroup>

        {dashboards && dashboards.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Recent Dashboards">
              {dashboards.slice(0, 5).map((dashboard) => (
                <CommandItem
                  key={dashboard.id}
                  onSelect={() => runCommand(() => setLocation(`/dashboard/${dashboard.id}`))}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>{dashboard.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
