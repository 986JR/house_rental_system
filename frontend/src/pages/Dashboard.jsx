import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  Building2, Calendar, Trash2, Edit3, Plus, 
  MapPin, Loader2, AlertCircle, Home, MessageSquare, 
  TrendingUp, Users, ShieldAlert, ChevronRight, Bell, Settings,
  ArrowUpRight, Clock, Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';


const Dashboard = () => {
  const { user, updateProfile } = useAuth();
  const [data, setData] = useState({ properties: [], bookings: [], messages: [] });
  const [loading, setLoading] = useState(true);
  
  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ fullName: '', password: '' });
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (user.role === 'admin') {
        const propRes = await axios.get('/properties');
        setData({ properties: propRes.data.content || [], bookings: [], messages: [] });
      } else if (user.role === 'landlord') {
        const [propRes, bookRes] = await Promise.all([
          axios.get('/properties/my'),
          axios.get('/bookings/landlord')
        ]);
        setData({ properties: propRes.data || [], bookings: bookRes.data || [], messages: [] });
      } else {
        const bookRes = await axios.get('/bookings/my');
        setData({ properties: [], bookings: bookRes.data || [], messages: [] });
      }
    } catch (error) {
      // Fallback if backend is offline
      setData({ properties: [], bookings: [], messages: [] });
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      setProfileForm({ fullName: user.fullName, password: '' });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      await updateProfile(profileForm);
      setIsEditingProfile(false);
      setProfileForm({ ...profileForm, password: '' });
    } catch (err) {
      // Error handled in AuthContext
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Delete this listing permanently?')) return;
    try {
      await axios.delete(`/properties/${id}`);
      toast.success('Listing removed');
      fetchDashboardData();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
      <Loader2 className="animate-spin text-primary-600" size={48} />
      <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Accessing Command Center...</p>
    </div>
  );

  return (
    <div className="container py-12 md:py-16">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="badge bg-primary-600 text-white">Elite Hub</span>
            <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Active Status: Verified</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-950 dark:text-white leading-tight">
            Hello, <span className="text-primary-600">{user.fullName.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2 capitalize">{user.role} Control Panel</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          {user.role === 'landlord' && (
            <Link to="/properties/new" className="btn-primary flex-1 md:flex-none !px-8 !py-4 shadow-xl shadow-primary-600/20">
              <Plus size={20} className="mr-2" /> List Property
            </Link>
          )}
          <button className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-primary-600 transition-all shadow-sm">
            <Bell size={22} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {[
          { label: 'Revenue Generated', value: '$12,450', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Active Listings', value: data.properties.length, icon: Building2, color: 'text-primary-600', bg: 'bg-primary-600/10' },
          { label: 'Total Inquiries', value: data.bookings.length, icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Trust Rating', value: '4.9/5', icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-primary-400/40 transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-lg flex items-center gap-1">
                <ArrowUpRight size={12} /> +12%
              </span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-extrabold text-slate-950 dark:text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Main Section */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Properties Management */}
          {(user.role === 'landlord' || user.role === 'admin') && (
            <section className="glass-card rounded-[3rem] overflow-hidden border border-slate-100 dark:border-slate-800">
              <div className="p-8 md:p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-4 text-slate-950 dark:text-white">
                  <Building2 className="text-primary-600" /> My Portfolio
                </h2>
                <Link to="/properties" className="text-xs font-bold text-primary-600 uppercase tracking-widest hover:underline">Marketplace View</Link>
              </div>
              
              <div className="p-6 md:p-8">
                <div className="space-y-4">
                  {data.properties.length > 0 ? data.properties.map(prop => (
                    <div key={prop.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-3xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-primary-600/30 transition-all group gap-6">
                      <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg shrink-0">
                          <img 
                            src={prop.images?.[0]?.filePath || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=200'} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            alt={prop.title}
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-1 text-slate-950 dark:text-white line-clamp-1">{prop.title}</h4>
                          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                            <span className="flex items-center gap-1"><MapPin size={12} className="text-primary-600" /> {prop.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${prop.availability === 'available' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{prop.availability}</span>
                            <span className="text-slate-900 dark:text-white font-bold text-sm">${prop.pricePerMonth}/mo</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <Link to={`/properties/${prop.id}/edit`} className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-primary-600 transition-all shadow-sm">
                          <Edit3 size={18} />
                        </Link>
                        <button onClick={() => handleDeleteProperty(prop.id)} className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-red-500 transition-all shadow-sm">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-20">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <Building2 size={32} />
                      </div>
                      <p className="text-slate-400 font-medium italic">No listings found in your portfolio.</p>
                      <Link to="/properties/new" className="text-primary-600 font-bold mt-4 inline-block hover:underline">Create your first listing</Link>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Inquiries */}
          <section className="glass-card rounded-[3rem] overflow-hidden border border-slate-100 dark:border-slate-800">
            <div className="p-8 md:p-10 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-2xl font-bold flex items-center gap-4 text-slate-950 dark:text-white">
                <MessageSquare className="text-primary-600" /> Recent Inquiries
              </h2>
            </div>
            <div className="p-6 md:p-8">
              <div className="space-y-6">
                {data.bookings.length > 0 ? data.bookings.map(book => (
                  <div key={book.id} className="p-8 rounded-[2rem] bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold shadow-lg shadow-primary-600/20">
                          {(book.tenantEmail || book.landlordEmail)?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-950 dark:text-white text-sm">{book.tenantEmail || book.landlordEmail}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock size={12} className="text-slate-400" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Received 2 hours ago</p>
                          </div>
                        </div>
                      </div>
                      <span className="badge bg-primary-50 text-primary-600">Pending</span>
                    </div>
                    <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <p className="text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed">
                        "{book.message}"
                      </p>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                      <button className="btn-secondary !py-2 !px-6 text-xs font-bold !rounded-xl">Ignore</button>
                      <button className="btn-primary !py-2 !px-8 text-xs font-bold !rounded-xl">Reply</button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-20 text-slate-400">
                    <MessageSquare className="mx-auto mb-4 opacity-20" size={48} />
                    <p className="font-medium italic">No recent inquiries found.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Section */}
        <div className="lg:col-span-4 space-y-10">
          <section className="glass-card p-10 rounded-[3rem] text-center relative overflow-hidden border border-slate-100 dark:border-slate-800">
             <div className="absolute top-0 right-0 p-8 opacity-5"><Users size={120} /></div>
             <div className="relative z-10">
               <div className="w-24 h-24 mx-auto mb-8 rounded-[2.5rem] bg-gradient-to-br from-primary-600 to-blue-500 flex items-center justify-center text-white font-bold text-4xl shadow-2xl shadow-primary-600/20">
                 {user.fullName.charAt(0)}
               </div>
               <h3 className="text-2xl font-bold text-slate-950 dark:text-white mb-1">{user.fullName}</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-10">{user.role} Account</p>
               
               <div className="grid grid-cols-2 gap-6 py-10 border-y border-slate-100 dark:border-slate-800 mb-10">
                 <div>
                   <p className="text-2xl font-bold text-slate-950 dark:text-white">{data.properties.length || 0}</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Managed</p>
                 </div>
                 <div className="border-l border-slate-100 dark:border-slate-800">
                   <p className="text-2xl font-bold text-slate-950 dark:text-white">4.9</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score</p>
                 </div>
               </div>
               
               {isEditingProfile ? (
                 <form onSubmit={handleProfileSubmit} className="text-left space-y-4">
                   <div>
                     <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Full Name</label>
                     <input 
                       type="text" 
                       className="input-field" 
                       value={profileForm.fullName} 
                       onChange={(e) => setProfileForm({...profileForm, fullName: e.target.value})}
                       required 
                     />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">New Password (Optional)</label>
                     <input 
                       type="password" 
                       className="input-field" 
                       value={profileForm.password} 
                       onChange={(e) => setProfileForm({...profileForm, password: e.target.value})}
                       placeholder="Leave blank to keep current" 
                     />
                   </div>
                   <div className="flex gap-2 pt-2">
                     <button type="button" onClick={() => setIsEditingProfile(false)} className="btn-secondary flex-1 !py-2 text-xs">Cancel</button>
                     <button type="submit" disabled={updatingProfile} className="btn-primary flex-1 !py-2 text-xs">
                       {updatingProfile ? 'Saving...' : 'Save'}
                     </button>
                   </div>
                 </form>
               ) : (
                 <button onClick={() => setIsEditingProfile(true)} className="btn-secondary w-full !rounded-2xl flex items-center justify-center gap-2 group">
                   <Settings size={18} className="group-hover:rotate-45 transition-transform" /> Edit Profile
                 </button>
               )}
             </div>
          </section>

          <section className="glass-card p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3 text-slate-950 dark:text-white">
              <ShieldAlert size={22} className="text-amber-500" /> Security Tips
            </h3>
            <div className="space-y-6">
              {[
                { title: 'Verified Identity', desc: 'Ensure your ID is up to date for higher visibility.' },
                { title: 'Secure Messaging', desc: 'Always communicate via RentalHub to stay protected.' },
                { title: 'Payment Safety', desc: 'Never send money outside of our verified platform.' }
              ].map((tip, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary-500 shrink-0 mt-2" />
                  <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-white mb-1">{tip.title}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
