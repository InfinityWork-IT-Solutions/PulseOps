import { useState } from "react";
import { useParams, Link } from "wouter";
import { useDashboard } from "@/hooks/use-dashboards";
import { usePanels, useCreatePanel, useUpdatePanel, useDeletePanel } from "@/hooks/use-panels";
import { Sidebar } from "@/components/Sidebar";
import { Panel } from "@/components/Panel";
import { Plus, Settings, RefreshCw, Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type Panel as PanelType } from "@shared/schema";
import { Textarea } from "@/components/ui/textarea";

export default function DashboardView() {
  const { id } = useParams();
  const dashboardId = Number(id);
  
  const { data: dashboard, isLoading: isLoadingDashboard } = useDashboard(dashboardId);
  const { data: panels, isLoading: isLoadingPanels } = usePanels(dashboardId);
  const createPanel = useCreatePanel();
  const updatePanel = useUpdatePanel();
  const deletePanel = useDeletePanel();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPanel, setEditingPanel] = useState<PanelType | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "line",
    dataConfig: '{"data": []}'
  });

  const handleEdit = (panel: PanelType) => {
    setEditingPanel(panel);
    setFormData({
      title: panel.title,
      type: panel.type,
      dataConfig: JSON.stringify(panel.dataConfig, null, 2)
    });
    setIsEditModalOpen(true);
  };

  const handleCreate = () => {
    setEditingPanel(null);
    setFormData({
      title: "New Panel",
      type: "line",
      dataConfig: '{"data": []}'
    });
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const dataConfig = JSON.parse(formData.dataConfig);
      
      if (editingPanel) {
        await updatePanel.mutateAsync({
          id: editingPanel.id,
          dashboardId,
          title: formData.title,
          type: formData.type,
          dataConfig,
        });
      } else {
        await createPanel.mutateAsync({
          dashboardId,
          title: formData.title,
          type: formData.type,
          dataConfig,
          layoutConfig: { x: 0, y: 0, w: 6, h: 4 }
        });
      }
      setIsEditModalOpen(false);
    } catch (e) {
      alert("Invalid JSON configuration");
    }
  };

  if (isLoadingDashboard || isLoadingPanels) {
    return (
      <div className="flex bg-background min-h-screen">
        <Sidebar />
        <main className="pl-64 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground animate-pulse">Loading dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="flex bg-background min-h-screen">
        <Sidebar />
        <main className="pl-64 flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Dashboard not found</h2>
            <Link href="/">
              <Button variant="ghost">Return to Home</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar />
      
      <main className="pl-64 flex-1 flex flex-col min-h-0">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card/30 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="font-display font-semibold text-lg text-white">{dashboard.title}</h1>
              {dashboard.description && (
                <p className="text-xs text-muted-foreground hidden md:block">{dashboard.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-card border border-border rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-white hover:border-border/80 transition-colors cursor-pointer gap-2">
              <Calendar className="w-4 h-4" />
              <span>Last 6 hours</span>
            </div>
            
            <Button variant="outline" size="icon" className="h-9 w-9 border-border bg-transparent hover:bg-white/5">
              <RefreshCw className="w-4 h-4" />
            </Button>
            
            <Button variant="outline" size="icon" className="h-9 w-9 border-border bg-transparent hover:bg-white/5">
              <Settings className="w-4 h-4" />
            </Button>

            <Button onClick={handleCreate} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4" />
              Add Panel
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 flex-1 overflow-y-auto">
          {panels && panels.length > 0 ? (
            <div className="dashboard-grid">
              {panels.map((panel) => (
                <Panel 
                  key={panel.id} 
                  panel={panel} 
                  onEdit={handleEdit}
                  onDelete={(id) => deletePanel.mutate({ id, dashboardId })}
                />
              ))}
            </div>
          ) : (
            <div className="h-[60vh] flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl bg-card/10">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">No panels yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm text-center">Start visualizing your data by adding your first panel to this dashboard.</p>
              <Button onClick={handleCreate} size="lg" className="shadow-xl shadow-primary/20">
                Create First Panel
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Edit Panel Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-card border-border sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingPanel ? 'Edit Panel' : 'New Panel'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Panel Title</Label>
              <Input 
                id="title" 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="bg-background border-border focus:ring-primary"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="type">Visualization Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData({...formData, type: value})}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="area">Area Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                  <SelectItem value="stat">Statistic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="config">Data Configuration (JSON)</Label>
              <Textarea 
                id="config" 
                value={formData.dataConfig}
                onChange={(e) => setFormData({...formData, dataConfig: e.target.value})}
                className="bg-background border-border font-mono text-xs min-h-[200px]" 
              />
              <p className="text-xs text-muted-foreground">Enter raw JSON data config for now.</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="border-border hover:bg-white/5">Cancel</Button>
            <Button onClick={handleSave} disabled={createPanel.isPending || updatePanel.isPending} className="bg-primary text-primary-foreground">
              {editingPanel ? 'Save Changes' : 'Create Panel'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
