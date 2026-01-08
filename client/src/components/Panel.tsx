import { useState } from "react";
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import { MoreVertical, Edit2, Trash2, Maximize2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Panel as PanelType } from "@shared/schema";
import { cn } from "@/lib/utils";

interface PanelProps {
  panel: PanelType;
  onEdit: (panel: PanelType) => void;
  onDelete: (id: number) => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function Panel({ panel, onEdit, onDelete }: PanelProps) {
  // Parse configs - assume they are JSON compatible
  const dataConfig = panel.dataConfig as any;
  const data = dataConfig.data || [];
  const type = panel.type;

  // Mock data generation if empty (for visualization purposes)
  const chartData = data.length > 0 ? data : [
    { name: 'Jan', value: 400, uv: 240 },
    { name: 'Feb', value: 300, uv: 139 },
    { name: 'Mar', value: 200, uv: 980 },
    { name: 'Apr', value: 278, uv: 390 },
    { name: 'May', value: 189, uv: 480 },
    { name: 'Jun', value: 239, uv: 380 },
  ];

  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="uv" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        );
      case "area":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        );
      case "bar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                itemStyle={{ color: '#e2e8f0' }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.1)" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      case "stat":
        const lastValue = chartData[chartData.length - 1]?.value || 0;
        const prevValue = chartData[chartData.length - 2]?.value || 0;
        const percentChange = prevValue ? ((lastValue - prevValue) / prevValue) * 100 : 0;
        const isPositive = percentChange >= 0;
        
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <span className="text-4xl font-mono font-bold text-white tracking-tight">{lastValue.toLocaleString()}</span>
            <div className={cn("flex items-center gap-1 mt-2 text-sm font-medium", isPositive ? "text-emerald-500" : "text-rose-500")}>
              <span>{isPositive ? "▲" : "▼"} {Math.abs(percentChange).toFixed(1)}%</span>
              <span className="text-muted-foreground ml-1">vs last period</span>
            </div>
          </div>
        );
      default:
        return <div className="flex items-center justify-center h-full text-muted-foreground">Unsupported chart type</div>;
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-lg shadow-black/5 flex flex-col h-[300px] overflow-hidden group hover:border-border/80 transition-all duration-300">
      <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between bg-card/50">
        <h3 className="font-medium text-sm text-foreground/90">{panel.title}</h3>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-muted-foreground hover:text-white transition-colors p-1 rounded hover:bg-white/5 opacity-0 group-hover:opacity-100">
              <MoreVertical className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 bg-card border-border text-foreground">
            <DropdownMenuItem onClick={() => onEdit(panel)} className="cursor-pointer">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Maximize2 className="w-4 h-4 mr-2" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(panel.id)} className="text-destructive focus:text-destructive cursor-pointer">
              <Trash2 className="w-4 h-4 mr-2" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex-1 p-4 min-h-0">
        {renderChart()}
      </div>
    </div>
  );
}
