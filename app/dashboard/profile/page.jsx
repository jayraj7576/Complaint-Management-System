'use client';

import React, { useState, useEffect } from 'react';
import { User as UserIcon, Settings, ShieldCheck, Mail, Activity, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import ProfileForm from '@/components/profile/ProfileForm';
import PasswordForm from '@/components/profile/PasswordForm';
import AvatarUpload from '@/components/profile/AvatarUpload';
import { toast } from 'sonner';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([
    'Computer Engineering',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Civil Engineering',
    'Library',
    'Hostel',
    'Canteen',
    'Administration'
  ]); // Default while fetching dynamic depts if needed

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
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 border-none">Account Settings</h1>
        <p className="text-slate-500 mt-1">Manage your profile, password, and account preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Summary */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-8 flex flex-col items-center">
              <AvatarUpload currentAvatar={user?.avatar} onUpdate={handleAvatarUpdate} />
              
              <div className="mt-6 w-full space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-1.5 font-medium"><ShieldCheck size={14} /> Role</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 uppercase tracking-wider text-[10px]">
                    {user?.role}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-1.5 font-medium"><Mail size={14} /> Email</span>
                  <span className="text-slate-900 font-medium truncate ml-4 max-w-[120px]">{user?.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm border-none flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-500" />
                Account Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-[11px] text-slate-500 space-y-1">
                <p>Member since:</p>
                <p className="text-slate-900 font-medium italic">
                  {new Date(user?.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <Separator />
              <div className="text-[11px] text-slate-500 space-y-1">
                <p>Last profile update:</p>
                <p className="text-slate-900 font-medium italic">
                    {new Date(user?.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Detail Forms */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="border-none flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-blue-600" />
                Public Profile
              </CardTitle>
              <CardDescription>This information will be visible to administrators and relevant staff.</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm user={user} departments={departments} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="border-none flex items-center gap-2">
                <Settings className="h-5 w-5 text-red-600" />
                Security & Privacy
              </CardTitle>
              <CardDescription>Update your password to keep your account secure.</CardDescription>
            </CardHeader>
            <CardContent>
              <PasswordForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
