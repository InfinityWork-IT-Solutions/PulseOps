import { db } from "./db";
import {
  dashboards, panels, dataSources, alerts, integrations,
  type Dashboard, type InsertDashboard,
  type Panel, type InsertPanel,
  type DataSource, type InsertDataSource,
  type Alert, type InsertAlert,
  type Integration, type InsertIntegration
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

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
}

export const storage = new DatabaseStorage();
