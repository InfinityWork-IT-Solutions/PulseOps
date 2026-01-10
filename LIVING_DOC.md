# PulseOps - Living Documentation

**Version:** 1.0  
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

---

## Solution Overview

PulseOps is a comprehensive AI-powered observability and monitoring platform that unifies metrics, logs, traces, and alerts into a single intelligent interface. Inspired by industry leaders like Grafana, Datadog, and New Relic, PulseOps provides:

- **Unified Observability** - Single pane of glass for all monitoring data
- **AI-Powered Insights** - Anomaly detection and predictive analytics
- **One-Click Integrations** - Simplified connection to cloud providers and services
- **Guided Onboarding** - Interactive wizard for new users
- **Collaborative Incident Management** - Team-based incident response workflows

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

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              PULSEOPS PLATFORM                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         FRONTEND (React/Vite)                        │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────────┐ │    │
│  │  │ Landing │ │Dashboard│ │ Metrics │ │  Logs   │ │ Service Map     │ │    │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────────────┘ │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────────┐ │    │
│  │  │ Alerts  │ │Insights │ │Settings │ │Incidents│ │ Integrations    │ │    │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────────────┘ │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │    │
│  │  │           Shared Components (Sidebar, Command Palette)          │ │    │
│  │  └─────────────────────────────────────────────────────────────────┘ │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      BACKEND (Express.js API)                        │    │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────────┐  │    │
│  │  │ Dashboards  │ │   Alerts    │ │ Data Sources│ │ Integrations  │  │    │
│  │  │   API       │ │    API      │ │     API     │ │     API       │  │    │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └───────────────┘  │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐│    │
│  │  │                    API Key Validator                            ││    │
│  │  └─────────────────────────────────────────────────────────────────┘│    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      STORAGE (PostgreSQL/Drizzle)                    │    │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────────┐  │    │
│  │  │ dashboards  │ │   panels    │ │ datasources │ │    alerts     │  │    │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └───────────────┘  │    │
│  │  ┌─────────────┐ ┌─────────────┐                                    │    │
│  │  │integrations │ │   users     │                                    │    │
│  │  └─────────────┘ └─────────────┘                                    │    │
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
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Features Implemented

### 1. Marketing Landing Page
- Hero section with animated branding
- Solutions categories (Reliability, Cloud & K8s, DevOps/CI-CD, AI Autopilot)
- Integration showcase
- Pricing plans (Free, Pro, Enterprise)
- Customer testimonials
- Email signup for leads

### 2. Customizable Dashboards
- Multiple panel types (line, bar, area, pie, stat charts)
- Drag-and-drop layout (future enhancement)
- Favorite dashboards
- Panel data configuration

### 3. Metrics Explorer
- Ad-hoc metric querying
- Multi-series comparison
- Time-series visualization
- Customizable time ranges

### 4. Logs Viewer
- Real-time log streaming
- Structured filtering by level and service
- Search functionality
- Log level highlighting

### 5. Service Map
- Interactive service dependency visualization
- Health indicators per service
- Connection visualization

### 6. Alerts Management
- Severity levels (critical, warning, info)
- Status tracking (active, acknowledged, resolved)
- Threshold configuration
- Resolution workflow

### 7. AI-Powered Insight Canvas
- Anomaly detection
- Predictive analytics
- Health scoring
- Confidence-based insights

### 8. One-Click Integrations
- 20+ supported integrations
- API key validation (server-side)
- Connection status tracking
- Category-based organization

### 9. Guided Onboarding Wizard
- Step-by-step setup
- Progress tracking
- First-visit auto-display
- Skip option

### 10. Incident Command Center
- Real-time incident tracking
- Severity-based prioritization
- Assignment workflow
- Timeline view

### 11. Command Palette
- Quick navigation (Cmd/Ctrl+K)
- Search across pages
- Keyboard-first experience

### 12. Settings
- General preferences
- Security configuration
- Notification preferences
- Team management

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

### dashboards
| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| title | text | Dashboard name |
| description | text | Dashboard description |
| isFavorite | boolean | Favorite status |
| createdAt | timestamp | Creation date |
| updatedAt | timestamp | Last update date |

### panels
| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| dashboardId | integer | Foreign key to dashboards |
| title | text | Panel title |
| type | text | Chart type (line, bar, area, etc.) |
| dataConfig | json | Data source configuration |
| layoutConfig | json | Position and size |

### dataSources
| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| name | text | Data source name |
| type | text | Source type (prometheus, influx, etc.) |
| config | json | Connection configuration |
| createdAt | timestamp | Creation date |

### alerts
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

### integrations
| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| serviceId | text | Unique service identifier |
| serviceName | text | Display name |
| category | text | Integration category |
| status | text | connected, disconnected, error |
| lastValidatedAt | timestamp | Last API key validation |
| createdAt | timestamp | Creation date |

---

## API Endpoints

### Dashboards
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/dashboards | List all dashboards |
| POST | /api/dashboards | Create dashboard |
| PATCH | /api/dashboards/:id | Update dashboard |
| DELETE | /api/dashboards/:id | Delete dashboard |

### Panels
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/dashboards/:id/panels | List panels for dashboard |
| POST | /api/dashboards/:id/panels | Create panel |
| PATCH | /api/panels/:id | Update panel |
| DELETE | /api/panels/:id | Delete panel |

### Data Sources
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/datasources | List data sources |
| POST | /api/datasources | Create data source |
| PATCH | /api/datasources/:id | Update data source |
| DELETE | /api/datasources/:id | Delete data source |

### Alerts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/alerts | List all alerts |
| PATCH | /api/alerts/:id | Update alert status |

### Integrations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/integrations | List connected integrations |
| POST | /api/integrations/connect | Connect integration (validates API key) |
| DELETE | /api/integrations/:serviceId | Disconnect integration |

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

---

## Recent Changes

### January 2026

1. **API Key Validation System**
   - Added 20-character minimum validation
   - Server-side validation before connection
   - Connection status stored (not API keys)
   - Proper error handling for invalid keys

2. **Integrations Page Enhancement**
   - Form validation with react-hook-form + Zod
   - Dialog accessibility improvements
   - Removed unused region field
   - Category-based filtering

3. **Documentation**
   - Created comprehensive living documentation
   - Added README with integration guides

---

## Contact

**Infinitywork IT Solutions**  
Website: https://infinityworkitsolutions.com/  
Founder: Mpumelelo Magagula
