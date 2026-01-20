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
- **Traces (APM)** - Distributed tracing with span hierarchy and timing visualization
- **Alerts** - Comprehensive alert management with severity levels (critical/warning/info) and resolution workflow

### Systems Intelligence (Unique Features)
- **Insight Canvas** - AI-powered anomaly detection and predictive analytics
- **Signal Correlations** - AI-powered correlation of metrics, logs, and traces with confidence scoring
- **Postmortems** - Auto-generated incident review documentation with action items
- **Health Scoring** - Real-time system health metrics with trend analysis
- **Predictive Alerts** - AI-generated insights with confidence scoring

### Operational Workflows (NEW)
- **Alert Templates** - 6 built-in alert templates for common scenarios (CPU, Memory, Disk, etc.)
- **SLO/SLI Tracking** - Service Level Objectives with error budget monitoring
- **On-Call Scheduling** - Team rotation management with escalation policies
- **Saved Queries** - Save and organize frequently used metric queries
- **Incident Timeline** - Timeline event tracking with export capabilities

### Navigation & UX
- **Command Palette** - Quick navigation via Cmd/Ctrl+K
- **Time Range Selector** - Global time controls with presets and auto-refresh
- **Organized Sidebar** - Categorized navigation (Overview, Observability, Intelligence, Operations, Configuration)
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
- Pages in `client/src/pages/` (Home, DashboardView, DataSources, Alerts, MetricsExplorer, LogsViewer, ServiceMap, InsightCanvas, Settings, SLOs, Traces, Correlations, Postmortems, OnCall, AlertTemplates, SavedQueries)
- Reusable components in `client/src/components/` (Sidebar, Panel, TimeRangeSelector, CommandPalette)
- Custom hooks in `client/src/hooks/` for data fetching (use-slos, use-correlations, use-postmortems, etc.)
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
Entities defined in `shared/schema.ts`:

**Core Entities:**
1. **Dashboards** - Container for panels with title, description, favorite status
2. **Panels** - Visualization widgets with type, data config, and layout config (JSON)
3. **Data Sources** - Connection configurations for databases or APIs
4. **Alerts** - Alert definitions with severity, status, thresholds
5. **Integrations** - External service connections with validation status

**Phase 2 - Operational Workflows:**
6. **Saved Queries** - Saved metric queries with filters and visibility settings
7. **Dashboard Shares** - Dashboard sharing with permissions and expiration
8. **Alert Templates** - Pre-configured alert rules (6 built-in templates)
9. **Incident Timelines** - Timeline events for incident tracking
10. **On-Call Schedules** - Team rotation management with timezone support
11. **Escalation Policies** - Multi-level escalation chains

**Phase 3 - AI & APM Features:**
12. **SLOs** - Service Level Objectives with error budget tracking
13. **Traces** - Distributed traces for APM
14. **Spans** - Individual spans within traces
15. **Signal Correlations** - AI-powered correlation of metrics, logs, and traces
16. **Postmortems** - Incident review documentation with action items

### API Structure
Routes follow RESTful conventions:

**Core APIs:**
- `/api/dashboards` - Dashboard management (CRUD)
- `/api/dashboards/:dashboardId/panels` - Panel management per dashboard
- `/api/datasources` - Data source configuration
- `/api/alerts` - Alert management and status updates
- `/api/integrations` - External service connections

**New Feature APIs:**
- `/api/saved-queries` - Saved query management
- `/api/alert-templates` - Alert template CRUD
- `/api/oncall-schedules` - On-call schedule management
- `/api/escalation-policies` - Escalation policy configuration
- `/api/slos` - SLO management
- `/api/traces` - Distributed tracing
- `/api/spans` - Span management for traces
- `/api/correlations` - Signal correlation management
- `/api/postmortems` - Postmortem documentation

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

## Company Information

PulseOps is a product developed and owned by **Infinitywork IT Solutions** (https://infinityworkitsolutions.com/), founded by Mpumelelo Magagula.

## Documentation

- `README.md` - User-facing documentation with getting started guide and API key setup instructions
- `LIVING_DOC.md` - Comprehensive technical documentation with architecture, features, and API reference

## Recent Changes (January 2026)

### Version 2.0 - Major Feature Expansion

**Phase 3: AI & APM Features (NEW)**
- **SLO/SLI Tracking** - Full SLO management with 4 sample objectives, error budget visualization, status indicators
- **Distributed Tracing (APM)** - Complete traces page with span hierarchy, 3 sample traces with spans
- **Signal Correlation View** - AI-powered correlation detection with confidence scoring, root cause suggestions
- **Auto-Generated Postmortems** - Full postmortem management with draft/review/publish workflow, action items

**Phase 2: Operational Workflows (NEW)**
- **Saved Queries** - Query storage and organization with public/private visibility
- **Alert Templates** - 6 built-in templates (CPU Spike, Memory Exhaustion, Disk Space, Network Latency, Error Rate, Service Availability)
- **On-Call Scheduling** - Team rotation management with timezone support
- **Escalation Policies** - Multi-level escalation chains with timeout configuration
- **Incident Timeline Export** - Timeline event tracking with export capabilities

**Phase 1: Core Enhancements**
- Created comprehensive documentation (README.md and LIVING_DOC.md)
- Added API key validation for integrations (20+ char minimum, server-side validation)
- Integrations now validate before connecting (invalid keys are rejected)
- Added complete observability suite (Metrics Explorer, Logs Viewer, Service Map)
- Implemented PulseOps Insight Canvas with AI-powered features
- Created comprehensive Settings page with tabs
- Added Command Palette for quick navigation (Cmd/Ctrl+K)
- Built reusable TimeRangeSelector component
- Enhanced sidebar with categorized sections
- Implemented alerts system with severity levels and resolution workflow

**Marketing & Authentication**
- **Marketing landing page** at "/" with hero, solutions, pricing, testimonials
- **Login page** at "/login" with glassmorphism effects and 3D flip animation
- Updated routing: "/" shows landing page, "/app" shows dashboard workspace

### New Pages Added
- `/app/alert-templates` - Alert Templates management
- `/app/slos` - Service Level Objectives
- `/app/traces` - Distributed Tracing (APM)
- `/app/correlations` - Signal Correlation View
- `/app/postmortems` - Postmortem Documentation
- `/app/oncall` - On-Call Scheduling
- `/app/saved-queries` - Saved Queries management
