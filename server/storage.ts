import { db } from "./db";
import {
  dashboards, panels, dataSources, alerts, integrations,
  savedQueries, dashboardShares, alertTemplates, incidentTimelines,
  onCallSchedules, escalationPolicies, slos, traces, spans, postmortems, signalCorrelations,
  teams, teamMembers, webhooks, notificationChannels, reportSchedules,
  type Dashboard, type InsertDashboard,
  type Panel, type InsertPanel,
  type DataSource, type InsertDataSource,
  type Alert, type InsertAlert,
  type Integration, type InsertIntegration,
  type SavedQuery, type InsertSavedQuery,
  type DashboardShare, type InsertDashboardShare,
  type AlertTemplate, type InsertAlertTemplate,
  type IncidentTimeline, type InsertIncidentTimeline,
  type OnCallSchedule, type InsertOnCallSchedule,
  type EscalationPolicy, type InsertEscalationPolicy,
  type Slo, type InsertSlo,
  type Trace, type InsertTrace,
  type Span, type InsertSpan,
  type Postmortem, type InsertPostmortem,
  type SignalCorrelation, type InsertSignalCorrelation,
  type Team, type InsertTeam,
  type TeamMember, type InsertTeamMember,
  type Webhook, type InsertWebhook,
  type NotificationChannel, type InsertNotificationChannel,
  type ReportSchedule, type InsertReportSchedule
} from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // Dashboards
  getDashboards(): Promise<Dashboard[]>;
  getDashboard(id: number): Promise<Dashboard | undefined>;
  createDashboard(dashboard: InsertDashboard): Promise<Dashboard>;
  updateDashboard(id: number, updates: Partial<InsertDashboard>): Promise<Dashboard>;
  deleteDashboard(id: number): Promise<void>;

  // Panels
  getPanels(dashboardId: number): Promise<Panel[]>;
  createPanel(panel: InsertPanel): Promise<Panel>;
  updatePanel(id: number, updates: Partial<InsertPanel>): Promise<Panel>;
  deletePanel(id: number): Promise<void>;

  // Data Sources
  getDataSources(): Promise<DataSource[]>;
  createDataSource(ds: InsertDataSource): Promise<DataSource>;

  // Alerts
  getAlerts(): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  updateAlert(id: number, updates: Partial<InsertAlert>): Promise<Alert>;

  // Integrations
  getIntegrations(): Promise<Integration[]>;
  getIntegration(serviceId: string): Promise<Integration | undefined>;
  upsertIntegration(integration: InsertIntegration): Promise<Integration>;
  updateIntegrationStatus(serviceId: string, status: string, lastValidatedAt?: Date): Promise<Integration>;
  deleteIntegration(serviceId: string): Promise<void>;

  // Saved Queries
  getSavedQueries(): Promise<SavedQuery[]>;
  getSavedQuery(id: number): Promise<SavedQuery | undefined>;
  createSavedQuery(query: InsertSavedQuery): Promise<SavedQuery>;
  updateSavedQuery(id: number, updates: Partial<InsertSavedQuery>): Promise<SavedQuery>;
  deleteSavedQuery(id: number): Promise<void>;

  // Dashboard Shares
  getDashboardShares(dashboardId: number): Promise<DashboardShare[]>;
  getDashboardShareByToken(token: string): Promise<DashboardShare | undefined>;
  createDashboardShare(share: InsertDashboardShare): Promise<DashboardShare>;
  deleteDashboardShare(id: number): Promise<void>;

  // Alert Templates
  getAlertTemplates(): Promise<AlertTemplate[]>;
  getAlertTemplate(id: number): Promise<AlertTemplate | undefined>;
  createAlertTemplate(template: InsertAlertTemplate): Promise<AlertTemplate>;
  deleteAlertTemplate(id: number): Promise<void>;

  // Incident Timelines
  getIncidentTimeline(incidentId: string): Promise<IncidentTimeline[]>;
  addTimelineEvent(event: InsertIncidentTimeline): Promise<IncidentTimeline>;

  // On-Call Schedules
  getOnCallSchedules(): Promise<OnCallSchedule[]>;
  getOnCallSchedule(id: number): Promise<OnCallSchedule | undefined>;
  createOnCallSchedule(schedule: InsertOnCallSchedule): Promise<OnCallSchedule>;
  updateOnCallSchedule(id: number, updates: Partial<InsertOnCallSchedule>): Promise<OnCallSchedule>;
  deleteOnCallSchedule(id: number): Promise<void>;

  // Escalation Policies
  getEscalationPolicies(): Promise<EscalationPolicy[]>;
  getEscalationPolicy(id: number): Promise<EscalationPolicy | undefined>;
  createEscalationPolicy(policy: InsertEscalationPolicy): Promise<EscalationPolicy>;
  updateEscalationPolicy(id: number, updates: Partial<InsertEscalationPolicy>): Promise<EscalationPolicy>;
  deleteEscalationPolicy(id: number): Promise<void>;

  // SLOs
  getSlos(): Promise<Slo[]>;
  getSlo(id: number): Promise<Slo | undefined>;
  createSlo(slo: InsertSlo): Promise<Slo>;
  updateSlo(id: number, updates: Partial<InsertSlo>): Promise<Slo>;
  deleteSlo(id: number): Promise<void>;

  // Traces
  getTraces(): Promise<Trace[]>;
  getTrace(traceId: string): Promise<Trace | undefined>;
  createTrace(trace: InsertTrace): Promise<Trace>;
  getSpansByTraceId(traceId: string): Promise<Span[]>;
  createSpan(span: InsertSpan): Promise<Span>;

  // Postmortems
  getPostmortems(): Promise<Postmortem[]>;
  getPostmortem(id: number): Promise<Postmortem | undefined>;
  getPostmortemByIncident(incidentId: string): Promise<Postmortem | undefined>;
  createPostmortem(postmortem: InsertPostmortem): Promise<Postmortem>;
  updatePostmortem(id: number, updates: Partial<InsertPostmortem>): Promise<Postmortem>;

  // Signal Correlations
  getSignalCorrelations(): Promise<SignalCorrelation[]>;
  getSignalCorrelation(correlationId: string): Promise<SignalCorrelation | undefined>;
  createSignalCorrelation(correlation: InsertSignalCorrelation): Promise<SignalCorrelation>;
  updateSignalCorrelation(correlationId: string, updates: Partial<InsertSignalCorrelation>): Promise<SignalCorrelation>;

  // Teams
  getTeams(): Promise<Team[]>;
  getTeam(id: number): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: number, updates: Partial<InsertTeam>): Promise<Team>;
  deleteTeam(id: number): Promise<void>;

  // Team Members
  getTeamMembers(teamId: number): Promise<TeamMember[]>;
  addTeamMember(member: InsertTeamMember): Promise<TeamMember>;
  updateTeamMember(id: number, updates: Partial<InsertTeamMember>): Promise<TeamMember>;
  removeTeamMember(id: number): Promise<void>;

  // Webhooks
  getWebhooks(): Promise<Webhook[]>;
  getWebhook(id: number): Promise<Webhook | undefined>;
  createWebhook(webhook: InsertWebhook): Promise<Webhook>;
  updateWebhook(id: number, updates: Partial<InsertWebhook>): Promise<Webhook>;
  deleteWebhook(id: number): Promise<void>;

  // Notification Channels
  getNotificationChannels(): Promise<NotificationChannel[]>;
  getNotificationChannel(id: number): Promise<NotificationChannel | undefined>;
  createNotificationChannel(channel: InsertNotificationChannel): Promise<NotificationChannel>;
  updateNotificationChannel(id: number, updates: Partial<InsertNotificationChannel>): Promise<NotificationChannel>;
  deleteNotificationChannel(id: number): Promise<void>;

  // Report Schedules
  getReportSchedules(): Promise<ReportSchedule[]>;
  getReportSchedule(id: number): Promise<ReportSchedule | undefined>;
  createReportSchedule(schedule: InsertReportSchedule): Promise<ReportSchedule>;
  updateReportSchedule(id: number, updates: Partial<InsertReportSchedule>): Promise<ReportSchedule>;
  deleteReportSchedule(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Dashboards
  async getDashboards(): Promise<Dashboard[]> {
    return await db.select().from(dashboards).orderBy(dashboards.createdAt);
  }

  async getDashboard(id: number): Promise<Dashboard | undefined> {
    const [dashboard] = await db.select().from(dashboards).where(eq(dashboards.id, id));
    return dashboard;
  }

  async createDashboard(insertDashboard: InsertDashboard): Promise<Dashboard> {
    const [dashboard] = await db.insert(dashboards).values(insertDashboard).returning();
    return dashboard;
  }

  async updateDashboard(id: number, updates: Partial<InsertDashboard>): Promise<Dashboard> {
    const [dashboard] = await db.update(dashboards)
      .set(updates)
      .where(eq(dashboards.id, id))
      .returning();
    return dashboard;
  }

  async deleteDashboard(id: number): Promise<void> {
    await db.delete(dashboards).where(eq(dashboards.id, id));
  }

  // Panels
  async getPanels(dashboardId: number): Promise<Panel[]> {
    return await db.select().from(panels).where(eq(panels.dashboardId, dashboardId));
  }

  async createPanel(insertPanel: InsertPanel): Promise<Panel> {
    const [panel] = await db.insert(panels).values(insertPanel).returning();
    return panel;
  }

  async updatePanel(id: number, updates: Partial<InsertPanel>): Promise<Panel> {
    const [panel] = await db.update(panels)
      .set(updates)
      .where(eq(panels.id, id))
      .returning();
    return panel;
  }

  async deletePanel(id: number): Promise<void> {
    await db.delete(panels).where(eq(panels.id, id));
  }

  // Data Sources
  async getDataSources(): Promise<DataSource[]> {
    return await db.select().from(dataSources);
  }

  async createDataSource(insertDataSource: InsertDataSource): Promise<DataSource> {
    const [dataSource] = await db.insert(dataSources).values(insertDataSource).returning();
    return dataSource;
  }

  // Alerts
  async getAlerts(): Promise<Alert[]> {
    return await db.select().from(alerts).orderBy(desc(alerts.createdAt));
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const [alert] = await db.insert(alerts).values(insertAlert).returning();
    return alert;
  }

  async updateAlert(id: number, updates: Partial<InsertAlert>): Promise<Alert> {
    const [alert] = await db.update(alerts)
      .set(updates)
      .where(eq(alerts.id, id))
      .returning();
    return alert;
  }

  // Integrations
  async getIntegrations(): Promise<Integration[]> {
    return await db.select().from(integrations).orderBy(integrations.serviceName);
  }

  async getIntegration(serviceId: string): Promise<Integration | undefined> {
    const [integration] = await db.select().from(integrations).where(eq(integrations.serviceId, serviceId));
    return integration;
  }

  async upsertIntegration(insertIntegration: InsertIntegration): Promise<Integration> {
    const existing = await this.getIntegration(insertIntegration.serviceId);
    if (existing) {
      const [updated] = await db.update(integrations)
        .set({ ...insertIntegration, updatedAt: new Date() })
        .where(eq(integrations.serviceId, insertIntegration.serviceId))
        .returning();
      return updated;
    }
    const [integration] = await db.insert(integrations).values(insertIntegration).returning();
    return integration;
  }

  async updateIntegrationStatus(serviceId: string, status: string, lastValidatedAt?: Date): Promise<Integration> {
    const [integration] = await db.update(integrations)
      .set({ status, lastValidatedAt, updatedAt: new Date() })
      .where(eq(integrations.serviceId, serviceId))
      .returning();
    return integration;
  }

  async deleteIntegration(serviceId: string): Promise<void> {
    await db.delete(integrations).where(eq(integrations.serviceId, serviceId));
  }

  // Saved Queries
  async getSavedQueries(): Promise<SavedQuery[]> {
    return await db.select().from(savedQueries).orderBy(desc(savedQueries.createdAt));
  }

  async getSavedQuery(id: number): Promise<SavedQuery | undefined> {
    const [query] = await db.select().from(savedQueries).where(eq(savedQueries.id, id));
    return query;
  }

  async createSavedQuery(query: InsertSavedQuery): Promise<SavedQuery> {
    const [saved] = await db.insert(savedQueries).values(query).returning();
    return saved;
  }

  async updateSavedQuery(id: number, updates: Partial<InsertSavedQuery>): Promise<SavedQuery> {
    const [updated] = await db.update(savedQueries)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(savedQueries.id, id))
      .returning();
    return updated;
  }

  async deleteSavedQuery(id: number): Promise<void> {
    await db.delete(savedQueries).where(eq(savedQueries.id, id));
  }

  // Dashboard Shares
  async getDashboardShares(dashboardId: number): Promise<DashboardShare[]> {
    return await db.select().from(dashboardShares).where(eq(dashboardShares.dashboardId, dashboardId));
  }

  async getDashboardShareByToken(token: string): Promise<DashboardShare | undefined> {
    const [share] = await db.select().from(dashboardShares).where(eq(dashboardShares.shareToken, token));
    return share;
  }

  async createDashboardShare(share: InsertDashboardShare): Promise<DashboardShare> {
    const [created] = await db.insert(dashboardShares).values(share).returning();
    return created;
  }

  async deleteDashboardShare(id: number): Promise<void> {
    await db.delete(dashboardShares).where(eq(dashboardShares.id, id));
  }

  // Alert Templates
  async getAlertTemplates(): Promise<AlertTemplate[]> {
    return await db.select().from(alertTemplates).orderBy(alertTemplates.name);
  }

  async getAlertTemplate(id: number): Promise<AlertTemplate | undefined> {
    const [template] = await db.select().from(alertTemplates).where(eq(alertTemplates.id, id));
    return template;
  }

  async createAlertTemplate(template: InsertAlertTemplate): Promise<AlertTemplate> {
    const [created] = await db.insert(alertTemplates).values(template).returning();
    return created;
  }

  async deleteAlertTemplate(id: number): Promise<void> {
    await db.delete(alertTemplates).where(eq(alertTemplates.id, id));
  }

  // Incident Timelines
  async getIncidentTimeline(incidentId: string): Promise<IncidentTimeline[]> {
    return await db.select().from(incidentTimelines)
      .where(eq(incidentTimelines.incidentId, incidentId))
      .orderBy(incidentTimelines.timestamp);
  }

  async addTimelineEvent(event: InsertIncidentTimeline): Promise<IncidentTimeline> {
    const [created] = await db.insert(incidentTimelines).values(event).returning();
    return created;
  }

  // On-Call Schedules
  async getOnCallSchedules(): Promise<OnCallSchedule[]> {
    return await db.select().from(onCallSchedules).orderBy(onCallSchedules.name);
  }

  async getOnCallSchedule(id: number): Promise<OnCallSchedule | undefined> {
    const [schedule] = await db.select().from(onCallSchedules).where(eq(onCallSchedules.id, id));
    return schedule;
  }

  async createOnCallSchedule(schedule: InsertOnCallSchedule): Promise<OnCallSchedule> {
    const [created] = await db.insert(onCallSchedules).values(schedule).returning();
    return created;
  }

  async updateOnCallSchedule(id: number, updates: Partial<InsertOnCallSchedule>): Promise<OnCallSchedule> {
    const [updated] = await db.update(onCallSchedules)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(onCallSchedules.id, id))
      .returning();
    return updated;
  }

  async deleteOnCallSchedule(id: number): Promise<void> {
    await db.delete(onCallSchedules).where(eq(onCallSchedules.id, id));
  }

  // Escalation Policies
  async getEscalationPolicies(): Promise<EscalationPolicy[]> {
    return await db.select().from(escalationPolicies).orderBy(escalationPolicies.name);
  }

  async getEscalationPolicy(id: number): Promise<EscalationPolicy | undefined> {
    const [policy] = await db.select().from(escalationPolicies).where(eq(escalationPolicies.id, id));
    return policy;
  }

  async createEscalationPolicy(policy: InsertEscalationPolicy): Promise<EscalationPolicy> {
    const [created] = await db.insert(escalationPolicies).values(policy).returning();
    return created;
  }

  async updateEscalationPolicy(id: number, updates: Partial<InsertEscalationPolicy>): Promise<EscalationPolicy> {
    const [updated] = await db.update(escalationPolicies)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(escalationPolicies.id, id))
      .returning();
    return updated;
  }

  async deleteEscalationPolicy(id: number): Promise<void> {
    await db.delete(escalationPolicies).where(eq(escalationPolicies.id, id));
  }

  // SLOs
  async getSlos(): Promise<Slo[]> {
    return await db.select().from(slos).orderBy(slos.name);
  }

  async getSlo(id: number): Promise<Slo | undefined> {
    const [slo] = await db.select().from(slos).where(eq(slos.id, id));
    return slo;
  }

  async createSlo(slo: InsertSlo): Promise<Slo> {
    const [created] = await db.insert(slos).values(slo).returning();
    return created;
  }

  async updateSlo(id: number, updates: Partial<InsertSlo>): Promise<Slo> {
    const [updated] = await db.update(slos)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(slos.id, id))
      .returning();
    return updated;
  }

  async deleteSlo(id: number): Promise<void> {
    await db.delete(slos).where(eq(slos.id, id));
  }

  // Traces
  async getTraces(): Promise<Trace[]> {
    return await db.select().from(traces).orderBy(desc(traces.startTime));
  }

  async getTrace(traceId: string): Promise<Trace | undefined> {
    const [trace] = await db.select().from(traces).where(eq(traces.traceId, traceId));
    return trace;
  }

  async createTrace(trace: InsertTrace): Promise<Trace> {
    const [created] = await db.insert(traces).values(trace).returning();
    return created;
  }

  async getSpansByTraceId(traceId: string): Promise<Span[]> {
    return await db.select().from(spans).where(eq(spans.traceId, traceId)).orderBy(spans.startTime);
  }

  async createSpan(span: InsertSpan): Promise<Span> {
    const [created] = await db.insert(spans).values(span).returning();
    return created;
  }

  // Postmortems
  async getPostmortems(): Promise<Postmortem[]> {
    return await db.select().from(postmortems).orderBy(desc(postmortems.createdAt));
  }

  async getPostmortem(id: number): Promise<Postmortem | undefined> {
    const [postmortem] = await db.select().from(postmortems).where(eq(postmortems.id, id));
    return postmortem;
  }

  async getPostmortemByIncident(incidentId: string): Promise<Postmortem | undefined> {
    const [postmortem] = await db.select().from(postmortems).where(eq(postmortems.incidentId, incidentId));
    return postmortem;
  }

  async createPostmortem(postmortem: InsertPostmortem): Promise<Postmortem> {
    const [created] = await db.insert(postmortems).values(postmortem).returning();
    return created;
  }

  async updatePostmortem(id: number, updates: Partial<InsertPostmortem>): Promise<Postmortem> {
    const [updated] = await db.update(postmortems)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(postmortems.id, id))
      .returning();
    return updated;
  }

  // Signal Correlations
  async getSignalCorrelations(): Promise<SignalCorrelation[]> {
    return await db.select().from(signalCorrelations).orderBy(desc(signalCorrelations.createdAt));
  }

  async getSignalCorrelation(correlationId: string): Promise<SignalCorrelation | undefined> {
    const [correlation] = await db.select().from(signalCorrelations).where(eq(signalCorrelations.correlationId, correlationId));
    return correlation;
  }

  async createSignalCorrelation(correlation: InsertSignalCorrelation): Promise<SignalCorrelation> {
    const [created] = await db.insert(signalCorrelations).values(correlation).returning();
    return created;
  }

  async updateSignalCorrelation(correlationId: string, updates: Partial<InsertSignalCorrelation>): Promise<SignalCorrelation> {
    const [updated] = await db.update(signalCorrelations)
      .set(updates)
      .where(eq(signalCorrelations.correlationId, correlationId))
      .returning();
    return updated;
  }

  // Teams
  async getTeams(): Promise<Team[]> {
    return await db.select().from(teams).orderBy(teams.name);
  }

  async getTeam(id: number): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team;
  }

  async createTeam(team: InsertTeam): Promise<Team> {
    const [created] = await db.insert(teams).values(team).returning();
    return created;
  }

  async updateTeam(id: number, updates: Partial<InsertTeam>): Promise<Team> {
    const [updated] = await db.update(teams)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(teams.id, id))
      .returning();
    return updated;
  }

  async deleteTeam(id: number): Promise<void> {
    await db.delete(teams).where(eq(teams.id, id));
  }

  // Team Members
  async getTeamMembers(teamId: number): Promise<TeamMember[]> {
    return await db.select().from(teamMembers).where(eq(teamMembers.teamId, teamId));
  }

  async addTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const [created] = await db.insert(teamMembers).values(member).returning();
    return created;
  }

  async updateTeamMember(id: number, updates: Partial<InsertTeamMember>): Promise<TeamMember> {
    const [updated] = await db.update(teamMembers)
      .set(updates)
      .where(eq(teamMembers.id, id))
      .returning();
    return updated;
  }

  async removeTeamMember(id: number): Promise<void> {
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
  }

  // Webhooks
  async getWebhooks(): Promise<Webhook[]> {
    return await db.select().from(webhooks).orderBy(desc(webhooks.createdAt));
  }

  async getWebhook(id: number): Promise<Webhook | undefined> {
    const [webhook] = await db.select().from(webhooks).where(eq(webhooks.id, id));
    return webhook;
  }

  async createWebhook(webhook: InsertWebhook): Promise<Webhook> {
    const [created] = await db.insert(webhooks).values(webhook).returning();
    return created;
  }

  async updateWebhook(id: number, updates: Partial<InsertWebhook>): Promise<Webhook> {
    const [updated] = await db.update(webhooks)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(webhooks.id, id))
      .returning();
    return updated;
  }

  async deleteWebhook(id: number): Promise<void> {
    await db.delete(webhooks).where(eq(webhooks.id, id));
  }

  // Notification Channels
  async getNotificationChannels(): Promise<NotificationChannel[]> {
    return await db.select().from(notificationChannels).orderBy(notificationChannels.name);
  }

  async getNotificationChannel(id: number): Promise<NotificationChannel | undefined> {
    const [channel] = await db.select().from(notificationChannels).where(eq(notificationChannels.id, id));
    return channel;
  }

  async createNotificationChannel(channel: InsertNotificationChannel): Promise<NotificationChannel> {
    const [created] = await db.insert(notificationChannels).values(channel).returning();
    return created;
  }

  async updateNotificationChannel(id: number, updates: Partial<InsertNotificationChannel>): Promise<NotificationChannel> {
    const [updated] = await db.update(notificationChannels)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(notificationChannels.id, id))
      .returning();
    return updated;
  }

  async deleteNotificationChannel(id: number): Promise<void> {
    await db.delete(notificationChannels).where(eq(notificationChannels.id, id));
  }

  // Report Schedules
  async getReportSchedules(): Promise<ReportSchedule[]> {
    return await db.select().from(reportSchedules).orderBy(reportSchedules.name);
  }

  async getReportSchedule(id: number): Promise<ReportSchedule | undefined> {
    const [schedule] = await db.select().from(reportSchedules).where(eq(reportSchedules.id, id));
    return schedule;
  }

  async createReportSchedule(schedule: InsertReportSchedule): Promise<ReportSchedule> {
    const [created] = await db.insert(reportSchedules).values(schedule).returning();
    return created;
  }

  async updateReportSchedule(id: number, updates: Partial<InsertReportSchedule>): Promise<ReportSchedule> {
    const [updated] = await db.update(reportSchedules)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(reportSchedules.id, id))
      .returning();
    return updated;
  }

  async deleteReportSchedule(id: number): Promise<void> {
    await db.delete(reportSchedules).where(eq(reportSchedules.id, id));
  }
}

export const storage = new DatabaseStorage();
