import { z } from 'zod';
import { insertDashboardSchema, insertPanelSchema, insertDataSourceSchema, dashboards, panels, dataSources } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  dashboards: {
    list: {
      method: 'GET' as const,
      path: '/api/dashboards',
      responses: {
        200: z.array(z.custom<typeof dashboards.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/dashboards/:id',
      responses: {
        200: z.custom<typeof dashboards.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/dashboards',
      input: insertDashboardSchema,
      responses: {
        201: z.custom<typeof dashboards.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/dashboards/:id',
      input: insertDashboardSchema.partial(),
      responses: {
        200: z.custom<typeof dashboards.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/dashboards/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  panels: {
    list: {
      method: 'GET' as const,
      path: '/api/dashboards/:dashboardId/panels',
      responses: {
        200: z.array(z.custom<typeof panels.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/panels',
      input: insertPanelSchema,
      responses: {
        201: z.custom<typeof panels.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/panels/:id',
      input: insertPanelSchema.partial(),
      responses: {
        200: z.custom<typeof panels.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/panels/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  dataSources: {
    list: {
      method: 'GET' as const,
      path: '/api/datasources',
      responses: {
        200: z.array(z.custom<typeof dataSources.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/datasources',
      input: insertDataSourceSchema,
      responses: {
        201: z.custom<typeof dataSources.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  alerts: {
    list: {
      method: 'GET' as const,
      path: '/api/alerts',
      responses: {
        200: z.array(z.custom<Alert>()),
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/alerts/:id',
      input: z.object({ status: z.string(), resolvedAt: z.string().optional() }),
      responses: {
        200: z.custom<Alert>(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export type CreateDashboardRequest = z.infer<typeof api.dashboards.create.input>;
export type UpdateDashboardRequest = z.infer<typeof api.dashboards.update.input>;
export type CreatePanelRequest = z.infer<typeof api.panels.create.input>;
export type UpdatePanelRequest = z.infer<typeof api.panels.update.input>;
export type CreateDataSourceRequest = z.infer<typeof api.dataSources.create.input>;
import { type Alert } from './schema';


export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
