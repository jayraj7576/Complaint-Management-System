'use client';

import React, { useState, useEffect } from 'react';
import { User as UserIcon, Settings, ShieldCheck, Mail, Activity, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import ProfileForm from '@/components/profile/ProfileForm';
import PasswordForm from '@/components/profile/PasswordForm';
import AvatarUpload from '@/components/profile/AvatarUpload';
import MainLayout from '@/components/layout/MainLayout';
import { toast } from 'sonner';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const departments = [
    'Computer Engineering',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Civil Engineering',
    'Library',
    'Hostel',
    'Canteen',
    'Administration'
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
      } else {
        toast.error('Failed to load profile');
      }
    } catch (err) {
      toast.error('An error occurred loading profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpdate = (newUrl) => {
    setUser({ ...user, avatar: newUrl });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 border-none">Account Settings</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your profile, password, and account preferences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Avatar & Summary */}
          <div className="space-y-6">
            <Card className="border-none shadow-xl ring-1 ring-black/5">
              <CardContent className="pt-8 flex flex-col items-center">
                <AvatarUpload currentAvatar={user?.avatar} onUpdate={handleAvatarUpdate} />
                
                <div className="mt-6 w-full space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-1.5 font-bold"><ShieldCheck size={14} className="text-blue-600" /> Role</span>
                    <Badge className="bg-blue-600 text-white border-none font-bold uppercase tracking-wider text-[10px]">
                      {user?.role.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm border-t pt-3">
                    <span className="text-slate-500 flex items-center gap-1.5 font-bold"><Mail size={14} className="text-blue-600" /> Email</span>
                    <span className="text-slate-900 font-extrabold truncate ml-4 max-w-[120px]">{user?.email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl ring-1 ring-black/5">
              <CardHeader className="pb-3 border-b bg-slate-50/50">
                <CardTitle className="text-sm font-bold border-none flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                  Account Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="text-[11px] text-slate-500 space-y-1">
                  <p className="font-bold uppercase tracking-widest">Member since</p>
                  <p className="text-slate-900 font-extrabold text-sm">
                    {new Date(user?.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <Separator />
                <div className="text-[11px] text-slate-500 space-y-1">
                  <p className="font-bold uppercase tracking-widest">Last profile update</p>
                  <p className="text-slate-900 font-extrabold text-sm italic">
                      {new Date(user?.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Detail Forms */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border-none shadow-xl ring-1 ring-black/5">
              <CardHeader className="border-b bg-white/50">
                <CardTitle className="border-none flex items-center gap-2 font-bold text-xl">
                  <UserIcon className="h-5 w-5 text-blue-600" />
                  Public Profile
                </CardTitle>
                <CardDescription className="font-medium">This information is visible to institutional reviewers.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ProfileForm user={user} departments={departments} />
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl ring-1 ring-black/5">
              <CardHeader className="border-b bg-red-50/30">
                <CardTitle className="border-none flex items-center gap-2 font-bold text-xl text-red-600">
                  <Settings className="h-5 w-5" />
                  Security & Credentials
                </CardTitle>
                <CardDescription className="font-medium">Keep your account secure with a strong password.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <PasswordForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
