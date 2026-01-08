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
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <div className="w-4 h-2 bg-primary-foreground rounded-full animate-pulse" />
              </div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">PulseOps</h1>
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
