import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useDashboards, useCreateDashboard, useDeleteDashboard } from "@/hooks/use-dashboards";
import { Sidebar } from "@/components/Sidebar";
import { Plus, Search, LayoutGrid, Star, MoreHorizontal, Trash2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OnboardingWizard } from "@/components/OnboardingWizard";

export default function Home() {
  const { data: dashboards, isLoading } = useDashboards();
  const createDashboard = useCreateDashboard();
  const deleteDashboard = useDeleteDashboard();
  
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newDashData, setNewDashData] = useState({ title: "", description: "" });
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem("pulseops_onboarding_complete");
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem("pulseops_onboarding_complete", "true");
    setShowOnboarding(false);
  };

  const filteredDashboards = dashboards?.filter(d => 
    d.title.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const handleCreate = async () => {
    try {
      await createDashboard.mutateAsync({
        title: newDashData.title,
        description: newDashData.description,
        isFavorite: false
      });
      setNewDashData({ title: "", description: "" });
      setIsCreateOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex bg-background min-h-screen text-foreground font-sans">
      <Sidebar />
      
      <main className="pl-64 flex-1 flex flex-col">
        <div className="p-8 max-w-7xl mx-auto w-full">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-display font-bold text-white mb-2">Dashboards</h1>
              <p className="text-muted-foreground">Manage and organize your data visualizations.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search dashboards..." 
                  className="pl-9 bg-card border-border focus:ring-primary"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  data-testid="input-search-dashboards"
                />
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowOnboarding(true)} 
                className="border-border hover:bg-white/5"
                data-testid="button-run-setup"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Setup Guide
              </Button>
              <Button onClick={() => setIsCreateOpen(true)} className="bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90" data-testid="button-new-dashboard">
                <Plus className="w-4 h-4 mr-2" />
                New Dashboard
              </Button>
            </div>
          </div>

          {/* Dashboard Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 rounded-xl bg-card/50 border border-border animate-pulse" />
              ))}
            </div>
          ) : filteredDashboards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDashboards.map((dash) => (
                <div key={dash.id} className="group relative bg-card hover:bg-card/80 border border-border hover:border-primary/50 rounded-xl p-6 transition-all duration-300 shadow-lg shadow-black/5 hover:shadow-xl hover:-translate-y-1">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                     <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border">
                        <DropdownMenuItem onClick={() => deleteDashboard.mutate(dash.id)} className="text-destructive focus:text-destructive cursor-pointer">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <Link href={`/dashboard/${dash.id}`}>
                    <div className="cursor-pointer h-full flex flex-col">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                        <LayoutGrid className="w-5 h-5" />
                      </div>
                      
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors">{dash.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                        {dash.description || "No description provided."}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground/60 border-t border-border/50 pt-4 mt-auto">
                        <span>Updated 2h ago</span>
                        {dash.isFavorite && (
                          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500 ml-auto" />
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-2xl bg-card/10">
              <p className="text-muted-foreground mb-4">No dashboards found matching your search.</p>
              <Button variant="outline" onClick={() => setSearch("")} className="border-border hover:bg-white/5">Clear Search</Button>
            </div>
          )}
        </div>
      </main>

      {/* Create Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle>Create Dashboard</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Name</Label>
              <Input 
                id="title" 
                placeholder="e.g. Server Metrics" 
                className="bg-background border-border"
                value={newDashData.title}
                onChange={(e) => setNewDashData({...newDashData, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea 
                id="desc" 
                placeholder="Optional description..." 
                className="bg-background border-border"
                value={newDashData.description}
                onChange={(e) => setNewDashData({...newDashData, description: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="border-border hover:bg-white/5">Cancel</Button>
            <Button onClick={handleCreate} disabled={createDashboard.isPending} className="bg-primary text-primary-foreground">
              {createDashboard.isPending ? 'Creating...' : 'Create Dashboard'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Onboarding Wizard */}
      <OnboardingWizard
        open={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
      />
    </div>
  );
}
