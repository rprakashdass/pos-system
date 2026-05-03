"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import apiService from "@/services/apiService";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toaster";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.post('/auth/login', { email, password });
      toast({ title: 'Logged in' });
      router.push('/');
    } catch (err) {
      toast({ variant: 'destructive', title: 'Login failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-12">
      <div className="w-full rounded-2xl border bg-background p-6 shadow-sm">
        <h2 className="text-2xl font-semibold mb-2">Sign in</h2>
        <p className="mb-6 text-sm text-muted-foreground">Use your email and password to access the POS app.</p>
        <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Password</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          New here? <Link className="font-medium text-primary hover:underline" href="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
