'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck,
  Building2,
  Clock
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    department: 'Computer Engineering',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { register } = useAuth();

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    
    if (id === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const handleDeptChange = (value) => {
    setFormData({ ...formData, department: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setIsLoading(true);

    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.phone,
      'USER', // Default role for public registration
      formData.department
    );

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || 'Failed to register');
    }
    setIsLoading(false);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-200';
    if (passwordStrength === 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-yellow-500';
    if (passwordStrength === 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength === 1) return 'Weak';
    if (passwordStrength === 2) return 'Fair';
    if (passwordStrength === 3) return 'Good';
    return 'Strong';
  };

  if (success) {
      return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12 sm:px-6 lg:px-8">
            <Card className="relative w-full max-w-md shadow-2xl rounded-[2.5rem] border-none overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500" />
                <CardHeader className="pt-12 pb-6 text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-green-50 shadow-inner">
                        <ShieldCheck className="h-10 w-10 text-green-600" />
                    </div>
                    <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">Identity Secured</CardTitle>
                    <CardDescription className="text-lg font-medium text-slate-500 mt-2">
                        Your account has been created successfully.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8 space-y-6">
                    <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex gap-4">
                        <Clock className="h-6 w-6 text-amber-600 shrink-0 mt-1" />
                        <div>
                            <h4 className="font-black text-amber-900 uppercase tracking-widest text-[10px] mb-1">Approval Required</h4>
                            <p className="text-sm font-medium text-amber-800 leading-relaxed">
                                For security reasons, your account must be verified by your department head before you can log in.
                            </p>
                        </div>
                    </div>
                    
                    <p className="text-center text-slate-400 text-sm font-medium">
                        You will receive an email once your access has been authorized.
                    </p>

                    <Button asChild className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-100 border-none transition-all">
                        <Link href="/login">Return to Sign In</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-blue-50 via-white to-purple-50 px-4 py-6 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-300 opacity-20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-300 opacity-20 blur-3xl animate-pulse delay-1000" />
      </div>

      <Card className="relative w-full max-w-[440px] shadow-2xl rounded-4xl border-none overflow-hidden transition-all">
        <CardHeader className="space-y-1 p-8 pb-4">
          <CardTitle className="text-center text-3xl font-black tracking-tight text-slate-900">Create Identity</CardTitle>
          <CardDescription className="text-center text-sm font-medium text-slate-500">
            Join the automated complaint resolution system.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="px-8 space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-2xl bg-red-50 p-3 border border-red-100 text-xs font-bold text-red-600">
                <XCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</Label>
                    <div className="relative group">
                        <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                        <Input
                            id="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            className="pl-11 h-11 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl font-bold placeholder:text-slate-300 transition-all shadow-inner text-sm"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Email</Label>
                    <div className="relative group">
                        <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="email@univ.edu"
                            value={formData.email}
                            onChange={handleChange}
                            className="pl-11 h-11 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl font-bold placeholder:text-slate-300 transition-all shadow-inner text-sm lowercase"
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department</Label>
                <div className="relative group">
                    <Building2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300 z-10" />
                    <Select value={formData.department} onValueChange={handleDeptChange}>
                        <SelectTrigger className="pl-11 h-11 bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 rounded-xl font-bold shadow-inner text-sm">
                            <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-none shadow-2xl p-2 max-h-[220px]">
                            <SelectItem value="Computer Engineering" className="rounded-xl py-2 font-bold text-sm">Computer Engineering</SelectItem>
                            <SelectItem value="Mechanical Engineering" className="rounded-xl py-2 font-bold text-sm">Mechanical Engineering</SelectItem>
                            <SelectItem value="Electrical Engineering" className="rounded-xl py-2 font-bold text-sm">Electrical Engineering</SelectItem>
                            <SelectItem value="Civil Engineering" className="rounded-xl py-2 font-bold text-sm">Civil Engineering</SelectItem>
                            <SelectItem value="Library" className="rounded-xl py-2 font-bold text-sm">Library</SelectItem>
                            <SelectItem value="Hostel" className="rounded-xl py-2 font-bold text-sm">Hostel</SelectItem>
                            <SelectItem value="Canteen" className="rounded-xl py-2 font-bold text-sm">Canteen</SelectItem>
                            <SelectItem value="Administration" className="rounded-xl py-2 font-bold text-sm">Administration</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="8+ chars"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-11 h-11 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl font-bold placeholder:text-slate-300 transition-all shadow-inner text-sm"
                      required
                      minLength={8}
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Re-type key"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`pl-11 h-11 bg-slate-50 border-none focus-visible:ring-2 rounded-xl font-bold placeholder:text-slate-300 transition-all shadow-inner text-sm ${
                        formData.confirmPassword && formData.password !== formData.confirmPassword 
                        ? 'focus-visible:ring-red-500 text-red-600' 
                        : 'focus-visible:ring-blue-500'
                      }`}
                      required
                    />
                  </div>
                </div>
            </div>

            {formData.password && (
                <div className="px-1 space-y-1">
                  <div className="flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                          i < passwordStrength ? getPasswordStrengthColor() : 'bg-slate-100'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                    <span className={formData.password === formData.confirmPassword ? 'text-green-500' : 'text-slate-300'}>
                        {formData.confirmPassword && formData.password !== formData.confirmPassword ? 'Keys Mismatch' : formData.confirmPassword ? 'Keys Match' : ''}
                    </span>
                    <span className={passwordStrength > 2 ? 'text-blue-500' : 'text-slate-300'}>Strength: {getPasswordStrengthText()}</span>
                  </div>
                </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact</Label>
              <div className="relative group">
                <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 00000 00000"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-11 h-11 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl font-bold placeholder:text-slate-300 transition-all shadow-inner text-sm"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 p-8 pt-4">
            <Button type="submit" className="group w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg shadow-blue-100 transition-all hover:-translate-y-0.5 active:scale-95 border-none text-sm" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Initializing...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>

            <div className="text-center text-xs font-bold text-slate-400">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

function Loader2(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v4" />
      <path d="m16.2 7.8 2.9-2.9" />
      <path d="M18 12h4" />
      <path d="m16.2 16.2 2.9 2.9" />
      <path d="M12 18v4" />
      <path d="m4.9 19.1 2.9-2.9" />
      <path d="M2 12h4" />
      <path d="m4.9 4.9 2.9 2.9" />
    </svg>
  );
}
