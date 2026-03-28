'use client';

import React, { useEffect, useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  Edit2, 
  ShieldAlert, 
  CheckCircle2, 
  Plus, 
  Search, 
  UserMinus, 
  ShieldCheck,
  User,
  Mail,
  Lock,
  Building2
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Create modal state
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [addForm, setAddForm] = useState({
     name: '',
     email: '',
     password: '',
     role: 'USER',
     department: 'Computer Engineering'
  });

  // Edit modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ role: '', department: '', isActive: true, status: '' });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`User ${addForm.name} created successfully`);
        fetchUsers();
        setIsAddUserModalOpen(false);
        setAddForm({ name: '', email: '', password: '', role: 'USER', department: 'Computer Engineering' });
      } else {
        toast.error(data.error || 'Failed to create user');
      }
    } catch (err) {
      toast.error('Network error during user creation');
    } finally {
      setIsCreating(false);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditForm({
      role: user.role,
      department: user.department || '',
      isActive: user.isActive,
      status: user.status || 'APPROVED'
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (userId, customData = null) => {
    try {
      setIsUpdating(true);
      const targetId = userId || selectedUser._id;
      const payload = customData || editForm;

      const res = await fetch(`/api/users/${targetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success('User updated successfully');
        fetchUsers();
        setIsEditModalOpen(false);
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error('Failed to update user');
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredUsers = users.filter((user) => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (user) => {
    // Default to PENDING if status is missing or null
    const status = user.status || 'PENDING';
    
    // If explicitly suspended or isActive is specifically false
    if (status === 'SUSPENDED' || user.isActive === false) {
      return <span className="flex items-center text-xs text-red-700 bg-red-50/50 px-2.5 py-1 rounded-full w-fit font-bold"><UserMinus className="h-3.5 w-3.5 mr-1" /> SUSPENDED</span>;
    }
    
    switch (status) {
      case 'PENDING':
        return <span className="flex items-center text-xs text-amber-700 bg-amber-50/50 px-2.5 py-1 rounded-full w-fit font-bold"><Loader2 className="h-3.5 w-3.5 mr-1 animate-spin-slow" /> PENDING</span>;
      case 'APPROVED':
        return <span className="flex items-center text-xs text-green-700 bg-green-50/50 px-2.5 py-1 rounded-full w-fit font-bold"><ShieldCheck className="h-3.5 w-3.5 mr-1" /> VERIFIED</span>;
      case 'REJECTED':
        return <span className="flex items-center text-xs text-red-600 bg-red-50 px-2.5 py-1 rounded-full w-fit font-bold"><AlertTriangle className="h-3.5 w-3.5 mr-1" /> REJECTED</span>;
      default:
        return <span className="flex items-center text-xs text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full w-fit font-bold uppercase">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Access Control</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Authorize students and manage staff accounts.</p>
        </div>
        {currentUser?.role === 'ADMIN' && (
          <Button 
            onClick={() => setIsAddUserModalOpen(true)} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 px-6 rounded-2xl shadow-xl shadow-blue-100 transition-all hover:-translate-y-0.5 active:scale-95"
          >
             <Plus className="h-5 w-5 mr-2 stroke-[3px]" />
             Create New Account
          </Button>
        )}
      </div>

      {/* Control bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-1/3 space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Universal Search</label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
              <Input
                  placeholder="Enter name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 bg-slate-50/50 border-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-2xl text-slate-700 font-medium placeholder:text-slate-300 transition-all shadow-inner"
              />
            </div>
        </div>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-4xl border border-slate-100 shadow-2xl overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              <p className="text-slate-400 font-bold animate-pulse">Syncing user database...</p>
          </div>
        )}
        
        <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-100 hover:bg-transparent">
                <TableHead className="py-5 pl-8 text-xs font-black uppercase text-slate-400 tracking-wider">Identity</TableHead>
                <TableHead className="py-5 text-xs font-black uppercase text-slate-400 tracking-wider">Account Level</TableHead>
                <TableHead className="py-5 text-xs font-black uppercase text-slate-400 tracking-wider">Departmental Scope</TableHead>
                <TableHead className="py-5 text-xs font-black uppercase text-slate-400 tracking-wider">Verification</TableHead>
                <TableHead className="py-5 text-xs font-black uppercase text-slate-400 tracking-wider text-center">Involvement</TableHead>
                <TableHead className="py-5 text-right pr-8 text-xs font-black uppercase text-slate-400 tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id} className="border-slate-50 hover:bg-slate-50/30 transition-colors">
                  <TableCell className="pl-8 py-5">
                    <div className="font-bold text-slate-900 group">{user.name}</div>
                    <div className="text-xs font-medium text-slate-400 lowercase">{user.email}</div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-xl text-[10px] font-black tracking-widest uppercase border ${
                        user.role === 'ADMIN' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                        user.role === 'DEPARTMENT_HEAD' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                        'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5 text-slate-300" />
                        <span className="text-sm font-semibold text-slate-600">
                            {user.department || <span className="text-slate-300 italic font-normal">Internal</span>}
                        </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(user)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="text-sm font-black text-slate-400">{user.totalComplaints || 0}</div>
                    <div className="text-[10px] font-bold text-slate-300 uppercase">Complaints</div>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex items-center justify-end gap-2">
                        {user.status === 'PENDING' && (
                            <Button 
                                onClick={() => handleUpdate(user._id, { status: 'APPROVED' })}
                                className="h-9 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-100 transition-all border-none"
                            >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Approve
                            </Button>
                        )}
                        <Button 
                           variant="outline" 
                           size="sm" 
                           onClick={() => openEditModal(user)}
                           className="h-9 w-9 p-0 rounded-xl border-2 border-slate-100 hover:bg-slate-50 hover:border-blue-200 hover:text-blue-600 transition-all"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-20">
                    <div className="flex flex-col items-center">
                       <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                           <Search className="h-10 w-10 text-slate-200" />
                       </div>
                       <h3 className="text-lg font-black text-slate-900 tracking-tight">Account not found</h3>
                       <p className="text-slate-400 text-sm max-w-xs mt-1 font-medium">Verify your search spelling or try filtering by name.</p>
                       <Button variant="link" className="mt-4 text-blue-600 font-bold" onClick={() => setSearchTerm('')}>Clear all filters</Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
      </div>

      {/* Add User Modal */}
      <Dialog open={isAddUserModalOpen} onOpenChange={setIsAddUserModalOpen}>
        <DialogContent className="sm:max-w-md rounded-4xl border-none shadow-2xl p-0 overflow-hidden">
          <form onSubmit={handleCreateUser}>
            <DialogHeader className="bg-slate-50/50 p-8 border-b border-slate-100">
                <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Create Identity</DialogTitle>
                <p className="text-slate-400 font-medium text-sm">Onboard new staff or admins to the system.</p>
            </DialogHeader>
            <div className="p-8 space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <User className="h-3.5 w-3.5" /> Full Name
                    </label>
                    <Input
                        required
                        placeholder="John Doe"
                        value={addForm.name}
                        onChange={(e) => setAddForm({...addForm, name: e.target.value})}
                        className="h-12 rounded-2xl border-2 border-slate-100 focus:border-blue-500 font-medium transition-all"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5" /> Official Email
                        </label>
                        <Input
                            required
                            type="email"
                            placeholder="user@university.edu"
                            value={addForm.email}
                            onChange={(e) => setAddForm({...addForm, email: e.target.value})}
                            className="h-12 rounded-2xl border-2 border-slate-100 focus:border-blue-500 font-medium transition-all lowercase"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Lock className="h-3.5 w-3.5" /> Initial Password
                        </label>
                        <Input
                            required
                            type="password"
                            placeholder="8+ characters"
                            value={addForm.password}
                            onChange={(e) => setAddForm({...addForm, password: e.target.value})}
                            className="h-12 rounded-2xl border-2 border-slate-100 focus:border-blue-500 font-medium transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 border-none">System Privilege</label>
                        <Select value={addForm.role} onValueChange={(v) => setAddForm({...addForm, role: v})}>
                            <SelectTrigger className="h-12 rounded-2xl border-2 border-slate-100 font-bold"><SelectValue /></SelectTrigger>
                            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl p-2 bg-white text-slate-900">
                                <SelectItem value="USER" className="rounded-xl font-bold py-3 hover:bg-slate-50 text-slate-900">Student / User</SelectItem>
                                <SelectItem value="DEPARTMENT_HEAD" className="rounded-xl font-bold py-3 text-indigo-600 hover:bg-indigo-50">Department Head</SelectItem>
                                <SelectItem value="ADMIN" className="rounded-xl font-bold py-3 text-purple-600 hover:bg-purple-50">Super Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 border-none">Department Assignment</label>
                        <Select value={addForm.department} onValueChange={(v) => setAddForm({...addForm, department: v})}>
                            <SelectTrigger className="h-12 rounded-2xl border-2 border-slate-100 font-bold"><SelectValue /></SelectTrigger>
                            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl p-2 max-h-[240px] bg-white text-slate-900">
                                <SelectItem value="Computer Engineering" className="rounded-xl py-2.5 font-medium hover:bg-slate-50">Computer Engineering</SelectItem>
                                <SelectItem value="Mechanical Engineering" className="rounded-xl py-2.5 font-medium hover:bg-slate-50">Mechanical Engineering</SelectItem>
                                <SelectItem value="Electrical Engineering" className="rounded-xl py-2.5 font-medium hover:bg-slate-50">Electrical Engineering</SelectItem>
                                <SelectItem value="Civil Engineering" className="rounded-xl py-2.5 font-medium hover:bg-slate-50">Civil Engineering</SelectItem>
                                <SelectItem value="Library" className="rounded-xl py-2.5 font-medium hover:bg-slate-50">Library</SelectItem>
                                <SelectItem value="Hostel" className="rounded-xl py-2.5 font-medium hover:bg-slate-50">Hostel</SelectItem>
                                <SelectItem value="Canteen" className="rounded-xl py-2.5 font-medium hover:bg-slate-50">Canteen</SelectItem>
                                <SelectItem value="Administration" className="rounded-xl py-2.5 font-medium hover:bg-slate-50">Administration</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
            <DialogFooter className="bg-slate-50/50 p-8 border-t border-slate-100 gap-4">
                <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setIsAddUserModalOpen(false)}
                    className="h-12 px-6 rounded-2xl text-slate-400 font-black tracking-widest uppercase text-[10px]"
                >
                    Abandon
                </Button>
                <Button 
                    type="submit" 
                    disabled={isCreating}
                    className="h-12 px-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-xl shadow-blue-100 transition-all border-none"
                >
                    {isCreating ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <ShieldCheck className="h-5 w-5 mr-2" />}
                    Authorize Identity
                </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit/Approval Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-4xl border-none shadow-2xl overflow-hidden p-0">
          <DialogHeader className="bg-slate-50/50 p-8 border-b border-slate-100">
            <DialogTitle className="text-xl font-black text-slate-900 tracking-tight">Status & Verification</DialogTitle>
            <p className="text-sm font-medium text-slate-400">Updating credentials for {selectedUser?.name}</p>
          </DialogHeader>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 border-none">Access Level</label>
              <Select value={editForm.role} onValueChange={(v) => setEditForm({...editForm, role: v})}>
                <SelectTrigger className="h-12 rounded-2xl border-2 border-slate-100 font-bold"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-2xl p-2 border-slate-100 shadow-2xl bg-white text-slate-900">
                  <SelectItem value="USER" className="rounded-xl py-2.5 font-bold hover:bg-slate-50">Student / User</SelectItem>
                  <SelectItem value="DEPARTMENT_HEAD" className="rounded-xl py-2.5 font-bold text-indigo-600 hover:bg-indigo-50">Department Head</SelectItem>
                  <SelectItem value="ADMIN" className="rounded-xl py-2.5 font-bold text-purple-600 hover:bg-purple-50">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 border-none">Account Verification Status</label>
              <Select value={editForm.status} onValueChange={(v) => setEditForm({...editForm, status: v})}>
                <SelectTrigger className="h-12 rounded-2xl border-2 border-slate-100 font-bold"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-2xl p-2 border-slate-100 shadow-2xl bg-white text-slate-900">
                  <SelectItem value="PENDING" className="rounded-xl py-2.5 font-bold text-amber-600 hover:bg-amber-50">Pending Review</SelectItem>
                  <SelectItem value="APPROVED" className="rounded-xl py-2.5 font-bold text-green-600 hover:bg-green-50">Verified & Approved</SelectItem>
                  <SelectItem value="REJECTED" className="rounded-xl py-2.5 font-bold text-red-600 hover:bg-red-50">Access Denied</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 border-none">
                 <div className={`w-3 h-3 rounded-full ${editForm.isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                 <span className="text-sm font-bold text-slate-700">{editForm.isActive ? 'Account Live' : 'Account Disabled'}</span>
                 <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setEditForm({...editForm, isActive: !editForm.isActive})}
                    className="ml-auto text-[10px] font-black uppercase text-blue-600 tracking-wider hover:bg-blue-50 rounded-lg p-2 h-auto"
                 >
                    Toggle Switch
                 </Button>
            </div>
          </div>
          <DialogFooter className="bg-slate-50/50 p-8 border-t border-slate-100 flex-col sm:flex-row gap-3">
            <Button 
                variant="outline" 
                onClick={() => setIsEditModalOpen(false)}
                className="h-12 px-6 rounded-2xl border-2 border-slate-100 font-bold text-slate-400 hover:bg-white"
            >
                Dismiss
            </Button>
            <Button 
                onClick={() => handleUpdate()} 
                disabled={isUpdating}
                className="h-12 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-xl shadow-blue-100 border-none"
            >
                {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> : <ShieldCheck className="mr-2 h-4 w-4 text-emerald-400" />}
                Persist Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
