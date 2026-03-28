'use client';

import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Building, Plus, Save, Trash2, Loader2, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Settings state
  const [systemSettings, setSystemSettings] = useState({
    appName: 'Complaint Management System',
    supportEmail: 'support@jspm.edu',
    allowEscalation: true,
    maintenanceMode: false
  });
  
  // Department management state
  const [departments, setDepartments] = useState([]);
  const [heads, setHeads] = useState([]);
  const [newDept, setNewDept] = useState({ name: '', code: '' });
  const [deptLoading, setDeptLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [settingsRes, departmentsRes, headsRes] = await Promise.all([
        fetch('/api/admin/settings'),
        fetch('/api/admin/departments'),
        fetch('/api/admin/users/heads')
      ]);
      
      const settingsData = await settingsRes.json();
      const departmentsData = await departmentsRes.json();
      const headsData = await headsRes.json();
      
      if (settingsData.success) {
        const mapped = {};
        settingsData.settings.forEach(s => mapped[s.key] = s.value);
        if (Object.keys(mapped).length) {
            setSystemSettings(prev => ({...prev, ...mapped}));
        }
      }
      
      if (departmentsData.success) {
        setDepartments(departmentsData.departments);
      }

      if (headsData.success) {
        setHeads(headsData.heads);
      }
    } catch (err) {
      toast.error('Failed to load settings data');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(systemSettings)
      });
      const data = await res.json();
      if (data.success) {
        toast.success('System settings saved');
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const addDepartment = async () => {
    if (!newDept.name || !newDept.code) return;
    setDeptLoading(true);
    try {
      const res = await fetch('/api/admin/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDept)
      });
      const data = await res.json();
      if (data.success) {
        setDepartments([data.department, ...departments]);
        setNewDept({ name: '', code: '' });
        toast.success('Department added');
      } else {
          toast.error(data.error);
      }
    } catch (err) {
      toast.error('Failed to add department');
    } finally {
      setDeptLoading(false);
    }
  };

  const updateDepartmentHead = async (deptId, headId) => {
    try {
      const res = await fetch(`/api/admin/departments/${deptId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headId })
      });
      const data = await res.json();
      if (data.success) {
        setDepartments(departments.map(d => d._id === deptId ? data.department : d));
        toast.success('Head of department updated');
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error('Failed to update head');
    }
  };

  const deleteDepartment = async (id) => {
    if (!confirm('Are you sure you want to delete this department? This could affect filtering of existing complaints.')) return;
    try {
      const res = await fetch(`/api/admin/departments/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setDepartments(departments.filter(d => d._id !== id));
        toast.success('Department deleted');
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error('Failed to delete department');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-5xl mx-auto py-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">System Settings</h1>
        <p className="text-slate-500 font-medium tracking-tight">Configure global application parameters and meta-data.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* General Settings */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-lg border-none ring-1 ring-slate-200">
            <CardHeader className="border-b bg-slate-50/50">
              <CardTitle className="flex items-center gap-2 text-xl font-bold border-none">
                <SettingsIcon className="h-5 w-5 text-blue-600" />
                General Configuration
              </CardTitle>
              <CardDescription className="font-medium text-slate-400">Adjust core application identifying information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="appName" className="font-semibold text-slate-700">App Name</Label>
                  <Input 
                    id="appName"
                    value={systemSettings.appName}
                    className="bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
                    onChange={(e) => setSystemSettings({...systemSettings, appName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail" className="font-semibold text-slate-700">Support Contact Email</Label>
                  <Input 
                    id="supportEmail"
                    value={systemSettings.supportEmail}
                    className="bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
                    onChange={(e) => setSystemSettings({...systemSettings, supportEmail: e.target.value})}
                  />
                </div>
                
                <div className="pt-4 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-slate-100">
                    <div className="space-y-0.5">
                      <Label className="text-md font-bold text-slate-800">Enable Automated Escalation</Label>
                      <p className="text-xs text-slate-400 font-medium">Auto-escalate tickets older than 48 hours.</p>
                    </div>
                    <Switch 
                        checked={systemSettings.allowEscalation} 
                        onCheckedChange={(v) => setSystemSettings({...systemSettings, allowEscalation: v})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-red-50/50 rounded-xl border-2 border-red-50">
                    <div className="space-y-0.5">
                      <Label className="text-md font-bold text-red-900">Maintenance Mode</Label>
                      <p className="text-xs text-red-700/60 font-medium">Restrict system access to Administrators only.</p>
                    </div>
                    <Switch 
                        checked={systemSettings.maintenanceMode}
                        onCheckedChange={(v) => setSystemSettings({...systemSettings, maintenanceMode: v})}
                    />
                  </div>
                </div>
              </div>
              
              <Button onClick={saveSettings} disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg py-6 font-bold text-md shadow-md transition-all active:scale-95">
                {saving ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Save className="h-5 w-5 mr-2" />}
                Save System Configuration
              </Button>
            </CardContent>
          </Card>

          {/* Department Management */}
          <Card className="shadow-lg border-none ring-1 ring-slate-200 overflow-hidden">
            <CardHeader className="border-b bg-slate-50/50">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-xl font-bold border-none">
                  <Building className="h-5 w-5 text-orange-600" />
                  College Departments
                </CardTitle>
                <CardDescription className="font-medium text-slate-400">Manage the list of active departments in the system.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex flex-col sm:flex-row gap-2 p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                <div className="grid grid-cols-2 flex-1 gap-2">
                  <Input 
                    placeholder="Dept Name" 
                    className="bg-white border-orange-200"
                    value={newDept.name}
                    onChange={(e) => setNewDept({...newDept, name: e.target.value})}
                  />
                  <Input 
                    placeholder="Dept Code" 
                    className="bg-white border-orange-200"
                    value={newDept.code}
                    onChange={(e) => setNewDept({...newDept, code: e.target.value})}
                  />
                </div>
                <Button 
                    onClick={addDepartment} 
                    disabled={deptLoading || !newDept.name || !newDept.code}
                    className="bg-orange-600 hover:bg-orange-700 font-bold px-6"
                >
                  {deptLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-5 w-5 mr-2" />}
                  Add
                </Button>
              </div>

              <div className="rounded-xl border overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="font-bold">Code</TableHead>
                      <TableHead className="font-bold">Name</TableHead>
                      <TableHead className="font-bold">Head of Dept</TableHead>
                      <TableHead className="text-right font-bold pr-6">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departments.map((dept) => (
                      <TableRow key={dept._id} className="hover:bg-slate-50 transition-colors">
                        <TableCell className="font-mono text-xs font-bold text-slate-500">{dept.code}</TableCell>
                        <TableCell className="font-bold text-slate-800">{dept.name}</TableCell>
                        <TableCell>
                          <Select 
                            value={dept.headId?._id || 'none'} 
                            onValueChange={(v) => updateDepartmentHead(dept._id, v === 'none' ? null : v)}
                          >
                            <SelectTrigger className="w-[180px] h-8 text-xs font-semibold bg-white">
                              <SelectValue placeholder="No Head Assigned" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              <SelectItem value="none">No Head Assigned</SelectItem>
                              {heads.map(head => (
                                <SelectItem key={head._id} value={head._id} className="text-xs">
                                  {head.name} ({head.role.replace('DEPARTMENT_', '')})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                            onClick={() => deleteDepartment(dept._id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {departments.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-10 text-slate-400 text-sm italic font-medium">
                          No departments configured yet. All system modules are currently department-agnostic.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Column */}
        <div className="space-y-6">
          <Card className="bg-linear-to-br from-blue-600 to-blue-800 text-white border-none shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold border-none flex items-center gap-2">
                <Info size={18} />
                Management Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-100/90 leading-relaxed font-medium">
                <strong>Departments:</strong> Assign a "Head" to allow them access only to complaints within their module.
                <br/><br/>
                <strong>Maintenance:</strong> Switching to maintenance mode will log users out and show a placeholder to every role except Super Admins.
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-none ring-1 ring-slate-200">
            <CardHeader className="bg-slate-50/50 border-b">
              <CardTitle className="text-sm font-bold border-none text-slate-600">Quick Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-bold">Total Departments</span>
                    <span className="font-extrabold text-slate-900">{departments.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-bold">Heads Assigned</span>
                    <span className="font-extrabold text-blue-600">
                      {departments.filter(d => !!d.headId).length}
                    </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-bold">System Status</span>
                    <span className="text-green-600 flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-widest">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                        Operational
                    </span>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
