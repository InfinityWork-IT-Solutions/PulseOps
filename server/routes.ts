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

  await seedDatabase();
  await seedAlerts();

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
