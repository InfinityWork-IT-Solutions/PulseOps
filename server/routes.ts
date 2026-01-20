import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // === Dashboards ===
  app.get(api.dashboards.list.path, async (_req, res) => {
    const dashboards = await storage.getDashboards();
    res.json(dashboards);
  });

  app.get(api.dashboards.get.path, async (req, res) => {
    const dashboard = await storage.getDashboard(Number(req.params.id));
    if (!dashboard) {
      return res.status(404).json({ message: "Dashboard not found" });
    }
    res.json(dashboard);
  });

  app.post(api.dashboards.create.path, async (req, res) => {
    try {
      const input = api.dashboards.create.input.parse(req.body);
      const dashboard = await storage.createDashboard(input);
      res.status(201).json(dashboard);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.dashboards.update.path, async (req, res) => {
    try {
      const input = api.dashboards.update.input.parse(req.body);
      const dashboard = await storage.updateDashboard(Number(req.params.id), input);
      if (!dashboard) {
        return res.status(404).json({ message: "Dashboard not found" });
      }
      res.json(dashboard);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.dashboards.delete.path, async (req, res) => {
    const dashboard = await storage.getDashboard(Number(req.params.id));
    if (!dashboard) {
      return res.status(404).json({ message: "Dashboard not found" });
    }
    await storage.deleteDashboard(Number(req.params.id));
    res.status(204).send();
  });

  // === Panels ===
  app.get(api.panels.list.path, async (req, res) => {
    const panels = await storage.getPanels(Number(req.params.dashboardId));
    res.json(panels);
  });

  app.post(api.panels.create.path, async (req, res) => {
    try {
      const input = api.panels.create.input.parse(req.body);
      const panel = await storage.createPanel(input);
      res.status(201).json(panel);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.panels.update.path, async (req, res) => {
    try {
      const input = api.panels.update.input.parse(req.body);
      const panel = await storage.updatePanel(Number(req.params.id), input);
      res.json(panel);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.panels.delete.path, async (req, res) => {
    await storage.deletePanel(Number(req.params.id));
    res.status(204).send();
  });

  // === Data Sources ===
  app.get(api.dataSources.list.path, async (_req, res) => {
    const dataSources = await storage.getDataSources();
    res.json(dataSources);
  });

  app.post(api.dataSources.create.path, async (req, res) => {
    try {
      const input = api.dataSources.create.input.parse(req.body);
      const dataSource = await storage.createDataSource(input);
      res.status(201).json(dataSource);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // === Alerts ===
  app.get(api.alerts.list.path, async (_req, res) => {
    const alerts = await storage.getAlerts();
    res.json(alerts);
  });

  app.patch(api.alerts.update.path, async (req, res) => {
    try {
      const input = api.alerts.update.input.parse(req.body);
      const alert = await storage.updateAlert(Number(req.params.id), {
        status: input.status,
        ...(input.resolvedAt && { resolvedAt: new Date(input.resolvedAt) })
      } as any);
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      res.json(alert);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // === Integrations ===
  app.get(api.integrations.list.path, async (_req, res) => {
    const integrations = await storage.getIntegrations();
    res.json(integrations);
  });

  app.post(api.integrations.connect.path, async (req, res) => {
    try {
      const input = api.integrations.connect.input.parse(req.body);
      
      // Validate the API key format and length
      const isValidKey = validateApiKey(input.serviceId, input.apiKey);
      
      if (!isValidKey) {
        return res.status(401).json({ 
          message: "Invalid API key. Please check your key and try again.",
          valid: false 
        });
      }
      
      // API key is valid - store connection status (NOT the key itself)
      const integration = await storage.upsertIntegration({
        serviceId: input.serviceId,
        serviceName: input.serviceName,
        category: input.category,
        status: "connected",
        lastValidatedAt: new Date(),
      });
      
      res.json(integration);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.integrations.disconnect.path, async (req, res) => {
    const existing = await storage.getIntegration(req.params.serviceId);
    if (!existing) {
      return res.status(404).json({ message: "Integration not found" });
    }
    await storage.deleteIntegration(req.params.serviceId);
    res.status(204).send();
  });

  // === Saved Queries ===
  app.get("/api/saved-queries", async (_req, res) => {
    const queries = await storage.getSavedQueries();
    res.json(queries);
  });

  app.post("/api/saved-queries", async (req, res) => {
    try {
      const query = await storage.createSavedQuery(req.body);
      res.status(201).json(query);
    } catch (err) {
      res.status(400).json({ message: "Failed to save query" });
    }
  });

  app.delete("/api/saved-queries/:id", async (req, res) => {
    await storage.deleteSavedQuery(Number(req.params.id));
    res.status(204).send();
  });

  // === Dashboard Shares ===
  app.get("/api/dashboards/:dashboardId/shares", async (req, res) => {
    const shares = await storage.getDashboardShares(Number(req.params.dashboardId));
    res.json(shares);
  });

  app.get("/api/share/:token", async (req, res) => {
    const share = await storage.getDashboardShareByToken(req.params.token);
    if (!share || !share.isActive) {
      return res.status(404).json({ message: "Share link not found or expired" });
    }
    if (share.expiresAt && new Date(share.expiresAt) < new Date()) {
      return res.status(410).json({ message: "Share link has expired" });
    }
    const dashboard = await storage.getDashboard(share.dashboardId!);
    const panels = await storage.getPanels(share.dashboardId!);
    res.json({ dashboard, panels });
  });

  app.post("/api/dashboards/:dashboardId/shares", async (req, res) => {
    const token = generateShareToken();
    const share = await storage.createDashboardShare({
      dashboardId: Number(req.params.dashboardId),
      shareToken: token,
      expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : null,
      isActive: true,
    });
    res.status(201).json(share);
  });

  app.delete("/api/shares/:id", async (req, res) => {
    await storage.deleteDashboardShare(Number(req.params.id));
    res.status(204).send();
  });

  // === Alert Templates ===
  app.get("/api/alert-templates", async (_req, res) => {
    const templates = await storage.getAlertTemplates();
    res.json(templates);
  });

  app.post("/api/alert-templates", async (req, res) => {
    try {
      const template = await storage.createAlertTemplate(req.body);
      res.status(201).json(template);
    } catch (err) {
      res.status(400).json({ message: "Failed to create template" });
    }
  });

  app.delete("/api/alert-templates/:id", async (req, res) => {
    await storage.deleteAlertTemplate(Number(req.params.id));
    res.status(204).send();
  });

  // === Incident Timelines ===
  app.get("/api/incidents/:incidentId/timeline", async (req, res) => {
    const timeline = await storage.getIncidentTimeline(req.params.incidentId);
    res.json(timeline);
  });

  app.post("/api/incidents/:incidentId/timeline", async (req, res) => {
    const event = await storage.addTimelineEvent({
      incidentId: req.params.incidentId,
      eventType: req.body.eventType,
      eventData: req.body.eventData,
      userId: req.body.userId,
      userName: req.body.userName,
      timestamp: new Date(),
    });
    res.status(201).json(event);
  });

  // === On-Call Schedules ===
  app.get("/api/on-call", async (_req, res) => {
    const schedules = await storage.getOnCallSchedules();
    res.json(schedules);
  });

  app.get("/api/on-call/:id", async (req, res) => {
    const schedule = await storage.getOnCallSchedule(Number(req.params.id));
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    res.json(schedule);
  });

  app.post("/api/on-call", async (req, res) => {
    try {
      const schedule = await storage.createOnCallSchedule(req.body);
      res.status(201).json(schedule);
    } catch (err) {
      res.status(400).json({ message: "Failed to create schedule" });
    }
  });

  app.put("/api/on-call/:id", async (req, res) => {
    const schedule = await storage.updateOnCallSchedule(Number(req.params.id), req.body);
    res.json(schedule);
  });

  app.delete("/api/on-call/:id", async (req, res) => {
    await storage.deleteOnCallSchedule(Number(req.params.id));
    res.status(204).send();
  });

  // === Escalation Policies ===
  app.get("/api/escalation-policies", async (_req, res) => {
    const policies = await storage.getEscalationPolicies();
    res.json(policies);
  });

  app.post("/api/escalation-policies", async (req, res) => {
    try {
      const policy = await storage.createEscalationPolicy(req.body);
      res.status(201).json(policy);
    } catch (err) {
      res.status(400).json({ message: "Failed to create policy" });
    }
  });

  app.put("/api/escalation-policies/:id", async (req, res) => {
    const policy = await storage.updateEscalationPolicy(Number(req.params.id), req.body);
    res.json(policy);
  });

  app.delete("/api/escalation-policies/:id", async (req, res) => {
    await storage.deleteEscalationPolicy(Number(req.params.id));
    res.status(204).send();
  });

  // === SLOs ===
  app.get("/api/slos", async (_req, res) => {
    const sloList = await storage.getSlos();
    res.json(sloList);
  });

  app.get("/api/slos/:id", async (req, res) => {
    const slo = await storage.getSlo(Number(req.params.id));
    if (!slo) {
      return res.status(404).json({ message: "SLO not found" });
    }
    res.json(slo);
  });

  app.post("/api/slos", async (req, res) => {
    try {
      const slo = await storage.createSlo(req.body);
      res.status(201).json(slo);
    } catch (err) {
      res.status(400).json({ message: "Failed to create SLO" });
    }
  });

  app.put("/api/slos/:id", async (req, res) => {
    const slo = await storage.updateSlo(Number(req.params.id), req.body);
    res.json(slo);
  });

  app.delete("/api/slos/:id", async (req, res) => {
    await storage.deleteSlo(Number(req.params.id));
    res.status(204).send();
  });

  // === Traces (APM) ===
  app.get("/api/traces", async (_req, res) => {
    const traceList = await storage.getTraces();
    res.json(traceList);
  });

  app.get("/api/traces/:traceId", async (req, res) => {
    const trace = await storage.getTrace(req.params.traceId);
    if (!trace) {
      return res.status(404).json({ message: "Trace not found" });
    }
    const traceSpans = await storage.getSpansByTraceId(req.params.traceId);
    res.json({ trace, spans: traceSpans });
  });

  app.post("/api/traces", async (req, res) => {
    try {
      const trace = await storage.createTrace(req.body);
      res.status(201).json(trace);
    } catch (err) {
      res.status(400).json({ message: "Failed to create trace" });
    }
  });

  app.post("/api/spans", async (req, res) => {
    try {
      const span = await storage.createSpan(req.body);
      res.status(201).json(span);
    } catch (err) {
      res.status(400).json({ message: "Failed to create span" });
    }
  });

  // === Postmortems ===
  app.get("/api/postmortems", async (_req, res) => {
    const postmortemList = await storage.getPostmortems();
    res.json(postmortemList);
  });

  app.get("/api/postmortems/:id", async (req, res) => {
    const postmortem = await storage.getPostmortem(Number(req.params.id));
    if (!postmortem) {
      return res.status(404).json({ message: "Postmortem not found" });
    }
    res.json(postmortem);
  });

  app.get("/api/incidents/:incidentId/postmortem", async (req, res) => {
    const postmortem = await storage.getPostmortemByIncident(req.params.incidentId);
    if (!postmortem) {
      return res.status(404).json({ message: "Postmortem not found" });
    }
    res.json(postmortem);
  });

  app.post("/api/postmortems", async (req, res) => {
    try {
      const postmortem = await storage.createPostmortem(req.body);
      res.status(201).json(postmortem);
    } catch (err) {
      res.status(400).json({ message: "Failed to create postmortem" });
    }
  });

  app.put("/api/postmortems/:id", async (req, res) => {
    const postmortem = await storage.updatePostmortem(Number(req.params.id), req.body);
    res.json(postmortem);
  });

  // === Signal Correlations ===
  app.get("/api/correlations", async (_req, res) => {
    const correlations = await storage.getSignalCorrelations();
    res.json(correlations);
  });

  app.get("/api/correlations/:correlationId", async (req, res) => {
    const correlation = await storage.getSignalCorrelation(req.params.correlationId);
    if (!correlation) {
      return res.status(404).json({ message: "Correlation not found" });
    }
    res.json(correlation);
  });

  app.post("/api/correlations", async (req, res) => {
    try {
      const correlation = await storage.createSignalCorrelation(req.body);
      res.status(201).json(correlation);
    } catch (err) {
      res.status(400).json({ message: "Failed to create correlation" });
    }
  });

  app.put("/api/correlations/:correlationId", async (req, res) => {
    const correlation = await storage.updateSignalCorrelation(req.params.correlationId, req.body);
    res.json(correlation);
  });

  // === Teams ===
  app.get("/api/teams", async (_req, res) => {
    const teams = await storage.getTeams();
    res.json(teams);
  });

  app.get("/api/teams/:id", async (req, res) => {
    const team = await storage.getTeam(Number(req.params.id));
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    res.json(team);
  });

  app.post("/api/teams", async (req, res) => {
    try {
      const team = await storage.createTeam(req.body);
      res.status(201).json(team);
    } catch (err) {
      res.status(400).json({ message: "Failed to create team" });
    }
  });

  app.put("/api/teams/:id", async (req, res) => {
    const team = await storage.updateTeam(Number(req.params.id), req.body);
    res.json(team);
  });

  app.delete("/api/teams/:id", async (req, res) => {
    await storage.deleteTeam(Number(req.params.id));
    res.status(204).send();
  });

  // === Team Members ===
  app.get("/api/teams/:teamId/members", async (req, res) => {
    const members = await storage.getTeamMembers(Number(req.params.teamId));
    res.json(members);
  });

  app.post("/api/teams/:teamId/members", async (req, res) => {
    try {
      const member = await storage.addTeamMember({
        ...req.body,
        teamId: Number(req.params.teamId)
      });
      res.status(201).json(member);
    } catch (err) {
      res.status(400).json({ message: "Failed to add team member" });
    }
  });

  app.put("/api/team-members/:id", async (req, res) => {
    const member = await storage.updateTeamMember(Number(req.params.id), req.body);
    res.json(member);
  });

  app.delete("/api/team-members/:id", async (req, res) => {
    await storage.removeTeamMember(Number(req.params.id));
    res.status(204).send();
  });

  // === Webhooks ===
  app.get("/api/webhooks", async (_req, res) => {
    const webhooks = await storage.getWebhooks();
    res.json(webhooks);
  });

  app.get("/api/webhooks/:id", async (req, res) => {
    const webhook = await storage.getWebhook(Number(req.params.id));
    if (!webhook) {
      return res.status(404).json({ message: "Webhook not found" });
    }
    res.json(webhook);
  });

  app.post("/api/webhooks", async (req, res) => {
    try {
      const webhook = await storage.createWebhook(req.body);
      res.status(201).json(webhook);
    } catch (err) {
      res.status(400).json({ message: "Failed to create webhook" });
    }
  });

  app.put("/api/webhooks/:id", async (req, res) => {
    const webhook = await storage.updateWebhook(Number(req.params.id), req.body);
    res.json(webhook);
  });

  app.delete("/api/webhooks/:id", async (req, res) => {
    await storage.deleteWebhook(Number(req.params.id));
    res.status(204).send();
  });

  app.post("/api/webhooks/:id/test", async (req, res) => {
    const webhook = await storage.getWebhook(Number(req.params.id));
    if (!webhook) {
      return res.status(404).json({ message: "Webhook not found" });
    }
    // Mock test - in production, this would actually send a test payload
    res.json({ success: true, message: "Test payload sent successfully" });
  });

  // === Notification Channels ===
  app.get("/api/notification-channels", async (_req, res) => {
    const channels = await storage.getNotificationChannels();
    res.json(channels);
  });

  app.get("/api/notification-channels/:id", async (req, res) => {
    const channel = await storage.getNotificationChannel(Number(req.params.id));
    if (!channel) {
      return res.status(404).json({ message: "Notification channel not found" });
    }
    res.json(channel);
  });

  app.post("/api/notification-channels", async (req, res) => {
    try {
      const channel = await storage.createNotificationChannel(req.body);
      res.status(201).json(channel);
    } catch (err) {
      res.status(400).json({ message: "Failed to create notification channel" });
    }
  });

  app.put("/api/notification-channels/:id", async (req, res) => {
    const channel = await storage.updateNotificationChannel(Number(req.params.id), req.body);
    res.json(channel);
  });

  app.delete("/api/notification-channels/:id", async (req, res) => {
    await storage.deleteNotificationChannel(Number(req.params.id));
    res.status(204).send();
  });

  // === Report Schedules ===
  app.get("/api/report-schedules", async (_req, res) => {
    const schedules = await storage.getReportSchedules();
    res.json(schedules);
  });

  app.get("/api/report-schedules/:id", async (req, res) => {
    const schedule = await storage.getReportSchedule(Number(req.params.id));
    if (!schedule) {
      return res.status(404).json({ message: "Report schedule not found" });
    }
    res.json(schedule);
  });

  app.post("/api/report-schedules", async (req, res) => {
    try {
      const schedule = await storage.createReportSchedule(req.body);
      res.status(201).json(schedule);
    } catch (err) {
      res.status(400).json({ message: "Failed to create report schedule" });
    }
  });

  app.put("/api/report-schedules/:id", async (req, res) => {
    const schedule = await storage.updateReportSchedule(Number(req.params.id), req.body);
    res.json(schedule);
  });

  app.delete("/api/report-schedules/:id", async (req, res) => {
    await storage.deleteReportSchedule(Number(req.params.id));
    res.status(204).send();
  });

  await seedDatabase();
  await seedAlerts();
  await seedAlertTemplates();
  await seedSlos();
  await seedTraces();
  await seedCorrelations();

  return httpServer;
}

async function seedDatabase() {
  const existing = await storage.getDashboards();
  if (existing.length === 0) {
    // Create 'General' Dashboard
    const dashboard = await storage.createDashboard({
      title: "PulseOps Overview",
      description: "Overview of system metrics",
      isFavorite: true,
    });

    // Add some panels
    await storage.createPanel({
      dashboardId: dashboard.id,
      title: "Server CPU Usage",
      type: "line",
      dataConfig: {
        mock: [
          { time: "10:00", value: 30 },
          { time: "10:05", value: 45 },
          { time: "10:10", value: 35 },
          { time: "10:15", value: 60 },
          { time: "10:20", value: 55 },
          { time: "10:25", value: 80 },
        ],
        xKey: "time",
        yKey: "value"
      },
      layoutConfig: { w: 6, h: 8 },
    });

    await storage.createPanel({
      dashboardId: dashboard.id,
      title: "Memory Usage",
      type: "area",
      dataConfig: {
        mock: [
          { time: "10:00", value: 2048 },
          { time: "10:05", value: 2100 },
          { time: "10:10", value: 2080 },
          { time: "10:15", value: 2300 },
          { time: "10:20", value: 2250 },
          { time: "10:25", value: 2400 },
        ],
        xKey: "time",
        yKey: "value"
      },
      layoutConfig: { w: 6, h: 8 },
    });

     await storage.createPanel({
      dashboardId: dashboard.id,
      title: "Active Users",
      type: "stat",
      dataConfig: {
        value: 1245,
        trend: 12
      },
      layoutConfig: { w: 3, h: 4 },
    });
  }
}

// Generate a random share token
function generateShareToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// API key validation - checks basic requirements
// In production, this would make an actual API call to verify the key with the service
function validateApiKey(_serviceId: string, apiKey: string): boolean {
  // Basic validation - key must be non-empty and have minimum length
  if (!apiKey || typeof apiKey !== 'string') {
    return false;
  }
  
  // Minimum 20 characters for security
  if (apiKey.trim().length < 20) {
    return false;
  }
  
  // Key must contain only valid characters (alphanumeric + common special chars used in API keys)
  if (!/^[A-Za-z0-9+/_=-]+$/.test(apiKey.trim())) {
    return false;
  }
  
  return true;
}

async function seedAlerts() {
  const existingAlerts = await storage.getAlerts();
  if (existingAlerts.length === 0) {
    await storage.createAlert({
      title: "High CPU Usage",
      description: "Server CPU usage exceeded 85% threshold",
      severity: "critical",
      status: "active",
      thresholdValue: 85,
      currentValue: 92,
    });

    await storage.createAlert({
      title: "Memory Warning",
      description: "Memory usage approaching limit at 75%",
      severity: "warning",
      status: "active",
      thresholdValue: 80,
      currentValue: 75,
    });

    await storage.createAlert({
      title: "Database Connection Pool",
      description: "Connection pool utilization is high",
      severity: "warning",
      status: "active",
      thresholdValue: 90,
      currentValue: 78,
    });

    await storage.createAlert({
      title: "API Response Time",
      description: "Average response time increased to 450ms",
      severity: "info",
      status: "resolved",
      thresholdValue: 500,
      currentValue: 450,
    });
  }
}

async function seedAlertTemplates() {
  const existing = await storage.getAlertTemplates();
  if (existing.length === 0) {
    await storage.createAlertTemplate({
      name: "High CPU Usage",
      description: "Alert when CPU usage exceeds threshold",
      category: "infrastructure",
      severity: "critical",
      condition: { metric: "cpu_usage", operator: ">", threshold: 85 },
      isBuiltIn: true,
    });

    await storage.createAlertTemplate({
      name: "Memory Pressure",
      description: "Alert when memory usage is high",
      category: "infrastructure",
      severity: "warning",
      condition: { metric: "memory_usage", operator: ">", threshold: 80 },
      isBuiltIn: true,
    });

    await storage.createAlertTemplate({
      name: "Error Rate Spike",
      description: "Alert when error rate exceeds normal levels",
      category: "application",
      severity: "critical",
      condition: { metric: "error_rate", operator: ">", threshold: 5 },
      isBuiltIn: true,
    });

    await storage.createAlertTemplate({
      name: "High Latency",
      description: "Alert when response time is slow",
      category: "application",
      severity: "warning",
      condition: { metric: "p99_latency", operator: ">", threshold: 500 },
      isBuiltIn: true,
    });

    await storage.createAlertTemplate({
      name: "Disk Space Low",
      description: "Alert when disk space is running low",
      category: "infrastructure",
      severity: "warning",
      condition: { metric: "disk_usage", operator: ">", threshold: 90 },
      isBuiltIn: true,
    });

    await storage.createAlertTemplate({
      name: "Failed Login Attempts",
      description: "Alert on suspicious login activity",
      category: "security",
      severity: "critical",
      condition: { metric: "failed_logins", operator: ">", threshold: 10 },
      isBuiltIn: true,
    });
  }
}

async function seedSlos() {
  const existing = await storage.getSlos();
  if (existing.length === 0) {
    await storage.createSlo({
      name: "API Availability",
      description: "99.9% uptime for core API endpoints",
      serviceId: "api-gateway",
      sliType: "availability",
      targetPercentage: 999, // 99.9%
      windowDays: 30,
      currentValue: 998, // 99.8%
      errorBudgetRemaining: 72,
      status: "healthy",
    });

    await storage.createSlo({
      name: "Checkout Latency",
      description: "P99 latency under 200ms for checkout flow",
      serviceId: "checkout-service",
      sliType: "latency",
      targetPercentage: 950, // 95%
      windowDays: 7,
      currentValue: 920, // 92%
      errorBudgetRemaining: 15,
      status: "at_risk",
    });

    await storage.createSlo({
      name: "Database Error Rate",
      description: "Error rate below 0.1% for database operations",
      serviceId: "database-cluster",
      sliType: "error_rate",
      targetPercentage: 999, // 99.9%
      windowDays: 30,
      currentValue: 1000, // 100%
      errorBudgetRemaining: 100,
      status: "healthy",
    });

    await storage.createSlo({
      name: "Payment Processing",
      description: "99.99% success rate for payment transactions",
      serviceId: "payment-service",
      sliType: "availability",
      targetPercentage: 9999, // 99.99%
      windowDays: 30,
      currentValue: 9985, // 99.85%
      errorBudgetRemaining: -5,
      status: "breached",
    });
  }
}

async function seedTraces() {
  const existing = await storage.getTraces();
  if (existing.length === 0) {
    const now = new Date();
    
    // Trace 1: Normal request
    await storage.createTrace({
      traceId: "trace-001-abc123",
      rootSpanId: "span-001",
      serviceName: "api-gateway",
      operationName: "GET /api/users",
      duration: 45,
      status: "ok",
      startTime: new Date(now.getTime() - 60000),
      endTime: new Date(now.getTime() - 59955),
      metadata: { userId: "user-123", region: "us-east-1" },
    });

    // Trace 2: Slow request
    await storage.createTrace({
      traceId: "trace-002-def456",
      rootSpanId: "span-010",
      serviceName: "checkout-service",
      operationName: "POST /api/checkout",
      duration: 2500,
      status: "ok",
      startTime: new Date(now.getTime() - 120000),
      endTime: new Date(now.getTime() - 117500),
      metadata: { orderId: "order-789", paymentMethod: "card" },
    });

    // Trace 3: Error request
    await storage.createTrace({
      traceId: "trace-003-ghi789",
      rootSpanId: "span-020",
      serviceName: "payment-service",
      operationName: "POST /api/charge",
      duration: 150,
      status: "error",
      startTime: new Date(now.getTime() - 180000),
      endTime: new Date(now.getTime() - 179850),
      metadata: { error: "Payment gateway timeout", retries: 3 },
    });

    // Add spans for trace-001
    await storage.createSpan({
      spanId: "span-001",
      traceId: "trace-001-abc123",
      parentSpanId: null,
      serviceName: "api-gateway",
      operationName: "GET /api/users",
      duration: 45,
      status: "ok",
      startTime: new Date(now.getTime() - 60000),
      endTime: new Date(now.getTime() - 59955),
      tags: { "http.method": "GET", "http.status_code": 200 },
    });

    await storage.createSpan({
      spanId: "span-002",
      traceId: "trace-001-abc123",
      parentSpanId: "span-001",
      serviceName: "user-service",
      operationName: "getUserById",
      duration: 25,
      status: "ok",
      startTime: new Date(now.getTime() - 59990),
      endTime: new Date(now.getTime() - 59965),
      tags: { "db.type": "postgres", "db.statement": "SELECT * FROM users" },
    });

    await storage.createSpan({
      spanId: "span-003",
      traceId: "trace-001-abc123",
      parentSpanId: "span-002",
      serviceName: "cache",
      operationName: "redis.get",
      duration: 5,
      status: "ok",
      startTime: new Date(now.getTime() - 59985),
      endTime: new Date(now.getTime() - 59980),
      tags: { "cache.hit": true },
    });
  }
}

async function seedCorrelations() {
  const existing = await storage.getSignalCorrelations();
  if (existing.length === 0) {
    await storage.createSignalCorrelation({
      correlationId: "corr-001-cpu-memory",
      alertIds: [1, 2],
      logPatterns: ["OutOfMemoryError", "GC overhead limit exceeded"],
      metricAnomalies: ["cpu.usage > 85%", "memory.usage > 80%"],
      traceIds: ["trace-002-def456", "trace-003-ghi789"],
      serviceIds: ["api-gateway", "checkout-service"],
      severity: "critical",
      status: "active",
      aiAnalysis: "High CPU usage is correlating with memory pressure. The garbage collector is working overtime, causing increased latency and potential service degradation.",
      suggestedCause: "Memory leak in checkout service or insufficient heap allocation during peak load",
      confidence: 92,
    });

    await storage.createSignalCorrelation({
      correlationId: "corr-002-latency-errors",
      alertIds: [3],
      logPatterns: ["timeout", "connection refused"],
      metricAnomalies: ["p99.latency > 500ms", "error.rate > 5%"],
      traceIds: ["trace-001-abc123"],
      serviceIds: ["payment-service", "database-cluster"],
      severity: "warning",
      status: "active",
      aiAnalysis: "Payment service is experiencing increased latency which correlates with a spike in connection errors to the database. This suggests a database performance issue.",
      suggestedCause: "Database connection pool exhaustion or slow query affecting payment processing",
      confidence: 87,
    });

    await storage.createSignalCorrelation({
      correlationId: "corr-003-cache-miss",
      alertIds: [],
      logPatterns: ["cache miss", "slow query"],
      metricAnomalies: ["redis.hits < 60%"],
      traceIds: [],
      serviceIds: ["cache", "user-service"],
      severity: "info",
      status: "resolved",
      aiAnalysis: "Cache hit ratio dropped below baseline, causing increased database load.",
      suggestedCause: "Cache key changes or cache eviction policy triggered",
      confidence: 72,
    });

    await storage.createSignalCorrelation({
      correlationId: "corr-004-disk-io",
      alertIds: [],
      logPatterns: ["disk space low", "I/O wait"],
      metricAnomalies: ["disk.usage > 90%", "disk.io.wait > 20%"],
      traceIds: [],
      serviceIds: ["database-cluster"],
      severity: "warning",
      status: "active",
      aiAnalysis: "Disk space utilization is critically high with I/O wait times increasing. This will impact database performance.",
      suggestedCause: "Large logs or temporary files accumulating on disk",
      confidence: 85,
    });
  }
}
