import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Activity, BarChart3, TrendingUp, Zap, Server, Database, Shield, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { SiGithub, SiGoogle } from "react-icons/si";
import { Grid2x2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface FloatingElement {
  id: number;
  icon: typeof Activity;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const floatingElements: FloatingElement[] = [
  { id: 1, icon: Activity, x: 10, y: 20, size: 32, duration: 8, delay: 0 },
  { id: 2, icon: BarChart3, x: 80, y: 15, size: 40, duration: 10, delay: 1 },
  { id: 3, icon: TrendingUp, x: 15, y: 70, size: 28, duration: 9, delay: 2 },
  { id: 4, icon: Server, x: 85, y: 60, size: 36, duration: 11, delay: 0.5 },
  { id: 5, icon: Database, x: 50, y: 10, size: 30, duration: 7, delay: 1.5 },
  { id: 6, icon: Zap, x: 25, y: 85, size: 24, duration: 8, delay: 3 },
  { id: 7, icon: Shield, x: 70, y: 80, size: 34, duration: 9, delay: 2.5 },
  { id: 8, icon: Activity, x: 5, y: 45, size: 26, duration: 10, delay: 1 },
  { id: 9, icon: BarChart3, x: 90, y: 35, size: 38, duration: 8, delay: 0 },
  { id: 10, icon: TrendingUp, x: 45, y: 90, size: 32, duration: 12, delay: 2 },
];

const gridLines = Array.from({ length: 20 }, (_, i) => i);

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignInFormData = z.infer<typeof signInSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;

export default function Login() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const handleSignIn = (data: SignInFormData) => {
    toast({ title: "Welcome back!", description: "Redirecting to dashboard..." });
    setTimeout(() => setLocation("/app"), 1500);
  };

  const handleSignUp = (data: SignUpFormData) => {
    toast({ title: "Account created!", description: "Welcome to PulseOps! Redirecting..." });
    setTimeout(() => setLocation("/app"), 1500);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-20">
          {gridLines.map((i) => (
            <motion.line
              key={`h-${i}`}
              x1="0%"
              y1={`${i * 5}%`}
              x2="100%"
              y2={`${i * 5}%`}
              stroke="url(#grid-gradient)"
              strokeWidth="1"
              initial={{ opacity: 0.1 }}
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
          {gridLines.map((i) => (
            <motion.line
              key={`v-${i}`}
              x1={`${i * 5}%`}
              y1="0%"
              x2={`${i * 5}%`}
              y2="100%"
              stroke="url(#grid-gradient)"
              strokeWidth="1"
              initial={{ opacity: 0.1 }}
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
          <defs>
            <linearGradient id="grid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Animated Floating Observability Icons */}
      {floatingElements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute text-primary/20"
          style={{ left: `${el.x}%`, top: `${el.y}%` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1],
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            delay: el.delay,
            ease: "easeInOut",
          }}
        >
          <el.icon size={el.size} />
        </motion.div>
      ))}

      {/* Animated Pulse Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {[1, 2, 3].map((ring) => (
          <motion.div
            key={ring}
            className="absolute rounded-full border border-primary/20"
            style={{
              width: 200 + ring * 150,
              height: 200 + ring * 150,
              left: -(100 + ring * 75),
              top: -(100 + ring * 75),
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 4 + ring,
              repeat: Infinity,
              delay: ring * 0.5,
            }}
          />
        ))}
      </div>

      {/* Gradient Orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-primary/10 blur-3xl"
        style={{ left: "10%", top: "20%" }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-80 h-80 rounded-full bg-purple-500/10 blur-3xl"
        style={{ right: "10%", bottom: "20%" }}
        animate={{
          x: [0, -40, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Back to Home Link */}
      <Link href="/">
        <motion.div
          className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-white transition-colors cursor-pointer z-20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          data-testid="link-back-home"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </motion.div>
      </Link>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Link href="/">
              <div className="inline-flex items-center gap-2 cursor-pointer" data-testid="link-logo-home">
                <div className="relative">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-primary/50"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <span className="text-2xl font-bold text-white">PulseOps</span>
              </div>
            </Link>
          </motion.div>

          {/* Flip Card Container */}
          <div className="relative" style={{ perspective: "1000px" }}>
            <AnimatePresence mode="wait">
              {!isFlipped ? (
                <motion.div
                  key="signin"
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Sign In Card */}
                  <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-6">
                      <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                      <p className="text-muted-foreground">Sign in to your PulseOps account</p>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="flex gap-3 mb-6">
                      <Button
                        variant="outline"
                        className="flex-1 bg-white/5 border-white/20 hover:bg-white/10 text-white"
                        data-testid="button-signin-google"
                      >
                        <SiGoogle className="w-4 h-4 mr-2" />
                        Google
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 bg-white/5 border-white/20 hover:bg-white/10 text-white"
                        data-testid="button-signin-github"
                      >
                        <SiGithub className="w-4 h-4 mr-2" />
                        GitHub
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 bg-white/5 border-white/20 hover:bg-white/10 text-white"
                        data-testid="button-signin-microsoft"
                      >
                        <Grid2x2 className="w-4 h-4 mr-2" />
                        Microsoft
                      </Button>
                    </div>

                    <div className="relative mb-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/20"></div>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-transparent px-2 text-muted-foreground">or continue with email</span>
                      </div>
                    </div>

                    <Form {...signInForm}>
                      <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                        <FormField
                          control={signInForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white/80">Email</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="you@company.com"
                                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-primary"
                                  data-testid="input-signin-email"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signInForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white/80">Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-primary pr-10"
                                    data-testid="input-signin-password"
                                    {...field}
                                  />
                                  <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                                    onClick={() => setShowPassword(!showPassword)}
                                    data-testid="button-toggle-password"
                                  >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex items-center justify-between text-sm">
                          <label className="flex items-center gap-2 text-white/60 cursor-pointer">
                            <input type="checkbox" className="rounded border-white/20 bg-white/5" data-testid="input-remember-me" />
                            Remember me
                          </label>
                          <a href="#" className="text-primary hover:underline" data-testid="link-forgot-password">Forgot password?</a>
                        </div>
                        <Button
                          type="submit"
                          size="lg"
                          className="w-full"
                          data-testid="button-signin-submit"
                        >
                          Sign In
                        </Button>
                      </form>
                    </Form>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                      Don't have an account?{" "}
                      <button
                        onClick={() => setIsFlipped(true)}
                        className="text-primary hover:underline font-medium"
                        data-testid="button-switch-to-signup"
                      >
                        Create one
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ rotateY: -90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: 90, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Sign Up Card */}
                  <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-6">
                      <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
                      <p className="text-muted-foreground">Start monitoring your infrastructure</p>
                    </div>

                    {/* Social Signup Buttons */}
                    <div className="flex gap-3 mb-6">
                      <Button
                        variant="outline"
                        className="flex-1 bg-white/5 border-white/20 hover:bg-white/10 text-white"
                        data-testid="button-signup-google"
                      >
                        <SiGoogle className="w-4 h-4 mr-2" />
                        Google
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 bg-white/5 border-white/20 hover:bg-white/10 text-white"
                        data-testid="button-signup-github"
                      >
                        <SiGithub className="w-4 h-4 mr-2" />
                        GitHub
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 bg-white/5 border-white/20 hover:bg-white/10 text-white"
                        data-testid="button-signup-microsoft"
                      >
                        <Grid2x2 className="w-4 h-4 mr-2" />
                        Microsoft
                      </Button>
                    </div>

                    <div className="relative mb-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/20"></div>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-transparent px-2 text-muted-foreground">or sign up with email</span>
                      </div>
                    </div>

                    <Form {...signUpForm}>
                      <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                        <FormField
                          control={signUpForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white/80">Full Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="John Doe"
                                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-primary"
                                  data-testid="input-signup-name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signUpForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white/80">Work Email</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="you@company.com"
                                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-primary"
                                  data-testid="input-signup-email"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signUpForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white/80">Password</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Create a strong password"
                                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-primary"
                                  data-testid="input-signup-password"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signUpForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white/80">Confirm Password</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Confirm your password"
                                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-primary"
                                  data-testid="input-signup-confirm"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="submit"
                          size="lg"
                          className="w-full"
                          data-testid="button-signup-submit"
                        >
                          Create Account
                        </Button>
                      </form>
                    </Form>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <button
                        onClick={() => setIsFlipped(false)}
                        className="text-primary hover:underline font-medium"
                        data-testid="button-switch-to-signin"
                      >
                        Sign in
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <motion.p
            className="text-center text-xs text-muted-foreground mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            By continuing, you agree to our{" "}
            <a href="#" className="text-primary hover:underline" data-testid="link-terms">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="text-primary hover:underline" data-testid="link-privacy">Privacy Policy</a>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
