# Aether - Analytics Dashboard Platform

## Overview

Aether is a full-stack analytics dashboard application that allows users to create, manage, and visualize data through customizable dashboards and panels. The platform supports multiple chart types (line, bar, area, pie, stat) and configurable data sources. Built with a React frontend and Express backend, it uses PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management and caching
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Charts**: Recharts library for data visualization (line, bar, area, pie charts)
- **Build Tool**: Vite for development and production builds

The frontend follows a component-based architecture with:
- Pages in `client/src/pages/` (Home, DashboardView, DataSources)
- Reusable components in `client/src/components/`
- Custom hooks in `client/src/hooks/` for data fetching (dashboards, panels, datasources)
- UI primitives from shadcn/ui in `client/src/components/ui/`

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod validation
- **Storage Pattern**: Repository pattern via `IStorage` interface in `server/storage.ts`

The backend uses a clean separation:
- `server/routes.ts` - API route handlers
- `server/storage.ts` - Database operations abstracted through storage interface
- `server/db.ts` - Database connection pool configuration
- `shared/schema.ts` - Drizzle schema definitions shared between client and server

### Data Models
Three main entities defined in `shared/schema.ts`:
1. **Dashboards** - Container for panels with title, description, favorite status
2. **Panels** - Visualization widgets with type, data config, and layout config (JSON)
3. **Data Sources** - Connection configurations for databases or APIs

### API Structure
Routes follow RESTful conventions with full CRUD operations:
- `/api/dashboards` - Dashboard management
- `/api/dashboards/:dashboardId/panels` - Panel management per dashboard
- `/api/datasources` - Data source configuration

### Development vs Production
- Development: Vite dev server with HMR, served through Express middleware
- Production: Static files served from `dist/public`, bundled with esbuild

## External Dependencies

### Database
- **PostgreSQL** - Primary data store, connection via `DATABASE_URL` environment variable
- **Drizzle Kit** - Database migrations stored in `./migrations`
- **connect-pg-simple** - Session storage (available but not currently implemented)

### Key NPM Packages
- `drizzle-orm` / `drizzle-zod` - ORM and schema validation
- `@tanstack/react-query` - Async state management
- `recharts` - Charting library
- `zod` - Runtime type validation for API inputs/outputs
- `wouter` - Client-side routing
- Full shadcn/ui component set via Radix UI primitives

### Development Tools
- `tsx` - TypeScript execution for development
- `esbuild` - Production server bundling
- Replit-specific plugins for dev experience (`@replit/vite-plugin-*`)

### Database Commands
- `npm run db:push` - Push schema changes to database using Drizzle Kit