'use client';

import React, { useState } from 'react';
import { Loader2, Save, User, Phone, Building, Bell, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export default function ProfileForm({ user, departments = [] }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    department: user?.department || '',
    notificationPreferences: {
      email: user?.notificationPreferences?.email ?? true,
      browser: user?.notificationPreferences?.browser ?? true,
      frequency: user?.notificationPreferences?.frequency || 'IMMEDIATE',
    }
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Profile updated successfully');
      } else {
        toast.error(data.error || 'Failed to update profile');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-900 border-b pb-2">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <User className="h-4 w-4 text-blue-500" />
              Full Name
            </label>
            <Input 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-slate-50 border-slate-200"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Phone className="h-4 w-4 text-blue-500" />
              Phone Number
            </label>
            <Input 
              value={formData.phone} 
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-slate-50 border-slate-200"
              placeholder="10-digit number" 
              type="tel"
            />
          </div>

          <div className="space-y-2 lg:col-span-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Building className="h-4 w-4 text-blue-500" />
              Department
            </label>
            <Select 
              value={formData.department} 
              onValueChange={(v) => setFormData({ ...formData, department: v })}
            >
              <SelectTrigger className="bg-slate-50 border-slate-200">
                <SelectValue placeholder="Select Department..." />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 border-b pb-2 pt-4">Notification Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                <Mail size={18} />
              </div>
              <div className="space-y-0.5">
                <label className="text-sm font-bold text-slate-800">Email Notifications</label>
                <p className="text-xs text-slate-500 font-medium">Receive status updates via your college email.</p>
              </div>
            </div>
            <Switch 
              checked={formData.notificationPreferences.email}
              onCheckedChange={(v) => setFormData({
                ...formData,
                notificationPreferences: { ...formData.notificationPreferences, email: v }
              })}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                <Bell size={18} />
              </div>
              <div className="space-y-0.5">
                <label className="text-sm font-bold text-slate-800">Browser Notifications</label>
                <p className="text-xs text-slate-500 font-medium">Real-time alerts while the application is open.</p>
              </div>
            </div>
            <Switch 
              checked={formData.notificationPreferences.browser}
              onCheckedChange={(v) => setFormData({
                ...formData,
                notificationPreferences: { ...formData.notificationPreferences, browser: v }
              })}
            />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-md font-bold rounded-xl shadow-lg transition-all active:scale-95">
        {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Save className="h-5 w-5 mr-2" />}
        Update Profile Settings
      </Button>
    </form>
  );
}
