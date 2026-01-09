import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import DashboardView from "@/pages/DashboardView";
import DataSources from "@/pages/DataSources";
import Alerts from "@/pages/Alerts";

function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-[100] overflow-hidden">
      <div className="relative">
        {/* Animated Rings */}
        <div className="absolute inset-[-20px] rounded-full border border-primary/20 animate-pulse-ring" />
        <div className="absolute inset-[-40px] rounded-full border border-primary/10 animate-pulse-ring [animation-delay:0.5s]" />
        
        {/* Logo Container */}
        <div className="relative w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 animate-shimmer" />
          <div className="w-10 h-2 bg-primary-foreground rounded-full animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
        </div>
      </div>
      
      <div className="mt-8 flex flex-col items-center gap-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
          PulseOps
        </h1>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard/:id" component={DashboardView} />
      <Route path="/datasources" component={DataSources} />
      <Route path="/alerts" component={Alerts} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen />;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={100}>
        <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-700">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
