/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  Code2, 
  Users, 
  Factory, 
  Search, 
  ExternalLink, 
  Github, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  MoreVertical, 
  Plus, 
  RefreshCw, 
  Database, 
  Globe, 
  Zap, 
  Eye, 
  Terminal,
  Filter,
  Download,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

type Section = 'dashboard' | 'registry' | 'prompts' | 'leads' | 'factory';

interface Lead {
  id: string;
  business: string;
  rating: number;
  reviews: number;
  domainStatus: 'available' | 'taken' | 'pending';
  niche: string;
  city: string;
}

interface Project {
  id: string;
  client: string;
  progress: number;
  status: 'building' | 'deployed' | 'error';
  repo: string;
  url: string;
  lastUpdate: string;
}

// --- Mock Data ---

const MOCK_LEADS: Lead[] = [
  { id: '1', business: 'Austin HVAC Pros', rating: 4.8, reviews: 124, domainStatus: 'available', niche: 'HVAC', city: 'Austin' },
  { id: '2', business: 'Elite Plumbing Co', rating: 4.2, reviews: 89, domainStatus: 'taken', niche: 'Plumbing', city: 'Dallas' },
  { id: '3', business: 'Sunny Day Solar', rating: 4.9, reviews: 256, domainStatus: 'available', niche: 'Solar', city: 'Phoenix' },
  { id: '4', business: 'Green Grass Landscaping', rating: 3.8, reviews: 45, domainStatus: 'pending', niche: 'Landscaping', city: 'Houston' },
  { id: '5', business: 'Modern Dental Care', rating: 4.5, reviews: 312, domainStatus: 'taken', niche: 'Dentist', city: 'Austin' },
];

const MOCK_PROJECTS: Project[] = [
  { id: '1', client: 'Austin HVAC Pros', progress: 100, status: 'deployed', repo: 'github.com/agency/austin-hvac', url: 'austinhvacpros.com', lastUpdate: '2h ago' },
  { id: '2', client: 'Sunny Day Solar', progress: 65, status: 'building', repo: 'github.com/agency/sunny-solar', url: 'sunnysolar.vercel.app', lastUpdate: '15m ago' },
  { id: '3', client: 'Green Grass Landscaping', progress: 20, status: 'error', repo: 'github.com/agency/green-grass', url: 'greengrass.vercel.app', lastUpdate: '1d ago' },
];

// --- Components ---

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: any, 
  label: string, 
  active: boolean, 
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
      active 
        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 border border-transparent'
    }`}
  >
    <Icon size={18} className={active ? 'text-blue-400' : 'text-zinc-500 group-hover:text-zinc-300'} />
    <span className="text-sm font-medium">{label}</span>
  </button>
);

const Card = ({ children, className = "", ...props }: { children: React.ReactNode, className?: string, [key: string]: any }) => (
  <div className={`bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden ${className}`} {...props}>
    {children}
  </div>
);

const Badge = ({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'error' | 'blue' }) => {
  const styles = {
    default: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    error: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[variant]}`}>
      {children}
    </span>
  );
};

// --- Main Sections ---

const DashboardView = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[
        { label: 'Active Sites', value: '24', icon: Globe, color: 'text-blue-400' },
        { label: 'Leads Scanned', value: '1,284', icon: Search, color: 'text-emerald-400' },
        { label: 'Builds Today', value: '12', icon: Zap, color: 'text-amber-400' },
        { label: 'API Usage', value: '84%', icon: Database, color: 'text-purple-400' },
      ].map((stat, i) => (
        <Card key={i} className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
          <stat.icon className={stat.color} size={24} />
        </Card>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Clock size={16} className="text-blue-400" />
            Recent Activity
          </h3>
          <button className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">View All</button>
        </div>
        <div className="space-y-4">
          {[
            { action: 'Site Deployed', target: 'Austin HVAC Pros', time: '2m ago', icon: CheckCircle2, color: 'text-emerald-400' },
            { action: 'Lead Scraped', target: 'Elite Plumbing Co', time: '15m ago', icon: Search, color: 'text-blue-400' },
            { action: 'Build Failed', target: 'Green Grass Landscaping', time: '1h ago', icon: AlertCircle, color: 'text-rose-400' },
            { action: 'Prompt Updated', target: 'Service Template V2', time: '3h ago', icon: Code2, color: 'text-purple-400' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-800/30 transition-colors group">
              <div className={`p-2 rounded-lg bg-zinc-800 group-hover:bg-zinc-700 transition-colors ${item.color}`}>
                <item.icon size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.action}</p>
                <p className="text-xs text-zinc-500">{item.target}</p>
              </div>
              <span className="text-xs text-zinc-600 font-mono">{item.time}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Terminal size={16} className="text-emerald-400" />
            System Status
          </h3>
          <Badge variant="success">All Systems Operational</Badge>
        </div>
        <div className="space-y-6">
          {[
            { label: 'Vercel API', status: 'Healthy', load: '12ms' },
            { label: 'GitHub Webhooks', status: 'Healthy', load: '45ms' },
            { label: 'Gemini 1.5 Pro', status: 'Healthy', load: '1.2s' },
            { label: 'Lead Scraper Node', status: 'Healthy', load: '240ms' },
          ].map((sys, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-sm font-medium text-zinc-300">{sys.label}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-zinc-500 font-mono">{sys.load}</span>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-tighter">{sys.status}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
);

const RegistryView = () => (
  <div className="max-w-3xl space-y-8">
    <header>
      <h2 className="text-2xl font-bold tracking-tight">Master Registry</h2>
      <p className="text-zinc-400 text-sm mt-1">Manage global configuration variables for the assembly line.</p>
    </header>

    <div className="space-y-6">
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Global Variables</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400 ml-1">Target Niche</label>
            <input 
              type="text" 
              defaultValue="HVAC Services"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400 ml-1">Target City</label>
            <input 
              type="text" 
              defaultValue="Austin, TX"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">API Infrastructure</h3>
        <div className="space-y-4">
          {[
            { label: 'Gemini API Key', value: '••••••••••••••••••••••••', status: 'active' },
            { label: 'Vercel Auth Token', value: '••••••••••••••••••••••••', status: 'active' },
            { label: 'GitHub App Secret', value: '••••••••••••••••••••••••', status: 'expired' },
          ].map((api, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${api.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                <div>
                  <p className="text-sm font-semibold">{api.label}</p>
                  <p className="text-xs text-zinc-500 font-mono mt-0.5">{api.value}</p>
                </div>
              </div>
              <button className="text-xs font-medium text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded-md hover:bg-blue-400/5 transition-all">
                Rotate Key
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="pt-4 flex justify-end">
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)]">
          Save Configuration
        </button>
      </div>
    </div>
  </div>
);

const PromptsView = () => {
  const [template, setTemplate] = useState("Build a high-converting landing page for a {{NICHE}} business in {{CITY}}. Focus on local SEO for '{{NICHE}} in {{CITY}}'.");
  const [hydrated, setHydrated] = useState("");

  useEffect(() => {
    setHydrated(template.replace(/{{NICHE}}/g, "HVAC").replace(/{{CITY}}/g, "Austin"));
  }, [template]);

  return (
    <div className="h-full flex flex-col space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Prompt Factory</h2>
          <p className="text-zinc-400 text-sm mt-1">Review and test prompt templates with live variable hydration.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors">
            <RefreshCw size={18} />
          </button>
          <button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-4 py-2 rounded-lg text-sm font-medium transition-all border border-zinc-700">
            Save Template
          </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px]">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Raw Template</span>
            <span className="text-[10px] font-mono text-zinc-600">YAML / Markdown</span>
          </div>
          <textarea 
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm font-mono text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 resize-none leading-relaxed"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Hydrated Preview</span>
            <span className="text-[10px] font-mono text-zinc-600">Live Preview</span>
          </div>
          <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm font-mono leading-relaxed overflow-auto">
            {hydrated.split(/(\{\{.*?\}\})/).map((part, i) => (
              <span key={i} className={part.startsWith('{{') ? 'text-blue-400 font-bold' : 'text-zinc-400'}>
                {part.startsWith('{{') ? part.replace('{{', '').replace('}}', '').toLowerCase() : part}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const LeadsView = () => (
  <div className="space-y-6">
    <header className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Lead Scout</h2>
        <p className="text-zinc-400 text-sm mt-1">High-density business intelligence for automated outreach.</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input 
            type="text" 
            placeholder="Search leads..."
            className="bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 w-64"
          />
        </div>
        <button className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-100 transition-colors">
          <Filter size={18} />
        </button>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2">
          <Download size={16} />
          Export CSV
        </button>
      </div>
    </header>

    <Card>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-zinc-800/50 border-bottom border-zinc-800">
            <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Business Name</th>
            <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Rating</th>
            <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Reviews</th>
            <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Domain</th>
            <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Location</th>
            <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {MOCK_LEADS.map((lead) => (
            <tr key={lead.id} className="hover:bg-zinc-800/20 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-zinc-100">{lead.business}</span>
                  <span className="text-xs text-zinc-500">{lead.niche}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-mono font-bold text-amber-400">{lead.rating}</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <div key={s} className={`w-1 h-3 rounded-full ${s <= Math.floor(lead.rating) ? 'bg-amber-400' : 'bg-zinc-700'}`} />
                    ))}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm font-mono text-zinc-400">{lead.reviews}</td>
              <td className="px-6 py-4">
                <Badge variant={lead.domainStatus === 'available' ? 'success' : lead.domainStatus === 'taken' ? 'error' : 'warning'}>
                  {lead.domainStatus}
                </Badge>
              </td>
              <td className="px-6 py-4 text-sm text-zinc-400">{lead.city}</td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 text-zinc-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-md transition-all" title="Scrape">
                    <RefreshCw size={14} />
                  </button>
                  <button className="p-1.5 text-zinc-500 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-md transition-all" title="Enrich">
                    <Zap size={14} />
                  </button>
                  <button className="p-1.5 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-700 rounded-md transition-all">
                    <MoreVertical size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  </div>
);

const FactoryView = () => (
  <div className="space-y-6">
    <header className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Site Factory</h2>
        <p className="text-zinc-400 text-sm mt-1">Monitor the automated assembly and deployment pipeline.</p>
      </div>
      <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2">
        <Plus size={16} />
        New Build
      </button>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {MOCK_PROJECTS.map((project) => (
        <Card key={project.id} className="group">
          <div className="p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-zinc-100">{project.client}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={project.status === 'deployed' ? 'success' : project.status === 'building' ? 'blue' : 'error'}>
                    {project.status}
                  </Badge>
                  <span className="text-[10px] text-zinc-500 font-mono">{project.lastUpdate}</span>
                </div>
              </div>
              <button className="text-zinc-500 hover:text-zinc-100 transition-colors">
                <MoreVertical size={18} />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-medium">Build Progress</span>
                <span className="text-zinc-100 font-bold">{project.progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    project.status === 'deployed' ? 'bg-emerald-500' : 
                    project.status === 'error' ? 'bg-rose-500' : 'bg-blue-500'
                  }`}
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <a href={`https://${project.repo}`} className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                <Github size={14} />
                <span className="truncate">{project.repo}</span>
              </a>
              <a href={`https://${project.url}`} className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                <Globe size={14} />
                <span className="truncate">{project.url}</span>
                <ArrowUpRight size={12} />
              </a>
            </div>
          </div>
          <div className="px-5 py-3 bg-zinc-800/30 border-t border-zinc-800 flex items-center justify-between">
            <button className="text-xs font-semibold text-zinc-400 hover:text-zinc-100 transition-colors flex items-center gap-1.5">
              <Eye size={14} />
              View Logs
            </button>
            <button className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1.5">
              Manage Site
              <ChevronRight size={14} />
            </button>
          </div>
        </Card>
      ))}
      
      <button className="border-2 border-dashed border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center gap-3 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all group">
        <div className="p-3 rounded-full bg-zinc-900 group-hover:bg-zinc-800 transition-colors">
          <Plus size={24} />
        </div>
        <span className="text-sm font-semibold">Initiate New Assembly</span>
      </button>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 flex flex-col bg-zinc-950/50 backdrop-blur-xl">
        <div className="p-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              <Zap size={20} className="text-white fill-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tighter text-white">AgencyOS</h1>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={activeSection === 'dashboard'} 
            onClick={() => setActiveSection('dashboard')} 
          />
          <SidebarItem 
            icon={Settings} 
            label="Master Registry" 
            active={activeSection === 'registry'} 
            onClick={() => setActiveSection('registry')} 
          />
          <SidebarItem 
            icon={Code2} 
            label="Prompt Factory" 
            active={activeSection === 'prompts'} 
            onClick={() => setActiveSection('prompts')} 
          />
          <SidebarItem 
            icon={Users} 
            label="Lead Scout" 
            active={activeSection === 'leads'} 
            onClick={() => setActiveSection('leads')} 
          />
          <SidebarItem 
            icon={Factory} 
            label="Site Factory" 
            active={activeSection === 'factory'} 
            onClick={() => setActiveSection('factory')} 
          />
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-zinc-900/50 border border-zinc-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-zinc-100 truncate">Quinten</p>
              <p className="text-[10px] text-zinc-500 truncate">Pro Plan</p>
            </div>
            <button className="text-zinc-500 hover:text-zinc-300">
              <Settings size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-950/50 backdrop-blur-xl z-10">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
            <span>AgencyOS</span>
            <ChevronRight size={12} />
            <span className="text-zinc-300 capitalize">{activeSection.replace('-', ' ')}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Live Monitoring</span>
            </div>
            <button className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors relative">
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-500 rounded-full border border-zinc-950" />
              <Zap size={18} />
            </button>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="h-full"
            >
              {activeSection === 'dashboard' && <DashboardView />}
              {activeSection === 'registry' && <RegistryView />}
              {activeSection === 'prompts' && <PromptsView />}
              {activeSection === 'leads' && <LeadsView />}
              {activeSection === 'factory' && <FactoryView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}} />
    </div>
  );
}
