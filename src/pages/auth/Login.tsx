import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import logo from "@/assets/logo.png";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Apply dark green theme on login page only
  useEffect(() => {
    const root = document.documentElement;

    root.classList.add("dark", "theme-auth");

    return () => {
      // Remove only the auth theme on unmount
      root.classList.remove("theme-auth");
    };
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      // Navigate to dashboard on success
      navigate("/admin/dashboard", { replace: true });
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <img
            src={logo}
            alt="Al-Khair Pharmacy & Store"
            className="h-32 w-auto mx-auto mb-4"
          />
        </div>

        {/* Login Card */}
        <div className="bg-card rounded-lg border border-border p-8 shadow-card">
          <h1 className="text-2xl font-semibold text-center text-foreground mb-6 font-display">
            Welcome Back
          </h1>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-body">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:ring-ring"
                disabled={isLoading}
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-body">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:ring-ring"
                disabled={isLoading}
              />
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-muted-foreground text-sm mt-6 font-body">
          Al-Khair Pharmacy & Store — Admin Portal
        </p>
      </div>
    </div>
  );
};

export default Login;
