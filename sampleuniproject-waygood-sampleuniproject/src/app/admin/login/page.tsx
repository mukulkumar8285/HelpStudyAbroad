"use client";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { setEmail, setPassword, userLoginSuccess } from "@/redux/Slice";
import { loginAdmin } from "@/api/api";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Compass, LogIn } from "lucide-react";
import { Settoken } from "@/utils/auth";

export default function AdminLoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();

  const { email, password } = useSelector((state: RootState) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
     const response =  await loginAdmin(email, password);          
      dispatch(userLoginSuccess()); 
      console.log(response.token); 
      Settoken(response.token);    
      toast({ title: "Login Successful", description: "Redirecting..." });
      router.push("/admin/dashboard");
    } catch {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password.",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <form onSubmit={handleLogin}>
          <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-2">
              <Compass className="h-10 w-10 text-accent" />
              <h1 className="text-3xl font-bold text-primary">Course Compass</h1>
            </div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => dispatch(setEmail(e.target.value))}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => dispatch(setPassword(e.target.value))}
                required
                disabled={isLoading}
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
              {!isLoading && <LogIn className="ml-2 h-4 w-4" />}
            </Button>
          </CardFooter>
        </form>
        <Button variant="link" className="mx-auto w-full" onClick={() => router.push("/admin/signup")}>
            Back to Signup
        </Button>
      </Card>
    </div>
  );
}
