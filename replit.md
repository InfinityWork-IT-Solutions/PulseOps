# PulseOps - Systems Intelligence Platform

## Overview

PulseOps is a comprehensive observability and monitoring platform inspired by Grafana and modern observability tools like Datadog and New Relic. It provides customizable dashboards, real-time metrics exploration, log analysis, service dependency mapping, and AI-powered insights. The platform features a professional dark-mode aesthetic with animated branding elements.

## User Preferences

Preferred communication style: Simple, everyday language.

## Key Features

### Observability Suite
- **Dashboards** - Customizable visualization dashboards with multiple panel types (line, bar, area, pie, stat charts)
- **Metrics Explorer** - Ad-hoc metric querying with multi-series comparison and time-series visualization
- **Logs Viewer** - Real-time log streaming with structured filtering by level and service
- **Service Map** - Interactive service dependency visualization with health indicators
- **Alerts** - Comprehensive alert management with severity levels (critical/warning/info) and resolution workflow

### Systems Intelligence (Unique Features)
- **Insight Canvas** - AI-powered anomaly detection and predictive analytics
- **Health Scoring** - Real-time system health metrics with trend analysis
- **Anomaly Correlation** - Automatic correlation of metrics, logs, and traces
- **Predictive Alerts** - AI-generated insights with confidence scoring

### Navigation & UX
- **Command Palette** - Quick navigation via Cmd/Ctrl+K
- **Time Range Selector** - Global time controls with presets and auto-refresh
- **Organized Sidebar** - Categorized navigation (Overview, Observability, Intelligence, Configuration)
- **Animated Splash Screen** - Branded loading experience with pulse effects

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management and caching
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Charts**: Recharts library for data visualization
- **Build Tool**: Vite for development and production builds

The frontend follows a component-based architecture with:
- Pages in `client/src/pages/` (Home, DashboardView, DataSources, Alerts, MetricsExplorer, LogsViewer, ServiceMap, InsightCanvas, Settings)
- Reusable components in `client/src/components/` (Sidebar, Panel, TimeRangeSelector, CommandPalette)
- Custom hooks in `client/src/hooks/` for data fetching
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
Four main entities defined in `shared/schema.ts`:
1. **Dashboards** - Container for panels with title, description, favorite status
2. **Panels** - Visualization widgets with type, data config, and layout config (JSON)
3. **Data Sources** - Connection configurations for databases or APIs
4. **Alerts** - Alert definitions with severity, status, thresholds

### API Structure
Routes follow RESTful conventions:
- `/api/dashboards` - Dashboard management (CRUD)
- `/api/dashboards/:dashboardId/panels` - Panel management per dashboard
- `/api/datasources` - Data source configuration
- `/api/alerts` - Alert management and status updates

## Design System

### Theme
- Dark mode by default with professional color scheme
- Primary color: Blue (#3b82f6 / hsl 217 91% 60%)
- Card backgrounds with subtle transparency and blur effects
- Custom animations: shimmer, pulse-ring for branding elements

### Typography
- Body: Plus Jakarta Sans
- Monospace: JetBrains Mono (for code and metrics)

### Components
- shadcn/ui components with custom styling
- Consistent card-based layouts with proper spacing
- Badge system for status indicators
- Lucide icons throughout

## Development

### Commands
- `npm run dev` - Start development server
- `npm run db:push` - Push schema changes to database

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption key

## Recent Changes (January 2026)

- Added complete observability suite (Metrics Explorer, Logs Viewer, Service Map)
- Implemented PulseOps Insight Canvas with AI-powered features
- Created comprehensive Settings page with tabs
- Added Command Palette for quick navigation (Cmd/Ctrl+K)
- Built reusable TimeRangeSelector component
- Enhanced sidebar with categorized sections
- Implemented alerts system with severity levels and resolution workflow
