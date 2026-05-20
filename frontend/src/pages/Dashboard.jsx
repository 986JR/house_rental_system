import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, Calendar, Trash2, Edit3, Plus, 
  MapPin, Loader2, AlertCircle, Home, MessageSquare, 
  TrendingUp, Users, ShieldAlert, ChevronRight, Bell, Settings,
  ArrowUpRight, Clock, Star, ShieldCheck, DollarSign, Percent, 
  Activity, CheckCircle2, User, KeyRound, Mail, Sparkles, HelpCircle,
  Menu, X, LogOut, ChevronDown, Award, Search, Play, Pause, Square,
  Sun, Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// ── GLOBAL SVG STRIPES DEFINITION ──
const StripesDef = () => (
  <defs>
    <pattern id="diagonal-stripes" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="8" stroke="currentColor" className="text-slate-200 dark:text-slate-700/60" strokeWidth="2.5" />
    </pattern>
  </defs>
);

// ── NATIVE DONEZO-INSPIRED DYNAMIC STRIPED BAR CHART ──
const StripedBarChart = ({ title, counts, todayIndex }) => {
  const maxVal = Math.max(...counts, 1);
  
  const bars = counts.map((val, i) => {
    const label = ['S', 'M', 'T', 'W', 'T', 'F', 'S'][i];
    const isToday = i === todayIndex;
    const type = isToday ? 'current' : (val > 0 ? 'solid' : 'striped');
    
    // Scale bar height dynamically between 25px (min) and 140px (max)
    const heightValue = Math.round((val / maxVal) * 110) + 25;
    
    return {
      label,
      value: heightValue,
      actual: val,
      type,
      percent: `${Math.round((val / maxVal) * 100)}%`
    };
  });

  const width = 450;
  const height = 180;
  const paddingX = 30;
  const paddingY = 25;

  return (
    <div className="glass-card p-6 md:p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/80 shadow-premium w-full bg-white dark:bg-slate-900/60 flex flex-col justify-between h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest block mb-1">Rental Analytics</span>
          <h4 className="text-lg font-display font-extrabold text-slate-950 dark:text-white tracking-tight">{title}</h4>
        </div>
        <div className="flex gap-4 items-center">
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-600 inline-block" /> Inquiries
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
            <span className="w-2.5 h-2.5 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 inline-block" /> Idle Days
          </span>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <StripesDef />

          {bars.map((bar, i) => {
            const barWidth = 32;
            const spacing = (width - 2 * paddingX - barWidth) / (bars.length - 1);
            const x = paddingX + i * spacing;
            const barHeight = bar.value;
            const y = height - paddingY - barHeight;

            let fill = "url(#diagonal-stripes)";
            let rx = 8;

            if (bar.type === 'solid') fill = "currentColor";
            if (bar.type === 'current') fill = "currentColor";

            return (
              <g key={i} className="group">
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx={rx}
                  fill={fill}
                  stroke={bar.type === 'striped' ? 'currentColor' : 'none'}
                  className={`transition-all duration-300 ${
                    bar.type === 'solid'
                      ? 'text-primary-600 dark:text-primary-500'
                      : bar.type === 'current'
                      ? 'text-primary-400 dark:text-primary-400 opacity-85'
                      : 'text-slate-300 dark:text-slate-700'
                  }`}
                  strokeWidth={bar.type === 'striped' ? 1.5 : 0}
                />

                {bar.type === 'current' && bar.actual > 0 && (
                  <g>
                    <rect
                      x={x + barWidth / 2 - 18}
                      y={y - 25}
                      width={36}
                      height={18}
                      rx={6}
                      className="fill-slate-950 dark:fill-white"
                    />
                    <text
                      x={x + barWidth / 2}
                      y={y - 13}
                      textAnchor="middle"
                      className="text-[9px] font-bold fill-white dark:fill-slate-950 font-display"
                    >
                      {bar.percent}
                    </text>
                  </g>
                )}

                <text
                  x={x + barWidth / 2}
                  y={height - 6}
                  textAnchor="middle"
                  className="text-[10px] font-bold fill-slate-400 dark:fill-slate-500 font-display"
                >
                  {bar.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

// ── NATIVE DONEZO-INSPIRED STRIPED SEMI-CIRCLE PROGRESS GAUGE ──
const StripedSemiCircleGauge = ({ occupancyPercentage = 0 }) => {
  const width = 280;
  const height = 160;
  const cx = width / 2;
  const cy = 130;
  const r = 80;
  const strokeWidth = 24;

  const circumference = Math.PI * r;
  const completedOffset = circumference - (occupancyPercentage / 100) * circumference;

  return (
    <div className="glass-card p-6 md:p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/80 shadow-premium w-full bg-white dark:bg-slate-900/60 flex flex-col justify-between h-full">
      <div>
        <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest block mb-1">Lease Progress</span>
        <h4 className="text-lg font-display font-extrabold text-slate-950 dark:text-white tracking-tight mb-4">Rental Occupancy</h4>
      </div>

      <div className="relative flex items-center justify-center py-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-w-[200px] overflow-visible">
          <StripesDef />

          {/* Background Semi-Circle (Striped) */}
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke="url(#diagonal-stripes)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="text-slate-200 dark:text-slate-800"
          />

          {/* Completed Semi-Circle (Solid Primary) */}
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={completedOffset}
            className="text-primary-600 dark:text-primary-500 transition-all duration-1000 ease-out"
          />

          {/* Center Text */}
          <text
            x={cx}
            y={cy - 12}
            textAnchor="middle"
            className="text-3xl font-display font-black fill-slate-950 dark:fill-white tracking-tighter"
          >
            {occupancyPercentage}%
          </text>
          <text
            x={cx}
            y={cy + 8}
            textAnchor="middle"
            className="text-[9px] font-bold fill-slate-400 dark:fill-slate-500 uppercase tracking-widest"
          >
            Occupied
          </text>
        </svg>
      </div>

      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase pt-4 border-t border-slate-100 dark:border-slate-800/80">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-primary-600 inline-block" /> Leased
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 inline-block" /> Available
        </span>
      </div>
    </div>
  );
};

// ── NATIVE DONEZO-INSPIRED WAVY SESSION/TIME TRACKER ──
const WavyTimeTracker = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary-900 to-primary-950 text-white p-6 md:p-8 shadow-premium flex flex-col justify-between h-full border border-primary-500/10">
      {/* Decorative Wavy Lines */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full transform scale-150">
          <path d="M40,-53.7C53.7,-45.5,68,-35.1,72.9,-21.2C77.8,-7.4,73.4,9.8,66,25.2C58.6,40.6,48.2,54.1,34.5,61.9C20.8,69.7,3.9,71.8,-12,67.7C-27.9,63.6,-42.8,53.3,-53.4,40.2C-64,27.1,-70.4,11.2,-71.2,-5.1C-72,-21.4,-67.2,-38.2,-56.3,-46.8C-45.5,-55.5,-28.7,-56.1,-13.4,-57.8C2,59.5,17.3,-62,40,-53.7Z" fill="none" stroke="white" strokeWidth="2.5" transform="translate(100,100)" />
          <path d="M48.2,-64.7C62,-54.6,72.3,-39.7,77,-23.4C81.8,-7.1,81.1,10.6,73.7,24.9C66.3,39.3,52.3,50.3,37.2,58C22,65.6,5.8,70,-10.8,67.8C-27.4,65.6,-44.4,56.9,-54.9,43.7C-65.5,30.5,-69.6,12.8,-69.2,-4.3C-68.8,-21.4,-63.9,-37.8,-53.4,-48.2C-42.9,-58.6,-26.8,-63,-10.5,-65.4C5.7,-67.8,22,-68.2,48.2,-64.7Z" fill="none" stroke="white" strokeWidth="1.5" transform="translate(100,100) scale(0.8)" />
        </svg>
      </div>

      <div className="relative z-10 flex justify-between items-center mb-4">
        <div>
          <span className="text-[9px] font-bold text-primary-300 uppercase tracking-widest block mb-1">Session Tracker</span>
          <h4 className="text-base font-display font-extrabold text-white tracking-tight">Live Session</h4>
        </div>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
      </div>

      <div className="relative z-10 py-4 text-center">
        <span className="text-4xl font-mono font-bold tracking-tight text-white/95">
          {formatTime(time)}
        </span>
      </div>

      <div className="relative z-10 flex justify-center gap-4 pt-4 border-t border-white/10">
        <button 
          onClick={() => setIsRunning(!isRunning)} 
          className="w-12 h-12 rounded-full bg-white text-primary-950 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
        >
          {isRunning ? <Pause size={18} className="fill-primary-950 stroke-[3]" /> : <Play size={18} className="fill-primary-950 stroke-[3] ml-0.5" />}
        </button>

        <button 
          onClick={() => { setTime(0); setIsRunning(false); }} 
          className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 hover:scale-105 active:scale-95 transition-all shadow-lg"
        >
          <X size={18} className="stroke-[3]" />
        </button>
      </div>
    </div>
  );
};


const Dashboard = () => {
  const { user, updateProfile, logout } = useAuth();
  const [data, setData] = useState({ properties: [], bookings: [], logs: [], users: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Tab states: 'overview' | 'listings' | 'bookings' | 'settings' | 'logs' | 'users'
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);

  // User management modal states
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userForm, setUserForm] = useState({ id: null, email: '', fullName: '', password: '', role: 'tenant', active: true });

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({ fullName: '', password: '' });
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
  };

  const fetchDashboardDataBackground = async () => {
    try {
      if (user.role === 'admin') {
        const [propRes, bookRes, logsRes, usersRes] = await Promise.all([
          axios.get('/properties'),
          axios.get('/admin/bookings'),
          axios.get('/admin/logs'),
          axios.get('/admin/users')
        ]);
        setData({ 
          properties: propRes.data.content || propRes.data || [], 
          bookings: bookRes.data || [], 
          logs: logsRes.data || [],
          users: usersRes.data || []
        });
      } else if (user.role === 'landlord') {
        const [propRes, bookRes] = await Promise.all([
          axios.get('/properties/my'),
          axios.get('/bookings/landlord')
        ]);
        setData({ 
          properties: propRes.data || [], 
          bookings: bookRes.data || [], 
          logs: [],
          users: []
        });
      } else {
        const [bookRes, propRes] = await Promise.all([
          axios.get('/bookings/my'),
          axios.get('/properties')
        ]);
        setData({ 
          properties: propRes.data.content || propRes.data || [], 
          bookings: bookRes.data || [], 
          logs: [],
          users: []
        });
      }
    } catch (error) {
      // Ignored in background
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (user.role === 'admin') {
        const [propRes, bookRes, logsRes, usersRes] = await Promise.all([
          axios.get('/properties'),
          axios.get('/admin/bookings'),
          axios.get('/admin/logs'),
          axios.get('/admin/users')
        ]);
        setData({ 
          properties: propRes.data.content || propRes.data || [], 
          bookings: bookRes.data || [], 
          logs: logsRes.data || [],
          users: usersRes.data || []
        });
      } else if (user.role === 'landlord') {
        const [propRes, bookRes] = await Promise.all([
          axios.get('/properties/my'),
          axios.get('/bookings/landlord')
        ]);
        setData({ 
          properties: propRes.data || [], 
          bookings: bookRes.data || [], 
          logs: [],
          users: []
        });
      } else {
        const [bookRes, propRes] = await Promise.all([
          axios.get('/bookings/my'),
          axios.get('/properties')
        ]);
        setData({ 
          properties: propRes.data.content || propRes.data || [], 
          bookings: bookRes.data || [], 
          logs: [],
          users: []
        });
      }
    } catch (error) {
      setData({ properties: [], bookings: [], logs: [], users: [] });
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      setProfileForm({ fullName: user.fullName || '', password: '' });

      // Real-time updates without manual page refresh (FR-ADM-05 / NFR-01)
      const interval = setInterval(() => {
        fetchDashboardDataBackground();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      await updateProfile(profileForm);
      setProfileForm({ ...profileForm, password: '' });
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Delete this listing permanently?')) return;
    try {
      await axios.delete(`/properties/${id}`);
      toast.success('Listing removed successfully');
      fetchDashboardData();
    } catch (err) {
      toast.error('Failed to delete listing');
    }
  };

  const handleApproveProperty = async (propertyId, approvedVal) => {
    try {
      await axios.put(`/properties/${propertyId}/approve`, null, { params: { approved: approvedVal } });
      toast.success(approvedVal ? 'Property approved and added to marketplace' : 'Property left unapproved');
      fetchDashboardData();
    } catch (err) {
      toast.error('Failed to update property approval status');
    }
  };

  const handleOpenUserModal = (userToEdit = null) => {
    if (userToEdit) {
      setUserForm({
        id: userToEdit.id,
        email: userToEdit.email,
        fullName: userToEdit.fullName || '',
        password: '',
        role: userToEdit.role || 'tenant',
        active: userToEdit.active
      });
    } else {
      setUserForm({
        id: null,
        email: '',
        fullName: '',
        password: '',
        role: 'tenant',
        active: true
      });
    }
    setUserModalOpen(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      if (userForm.id) {
        await axios.put(`/admin/users/${userForm.id}`, {
          email: userForm.email,
          fullName: userForm.fullName,
          password: userForm.password || null,
          role: userForm.role,
          active: userForm.active
        });
        toast.success('User updated successfully');
      } else {
        await axios.post('/admin/users', {
          email: userForm.email,
          fullName: userForm.fullName,
          password: userForm.password,
          role: userForm.role,
          active: userForm.active
        });
        toast.success('User added successfully');
      }
      setUserModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to save user';
      toast.error(errorMsg);
    }
  };

  const handleDeleteUser = async (userId, userEmail, canDelete) => {
    if (!canDelete) {
      toast.error('Food Chain Rule: Only the administrator who added this user can delete them.');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete user ${userEmail}?`)) return;
    try {
      await axios.delete(`/admin/users/${userId}`);
      toast.success('User deleted successfully');
      fetchDashboardData();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete user';
      if (errorMsg.includes('creator')) {
        toast.error('Food Chain Rule: Only the administrator who added this user can delete them.');
      } else {
        toast.error(errorMsg);
      }
    }
  };

  const handleBookingAction = async (bookingId, status) => {
    try {
      await axios.put(`/bookings/${bookingId}`, { status });
      toast.success(`Booking ${status} successfully`);
      fetchDashboardData();
    } catch (err) {
      toast.error('Failed to update booking status');
    }
  };

  const handleLogoutClick = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  const getSidebarTabs = () => {
    const list = [
      { id: 'overview', label: 'Dashboard', icon: Home },
    ];
    if (user?.role === 'landlord' || user?.role === 'admin') {
      list.push({ id: 'listings', label: 'Properties', icon: Building2 });
    }
    list.push({ id: 'bookings', label: user?.role === 'landlord' ? 'Requests' : 'Applications', icon: MessageSquare });
    if (user?.role === 'admin') {
      list.push({ id: 'users', label: 'Manage Users', icon: Users });
      list.push({ id: 'logs', label: 'Audit Logs', icon: ShieldAlert });
    }
    list.push({ id: 'settings', label: 'Settings', icon: Settings });
    return list;
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[100vh] gap-6 bg-slate-50 dark:bg-[#08091a]">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-primary-500/20 border-t-primary-600 animate-spin" />
        <Sparkles className="absolute text-primary-500 animate-pulse" size={24} />
      </div>
      <p className="font-display font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-xs animate-pulse">
        Accessing Command Console...
      </p>
    </div>
  );

  const roleLabel = user?.role === 'admin' ? 'System Admin' : user?.role === 'landlord' ? 'Verified Host' : 'Elite Renter';

  // ── DYNAMIC METRICS PARSING ──
  const totalPropsCount = data.properties.length;
  const rentedPropsCount = data.properties.filter(p => p.availability !== 'available').length;
  const occupancyRatePercentage = totalPropsCount > 0 ? Math.round((rentedPropsCount / totalPropsCount) * 100) : 0;
  
  const landlordMonthlyRevenue = data.properties
    .filter(p => p.availability !== 'available')
    .reduce((sum, p) => sum + (Number(p.pricePerMonth) || 0), 0);

  const tenantMonthlyCommitment = data.bookings
    .filter(b => b.status === 'approved')
    .reduce((sum, b) => {
      const prop = data.properties.find(p => p.id === b.propertyId);
      return sum + (prop ? (Number(prop.pricePerMonth) || 0) : 0);
    }, 0);

  const landlordPendingRequests = data.bookings.filter(b => b.status === 'pending').length;
  const tenantPendingRequests = data.bookings.filter(b => b.status === 'pending').length;
  const tenantApprovedLeases = data.bookings.filter(b => b.status === 'approved').length;

  const adminErrorLogs = data.logs.filter(l => l.action?.toLowerCase().includes('error') || l.action?.toLowerCase().includes('failed')).length;

  // ── DYNAMIC METRIC CARD BUILDERS ──
  const getDynamicMetrics = () => {
    if (user.role === 'landlord') {
      return [
        { label: 'Active Listings', value: totalPropsCount, desc: `${totalPropsCount - rentedPropsCount} available for lease`, highlight: true },
        { label: 'Occupied Units', value: rentedPropsCount, desc: `${rentedPropsCount} leased properties` },
        { label: 'Estimated Revenue', value: `$${landlordMonthlyRevenue.toLocaleString()}`, desc: 'Total monthly occupied rent' },
        { label: 'Pending Requests', value: landlordPendingRequests, desc: `${landlordPendingRequests} coordinate inquires` }
      ];
    } else if (user.role === 'admin') {
      return [
        { label: 'Total Properties', value: totalPropsCount, desc: 'Active units in database', highlight: true },
        { label: 'Total Users', value: data.users?.length || 0, desc: 'Registered accounts' },
        { label: 'Total Bookings', value: data.bookings.length, desc: 'Coordinates requested' }
      ];
    } else {
      // Tenant
      return [
        { label: 'Approved Leases', value: tenantApprovedLeases, desc: 'Active contracts verified', highlight: true },
        { label: 'Applications Sent', value: data.bookings.length, desc: 'Total coordinate attempts' },
        { label: 'Awaiting Host', value: tenantPendingRequests, desc: `${tenantPendingRequests} pending hosts` },
        { label: 'Monthly Commitment', value: `$${tenantMonthlyCommitment.toLocaleString()}`, desc: 'Total rent committed' }
      ];
    }
  };

  // ── DYNAMIC WEEKLY INQUIRY PARSING FOR BAR CHART ──
  const getBookingsByDayOfWeek = () => {
    const counts = [0, 0, 0, 0, 0, 0, 0]; // S, M, T, W, T, F, S
    data.bookings.forEach(b => {
      if (b.createdAt) {
        const day = new Date(b.createdAt).getDay();
        if (day >= 0 && day <= 6) {
          counts[day]++;
        }
      }
    });
    return counts;
  };

  // ── DYNAMIC REMINDERS CARD ENGINE ──
  const getReminderData = () => {
    const pendingInquiries = data.bookings.filter(b => b.status === 'pending');
    if (pendingInquiries.length > 0) {
      const latest = pendingInquiries[0];
      return {
        title: 'Pending Coordinate Request',
        desc: `Inquiry from ${latest.tenantEmail || 'Renter'}`,
        time: `Lease: ${latest.propertyTitle || 'Listing'}`,
        actionText: 'Coordinate Now'
      };
    }
    
    const approvedBookings = data.bookings.filter(b => b.status === 'approved');
    if (approvedBookings.length > 0) {
      const latest = approvedBookings[0];
      return {
        title: 'Active Lease Notification',
        desc: latest.propertyTitle || 'Listing',
        time: `Starts: ${latest.startDate || 'N/A'}`,
        actionText: 'Review Contracts'
      };
    }
    
    return {
      title: 'No Pending Tasks',
      desc: 'All coordinates and units are fully optimized.',
      time: 'System Active & Secure',
      actionText: 'Manage Settings'
    };
  };

  const reminder = getReminderData();
  const metrics = getDynamicMetrics();
  const bookingsCounts = getBookingsByDayOfWeek();
  const todayIndex = new Date().getDay();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#08091a] flex flex-col md:flex-row text-slate-900 dark:text-slate-50 transition-colors duration-300 font-sans">
      
      {/* ── 1. SAAS LIGHT-ADAPTIVE SIDEBAR (DESKTOP) ── */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-[#0b0c1e] text-slate-500 dark:text-slate-400 border-r border-slate-100 dark:border-slate-900 h-screen fixed left-0 top-0 z-30 justify-between p-6 transition-all duration-300">
        <div className="space-y-8">
          {/* Logo Branding */}
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-10 h-10 rounded-[1.1rem] bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white font-display font-black shadow-lg shadow-primary-500/20">
              R
            </div>
            <div>
              <span className="font-display font-black tracking-tight text-slate-900 dark:text-white text-base block">RentalHub</span>
              <span className="text-[9px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest block -mt-1 font-display">Elite Club</span>
            </div>
          </div>

          {/* Navigation Menu Links */}
          <nav className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest px-3 mb-2">Menu</p>
            {getSidebarTabs().map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 relative group ${
                    isSelected 
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50/50 dark:bg-primary-950/20' 
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/30'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary-600 rounded-r" />
                  )}
                  <Icon size={16} className={`shrink-0 ${isSelected ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom Promo Card & Sign out */}
        <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-900">
          
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-900 to-primary-950 text-white p-4 text-center border border-primary-500/10">
            <div className="absolute inset-0 opacity-10">
              <svg viewBox="0 0 100 100" className="w-full h-full transform scale-150">
                <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="2" />
              </svg>
            </div>
            <p className="text-[10px] font-bold text-white block mb-1">Download our Mobile App</p>
            <p className="text-[8px] text-primary-200 leading-tight mb-3">Get easy offline access to your active lease parameter sets.</p>
            <button className="w-full py-2 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white font-bold text-[9px] uppercase tracking-wider rounded-xl transition-all shadow-md">
              Download App
            </button>
          </div>

          <button 
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-50 hover:bg-rose-50 border border-slate-100 hover:border-rose-100 dark:bg-white/5 dark:hover:bg-rose-500/10 dark:border-white/10 dark:hover:border-rose-500/30 text-slate-500 hover:text-rose-500 text-xs font-bold uppercase tracking-wider transition-all"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── 2. MOBILE HEADER & NAVIGATION ── */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-950 text-slate-800 dark:text-white fixed top-0 left-0 right-0 z-40 border-b border-slate-100 dark:border-b border-slate-900">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-black text-sm shadow-md">
            R
          </div>
          <span className="font-display font-black text-sm tracking-tight text-slate-900 dark:text-white">RentalHub</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleDark}
            className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-all"
            title="Toggle Theme"
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button 
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:border-white/10 flex items-center justify-center"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" 
              onClick={() => setMobileOpen(false)} 
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="relative flex flex-col w-64 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 h-full p-6 justify-between z-10"
            >
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-black text-sm">
                      R
                    </div>
                    <span className="font-display font-black text-sm tracking-tight text-slate-900 dark:text-white">RentalHub</span>
                  </div>
                  <button 
                    onClick={() => setMobileOpen(false)}
                    className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-white/5 flex items-center justify-center"
                  >
                    <X size={18} />
                  </button>
                </div>

                <nav className="space-y-1">
                  {getSidebarTabs().map((tab) => {
                    const Icon = tab.icon;
                    const isSelected = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setMobileOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${
                          isSelected 
                            ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400' 
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        <Icon size={16} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="space-y-4 border-t border-slate-100 dark:border-slate-900 pt-6">
                <button 
                  onClick={handleLogoutClick}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-white/5 text-slate-500 text-xs font-bold uppercase tracking-wider"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* ── 3. MAIN WORKSPACE CANVAS ── */}
      <main className="flex-1 md:pl-64 pt-20 md:pt-0 min-h-screen flex flex-col transition-all duration-300">
        
        {/* Top Header bar inspired by Donezo */}
        <header className="hidden md:flex justify-between items-center px-10 py-6 border-b border-slate-100 dark:border-slate-900 bg-white dark:bg-[#08091a] sticky top-0 z-20">
          
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search listings, bookings, or settings" 
              className="w-full pl-12 pr-12 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/25 transition-all text-slate-700 dark:text-white"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-400 font-mono">
              ⌘F
            </span>
          </div>

          <div className="flex items-center gap-6">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleDark}
              className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-900 flex items-center justify-center text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-all"
              title="Toggle Theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button className="relative w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-900 flex items-center justify-center text-slate-400 transition-all">
              <Bell size={18} />
              {landlordPendingRequests > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
              )}
            </button>

            <div className="flex items-center gap-3.5 pl-6 border-l border-slate-100 dark:border-slate-900">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{user.fullName || 'Verified Member'}</p>
                <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 leading-tight">{user.email || 'user@example.com'}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 text-white flex items-center justify-center font-extrabold text-sm shadow-md shadow-primary-500/10">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'M'}
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-8 flex-1">
          
          {/* Active Tab: Overview (Donezo Inspired) */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Row 1: Greeting Header (Top Bar navigation removed completely for clean look) */}
              <div className="pb-6 border-b border-slate-150 dark:border-slate-900">
                <h1 className="text-3xl font-display font-black text-slate-950 dark:text-white tracking-tight">Dashboard</h1>
                <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mt-1">Review active coordinates and optimize housing listings.</p>
              </div>

              {/* Row 2: Metrics Grid (1 Solid primary card, 3 bordered cards, dynamically loaded) */}
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${metrics.length} gap-6`}>
                {metrics.map((stat, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                      stat.highlight
                        ? 'bg-primary-600 text-white shadow-xl shadow-primary-600/15'
                        : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-premium hover:shadow-premium-hover'
                    }`}
                  >
                    {stat.highlight && (
                      <div className="absolute top-[-30%] right-[-10%] w-[120px] h-[120px] rounded-full bg-white/5 blur-xl" />
                    )}
                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${stat.highlight ? 'text-primary-200' : 'text-slate-400 dark:text-slate-500'}`}>
                        {stat.label}
                      </span>
                      <button className={`w-8 h-8 rounded-full flex items-center justify-center transition-all border ${
                        stat.highlight 
                          ? 'bg-white/10 hover:bg-white/20 text-white border-none' 
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-700'
                      }`}>
                        <ArrowUpRight size={14} className={stat.highlight ? 'stroke-[2.5]' : ''} />
                      </button>
                    </div>
                    <div className="relative z-10">
                      <h3 className={`text-4xl font-display font-black tracking-tight mb-2 ${stat.highlight ? 'text-white' : 'text-slate-950 dark:text-white'}`}>
                        {stat.value}
                      </h3>
                      <p className={`text-[10px] font-bold ${stat.highlight ? 'text-primary-200' : 'text-slate-400 dark:text-slate-500'}`}>
                        {stat.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Conditional Row Layouts based on Role */}
              {user.role === 'admin' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Column 1: Dynamic Bar Chart */}
                  <div className="lg:col-span-6 flex flex-col">
                    <StripedBarChart 
                      title="System Inquiry Activity" 
                      counts={bookingsCounts} 
                      todayIndex={todayIndex} 
                    />
                  </div>

                  {/* Column 2: Recent Bookings */}
                  <div className="lg:col-span-6 flex flex-col">
                    <div className="glass-card p-6 md:p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 w-full bg-white dark:bg-slate-900/60 h-full flex flex-col justify-between">
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="text-lg font-display font-extrabold text-slate-950 dark:text-white tracking-tight">Recent Bookings</h4>
                        <button onClick={() => setActiveTab('bookings')} className="text-[10px] font-bold text-primary-600 hover:text-primary-700 uppercase tracking-widest">
                          Review All
                        </button>
                      </div>

                      <div className="space-y-5">
                        {data.bookings.slice(0, 4).map(book => {
                          let statusColor = 'text-primary-600 bg-primary-50 dark:bg-primary-950/20';
                          if (book.status === 'rejected') statusColor = 'text-slate-400 bg-slate-100 dark:bg-slate-800';
                          return (
                            <div key={book.id} className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs shrink-0">
                                  {book.tenantEmail?.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-slate-950 dark:text-white text-xs truncate">{book.tenantEmail}</p>
                                  <p className="text-[9px] text-slate-400 dark:text-slate-500 truncate mt-0.5">Lease: {book.propertyTitle}</p>
                                </div>
                              </div>
                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest shrink-0 ${statusColor}`}>
                                {book.status}
                              </span>
                            </div>
                          );
                        })}
                        {data.bookings.length === 0 && (
                          <div className="text-center py-10 text-slate-400 text-xs italic">
                            No active coordinate requests.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {user.role === 'landlord' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Column 1: Dynamic Bar Chart */}
                    <div className="lg:col-span-6 flex flex-col">
                      <StripedBarChart 
                        title="Listing Inquiry Activity" 
                        counts={bookingsCounts} 
                        todayIndex={todayIndex} 
                      />
                    </div>

                    {/* Column 2: Recent Bookings */}
                    <div className="lg:col-span-6 flex flex-col">
                      <div className="glass-card p-6 md:p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 w-full bg-white dark:bg-slate-900/60 h-full flex flex-col justify-between">
                        <div className="flex justify-between items-center mb-6">
                          <h4 className="text-lg font-display font-extrabold text-slate-950 dark:text-white tracking-tight">Recent Bookings</h4>
                          <button onClick={() => setActiveTab('bookings')} className="text-[10px] font-bold text-primary-600 hover:text-primary-700 uppercase tracking-widest">
                            Review All
                          </button>
                        </div>

                        <div className="space-y-5">
                          {data.bookings.slice(0, 4).map(book => {
                            let statusColor = 'text-primary-600 bg-primary-50 dark:bg-primary-950/20';
                            if (book.status === 'rejected') statusColor = 'text-slate-400 bg-slate-100 dark:bg-slate-800';
                            return (
                              <div key={book.id} className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs shrink-0">
                                    {book.tenantEmail?.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-bold text-slate-950 dark:text-white text-xs truncate">{book.tenantEmail}</p>
                                    <p className="text-[9px] text-slate-400 dark:text-slate-500 truncate mt-0.5">Lease: {book.propertyTitle}</p>
                                  </div>
                                </div>
                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest shrink-0 ${statusColor}`}>
                                  {book.status}
                                </span>
                              </div>
                            );
                          })}
                          {data.bookings.length === 0 && (
                            <div className="text-center py-10 text-slate-400 text-xs italic">
                              No active coordinate requests.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Column 1: Occupancy Gauge */}
                    <div className="lg:col-span-4 flex flex-col">
                      <StripedSemiCircleGauge occupancyPercentage={occupancyRatePercentage} />
                    </div>

                    {/* Column 2: My Listings */}
                    <div className="lg:col-span-8 flex flex-col">
                      <div className="glass-card p-6 md:p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 w-full bg-white dark:bg-slate-900/60 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-base font-display font-extrabold text-slate-950 dark:text-white tracking-tight">My Listings</h4>
                          <Link to="/properties/new" className="text-[9px] font-bold text-primary-600 border border-primary-100 hover:bg-primary-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                            + New
                          </Link>
                        </div>

                        <div className="space-y-4 max-h-[160px] overflow-y-auto no-scrollbar">
                          {data.properties.slice(0, 4).map(prop => (
                            <div key={prop.id} className="flex items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className={`w-2 h-2 rounded-full shrink-0 ${prop.availability === 'available' ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-700'}`} />
                                <div className="min-w-0">
                                  <p className="font-bold text-slate-900 dark:text-white truncate">{prop.title}</p>
                                  <p className="text-[9px] text-slate-400 truncate">{prop.location}</p>
                                </div>
                              </div>
                              <span className="text-[9px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-full shrink-0">
                                ${prop.pricePerMonth}/mo
                              </span>
                            </div>
                          ))}
                          {data.properties.length === 0 && (
                            <div className="text-center py-6 text-slate-400 text-xs italic">
                              No active listings.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {user.role === 'tenant' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Column 1: Recent Applications */}
                  <div className="lg:col-span-12 flex flex-col">
                    <div className="glass-card p-6 md:p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 w-full bg-white dark:bg-slate-900/60 h-full flex flex-col justify-between">
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="text-lg font-display font-extrabold text-slate-950 dark:text-white tracking-tight">Recent Applications</h4>
                        <button onClick={() => setActiveTab('bookings')} className="text-[10px] font-bold text-primary-600 hover:text-primary-700 uppercase tracking-widest">
                          Review All
                        </button>
                      </div>

                      <div className="space-y-5">
                        {data.bookings.slice(0, 4).map(book => {
                          let statusColor = 'text-primary-600 bg-primary-50 dark:bg-primary-950/20';
                          if (book.status === 'rejected') statusColor = 'text-slate-400 bg-slate-100 dark:bg-slate-800';
                          return (
                            <div key={book.id} className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs shrink-0">
                                  {book.tenantEmail?.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-slate-950 dark:text-white text-xs truncate">{book.tenantEmail}</p>
                                  <p className="text-[9px] text-slate-400 dark:text-slate-500 truncate mt-0.5">Lease: {book.propertyTitle}</p>
                                </div>
                              </div>
                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest shrink-0 ${statusColor}`}>
                                {book.status}
                              </span>
                            </div>
                          );
                        })}
                        {data.bookings.length === 0 && (
                          <div className="text-center py-10 text-slate-400 text-xs italic">
                            No active coordinate requests.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Active Tab: My Portfolio Listings */}
          {activeTab === 'listings' && (user.role === 'landlord' || user.role === 'admin') && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800/80 shadow-premium bg-white dark:bg-slate-900/60"
            >
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-900/20">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-950 dark:text-white">Active Listings</h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Review and optimize your active housing rentals.</p>
                  </div>
                </div>
                <Link to="/properties/new" className="btn-primary !rounded-xl !py-2.5 !px-5 text-xs font-bold bg-primary-600 text-white hover:bg-primary-700 flex items-center gap-1.5 shadow-md shadow-primary-500/10">
                  <Plus size={14} className="stroke-[3]" /> Add Listing
                </Link>
              </div>
              
              <div className="p-8">
                {data.properties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.properties.map(prop => (
                      <div 
                        key={prop.id}
                        className="group relative rounded-[2rem] bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800 hover:border-primary-500/40 p-5 transition-all duration-300 flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-sm mb-4 bg-slate-100 dark:bg-slate-800">
                            <img 
                              src={prop.images?.[0]?.filePath || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=600'} 
                              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                              alt={prop.title}
                            />
                            <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                              <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-sm ${prop.availability === 'available' ? 'bg-primary-600 text-white' : 'bg-slate-500 text-white'}`}>
                                ● {prop.availability}
                              </span>
                              <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-sm ${prop.approved ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'}`}>
                                {prop.approved ? 'Approved' : 'Pending Review'}
                              </span>
                            </div>
                            <div className="absolute bottom-3 right-3 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-xl text-white font-bold text-xs">
                              ${prop.pricePerMonth?.toLocaleString()}/mo
                            </div>
                          </div>

                          <h4 className="font-bold text-lg mb-1.5 text-slate-950 dark:text-white line-clamp-1 group-hover:text-primary-600 transition-colors">{prop.title}</h4>
                          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider mb-4">
                            <MapPin size={12} className="text-primary-500 shrink-0" />
                            <span className="line-clamp-1">{prop.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <Users size={12} className="text-primary-500" /> {prop.rooms} Rooms
                          </span>

                          <div className="flex items-center gap-2">
                            {user.role === 'admin' && (
                              <button
                                onClick={() => handleApproveProperty(prop.id, !prop.approved)}
                                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm ${
                                  prop.approved 
                                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400' 
                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                }`}
                              >
                                {prop.approved ? 'Leave it' : 'Add (Approve)'}
                              </button>
                            )}
                            <Link to={`/properties/${prop.id}/edit`} className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-primary-600 transition-all shadow-sm hover:scale-105 active:scale-95">
                              <Edit3 size={16} />
                            </Link>
                            <button onClick={() => handleDeleteProperty(prop.id)} className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-rose-500 transition-all shadow-sm hover:scale-105 active:scale-95">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-slate-50/50 dark:bg-slate-900/10 rounded-[2rem]">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                      <Building2 size={32} />
                    </div>
                    <p className="text-slate-400 font-medium italic">No properties listed yet.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Active Tab: Manage Users (Admin Only) */}
          {activeTab === 'users' && user.role === 'admin' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800/80 shadow-premium bg-white dark:bg-slate-900/60"
            >
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-900/20">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                    <Users size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-950 dark:text-white">User Management</h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Add, update, delete or assign roles to platform members.</p>
                  </div>
                </div>
                <button
                  onClick={() => handleOpenUserModal()}
                  className="btn-primary !rounded-xl !py-2.5 !px-5 text-xs font-bold bg-primary-600 text-white hover:bg-primary-700 flex items-center gap-1.5 shadow-md shadow-primary-500/10"
                >
                  <Plus size={14} className="stroke-[3]" /> Add User
                </button>
              </div>

              <div className="p-8 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      <th className="pb-4">Name</th>
                      <th className="pb-4">Email</th>
                      <th className="pb-4">Role</th>
                      <th className="pb-4">Status</th>
                      <th className="pb-4">Created By</th>
                      <th className="pb-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-xs">
                    {data.users?.map(u => {
                      const creatorEmail = u.createdBy ? (data.users.find(creator => creator.id === u.createdBy)?.email || `User #${u.createdBy}`) : 'System Seed';
                      const isCreatorSelf = u.createdBy === user.id;
                      const isTargetAdmin = u.role === 'admin';
                      const canDelete = !isTargetAdmin || isCreatorSelf;

                      return (
                        <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                          <td className="py-4 font-bold text-slate-900 dark:text-white">{u.fullName || 'N/A'}</td>
                          <td className="py-4 text-slate-500 dark:text-slate-400">{u.email}</td>
                          <td className="py-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              u.role === 'admin' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400' :
                              u.role === 'landlord' ? 'bg-primary-100 text-primary-700 dark:bg-primary-950/30 dark:text-primary-400' :
                              'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-4">
                            <span className={`flex items-center gap-1.5 font-bold ${u.active ? 'text-emerald-500' : 'text-slate-400'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${u.active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                              {u.active ? 'Active' : 'Suspended'}
                            </span>
                          </td>
                          <td className="py-4 text-slate-400 dark:text-slate-500 text-[10px]">{creatorEmail}</td>
                          <td className="py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenUserModal(u)}
                                className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 flex items-center justify-center transition-all border border-slate-100 dark:border-slate-700"
                                title="Edit User"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u.id, u.email, canDelete)}
                                disabled={u.id === user.id}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border ${
                                  u.id === user.id ? 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-700 border-transparent cursor-not-allowed' :
                                  canDelete ? 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500 border-slate-100 dark:border-slate-700' :
                                  'bg-slate-100 dark:bg-slate-800 text-slate-350 dark:text-slate-700 border-transparent cursor-not-allowed'
                                }`}
                                title={u.id === user.id ? "Cannot delete yourself" : canDelete ? "Delete User" : `Food Chain Rule: Only the admin who created them (${creatorEmail}) can delete them`}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Active Tab: Booking Requests */}
          {activeTab === 'bookings' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800/80 shadow-premium bg-white dark:bg-slate-900/60"
            >
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-900/20">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                      {user.role === 'landlord' ? 'Booking Requests' : 'Application History'}
                    </h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Review, accept, or coordinate booking applications.</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                {data.bookings.length > 0 ? (
                  <div className="space-y-6">
                    {data.bookings.map(book => (
                      <div 
                        key={book.id} 
                        className="p-6 md:p-8 rounded-[2rem] bg-slate-50/50 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-800"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary-600 to-primary-700 text-white flex items-center justify-center font-black shadow-lg">
                              {book.tenantEmail?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-950 dark:text-white text-sm tracking-wide">{book.tenantEmail}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Clock size={12} className="text-slate-400" />
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  Received {new Date(book.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>

                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm ${
                            book.status === 'approved' 
                              ? 'bg-primary-600 text-white' 
                              : book.status === 'rejected' 
                              ? 'bg-slate-400 text-white' 
                              : 'bg-primary-500 text-white'
                          }`}>
                            ● {book.status}
                          </span>
                        </div>

                        <div className="py-6">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Target Property</p>
                          <h5 className="font-bold text-slate-900 dark:text-white text-base mb-4">{book.propertyTitle}</h5>
                          
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Inquiry Message</p>
                          <div className="bg-white dark:bg-slate-950/60 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 mb-4">
                            <p className="text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed">
                              "{book.message || 'No message provided'}"
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 mt-4 gap-2">
                            <div>
                              <strong className="text-slate-400">Lease Dates:</strong> {book.startDate} to {book.endDate}
                            </div>
                          </div>
                        </div>

                        {user.role === 'landlord' && book.status === 'pending' && (
                          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <button 
                              onClick={() => handleBookingAction(book.id, 'rejected')} 
                              className="btn-secondary !rounded-[1.2rem] !py-2.5 !px-6 text-xs font-bold active:scale-95"
                            >
                              Decline
                            </button>
                            <button 
                              onClick={() => handleBookingAction(book.id, 'approved')} 
                              className="btn-primary !rounded-[1.2rem] !py-2.5 !px-8 text-xs font-bold active:scale-95 shadow-md shadow-primary-600/10"
                            >
                              Accept Offer
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 text-slate-400">
                    <MessageSquare className="mx-auto mb-4 opacity-20" size={48} />
                    <p className="font-medium italic">No booking requests found.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Active Tab: Audit & Security Logs */}
          {activeTab === 'logs' && user.role === 'admin' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800/80 shadow-premium bg-white dark:bg-slate-900/60"
            >
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-900/20">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-950 dark:text-white">Security & Audit Logs</h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Platform actions security monitoring.</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-4 max-h-[600px] overflow-y-auto no-scrollbar">
                {data.logs.length > 0 ? (
                  <div className="space-y-4">
                    {data.logs.map(log => {
                      const isWarning = log.action?.toLowerCase().includes('error') || log.action?.toLowerCase().includes('failed');
                      return (
                        <div 
                          key={log.id} 
                          className={`p-5 rounded-2xl border ${
                            isWarning 
                              ? 'bg-slate-50/50 dark:bg-slate-900/10 border-slate-200 dark:border-slate-800' 
                              : 'bg-slate-50/50 dark:bg-slate-900/20 border-slate-100 dark:border-slate-800'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                              isWarning ? 'bg-slate-400 text-white' : 'bg-primary-600 text-white'
                            }`}>
                              {log.action}
                            </span>
                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                              {new Date(log.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            <strong className="text-slate-900 dark:text-white">{log.userEmail}</strong> — {log.details}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10 text-slate-400">
                    <p className="font-medium italic">No security events found.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Active Tab: Settings */}
          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800/80 shadow-premium bg-white dark:bg-slate-900/60"
            >
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-900/20">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                    <Settings size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-950 dark:text-white">Account Settings</h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Verify credentials and manage personal configurations.</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                          type="text" 
                          className="input-field !pl-12 !rounded-2xl" 
                          value={profileForm.fullName} 
                          onChange={(e) => setProfileForm({...profileForm, fullName: e.target.value})}
                          required 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Verified Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                          disabled
                          type="text" 
                          className="input-field !pl-12 !rounded-2xl opacity-60 cursor-not-allowed" 
                          value={user.email} 
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Update Password (Optional)</label>
                    <div className="relative">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="password" 
                        className="input-field !pl-12 !rounded-2xl" 
                        value={profileForm.password} 
                        onChange={(e) => setProfileForm({...profileForm, password: e.target.value})}
                        placeholder="Leave blank to preserve current credentials" 
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button 
                      type="submit" 
                      disabled={updatingProfile} 
                      className="btn-primary !rounded-2xl !py-3.5 !px-8 text-xs font-bold shadow-md active:scale-95 bg-primary-600 text-white hover:bg-primary-700"
                    >
                      {updatingProfile ? 'Saving...' : 'Save Settings'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {/* User management modal */}
          <AnimatePresence>
            {userModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setUserModalOpen(false)}
                  className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />

                {/* Modal Container */}
                <motion.div
                  initial={{ scale: 0.95, opacity: 0, y: 15 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 15 }}
                  className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-premium p-8 z-10 space-y-6"
                >
                  <div className="flex justify-between items-center pb-4 border-b border-slate-150 dark:border-slate-800">
                    <h3 className="text-xl font-display font-extrabold text-slate-950 dark:text-white">
                      {userForm.id ? 'Edit User Details' : 'Register New User'}
                    </h3>
                    <button 
                      onClick={() => setUserModalOpen(false)}
                      className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center transition-all"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <form onSubmit={handleSaveUser} className="space-y-5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                      <input 
                        type="text" 
                        required
                        className="input-field !rounded-xl"
                        placeholder="e.g. John Doe"
                        value={userForm.fullName}
                        onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                      <input 
                        type="email" 
                        required
                        className="input-field !rounded-xl"
                        placeholder="e.g. john@example.com"
                        value={userForm.email}
                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">User Role</label>
                        <select
                          className="input-field !rounded-xl"
                          value={userForm.role}
                          onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                        >
                          <option value="tenant">Tenant</option>
                          <option value="landlord">Landlord</option>
                          <option value="admin">Super Admin</option>
                        </select>
                      </div>

                      <div className="flex flex-col justify-end pb-3 pl-2">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input 
                            type="checkbox"
                            className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                            checked={userForm.active}
                            onChange={(e) => setUserForm({ ...userForm, active: e.target.checked })}
                          />
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-350">Active Status</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                        Password {userForm.id && '(Leave blank to preserve current)'}
                      </label>
                      <input 
                        type="password" 
                        required={!userForm.id}
                        className="input-field !rounded-xl"
                        placeholder={userForm.id ? "Optional security update" : "Minimum 6 characters"}
                        value={userForm.password}
                        onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-150 dark:border-slate-800">
                      <button 
                        type="button"
                        onClick={() => setUserModalOpen(false)}
                        className="btn-secondary !rounded-[1.2rem] !py-2.5 !px-6 text-xs font-bold active:scale-95"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="btn-primary !rounded-[1.2rem] !py-2.5 !px-8 text-xs font-bold active:scale-95 bg-primary-600 text-white hover:bg-primary-700"
                      >
                        {userForm.id ? 'Save Changes' : 'Register User'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
