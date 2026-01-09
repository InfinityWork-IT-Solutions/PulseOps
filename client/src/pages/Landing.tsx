import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  BarChart3,
  Bell,
  Brain,
  CheckCircle,
  ChevronRight,
  Code,
  Database,
  FileText,
  Globe,
  Layout,
  LineChart,
  Lock,
  Mail,
  Network,
  Play,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
  ArrowRight,
  Star,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Layout,
    title: "Customizable Dashboards",
    description: "Build beautiful, interactive dashboards with drag-and-drop panels. Support for line, bar, area, pie, and stat visualizations.",
  },
  {
    icon: Activity,
    title: "Metrics Explorer",
    description: "Query and explore metrics with powerful ad-hoc analysis. Compare multiple series and identify trends instantly.",
  },
  {
    icon: FileText,
    title: "Log Analytics",
    description: "Stream, search, and analyze logs in real-time. Filter by level, service, and custom attributes.",
  },
  {
    icon: Network,
    title: "Service Mapping",
    description: "Visualize service dependencies and health. Understand your architecture at a glance.",
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Automatic anomaly detection, predictive alerts, and intelligent correlation across your entire stack.",
  },
  {
    icon: Bell,
    title: "Smart Alerting",
    description: "Configure alerts with thresholds and get notified via email, Slack, PagerDuty, and more.",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for small teams getting started",
    features: [
      "Up to 3 dashboards",
      "7-day data retention",
      "Basic alerting",
      "Community support",
      "2 team members",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per user/month",
    description: "For growing teams that need more power",
    features: [
      "Unlimited dashboards",
      "30-day data retention",
      "Advanced alerting",
      "Priority support",
      "Unlimited team members",
      "API access",
      "Custom integrations",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For organizations with advanced needs",
    features: [
      "Everything in Pro",
      "Unlimited data retention",
      "SSO/SAML authentication",
      "Dedicated support",
      "Custom SLAs",
      "On-premise option",
      "Advanced AI features",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const testimonials = [
  {
    quote: "PulseOps transformed how we monitor our infrastructure. The AI insights alone saved us countless hours.",
    author: "Sarah Chen",
    role: "VP of Engineering",
    company: "TechScale",
  },
  {
    quote: "Finally, an observability tool that's both powerful and easy to use. Our team was productive from day one.",
    author: "Marcus Johnson",
    role: "SRE Lead",
    company: "CloudNative Inc",
  },
  {
    quote: "The service mapping feature helped us identify bottlenecks we didn't even know existed.",
    author: "Emily Rodriguez",
    role: "DevOps Manager",
    company: "FastDeploy",
  },
];

const integrations = [
  { name: "AWS", icon: "aws" },
  { name: "GCP", icon: "gcp" },
  { name: "Azure", icon: "azure" },
  { name: "Kubernetes", icon: "k8s" },
  { name: "Docker", icon: "docker" },
  { name: "Prometheus", icon: "prometheus" },
  { name: "Grafana", icon: "grafana" },
  { name: "Datadog", icon: "datadog" },
];

export default function Landing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="absolute inset-0 bg-primary/20 rounded-lg blur-sm" />
                <div className="relative w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 animate-shimmer" />
                  <div className="w-4 h-1 bg-primary-foreground rounded-full" />
                </div>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                PulseOps
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-white transition-colors" data-testid="link-features">
                Features
              </a>
              <a href="#pricing" className="text-sm text-muted-foreground hover:text-white transition-colors" data-testid="link-pricing">
                Pricing
              </a>
              <a href="#testimonials" className="text-sm text-muted-foreground hover:text-white transition-colors" data-testid="link-customers">
                Customers
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-white transition-colors" data-testid="link-docs">
                Docs
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/app">
                <Button variant="ghost" size="sm" data-testid="button-login">
                  Log In
                </Button>
              </Link>
              <Link href="/app">
                <Button size="sm" className="gap-2" data-testid="button-get-started">
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm border-primary/30 bg-primary/5">
              <Sparkles className="w-3.5 h-3.5 mr-2 text-primary" />
              AI-Powered Observability Platform
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
              Built for Scale.{" "}
              <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">
                Priced for Reality.
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              The complete observability platform that combines powerful monitoring, intelligent insights, 
              and beautiful dashboards. See everything. Miss nothing.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/app">
                <Button size="lg" className="gap-2" data-testid="button-start-free">
                  <Play className="w-4 h-4" />
                  Start Free
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="gap-2" data-testid="button-watch-demo">
                <Play className="w-4 h-4" />
                Watch Demo
              </Button>
            </div>

            <div className="mt-16 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Free forever plan
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Setup in 5 minutes
              </div>
            </div>
          </div>

          <div className="mt-20 relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 rounded-2xl blur-2xl opacity-50" />
            <div className="relative rounded-xl border border-border/50 bg-card/50 backdrop-blur overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-card/80">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-4 text-xs text-muted-foreground">PulseOps Dashboard</span>
              </div>
              <div className="p-6 bg-gradient-to-br from-card via-card/80 to-background min-h-[400px] flex items-center justify-center">
                <div className="grid grid-cols-3 gap-4 w-full max-w-4xl">
                  <Card className="border-border/50 bg-card/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-muted-foreground">Requests/sec</span>
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      </div>
                      <div className="text-2xl font-bold text-white">24.5K</div>
                      <div className="mt-3 h-12 flex items-end gap-1">
                        {[40, 65, 45, 80, 60, 90, 75, 85, 95, 70, 88, 92].map((h, i) => (
                          <div key={i} className="flex-1 bg-primary/40 rounded-t" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50 bg-card/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-muted-foreground">Error Rate</span>
                        <Activity className="w-4 h-4 text-yellow-500" />
                      </div>
                      <div className="text-2xl font-bold text-white">0.12%</div>
                      <div className="mt-3 h-12 flex items-end gap-1">
                        {[20, 15, 25, 10, 30, 15, 20, 25, 15, 10, 12, 8].map((h, i) => (
                          <div key={i} className="flex-1 bg-yellow-500/40 rounded-t" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50 bg-card/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-muted-foreground">Uptime</span>
                        <Shield className="w-4 h-4 text-green-500" />
                      </div>
                      <div className="text-2xl font-bold text-white">99.99%</div>
                      <div className="mt-3 h-12 flex items-center">
                        <div className="flex-1 grid grid-cols-30 gap-0.5">
                          {Array(30).fill(0).map((_, i) => (
                            <div key={i} className={cn("h-4 rounded-sm", i === 18 ? "bg-yellow-500/60" : "bg-green-500/60")} />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 border-y border-border/30 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground mb-8">
            Trusted by engineering teams at innovative companies
          </p>
          <div className="flex items-center justify-center gap-12 flex-wrap opacity-60">
            {["Stripe", "Vercel", "Linear", "Notion", "Figma", "Slack"].map((company) => (
              <div key={company} className="text-lg font-semibold text-muted-foreground">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything you need for complete observability
            </h2>
            <p className="text-lg text-muted-foreground">
              From metrics to logs to traces, PulseOps brings all your observability data together in one powerful platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border-border/50 bg-card/30 hover:bg-card/50 transition-colors group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-card/30 border-y border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="outline" className="mb-4">AI-Powered</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Intelligent insights that actually help
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our AI doesn't just detect anomalies—it correlates events across your entire stack, 
                predicts issues before they happen, and suggests actionable fixes.
              </p>
              <ul className="space-y-4">
                {[
                  "Automatic anomaly detection across all metrics",
                  "Predictive alerts before issues impact users",
                  "Root cause analysis with correlated events",
                  "AI-generated recommendations for optimization",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-primary/20 rounded-2xl blur-2xl" />
              <Card className="relative border-border/50 bg-card/80">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-500" />
                    <span className="font-semibold text-white">AI Insight</span>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">High Confidence</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <p className="text-sm text-white font-medium mb-2">Anomaly Detected</p>
                    <p className="text-sm text-muted-foreground">
                      API latency increased 340% in the last 15 minutes. This correlates with a deployment 
                      at 14:32 UTC and increased database query times.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-muted-foreground">94% confidence score</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Pricing</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-muted-foreground">
              Start free and scale as you grow. No hidden fees, no surprises.
            </p>
            
            <div className="mt-8 inline-flex items-center gap-2 p-1 rounded-lg bg-card border border-border">
              <button
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  billingCycle === "monthly" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-white"
                )}
                onClick={() => setBillingCycle("monthly")}
                data-testid="button-billing-monthly"
              >
                Monthly
              </button>
              <button
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  billingCycle === "annual" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-white"
                )}
                onClick={() => setBillingCycle("annual")}
                data-testid="button-billing-annual"
              >
                Annual <span className="text-green-500 ml-1">-20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <Card key={plan.name} className={cn(
                "relative border-border/50",
                plan.popular ? "border-primary bg-card" : "bg-card/30"
              )}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl text-white">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-white">
                      {billingCycle === "annual" && plan.price !== "$0" && plan.price !== "Custom"
                        ? `$${Math.round(parseInt(plan.price.replace("$", "")) * 0.8)}`
                        : plan.price}
                    </span>
                    <span className="text-muted-foreground ml-2">/{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Button className={cn("w-full", !plan.popular && "variant-outline")} variant={plan.popular ? "default" : "outline"} data-testid={`button-pricing-${plan.name.toLowerCase()}`}>
                    {plan.cta}
                  </Button>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-24 bg-card/30 border-y border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Loved by engineering teams
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.author} className="border-border/50 bg-card/50">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {testimonial.author.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm">{testimonial.author}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}, {testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl border border-border/50 bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 p-12 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to get started?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of engineering teams using PulseOps to monitor their systems.
                Start free, no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/app">
                  <Button size="lg" className="gap-2" data-testid="button-cta-get-started">
                    Get Started for Free
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="gap-2" data-testid="button-contact-sales">
                  <Mail className="w-4 h-4" />
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-16 border-t border-border/30 bg-card/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <div className="w-4 h-1 bg-primary-foreground rounded-full" />
                </div>
                <span className="font-bold text-xl text-white">PulseOps</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                The complete observability platform for modern engineering teams.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-muted-foreground hover:text-white transition-colors" data-testid="link-twitter">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-white transition-colors" data-testid="link-github">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-white transition-colors" data-testid="link-linkedin">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              2026 PulseOps. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
