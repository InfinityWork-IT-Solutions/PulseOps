import { pgTable, text, serial, timestamp, boolean, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";
import { index, varchar } from "drizzle-orm/pg-core";

// === AUTH MODELS ===
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

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
  dashboardId: integer("dashboard_id").references(() => dashboards.id),
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

// === ALERTS ===
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  severity: text("severity").notNull(), // 'info', 'warning', 'critical'
  status: text("status").notNull().default("active"), // 'active', 'resolved'
  panelId: integer("panel_id").references(() => panels.id),
  thresholdValue: integer("threshold_value"),
  currentValue: integer("current_value"),
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
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

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
  resolvedAt: true
});

// === TYPES ===
export type Dashboard = typeof dashboards.$inferSelect;
export type InsertDashboard = z.infer<typeof insertDashboardSchema>;

export type Panel = typeof panels.$inferSelect;
export type InsertPanel = z.infer<typeof insertPanelSchema>;

export type DataSource = typeof dataSources.$inferSelect;
export type InsertDataSource = z.infer<typeof insertDataSourceSchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;

// === INTEGRATIONS ===
export const integrations = pgTable("integrations", {
  id: serial("id").primaryKey(),
  serviceId: text("service_id").notNull().unique(),
  serviceName: text("service_name").notNull(),
  category: text("category").notNull(),
  status: text("status").notNull().default("disconnected"), // 'connected', 'disconnected', 'error'
  lastValidatedAt: timestamp("last_validated_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertIntegrationSchema = createInsertSchema(integrations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Integration = typeof integrations.$inferSelect;
export type InsertIntegration = z.infer<typeof insertIntegrationSchema>;

// Validation schema for connecting an integration (requires API key)
export const connectIntegrationSchema = z.object({
  serviceId: z.string().min(1, "Service ID is required"),
  apiKey: z.string().min(10, "API key must be at least 10 characters"),
});

export type ConnectIntegrationRequest = z.infer<typeof connectIntegrationSchema>;

// === API CONTRACT TYPES ===
export type CreateDashboardRequest = InsertDashboard;
export type UpdateDashboardRequest = Partial<InsertDashboard>;

export type CreatePanelRequest = InsertPanel;
export type UpdatePanelRequest = Partial<InsertPanel>;

export type CreateDataSourceRequest = InsertDataSource;
export type UpdateDataSourceRequest = Partial<InsertDataSource>;

export type CreateAlertRequest = InsertAlert;
export type UpdateAlertRequest = Partial<InsertAlert>;
