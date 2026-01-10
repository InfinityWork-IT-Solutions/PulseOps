# PulseOps

**AI-Powered Observability & Monitoring Platform**

A comprehensive observability platform that unifies metrics, logs, traces, and alerts with AI-powered insights. Built by [Infinitywork IT Solutions](https://infinityworkitsolutions.com/).

---

## What is PulseOps?

PulseOps is a modern observability platform designed to help engineering teams monitor, analyze, and troubleshoot their systems in real-time. Think of it as your command center for all things monitoring - combining the best features of tools like Grafana, Datadog, and New Relic into a single, intelligent interface.

### Key Capabilities

- **Customizable Dashboards** - Build visual dashboards with various chart types
- **Metrics Explorer** - Query and visualize metrics on-the-fly
- **Logs Viewer** - Stream and filter logs in real-time
- **Service Map** - Visualize service dependencies and health
- **Smart Alerts** - Set up alerts with severity levels and resolution workflows
- **AI Insights** - Get anomaly detection and predictive analytics
- **One-Click Integrations** - Connect to AWS, GCP, Azure, Datadog, and more
- **Incident Management** - Collaborate on incident response

---

## Who is PulseOps Built For?

| Role | Use Case |
|------|----------|
| **SRE Teams** | Monitor system reliability, reduce MTTR, manage incidents |
| **DevOps Engineers** | Track CI/CD pipelines, infrastructure health |
| **Platform Teams** | Manage service dependencies, capacity planning |
| **Engineering Managers** | Get visibility into system health and team performance |
| **Developers** | Debug issues quickly with unified logs and metrics |

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```
   DATABASE_URL=your_postgres_connection_string
   SESSION_SECRET=your_session_secret
   ```
4. Push database schema:
   ```bash
   npm run db:push
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open http://localhost:5000 in your browser

---

## Connecting Integrations

PulseOps supports 20+ integrations across cloud providers, monitoring tools, and CI/CD platforms.

### How to Connect an Integration

1. Navigate to **Integrations** from the sidebar
2. Browse integrations by category or search by name
3. Click **Connect** on the integration you want to add
4. Enter your API key when prompted
5. Click **Connect Integration** to validate and save

**Important:** Your API keys are validated securely on our servers. We do NOT store your actual API keys - only the connection status is saved.

---

## How to Get API Keys

### AWS CloudWatch

1. Log in to the [AWS Console](https://console.aws.amazon.com/)
2. Go to **IAM** (Identity and Access Management)
3. Click **Users** → **Add users**
4. Enter a username (e.g., `pulseops-monitor`)
5. Select **Access key - Programmatic access**
6. Attach the `CloudWatchReadOnlyAccess` policy
7. Complete the wizard and copy your **Access Key ID** and **Secret Access Key**
8. Use format: `ACCESSKEYID:SECRETACCESSKEY` when connecting

### Datadog

1. Log in to [Datadog](https://app.datadoghq.com/)
2. Go to **Organization Settings** → **API Keys**
3. Click **New Key** and give it a name
4. Copy the API key
5. For full access, also create an **Application Key** under the same section
6. Use the API key when connecting to PulseOps

### Prometheus

1. If using Prometheus with authentication, access your Prometheus server
2. Navigate to **Configuration** or your auth provider settings
3. Generate an API token or bearer token
4. Copy the token
5. Use the token when connecting to PulseOps

### New Relic

1. Log in to [New Relic](https://one.newrelic.com/)
2. Click your profile → **API Keys**
3. Click **Create a key**
4. Select **Ingest** type for data ingestion or **User** for query access
5. Give it a name and create
6. Copy the key and use it in PulseOps

### GitHub Actions

1. Log in to [GitHub](https://github.com/)
2. Go to **Settings** → **Developer settings** → **Personal access tokens**
3. Click **Generate new token (classic)** or **Fine-grained tokens**
4. For Actions monitoring, select scopes:
   - `repo` (for private repos)
   - `workflow`
   - `actions:read`
5. Generate and copy the token

### Azure Monitor

1. Log in to the [Azure Portal](https://portal.azure.com/)
2. Go to **Azure Active Directory** → **App registrations**
3. Click **New registration** and create an app
4. After creation, go to **Certificates & secrets**
5. Create a new **Client secret**
6. Copy the **Application (client) ID** and the **Secret value**
7. Use format: `CLIENT_ID:CLIENT_SECRET` when connecting

### Google Cloud (GCP)

1. Log in to the [GCP Console](https://console.cloud.google.com/)
2. Go to **IAM & Admin** → **Service Accounts**
3. Click **Create Service Account**
4. Give it a name and the **Monitoring Viewer** role
5. Click on the service account → **Keys** → **Add Key** → **Create new key**
6. Select **JSON** format and download
7. The JSON file contains your credentials - use the `private_key` field

### Slack (Notifications)

1. Go to [Slack API](https://api.slack.com/apps)
2. Click **Create New App** → **From scratch**
3. Give it a name and select your workspace
4. Go to **OAuth & Permissions**
5. Add scopes: `chat:write`, `channels:read`
6. Click **Install to Workspace**
7. Copy the **Bot User OAuth Token** (starts with `xoxb-`)

### PagerDuty

1. Log in to [PagerDuty](https://app.pagerduty.com/)
2. Go to **Integrations** → **Developer Tools** → **API Access Keys**
3. Click **Create New API Key**
4. Give it a description
5. Copy the API key

### Grafana Cloud

1. Log in to [Grafana Cloud](https://grafana.com/auth/sign-in)
2. Go to your stack → **Security** → **API Keys**
3. Click **Add API Key**
4. Select the role (Viewer, Editor, or Admin)
5. Generate and copy the key

### Elasticsearch

1. Access your Elasticsearch cluster
2. If using Elastic Cloud, go to **Deployment** → **Security**
3. Create an API key or use Basic Auth credentials
4. For API key, use format: `id:api_key`
5. For Basic Auth, use format: `username:password`

---

## Troubleshooting

### "Invalid API key" Error

- Ensure your API key is at least 20 characters long
- Check that you copied the complete key without extra spaces
- Verify the key hasn't expired or been revoked
- Make sure you're using the correct key type (API key vs App key)

### Integration Shows "Error" Status

- The API key may have been rotated or revoked
- Disconnect and reconnect with a new valid key
- Check if the service is experiencing outages

### Can't Find My Integration

- Use the search bar to find integrations by name
- Check different categories using the filter tabs
- Contact support if you need a specific integration added

---

## Security

- API keys are validated server-side before any connection is established
- We do NOT store your actual API keys in our database
- Only the connection status is saved
- All communications are encrypted via HTTPS
- Session data is encrypted using industry-standard practices

---

## Support

For questions, issues, or feature requests:

**Infinitywork IT Solutions**  
Website: [infinityworkitsolutions.com](https://infinityworkitsolutions.com/)  
Founder: Mpumelelo Magagula

---

## License

Copyright 2026 Infinitywork IT Solutions. All rights reserved.
