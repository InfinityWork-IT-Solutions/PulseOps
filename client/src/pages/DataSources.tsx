import { useDataSources, useCreateDataSource } from "@/hooks/use-datasources";
import { Sidebar } from "@/components/Sidebar";
import { Database, Plus, CheckCircle2, Server, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function DataSources() {
  const { data: sources, isLoading } = useDataSources();
  const createSource = useCreateDataSource();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", type: "postgres", config: "{}" });

  const handleCreate = async () => {
    try {
      await createSource.mutateAsync({
        name: formData.name,
        type: formData.type,
        config: JSON.parse(formData.config || "{}")
      });
      setIsOpen(false);
      setFormData({ name: "", type: "postgres", config: "{}" });
    } catch(e) {
      alert("Invalid JSON config");
    }
  };

  return (
    <div className="flex bg-background min-h-screen text-foreground font-sans">
      <Sidebar />
      
      <main className="pl-64 flex-1 flex flex-col">
        <div className="p-8 max-w-5xl mx-auto w-full">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-display font-bold text-white mb-2">Data Sources</h1>
              <p className="text-muted-foreground">Manage connections to your databases and APIs.</p>
            </div>
            <Button onClick={() => setIsOpen(true)} className="bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4 mr-2" />
              Add Data Source
            </Button>
          </div>

          <div className="grid gap-4">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground animate-pulse">Loading sources...</div>
            ) : sources?.length === 0 ? (
              <div className="border-2 border-dashed border-border rounded-xl p-12 text-center bg-card/10">
                <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white">No data sources configured</h3>
                <p className="text-muted-foreground mt-2">Connect a database to start visualizing data.</p>
              </div>
            ) : (
              sources?.map((source) => (
                <div key={source.id} className="bg-card border border-border rounded-xl p-6 flex items-center gap-6 hover:border-primary/50 transition-colors group">
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center shrink-0",
                    source.type === 'postgres' ? "bg-blue-500/10 text-blue-500" : "bg-emerald-500/10 text-emerald-500"
                  )}>
                    {source.type === 'postgres' ? <Server className="w-6 h-6" /> : <Globe className="w-6 h-6" />}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-white text-lg">{source.name}</h3>
                      <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium uppercase tracking-wider">{source.type}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Connected via secure credentials</p>
                  </div>

                  <div className="flex items-center gap-2 text-emerald-500 text-sm font-medium bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10">
                    <CheckCircle2 className="w-4 h-4" />
                    Active
                  </div>
                  
                  <Button variant="outline" className="border-border hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity">Configure</Button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Add Data Source</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="bg-background border-border"
                placeholder="My Database"
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select 
                value={formData.type}
                onValueChange={(val) => setFormData({...formData, type: val})}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="postgres">PostgreSQL</SelectItem>
                  <SelectItem value="mysql">MySQL</SelectItem>
                  <SelectItem value="rest_api">REST API</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Connection Config (JSON)</Label>
              <Input 
                value={formData.config}
                onChange={(e) => setFormData({...formData, config: e.target.value})}
                className="bg-background border-border font-mono text-xs"
                placeholder='{"host": "localhost", "port": 5432}'
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)} className="border-border hover:bg-white/5">Cancel</Button>
            <Button onClick={handleCreate} disabled={createSource.isPending} className="bg-primary text-primary-foreground">
              {createSource.isPending ? 'Connecting...' : 'Save & Test'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
