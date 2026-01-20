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
  apiKey: z.string().min(20, "API key must be at least 20 characters"),
});

export type ConnectIntegrationRequest = z.infer<typeof connectIntegrationSchema>;

// === SAVED QUERIES ===
export const savedQueries = pgTable("saved_queries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  queryType: text("query_type").notNull(), // 'metrics', 'logs', 'traces'
  query: jsonb("query").notNull(), // The actual query configuration
  filters: jsonb("filters"), // Saved filter state
  createdBy: varchar("created_by"),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSavedQuerySchema = createInsertSchema(savedQueries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type SavedQuery = typeof savedQueries.$inferSelect;
export type InsertSavedQuery = z.infer<typeof insertSavedQuerySchema>;

// === DASHBOARD SHARES ===
export const dashboardShares = pgTable("dashboard_shares", {
  id: serial("id").primaryKey(),
  dashboardId: integer("dashboard_id").references(() => dashboards.id),
  shareToken: text("share_token").notNull().unique(),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(true),
  createdBy: varchar("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDashboardShareSchema = createInsertSchema(dashboardShares).omit({
  id: true,
  createdAt: true,
});

export type DashboardShare = typeof dashboardShares.$inferSelect;
export type InsertDashboardShare = z.infer<typeof insertDashboardShareSchema>;

// === ALERT TEMPLATES ===
export const alertTemplates = pgTable("alert_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // 'infrastructure', 'application', 'security', 'custom'
  severity: text("severity").notNull(), // 'info', 'warning', 'critical'
  condition: jsonb("condition").notNull(), // Threshold conditions
  notificationChannels: jsonb("notification_channels"), // Where to send alerts
  isBuiltIn: boolean("is_built_in").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAlertTemplateSchema = createInsertSchema(alertTemplates).omit({
  id: true,
  createdAt: true,
});

export type AlertTemplate = typeof alertTemplates.$inferSelect;
export type InsertAlertTemplate = z.infer<typeof insertAlertTemplateSchema>;

// === INCIDENT TIMELINES ===
export const incidentTimelines = pgTable("incident_timelines", {
  id: serial("id").primaryKey(),
  incidentId: text("incident_id").notNull(),
  eventType: text("event_type").notNull(), // 'created', 'acknowledged', 'escalated', 'resolved', 'comment', 'action'
  eventData: jsonb("event_data"),
  userId: varchar("user_id"),
  userName: text("user_name"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertIncidentTimelineSchema = createInsertSchema(incidentTimelines).omit({
  id: true,
});

export type IncidentTimeline = typeof incidentTimelines.$inferSelect;
export type InsertIncidentTimeline = z.infer<typeof insertIncidentTimelineSchema>;

// === ON-CALL SCHEDULES ===
export const onCallSchedules = pgTable("on_call_schedules", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  timezone: text("timezone").default("UTC"),
  rotationType: text("rotation_type").notNull(), // 'daily', 'weekly', 'custom'
  members: jsonb("members").notNull(), // Array of team members with order
  currentOnCall: varchar("current_on_call"),
  startDate: timestamp("start_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertOnCallScheduleSchema = createInsertSchema(onCallSchedules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type OnCallSchedule = typeof onCallSchedules.$inferSelect;
export type InsertOnCallSchedule = z.infer<typeof insertOnCallScheduleSchema>;

// === ESCALATION POLICIES ===
export const escalationPolicies = pgTable("escalation_policies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  rules: jsonb("rules").notNull(), // Array of escalation rules with conditions and actions
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertEscalationPolicySchema = createInsertSchema(escalationPolicies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type EscalationPolicy = typeof escalationPolicies.$inferSelect;
export type InsertEscalationPolicy = z.infer<typeof insertEscalationPolicySchema>;

// === SLOs (Service Level Objectives) ===
export const slos = pgTable("slos", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  serviceId: text("service_id").notNull(),
  sliType: text("sli_type").notNull(), // 'availability', 'latency', 'error_rate', 'throughput'
  targetPercentage: integer("target_percentage").notNull(), // e.g., 99.9 stored as 999
  windowDays: integer("window_days").default(30), // Rolling window
  currentValue: integer("current_value"), // Current SLI value
  errorBudgetRemaining: integer("error_budget_remaining"), // Percentage remaining
  status: text("status").default("healthy"), // 'healthy', 'at_risk', 'breached'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSloSchema = createInsertSchema(slos).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Slo = typeof slos.$inferSelect;
export type InsertSlo = z.infer<typeof insertSloSchema>;

// === TRACES (Distributed Tracing) ===
export const traces = pgTable("traces", {
  id: serial("id").primaryKey(),
  traceId: text("trace_id").notNull().unique(),
  rootSpanId: text("root_span_id"),
  serviceName: text("service_name").notNull(),
  operationName: text("operation_name").notNull(),
  duration: integer("duration").notNull(), // Duration in milliseconds
  status: text("status").notNull(), // 'ok', 'error'
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  metadata: jsonb("metadata"),
});

export const insertTraceSchema = createInsertSchema(traces).omit({
  id: true,
});

export type Trace = typeof traces.$inferSelect;
export type InsertTrace = z.infer<typeof insertTraceSchema>;

// === SPANS (Part of Traces) ===
export const spans = pgTable("spans", {
  id: serial("id").primaryKey(),
  spanId: text("span_id").notNull().unique(),
  traceId: text("trace_id").notNull(),
  parentSpanId: text("parent_span_id"),
  serviceName: text("service_name").notNull(),
  operationName: text("operation_name").notNull(),
  duration: integer("duration").notNull(),
  status: text("status").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  tags: jsonb("tags"),
  logs: jsonb("logs"),
});

export const insertSpanSchema = createInsertSchema(spans).omit({
  id: true,
});

export type Span = typeof spans.$inferSelect;
export type InsertSpan = z.infer<typeof insertSpanSchema>;

// === POSTMORTEMS ===
export const postmortems = pgTable("postmortems", {
  id: serial("id").primaryKey(),
  incidentId: text("incident_id").notNull(),
  title: text("title").notNull(),
  summary: text("summary"),
  impact: text("impact"),
  rootCause: text("root_cause"),
  timeline: jsonb("timeline"), // Key events during incident
  lessonsLearned: jsonb("lessons_learned"), // Array of lessons
  actionItems: jsonb("action_items"), // Follow-up tasks
  participants: jsonb("participants"), // People involved
  status: text("status").default("draft"), // 'draft', 'review', 'published'
  aiGenerated: boolean("ai_generated").default(false),
  createdBy: varchar("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  publishedAt: timestamp("published_at"),
});

export const insertPostmortemSchema = createInsertSchema(postmortems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
});

export type Postmortem = typeof postmortems.$inferSelect;
export type InsertPostmortem = z.infer<typeof insertPostmortemSchema>;

// === SIGNAL CORRELATIONS ===
export const signalCorrelations = pgTable("signal_correlations", {
  id: serial("id").primaryKey(),
  correlationId: text("correlation_id").notNull().unique(),
  alertIds: jsonb("alert_ids"), // Related alerts
  logPatterns: jsonb("log_patterns"), // Related log patterns
  metricAnomalies: jsonb("metric_anomalies"), // Related metric anomalies
  traceIds: jsonb("trace_ids"), // Related traces
  serviceIds: jsonb("service_ids"), // Affected services
  severity: text("severity").notNull(),
  status: text("status").default("active"),
  aiAnalysis: text("ai_analysis"), // AI-generated analysis
  suggestedCause: text("suggested_cause"),
  confidence: integer("confidence"), // AI confidence score 0-100
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

export const insertSignalCorrelationSchema = createInsertSchema(signalCorrelations).omit({
  id: true,
  createdAt: true,
  resolvedAt: true,
});

export type SignalCorrelation = typeof signalCorrelations.$inferSelect;
export type InsertSignalCorrelation = z.infer<typeof insertSignalCorrelationSchema>;

// === API CONTRACT TYPES ===
export type CreateDashboardRequest = InsertDashboard;
export type UpdateDashboardRequest = Partial<InsertDashboard>;

export type CreatePanelRequest = InsertPanel;
export type UpdatePanelRequest = Partial<InsertPanel>;

export type CreateDataSourceRequest = InsertDataSource;
export type UpdateDataSourceRequest = Partial<InsertDataSource>;

export type CreateAlertRequest = InsertAlert;
export type UpdateAlertRequest = Partial<InsertAlert>;
