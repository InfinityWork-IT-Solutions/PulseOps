import { pgTable, text, serial, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === DASHBOARDS ===
export const dashboards = pgTable("dashboards", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  isFavorite: boolean("is_favorite").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// === PANELS (WIDGETS) ===
export const panels = pgTable("panels", {
  id: serial("id").primaryKey(),
  dashboardId: serial("dashboard_id").references(() => dashboards.id),
  title: text("title").notNull(),
  type: text("type").notNull(), // 'line', 'bar', 'area', 'pie', 'stat'
  dataConfig: jsonb("data_config").notNull(), // Query configuration or mock data definition
  layoutConfig: jsonb("layout_config").notNull(), // { x, y, w, h } for grid layout
  createdAt: timestamp("created_at").defaultNow(),
});

// === DATA SOURCES ===
export const dataSources = pgTable("data_sources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'postgres', 'rest_api', 'mock'
  config: jsonb("config").notNull(), // Connection details
  createdAt: timestamp("created_at").defaultNow(),
});

// === SCHEMAS ===
export const insertDashboardSchema = createInsertSchema(dashboards).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertPanelSchema = createInsertSchema(panels).omit({ 
  id: true, 
  createdAt: true 
});

export const insertDataSourceSchema = createInsertSchema(dataSources).omit({ 
  id: true, 
  createdAt: true 
});

// === TYPES ===
export type Dashboard = typeof dashboards.$inferSelect;
export type InsertDashboard = z.infer<typeof insertDashboardSchema>;

export type Panel = typeof panels.$inferSelect;
export type InsertPanel = z.infer<typeof insertPanelSchema>;

export type DataSource = typeof dataSources.$inferSelect;
export type InsertDataSource = z.infer<typeof insertDataSourceSchema>;

// === API CONTRACT TYPES ===
export type CreateDashboardRequest = InsertDashboard;
export type UpdateDashboardRequest = Partial<InsertDashboard>;

export type CreatePanelRequest = InsertPanel;
export type UpdatePanelRequest = Partial<InsertPanel>;

export type CreateDataSourceRequest = InsertDataSource;
export type UpdateDataSourceRequest = Partial<InsertDataSource>;
