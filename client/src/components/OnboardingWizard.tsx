import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
  Activity,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  LayoutDashboard,
  Plug,
  Bell,
  Rocket,
  Play,
  X
} from "lucide-react";
import {
  SiAmazonwebservices,
  SiKubernetes,
  SiPrometheus,
  SiSlack
} from "react-icons/si";

interface OnboardingWizardProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const steps = [
  { id: 1, title: "Welcome", icon: Sparkles },
  { id: 2, title: "Connect", icon: Plug },
  { id: 3, title: "Dashboard", icon: LayoutDashboard },
  { id: 4, title: "Alerts", icon: Bell },
  { id: 5, title: "Ready", icon: Rocket },
];

const quickIntegrations = [
  { id: "aws", name: "AWS", icon: SiAmazonwebservices, color: "text-orange-400" },
  { id: "kubernetes", name: "Kubernetes", icon: SiKubernetes, color: "text-blue-400" },
  { id: "prometheus", name: "Prometheus", icon: SiPrometheus, color: "text-red-400" },
  { id: "slack", name: "Slack", icon: SiSlack, color: "text-purple-400" },
];

const sampleDashboards = [
  { id: "infra", name: "Infrastructure Overview", description: "CPU, Memory, Disk, and Network metrics" },
  { id: "k8s", name: "Kubernetes Cluster", description: "Pod health, deployments, and resource usage" },
  { id: "api", name: "API Performance", description: "Response times, error rates, and throughput" },
  { id: "custom", name: "Start from Scratch", description: "Build your own custom dashboard" },
];

export function OnboardingWizard({ open, onClose, onComplete }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedIntegrations, setSelectedIntegrations] = useState<Set<string>>(new Set());
  const [selectedDashboard, setSelectedDashboard] = useState<string | null>(null);
  const [alertEmail, setAlertEmail] = useState("");
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleIntegration = (id: string) => {
    setSelectedIntegrations(prev => {
      const newSet = new Set(Array.from(prev));
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleComplete = () => {
    toast({
      title: "Setup Complete!",
      description: "Your PulseOps workspace is ready. Let's start monitoring!",
    });
    onComplete();
    onClose();
  };

  const handleSkip = () => {
    toast({
      title: "Setup Skipped",
      description: "You can complete setup anytime from Settings.",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl bg-card border-border/50 p-0 overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-border/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Welcome to PulseOps</h2>
                <p className="text-sm text-muted-foreground">Let's get you set up in under 5 minutes</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleSkip} data-testid="button-skip-onboarding">
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Step {currentStep} of {steps.length}</span>
              <span className="text-primary font-medium">{steps[currentStep - 1].title}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-between mt-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isComplete = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isComplete
                        ? "bg-green-500 text-white"
                        : isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "bg-white/10 text-muted-foreground"
                    }`}
                  >
                    {isComplete ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-1 ${isComplete ? "bg-green-500" : "bg-white/10"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[300px]">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Welcome to PulseOps!</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Your AI-powered observability platform is ready. Let's set up your first dashboard, 
                    connect your infrastructure, and configure alerts.
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <Card className="bg-white/5 border-border/30 text-center p-4">
                    <Plug className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium text-white">Connect</p>
                    <p className="text-xs text-muted-foreground">Your tools</p>
                  </Card>
                  <Card className="bg-white/5 border-border/30 text-center p-4">
                    <LayoutDashboard className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium text-white">Build</p>
                    <p className="text-xs text-muted-foreground">Dashboards</p>
                  </Card>
                  <Card className="bg-white/5 border-border/30 text-center p-4">
                    <Bell className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium text-white">Alert</p>
                    <p className="text-xs text-muted-foreground">Your team</p>
                  </Card>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Connect Your Infrastructure</h3>
                  <p className="text-sm text-muted-foreground">
                    Select the tools you want to connect. You can add more later from the Integrations page.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {quickIntegrations.map((integration) => {
                    const Icon = integration.icon;
                    const isSelected = selectedIntegrations.has(integration.id);
                    
                    return (
                      <Card
                        key={integration.id}
                        className={`bg-white/5 border-border/30 cursor-pointer transition-all hover:border-primary/50 ${
                          isSelected ? "border-primary bg-primary/10" : ""
                        }`}
                        onClick={() => toggleIntegration(integration.id)}
                        data-testid={`onboarding-integration-${integration.id}`}
                      >
                        <CardContent className="p-4 flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center ${integration.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-white">{integration.name}</p>
                            <p className="text-xs text-muted-foreground">Click to select</p>
                          </div>
                          {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  {selectedIntegrations.size} integration{selectedIntegrations.size !== 1 ? "s" : ""} selected
                </p>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Create Your First Dashboard</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a template to get started quickly, or start from scratch.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {sampleDashboards.map((dashboard) => (
                    <Card
                      key={dashboard.id}
                      className={`bg-white/5 border-border/30 cursor-pointer transition-all hover:border-primary/50 ${
                        selectedDashboard === dashboard.id ? "border-primary bg-primary/10" : ""
                      }`}
                      onClick={() => setSelectedDashboard(dashboard.id)}
                      data-testid={`onboarding-dashboard-${dashboard.id}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-white mb-1">{dashboard.name}</p>
                            <p className="text-xs text-muted-foreground">{dashboard.description}</p>
                          </div>
                          {selectedDashboard === dashboard.id && (
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Set Up Alerts</h3>
                  <p className="text-sm text-muted-foreground">
                    Get notified when something needs your attention. We'll set up smart defaults for you.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="alert-email">Notification Email</Label>
                    <Input
                      id="alert-email"
                      type="email"
                      placeholder="you@company.com"
                      value={alertEmail}
                      onChange={(e) => setAlertEmail(e.target.value)}
                      className="bg-white/5 border-border/50"
                      data-testid="input-alert-email"
                    />
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-white">Default Alerts (Pre-configured)</p>
                    <div className="space-y-2">
                      {[
                        { name: "High CPU Usage", threshold: "> 85%", severity: "critical" },
                        { name: "Memory Warning", threshold: "> 80%", severity: "warning" },
                        { name: "Error Rate Spike", threshold: "> 5%", severity: "critical" },
                        { name: "Response Time", threshold: "> 500ms", severity: "warning" },
                      ].map((alert) => (
                        <div
                          key={alert.name}
                          className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-border/30"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                              alert.severity === "critical" ? "bg-red-500" : "bg-yellow-500"
                            }`} />
                            <span className="text-sm text-white">{alert.name}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">{alert.threshold}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto">
                  <Rocket className="w-10 h-10 text-white" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">You're All Set!</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Your PulseOps workspace is configured and ready to go. Start exploring your metrics 
                    and dashboards.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <Card className="bg-green-500/10 border-green-500/30 text-center p-4">
                    <Check className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-white">{selectedIntegrations.size} Integration{selectedIntegrations.size !== 1 ? "s" : ""}</p>
                  </Card>
                  <Card className="bg-green-500/10 border-green-500/30 text-center p-4">
                    <Check className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-white">1 Dashboard</p>
                  </Card>
                  <Card className="bg-green-500/10 border-green-500/30 text-center p-4">
                    <Check className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-white">4 Alerts</p>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-border/50 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
            data-testid="button-onboarding-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          {currentStep < steps.length ? (
            <Button onClick={handleNext} data-testid="button-onboarding-next">
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700" data-testid="button-onboarding-complete">
              <Play className="w-4 h-4 mr-2" />
              Start Monitoring
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
