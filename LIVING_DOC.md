# PulseOps - Living Documentation

**Version:** 2.0  
**Last Updated:** January 2026  
**Owner:** Infinitywork IT Solutions  
**Founder:** Mpumelelo Magagula  
**Website:** https://infinityworkitsolutions.com/

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Solution Overview](#solution-overview)
3. [Purpose & Goals](#purpose--goals)
4. [High-Level Architecture](#high-level-architecture)
5. [Features Implemented](#features-implemented)
6. [Technical Stack](#technical-stack)
7. [Database Schema](#database-schema)
8. [API Endpoints](#api-endpoints)
9. [Security Considerations](#security-considerations)
10. [Recent Changes](#recent-changes)

---

## Problem Statement

Modern engineering teams face significant challenges in maintaining system observability:

1. **Fragmented Tooling** - Teams often use multiple disconnected tools for metrics, logs, traces, and alerts, leading to context switching and delayed incident response.

2. **Alert Fatigue** - Without intelligent correlation and prioritization, teams are overwhelmed with notifications, causing critical alerts to be missed.

3. **Lack of Cross-Signal Correlation** - Traditional observability tools treat metrics, logs, and traces as separate data sources, making root cause analysis time-consuming.

4. **Complex Onboarding** - New team members struggle to understand system dependencies and monitoring configurations.

5. **Manual Integration Setup** - Connecting various cloud providers and monitoring services requires extensive configuration and ongoing maintenance.

6. **Incident Response Gaps** - Teams lack structured workflows for on-call management, escalation policies, and post-incident learning.

7. **No SLO Tracking** - Without Service Level Objective monitoring, teams cannot measure and maintain service reliability commitments.

---

## Solution Overview

PulseOps is a comprehensive AI-powered observability and monitoring platform that unifies metrics, logs, traces, and alerts into a single intelligent interface. Inspired by industry leaders like Grafana, Datadog, and New Relic, PulseOps provides:

- **Unified Observability** - Single pane of glass for all monitoring data
- **AI-Powered Insights** - Anomaly detection and predictive analytics
- **One-Click Integrations** - Simplified connection to cloud providers and services
- **Guided Onboarding** - Interactive wizard for new users
- **Collaborative Incident Management** - Team-based incident response workflows
- **Distributed Tracing (APM)** - End-to-end request tracing across microservices
- **SLO/SLI Tracking** - Service level objective monitoring and error budget management
- **On-Call Scheduling** - Team rotation management with escalation policies
- **Signal Correlation** - AI-powered correlation of metrics, logs, and traces
- **Postmortem Generation** - Automated incident review documentation

---

## Purpose & Goals

### Primary Purpose
Enable engineering teams to detect, diagnose, and resolve system issues faster through unified observability and AI-powered insights.

### Goals

| Goal | Description | Success Metric |
|------|-------------|----------------|
| Reduce MTTR | Decrease mean time to resolution | 73% reduction |
| Fewer Incidents | Prevent issues before they impact users | 45% fewer incidents |
| Unified View | Single dashboard for all observability data | 100% signal correlation |
| Easy Setup | Quick integration with existing tools | < 5 min per integration |
| SLO Compliance | Track and maintain service reliability | 99.9% uptime targets |
| Faster RCA | Accelerate root cause analysis | 5x faster diagnosis |

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              PULSEOPS PLATFORM                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         FRONTEND (React/Vite)                        │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │    │
│  │  │                    CORE OBSERVABILITY                            │ │    │
│  │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌───────────┐  │ │    │
│  │  │  │Dashboard│ │ Metrics │ │  Logs   │ │ Service │ │  Traces   │  │ │    │
│  │  │  │  View   │ │Explorer │ │ Viewer  │ │   Map   │ │   (APM)   │  │ │    │
│  │  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └───────────┘  │ │    │
│  │  └─────────────────────────────────────────────────────────────────┘ │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │    │
│  │  │                    INTELLIGENCE LAYER                            │ │    │
│  │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────────────────┐│ │    │
│  │  │  │ Insight │ │Correlat-│ │  Post-  │ │    Saved Queries &      ││ │    │
│  │  │  │ Canvas  │ │  ions   │ │mortems  │ │    Alert Templates      ││ │    │
│  │  │  └─────────┘ └─────────┘ └─────────┘ └─────────────────────────┘│ │    │
│  │  └─────────────────────────────────────────────────────────────────┘ │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │    │
│  │  │                    OPERATIONS LAYER                              │ │    │
│  │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌───────────┐  │ │    │
│  │  │  │ Alerts  │ │  SLOs   │ │ On-Call │ │Incidents│ │ Settings  │  │ │    │
│  │  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └───────────┘  │ │    │
│  │  └─────────────────────────────────────────────────────────────────┘ │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │    │
│  │  │           Shared Components (Sidebar, Command Palette)          │ │    │
│  │  └─────────────────────────────────────────────────────────────────┘ │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      BACKEND (Express.js API)                        │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐│    │
│  │  │                     CORE APIS                                   ││    │
│  │  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌─────────────────┐ ││    │
│  │  │  │Dashboards │ │  Alerts   │ │DataSources│ │  Integrations   │ ││    │
│  │  │  └───────────┘ └───────────┘ └───────────┘ └─────────────────┘ ││    │
│  │  └─────────────────────────────────────────────────────────────────┘│    │
│  │  ┌─────────────────────────────────────────────────────────────────┐│    │
│  │  │                     NEW FEATURE APIS                            ││    │
│  │  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌─────────────────┐ ││    │
│  │  │  │   SLOs    │ │  Traces   │ │Correlations│ │   Postmortems  │ ││    │
│  │  │  └───────────┘ └───────────┘ └───────────┘ └─────────────────┘ ││    │
│  │  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌─────────────────┐ ││    │
│  │  │  │  On-Call  │ │ Escalation│ │SavedQuery │ │ AlertTemplates  │ ││    │
│  │  │  └───────────┘ └───────────┘ └───────────┘ └─────────────────┘ ││    │
│  │  └─────────────────────────────────────────────────────────────────┘│    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      STORAGE (PostgreSQL/Drizzle)                    │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐│    │
│  │  │                     CORE TABLES                                 ││    │
│  │  │  dashboards | panels | datasources | alerts | integrations      ││    │
│  │  └─────────────────────────────────────────────────────────────────┘│    │
│  │  ┌─────────────────────────────────────────────────────────────────┐│    │
│  │  │                     NEW FEATURE TABLES                          ││    │
│  │  │  saved_queries | dashboard_shares | alert_templates             ││    │
│  │  │  incident_timelines | on_call_schedules | escalation_policies   ││    │
│  │  │  slos | traces | spans | postmortems | signal_correlations      ││    │
│  │  └─────────────────────────────────────────────────────────────────┘│    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          EXTERNAL INTEGRATIONS                               │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │   AWS   │ │  GCP    │ │  Azure  │ │ Datadog │ │Prometheus│ │ GitHub  │   │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘   │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │  Slack  │ │PagerDuty│ │  Jira   │ │ Sentry  │ │Kubernetes│ │ Docker  │   │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Features Implemented

### Phase 1: Foundation Features

#### 1. Marketing Landing Page
- Hero section with animated branding and pulse effects
- Solutions categories (Reliability, Cloud & K8s, DevOps/CI-CD, AI Autopilot)
- Integration showcase with 20+ supported services
- Pricing plans (Free, Pro, Enterprise)
- Customer testimonials and quantified outcomes
- Email signup for lead capture
- "Why PulseOps vs Grafana" comparison grid

#### 2. Customizable Dashboards
- Multiple panel types (line, bar, area, pie, stat charts)
- Dashboard favorites for quick access
- Panel data configuration with JSON support
- Responsive grid layout

#### 3. Metrics Explorer
- Ad-hoc metric querying with time range selection
- Multi-series comparison
- Time-series visualization with Recharts
- Customizable refresh intervals

#### 4. Logs Viewer
- Real-time log streaming
- Structured filtering by level (error, warn, info, debug)
- Service-based filtering
- Full-text search functionality
- Log level color highlighting

#### 5. Service Map
- Interactive service dependency visualization
- Health indicators per service (healthy, degraded, critical)
- Connection visualization with status colors
- Zoom and pan controls

#### 6. Alerts Management
- Severity levels (critical, warning, info)
- Status tracking (active, acknowledged, resolved)
- Threshold configuration
- Resolution workflow with timestamps

#### 7. AI-Powered Insight Canvas
- Real-time anomaly detection
- Predictive analytics with confidence scores
- System health scoring (0-100)
- Trend analysis and forecasting

#### 8. One-Click Integrations
- 20+ supported integrations organized by category
- API key validation (server-side, 20+ character minimum)
- Connection status tracking
- Category-based organization (Cloud, Monitoring, CI/CD, etc.)

#### 9. Guided Onboarding Wizard
- Step-by-step setup process
- Progress tracking
- First-visit auto-display
- Skip option for experienced users

#### 10. Incident Command Center
- Real-time incident tracking
- Severity-based prioritization
- Assignment workflow
- Timeline view with events

#### 11. Command Palette
- Quick navigation via Cmd/Ctrl+K
- Search across all pages
- Keyboard-first experience
- Recent actions history

#### 12. Settings
- General preferences
- Security configuration
- Notification preferences
- Team management

---

### Phase 2: Operational Workflows (NEW)

#### 13. Saved Queries & Filters
Save and organize frequently used metric queries for quick access.

**Features:**
- Create and save custom queries with parameters
- Query categorization and tagging
- Quick execution from saved list
- Share queries with team members
- Query history tracking

**Database Table:** `saved_queries`
- Stores query name, expression, description
- Service and time range filters
- isPublic flag for team sharing
- Owner tracking via createdBy

#### 14. Shareable Dashboards
Share dashboards with team members or external stakeholders.

**Features:**
- Generate shareable links
- Permission levels (view, edit)
- Expiration dates for links
- Email-based sharing
- Access analytics

**Database Table:** `dashboard_shares`
- Links dashboards to shared users
- Permission levels (view/edit)
- Expiration date support
- Share token generation

#### 15. Alert Templates
Pre-configured alert rules for common scenarios.

**Features:**
- 6 built-in templates:
  - CPU Spike Alert (>80% for 5min)
  - Memory Exhaustion (>90% for 3min)
  - Disk Space Warning (>85% used)
  - Network Latency Alert (>200ms p95)
  - Error Rate Spike (>5% for 2min)
  - Service Availability (uptime <99.9%)
- Custom template creation
- Template categorization (Performance, Infrastructure, Application)
- One-click alert creation from templates
- Threshold customization

**Database Table:** `alert_templates`
- Template name, description, category
- Metric expression and condition
- Threshold value and duration
- isBuiltIn flag for system templates

#### 16. Incident Timeline Export
Export incident timelines for post-incident review.

**Features:**
- Timeline event tracking
- Event types (created, updated, escalated, resolved, commented)
- User attribution
- JSON metadata support
- Export to PDF/JSON formats

**Database Table:** `incident_timelines`
- Links to incident (alert) ID
- Event type and message
- Actor/user tracking
- Metadata JSON field

#### 17. On-Call Scheduling
Manage team rotations and on-call responsibilities.

**Features:**
- Create rotation schedules
- Define rotation periods (daily, weekly, bi-weekly)
- Team member assignment with order
- Timezone support
- Active/inactive schedule toggle
- Visual calendar view

**Database Table:** `on_call_schedules`
- Schedule name and description
- Team ID association
- Rotation type and period
- Members array with order
- Timezone and active status
- Start/end time tracking

#### 18. Escalation Policies
Define escalation rules when alerts are not acknowledged.

**Features:**
- Multi-level escalation chains
- Timeout-based escalation
- Notification channel configuration
- Policy priority ordering
- Default policy designation

**Database Table:** `escalation_policies`
- Policy name and description
- Team ID association
- Escalation levels JSON array
- Default timeout configuration
- isDefault flag

---

### Phase 3: AI & APM Features (NEW)

#### 19. SLO/SLI Tracking
Monitor and maintain service level objectives.

**Features:**
- Define SLOs with target percentages
- Track current performance vs target
- Error budget calculation and visualization
- 4 sample SLOs included:
  - API Availability (99.9% target)
  - Latency P95 (99.5% target)
  - Error Rate (99.8% target)
  - Throughput (99.7% target)
- SLO status indicators (on-track, at-risk, breached)
- Time window configuration (7d, 30d, 90d)
- Alerting on budget consumption

**Database Table:** `slos`
- SLO name, description, service ID
- Target percentage and current value
- Time window in days
- Status tracking
- Error budget remaining

#### 20. Distributed Tracing (APM)
End-to-end request tracing across microservices.

**Features:**
- Trace visualization with span hierarchy
- 3 sample traces included:
  - User Authentication Flow
  - Product Search Request
  - Payment Processing
- Duration and span count display
- Status indicators (ok, error, timeout)
- Root cause identification
- Service path visualization
- Latency breakdown per span

**Database Tables:** `traces` and `spans`
- Trace: ID, name, service, duration, span count, status
- Span: ID, trace ID, operation name, service, timing
- Parent-child span relationships
- Tags and logs JSON fields

#### 21. Signal Correlation View
AI-powered correlation of metrics, logs, and traces.

**Features:**
- Automatic correlation detection
- Confidence scoring (0-100%)
- Severity levels (critical, warning, info, low)
- Related signals grouping:
  - Metric IDs
  - Log IDs
  - Trace IDs
  - Service IDs
- Log pattern analysis
- Metric anomaly detection
- Root cause suggestions
- Active/resolved status tracking

**Database Table:** `signal_correlations`
- Correlation ID and description
- Severity and confidence score
- Related IDs (metrics, logs, traces, services)
- Log patterns and metric anomalies arrays
- AI-generated root cause
- Status and resolution tracking

#### 22. AI Root-Cause Analysis
AI-powered diagnostic suggestions.

**Features:**
- Automatic root cause generation
- Confidence-based recommendations
- Correlation with historical incidents
- Suggested remediation steps
- Integration with postmortem generation

#### 23. Auto-Generated Postmortems
Automated incident review documentation.

**Features:**
- Incident-linked postmortems
- Status workflow (draft, review, published)
- AI-generated summaries
- Structured sections:
  - Summary
  - Impact assessment
  - Root cause analysis
  - Lessons learned (array)
  - Action items with completion tracking
- Participant tracking with roles
- Publishing workflow

**Database Table:** `postmortems`
- Title and incident ID
- Summary, impact, root cause
- Status (draft, review, published)
- Participants array
- Lessons learned array
- Action items array with completion
- AI-generated flag
- Publishing timestamp

---

## Technical Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| Wouter | Client-side routing |
| TanStack Query | Server state management |
| Tailwind CSS | Styling |
| shadcn/ui | Component library |
| Recharts | Data visualization |
| Framer Motion | Animations |
| Lucide React | Icons |
| date-fns | Date formatting |
| react-hook-form | Form management |
| Zod | Schema validation |

### Backend
| Technology | Purpose |
|------------|---------|
| Express.js | API framework |
| TypeScript | Type safety |
| Drizzle ORM | Database queries |
| Zod | Schema validation |
| PostgreSQL | Database |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| Replit | Hosting & deployment |
| Neon | PostgreSQL provider |

---

## Database Schema

### Core Tables

#### dashboards
| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| title | text | Dashboard name |
| description | text | Dashboard description |
| isFavorite | boolean | Favorite status |
| createdAt | timestamp | Creation date |
| updatedAt | timestamp | Last update date |

#### panels
| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| dashboardId | integer | Foreign key to dashboards |
| title | text | Panel title |
| type | text | Chart type (line, bar, area, etc.) |
| dataConfig | json | Data source configuration |
| layoutConfig | json | Position and size |

#### dataSources
| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| name | text | Data source name |
| type | text | Source type (prometheus, influx, etc.) |
| config | json | Connection configuration |
| createdAt | timestamp | Creation date |

#### alerts
| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| title | text | Alert name |
| description | text | Alert description |
| severity | text | critical, warning, info |
| status | text | active, acknowledged, resolved |
| panelId | integer | Related panel (optional) |
| thresholdValue | real | Threshold to trigger |
| currentValue | real | Current metric value |
| createdAt | timestamp | Creation date |
| resolvedAt | timestamp | Resolution date |

#### integrations
| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| serviceId | text | Unique service identifier |
| serviceName | text | Display name |
| category | text | Integration category |
| status | text | connected, disconnected, error |
| lastValidatedAt | timestamp | Last API key validation |
| createdAt | timestamp | Creation date |

### New Feature Tables

#### saved_queries
| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| name | text | Query name |
| description | text | Query description |
| query | text | Query expression |
| service | text | Target service filter |
| timeRange | text | Default time range |
| isPublic | boolean | Team visibility |
| createdBy | text | Owner user ID |
| createdAt | timestamp | Creation date |
| updatedAt | timestamp | Last update |

#### dashboard_shares
| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| dashboardId | integer | Foreign key to dashboards |
| sharedWith | text | User email or ID |
| permission | text | view or edit |
| shareToken | text | Unique share token |
| expiresAt | timestamp | Link expiration |
| createdAt | timestamp | Share creation date |

#### alert_templates
| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| name | text | Template name |
| description | text | Template description |
| category | text | Category (Performance, etc.) |
| metric | text | Metric expression |
| condition | text | Comparison operator |
| threshold | real | Threshold value |
| duration | text | Evaluation window |
| severity | text | Default severity |
| isBuiltIn | boolean | System template flag |
| createdAt | timestamp | Creation date |

#### incident_timelines
| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| incidentId | integer | Foreign key to alerts |
| eventType | text | Event type |
| message | text | Event message |
| actor | text | User who performed action |
| metadata | jsonb | Additional event data |
| createdAt | timestamp | Event timestamp |

#### on_call_schedules
| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| name | text | Schedule name |
| description | text | Schedule description |
| teamId | text | Team identifier |
| rotationType | text | daily, weekly, bi-weekly |
| rotationPeriod | integer | Period in days |
| members | jsonb | Team members array |
| timezone | text | Schedule timezone |
| isActive | boolean | Active status |
| startTime | timestamp | Schedule start |
| endTime | timestamp | Schedule end |
| createdAt | timestamp | Creation date |

#### escalation_policies
| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| name | text | Policy name |
| description | text | Policy description |
| teamId | text | Team identifier |
| levels | jsonb | Escalation levels array |
| defaultTimeout | integer | Minutes before escalation |
| isDefault | boolean | Default policy flag |
| createdAt | timestamp | Creation date |
| updatedAt | timestamp | Last update |

#### slos
| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| name | text | SLO name |
| description | text | SLO description |
| serviceId | text | Service identifier |
| targetPercentage | real | Target (e.g., 99.9) |
| currentPercentage | real | Current value |
| timeWindowDays | integer | Evaluation window |
| status | text | on-track, at-risk, breached |
| errorBudgetRemaining | real | Remaining budget % |
| createdAt | timestamp | Creation date |
| updatedAt | timestamp | Last update |

#### traces
| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| traceId | text | Unique trace identifier |
| name | text | Trace name |
| serviceName | text | Root service |
| duration | integer | Total duration (ms) |
| spanCount | integer | Number of spans |
| status | text | ok, error, timeout |
| startTime | timestamp | Trace start time |
| endTime | timestamp | Trace end time |
| createdAt | timestamp | Record creation |

#### spans
| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| spanId | text | Unique span identifier |
| traceId | text | Parent trace ID |
| parentSpanId | text | Parent span (optional) |
| operationName | text | Operation name |
| serviceName | text | Service name |
| duration | integer | Duration (ms) |
| startTime | timestamp | Span start |
| endTime | timestamp | Span end |
| tags | jsonb | Span tags |
| logs | jsonb | Span logs |
| status | text | Span status |

#### postmortems
| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| title | text | Postmortem title |
| incidentId | text | Related incident ID |
| summary | text | Executive summary |
| impact | text | Impact assessment |
| rootCause | text | Root cause analysis |
| lessonsLearned | jsonb | Lessons array |
| actionItems | jsonb | Action items array |
| participants | jsonb | Participants array |
| status | text | draft, review, published |
| aiGenerated | boolean | AI-generated flag |
| createdBy | text | Author user ID |
| publishedAt | timestamp | Publication date |
| createdAt | timestamp | Creation date |
| updatedAt | timestamp | Last update |

#### signal_correlations
| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| correlationId | text | Unique correlation ID |
| description | text | Correlation description |
| severity | text | critical, warning, info, low |
| confidence | integer | Confidence score (0-100) |
| metricIds | jsonb | Related metric IDs |
| logIds | jsonb | Related log IDs |
| traceIds | jsonb | Related trace IDs |
| serviceIds | jsonb | Affected services |
| logPatterns | jsonb | Detected patterns |
| metricAnomalies | jsonb | Detected anomalies |
| rootCause | text | AI root cause |
| status | text | active, resolved |
| resolvedAt | timestamp | Resolution time |
| createdAt | timestamp | Detection time |

---

## API Endpoints

### Core APIs

#### Dashboards
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/dashboards | List all dashboards |
| POST | /api/dashboards | Create dashboard |
| PATCH | /api/dashboards/:id | Update dashboard |
| DELETE | /api/dashboards/:id | Delete dashboard |

#### Panels
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/dashboards/:id/panels | List panels for dashboard |
| POST | /api/dashboards/:id/panels | Create panel |
| PATCH | /api/panels/:id | Update panel |
| DELETE | /api/panels/:id | Delete panel |

#### Data Sources
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/datasources | List data sources |
| POST | /api/datasources | Create data source |
| PATCH | /api/datasources/:id | Update data source |
| DELETE | /api/datasources/:id | Delete data source |

#### Alerts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/alerts | List all alerts |
| PATCH | /api/alerts/:id | Update alert status |

#### Integrations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/integrations | List connected integrations |
| POST | /api/integrations/connect | Connect integration (validates API key) |
| DELETE | /api/integrations/:serviceId | Disconnect integration |

### New Feature APIs

#### Saved Queries
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/saved-queries | List saved queries |
| POST | /api/saved-queries | Create saved query |
| PUT | /api/saved-queries/:id | Update saved query |
| DELETE | /api/saved-queries/:id | Delete saved query |

#### Alert Templates
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/alert-templates | List all templates |
| POST | /api/alert-templates | Create template |
| PUT | /api/alert-templates/:id | Update template |
| DELETE | /api/alert-templates/:id | Delete template |

#### On-Call Schedules
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/oncall-schedules | List schedules |
| POST | /api/oncall-schedules | Create schedule |
| PUT | /api/oncall-schedules/:id | Update schedule |
| DELETE | /api/oncall-schedules/:id | Delete schedule |

#### Escalation Policies
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/escalation-policies | List policies |
| POST | /api/escalation-policies | Create policy |
| PUT | /api/escalation-policies/:id | Update policy |
| DELETE | /api/escalation-policies/:id | Delete policy |

#### SLOs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/slos | List all SLOs |
| POST | /api/slos | Create SLO |
| PUT | /api/slos/:id | Update SLO |
| DELETE | /api/slos/:id | Delete SLO |

#### Traces
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/traces | List traces |
| GET | /api/traces/:traceId | Get trace details |
| POST | /api/traces | Create trace |
| GET | /api/traces/:traceId/spans | Get spans for trace |
| POST | /api/spans | Create span |

#### Signal Correlations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/correlations | List correlations |
| POST | /api/correlations | Create correlation |
| PUT | /api/correlations/:correlationId | Update correlation |
| DELETE | /api/correlations/:correlationId | Delete correlation |

#### Postmortems
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/postmortems | List postmortems |
| GET | /api/postmortems/:id | Get postmortem details |
| POST | /api/postmortems | Create postmortem |
| PUT | /api/postmortems/:id | Update postmortem |
| DELETE | /api/postmortems/:id | Delete postmortem |

---

## Security Considerations

### API Key Handling
- API keys are validated server-side before connection
- Keys require minimum 20 characters
- Keys are NOT stored in the database
- Only connection status is persisted
- Keys must match format: alphanumeric + common special characters

### Authentication
- Session-based authentication via Replit Auth
- SESSION_SECRET environment variable for encryption
- Secure cookie handling

### Data Protection
- PostgreSQL with connection pooling
- Environment variables for sensitive configuration
- No sensitive data in client-side code
- JSONB fields for flexible data storage

### Access Control
- Dashboard sharing with permission levels
- Public/private query visibility
- Team-based resource isolation

---

## Recent Changes

### January 2026 - Version 2.0

#### Phase 3: AI & APM Features
1. **SLO/SLI Tracking**
   - Full SLO management page
   - 4 sample SLOs with targets
   - Error budget visualization
   - Status indicators

2. **Distributed Tracing (APM)**
   - Complete traces page with span hierarchy
   - 3 sample traces with spans
   - Duration and status tracking

3. **Signal Correlation View**
   - AI-powered correlation detection
   - Confidence scoring
   - Related signals grouping
   - Root cause suggestions

4. **Auto-Generated Postmortems**
   - Full postmortem management
   - Draft/review/publish workflow
   - Lessons learned tracking
   - Action item management

#### Phase 2: Operational Workflows
1. **Saved Queries & Filters**
   - Query storage and organization
   - Public/private visibility

2. **Alert Templates**
   - 6 built-in templates
   - Custom template creation
   - Category organization

3. **On-Call Scheduling**
   - Rotation management
   - Team member assignment
   - Timezone support

4. **Escalation Policies**
   - Multi-level escalation chains
   - Timeout configuration

#### Phase 1: Core Enhancements
1. **API Key Validation System**
   - 20-character minimum validation
   - Server-side validation before connection
   - Connection status stored (not API keys)

2. **Integrations Page Enhancement**
   - Form validation with react-hook-form + Zod
   - Dialog accessibility improvements
   - Category-based filtering

3. **Documentation**
   - Comprehensive living documentation
   - README with integration guides

---

## Navigation Structure

### Sidebar Organization

**Overview**
- Home (Dashboard workspace)

**Observability**
- Dashboards
- Metrics Explorer
- Logs Viewer
- Service Map
- Traces (APM)

**Intelligence**
- Insight Canvas
- Correlations
- Postmortems

**Operations**
- Alerts
- Alert Templates
- SLOs
- On-Call
- Incidents

**Configuration**
- Data Sources
- Integrations
- Settings

---

## Contact

**Infinitywork IT Solutions**  
Website: https://infinityworkitsolutions.com/  
Founder: Mpumelelo Magagula
