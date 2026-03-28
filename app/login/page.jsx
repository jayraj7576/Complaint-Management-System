'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, XCircle, Shield, Clock, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    if (!result.success) {
      if (result.error && result.error.includes('pending approval')) {
        setIsPending(true);
      } else {
        setError(result.error || 'Failed to login');
      }
    }
    setIsLoading(false);
  };

  const handleStatusCheck = async () => {
    if (!email) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/auth/status?email=${email}`);
      const data = await res.json();
      if (data.success && data.status === 'APPROVED') {
        setIsPending(false);
        // Prompt for password again to ensure security and log them in
        setError('Your account is now approved! Please enter your password to sign in.');
      } else if (data.success && data.status === 'PENDING') {
        toast.info('Status updated: Verification is still in progress.');
      }
    } catch (err) {
      console.error('Status check error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-blue-50 via-white to-purple-50 px-4 py-6 sm:px-6 lg:px-8">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-300 opacity-20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-300 opacity-20 blur-3xl animate-pulse delay-1000" />
      </div>

      <Card className="relative w-full max-w-[400px] shadow-2xl overflow-hidden rounded-3xl border-none transition-all">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600" />
        
        {isPending ? (
          <div className="p-8 space-y-6 text-center animate-in fade-in zoom-in duration-500">
            <div className="mx-auto w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center shadow-inner relative">
               <Clock className="h-8 w-8 text-amber-600 animate-pulse" />
               <div className="absolute -top-1 -right-1 h-3 w-3 bg-amber-500 rounded-full border-2 border-white" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Verification Live</h2>
              <p className="text-slate-500 text-sm font-medium leading-relaxed px-2">
                Your account is currently being reviewed by your <span className="text-blue-600 font-bold">Department Head</span>. 
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border-2 border-dashed border-slate-200">
               <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Current Status</p>
               <div className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-black whitespace-nowrap">
                  AWAITING AUTHORIZATION
               </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={() => setIsPending(false)} 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-xl shadow-blue-100 transition-all text-sm border-none active:scale-95"
              >
                Try Different Account
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleStatusCheck} 
                disabled={isLoading}
                className="w-full h-10 text-slate-500 font-bold hover:bg-slate-50 rounded-lg text-sm"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                Refresh Status
              </Button>
            </div>

            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
               Security Protocol v4.2
            </p>
          </div>
        ) : (
          <>
            <CardHeader className="space-y-1 p-8 pb-4">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 shadow-inner">
                <Shield className="h-7 w-7 text-blue-600" />
              </div>
              <CardTitle className="text-center text-3xl font-black tracking-tight text-slate-900">Sign In</CardTitle>
              <CardDescription className="text-center text-sm font-medium text-slate-500">
                Authorized Access Only
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 px-8">
                {error && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 border border-red-100 text-xs font-bold text-red-600">
                    <XCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official ID</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-11 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl font-bold placeholder:text-slate-300 transition-all shadow-inner text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between ml-1">
                    <Label htmlFor="password" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Key</Label>
                    <Link href="#" className="text-[10px] font-black text-blue-600 hover:underline uppercase tracking-widest">
                      Restore?
                    </Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 h-11 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl font-bold placeholder:text-slate-300 transition-all shadow-inner text-sm"
                      required
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4 p-8 pt-4">
                <Button type="submit" className="group w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg shadow-blue-100 transition-all hover:-translate-y-0.5 active:scale-95 border-none text-sm" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>

                <div className="text-center text-xs font-bold text-slate-400">
                  New to the system?{' '}
                  <Link href="/register" className="text-blue-600 hover:underline">
                    Create Identity
                  </Link>
                </div>
              </CardFooter>
            </form>
          </>
        )}
      </Card>
    </div>
  );
}
