"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '@/services/apiService';
import { useToast } from '@/components/ui/toaster';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState({ firstname: '', lastname: '', email: '', password: '', role: 'USER' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.post('/v1/auth/register', form);
      toast({ title: 'Account created', description: 'You can now sign in' });
      router.push('/login');
    } catch {
      toast({ title: 'Registration failed', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 rounded-lg border p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Create account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {(['firstname', 'lastname', 'email', 'password'] as const).map((field) => (
            <div key={field} className="space-y-1">
              <label className="text-sm font-medium capitalize">{field}</label>
              <input
                type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={form[field]}
                onChange={set(field)}
                required
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="underline hover:text-foreground">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
