import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import DashboardView from "@/pages/DashboardView";
import DataSources from "@/pages/DataSources";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard/:id" component={DashboardView} />
      <Route path="/datasources" component={DataSources} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={100}>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <header className="border-b px-6 py-3 flex items-center justify-between bg-card/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative w-9 h-9 flex items-center justify-center">
                {/* Outer Glow */}
                <div className="absolute inset-0 bg-primary/20 rounded-lg blur-sm group-hover:bg-primary/30 transition-colors" />
                {/* Main Logo Box */}
                <div className="relative w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 overflow-hidden">
                  {/* Pulsing Core */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 animate-shimmer" />
                  <div className="w-4 h-1 bg-primary-foreground rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                </div>
              </div>
              <div className="flex flex-col -space-y-1">
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent group-hover:via-white transition-all duration-500">
                  PulseOps
                </h1>
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/60 group-hover:text-primary/60 transition-colors">
                  Systems Intelligence
                </span>
              </div>
            </div>
          </header>
          <main className="flex-1">
            <Toaster />
            <Router />
          </main>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
