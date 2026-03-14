import React, { useState, useEffect } from 'react';
import './index.css';

import IVBottleGauge from './components/IVBottleGauge';
import FlowRateCard from './components/FlowRateCard';
import AlertPanel from './components/AlertPanel';
import PatientCard from './components/PatientCard';
import NurseSection from './components/NurseSection';
import DeviceHealth from './components/DeviceHealth';
import DripChart from './components/DripChart';
import PatientHealthIntelligence from './components/PatientHealthIntelligence';


import { useSimulation } from './hooks/useSimulation';
import { useFirebaseData } from './hooks/useFirebaseData';

const NAV_GROUPS = [
  {
    label: 'Critical Monitoring',
    items: [
      { id: 'overview', icon: '📊', label: 'Live ICU Monitor' },
      { id: 'intelligence', icon: '🧠', label: 'Health Intelligence' },
      { id: 'priority', icon: '⚡', label: 'Priority Queue' },
    ],

  },
  {
    label: 'IV Operations',
    items: [
      { id: 'iv', icon: '💧', label: 'IV Fluid Levels' },
      { id: 'flowrate', icon: '🌊', label: 'Flow Rate Monitor' },
    ],
  },
  {
    label: 'Ward Management',
    items: [
      { id: 'bedmap', icon: '🛏️', label: 'Bed Map' },
      { id: 'patient', icon: '🏥', label: 'Patient Details' },
      { id: 'nurse', icon: '👩‍⚕️', label: 'Nurse Assignment' },
    ],
  },
  {
    label: 'Hardware Diagnostics',
    items: [
      { id: 'device', icon: '🔌', label: 'Device Health' },
    ],
  },
];

const PAGE_TITLES = {
  overview: { title: 'Live ICU Monitor', sub: 'Real-time IV monitoring for all active ICU beds' },
  intelligence: { title: 'Patient Health Intelligence', sub: 'AI-driven vital sign analysis and risk prediction' },
  priority: { title: 'Priority Queue', sub: 'Patient status sorted by urgency level' },

  iv: { title: 'IV Fluid Levels', sub: 'Live fluid level readings with 3D visualization' },
  flowrate: { title: 'Flow Rate Monitor', sub: 'Fluid delivery speed and drops per minute' },
  bedmap: { title: 'Bed Map', sub: 'Ward visualization and occupancy status' },
  patient: { title: 'Patient Details', sub: 'Medical details and IV therapy settings' },
  nurse: { title: 'Nurse Assignment', sub: 'Manage ward staff and monitoring duties' },
  device: { title: 'Device Health Monitor', sub: 'System diagnostics and hardware status' },
};

function KpiChip({ icon, label, value, sub, delay = 0, color = "var(--primary)" }) {
  return (
    <div className="kpi-chip animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
      <div className="kpi-icon-wrap" style={{ borderLeft: `3px solid ${color}` }}>{icon}</div>
      <div>
        <div className="kpi-label">{label}</div>
        <div className="kpi-value truncate" style={{ textShadow: `0 0 10px ${color}40`, color }}>{value}</div>
        {sub && <div style={{ fontSize: '10px', color: 'var(--text-light)', marginTop: '4px' }}>{sub}</div>}
      </div>
    </div>
  );
}

function Card({ icon, title, children, className = "" }) {
  return (
    <div className={`card animate-fade-in ${className}`}>
      <div className="card-header border-b border-slate-700/50 pb-4 mb-6">
        <div className="w-10 h-10 rounded-xl bg-slate-900/50 flex items-center justify-center text-xl shadow-inner border border-slate-700/50">
          {icon}
        </div>
        <span className="card-title text-slate-100">{title}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}

function PredictionBanner({ level, flowRate }) {
  if (flowRate <= 0) return (
    <div className="prediction-banner opacity-50">
      <span className="text-xl">⏱️</span>
      <span className="text-sm font-medium text-slate-400 italic">Prediction unavailable – detecting flow...</span>
    </div>
  );

  const mins = level / flowRate;
  const hours = Math.floor(mins / 60);
  const remainingMins = Math.round(mins % 60);
  const msg = hours > 0
    ? `IV will finish in approximately ${hours}h ${remainingMins}min`
    : `IV will finish in approximately ${Math.round(mins)} minutes`;

  const urgency = mins < 15 ? 'critical' : mins < 40 ? 'warning' : 'success';
  const colors = { critical: '#ef4444', warning: '#f59e0b', success: '#06b6d4' };

  return (
    <div className="prediction-banner" style={{ borderColor: `${colors[urgency]}40`, background: `${colors[urgency]}08` }}>
      <span className="text-xl animate-glow" style={{ color: colors[urgency] }}>⏱️</span>
      <div>
        <div className="text-sm font-bold" style={{ color: colors[urgency] }}>{msg}</div>
        <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-tight">AI PREDICTION BASED ON CURRENT FLOW: {flowRate.toFixed(1)} mL/min</div>
      </div>
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50 select-none cursor-pointer" onClick={() => onChange(!value)}>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{value ? 'SIM MODE ON' : 'CONNECT TO RTDB'}</span>
      <div className={`toggle-track ${value ? 'active' : ''}`}>
        <div className="toggle-thumb" />
      </div>
    </div>
  );
}

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('overview');
  const [simMode, setSimMode] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [ivHistory, setIvHistory] = useState([]);
  const [nurse, setNurse] = useState(null);
  const [bedId] = useState('bed_01');

  const simData = useSimulation(simMode);
  const { data: fbData } = useFirebaseData(bedId, !simMode);

  const [lastDataChange, setLastDataChange] = useState(Date.now());
  const prevRawRef = React.useRef(null);

  const raw = simMode ? simData : (fbData || null);
  const ivLevel = raw?.iv_level_ml;
  const flowRate = raw?.flow_rate_ml_min;
  const drops = raw?.drops_per_min ?? (flowRate ? flowRate * 20 : 0);
  const devStatus = raw?.device_status ?? (simMode ? 'online' : 'offline');
  const hardwareAlert = raw?.hardware_alert ?? '';

  // Track data changes for "No Flow" detection (15s rule)
  useEffect(() => {
    if (raw && (raw.iv_level_ml !== prevRawRef.current?.iv_level_ml || raw.flow_rate_ml_min !== prevRawRef.current?.flow_rate_ml_min)) {
      setLastDataChange(Date.now());
    }
    prevRawRef.current = raw;
  }, [raw]);

  const isStale = Date.now() - lastDataChange > 15000 && !simMode;

  const patient = {
    name: raw?.patient_name ?? 'Arun Kumar',
    id: raw?.patient_id ?? 'PAT-2024-0089',
    bed: raw?.bed_number ?? '12',
    doctor: raw?.doctor_name ?? 'Dr. Rajesh Sharma',
    diagnosis: raw?.diagnosis ?? 'Post-operative Hydration',
    ivType: raw?.iv_type ?? 'Normal Saline (NS)',
    since: raw?.admitted ?? 'Today',
  };

  useEffect(() => {
    if (ivLevel > 0) {
      setIvHistory(prev => [...prev, Math.round(ivLevel)].slice(-50));
      setLastUpdate(new Date());
    }
  }, [ivLevel]);

  const alerts = [];
  if (!simMode && devStatus === 'offline') alerts.push({ level: 'critical', title: 'Device Offline', message: 'No telemetry from ESP32.' });

  // Hardware-issued Alert
  if (!simMode && hardwareAlert) {
     const isCritical = hardwareAlert.toLowerCase().includes('critical') || hardwareAlert.toLowerCase().includes('error');
     alerts.push({
       level: isCritical ? 'critical' : 'warning',
       title: 'Hardware Alert',
       message: hardwareAlert,
       blinking: isCritical
     });
  }

  // Smart Alerts
  if (isStale && flowRate > 0) {
    alerts.push({
      level: 'critical',
      title: 'No Fluid Flow Detected',
      message: 'Check IV Line – Data has not changed for 15s.',
      blinking: true
    });
  }

  if (flowRate > 15) {
    alerts.push({
      level: 'warning',
      title: 'High Flow Rate Detected',
      message: 'Check IV Clamp – Flow rate exceeds safe threshold (15 ml/min).'
    });
  }

  if (ivLevel !== undefined && ivLevel !== null && ivLevel > 0 && ivLevel <= 50) {
    alerts.push({ level: 'critical', title: `Bed ${patient.bed} - CRITICAL`, message: `${ivLevel} mL Low Fluid.` });
  } else if (ivLevel !== undefined && ivLevel !== null && ivLevel > 50 && ivLevel <= 100) {
    alerts.push({ level: 'warning', title: `Bed ${patient.bed} - LOW`, message: `${ivLevel} mL Remaining.` });
  }

  if (flowRate > 0 && flowRate <= 15 && (flowRate < 1 || flowRate > 6)) {
    alerts.push({ level: 'warning', title: `Abnormal Flow`, message: `Line check required.` });
  }

  const fmt = (d) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const { title: pageTitle, sub: pageSub } = PAGE_TITLES[activePage] || {};

  const renderContent = () => {
    switch (activePage) {
      case 'overview':
        return (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-2">
              <KpiChip icon="💧" label="IV Level" value={<span id="volume">{ivLevel !== undefined && ivLevel !== null ? `${ivLevel} mL` : '---'}</span>} sub="500 mL Base" delay={0} color="var(--primary)" />
              <KpiChip icon="🌊" label="Drip Speed" value={<span id="flowrate">{flowRate !== undefined && flowRate !== null ? `${flowRate.toFixed(1)} mL/min` : '---'}</span>} sub="mL / min" delay={100} color="var(--success)" />
              <KpiChip icon="⏱️" label="Prediction" value={flowRate > 0 && ivLevel ? (Math.round(ivLevel / flowRate) > 60 ? `${Math.floor(ivLevel / flowRate / 60)}h ${Math.round((ivLevel / flowRate) % 60)}m` : `${Math.round(ivLevel / flowRate)}m`) : '---'} sub="Est. Empty Time" delay={200} color="var(--warning)" />
              <KpiChip icon="📡" label="Connectivity" value={devStatus.toUpperCase()} sub={`Bed ID: ${bedId}`} delay={300} color={devStatus === 'online' ? 'var(--success)' : 'var(--critical)'} />
            </div>
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
              <Card icon="🧪" title="Real-time Visualization" className="h-full">
                <div className="flex flex-col lg:flex-row items-center gap-12 py-6">
                  <div className="flex-shrink-0 animate-glow">
                    <IVBottleGauge level={ivLevel} maxLevel={500} />
                  </div>
                  <div className="flex-1 w-full space-y-8">
                    <PredictionBanner level={ivLevel} flowRate={flowRate} />
                    <div className="space-y-3">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fluid Volume Profile</span>
                        <span className="text-sm font-bold text-slate-100">{ivLevel} <span className="text-slate-500 font-medium">/ 500 mL</span></span>
                      </div>
                      <div className="progress-neon">
                        <div className="progress-neon-fill" style={{ width: `${(ivLevel / 500) * 100}%`, background: ivLevel <= 100 ? 'var(--warning)' : 'var(--primary)' }}></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-slate-900/30 border border-slate-700/50">
                        <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Patient Name</div>
                        <div className="text-sm font-bold text-slate-200">{patient.name}</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-900/30 border border-slate-700/50">
                        <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Bed Assignment</div>
                        <div className="text-sm font-bold text-slate-200">ICU Bed #{patient.bed}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              <Card icon="📈" title="Historical Trend (Volume mL)">
                <div className="canvas-wrap">
                  <DripChart history={ivHistory} dark />
                </div>
              </Card>
            </div>
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
              <Card icon="🌊" title="Flow Rate Monitor">
                <FlowRateCard flowRate={flowRate} dropsPerMin={drops} dark />
              </Card>
              <Card icon="🚨" title="System Alerts">
                <AlertPanel alerts={alerts} dark />
              </Card>
              <Card icon="🏥" title="Patient Profile">
                <PatientCard patient={patient} dark />
              </Card>
            </div>
          </div>
        );
      case 'intelligence':
        return <PatientHealthIntelligence patient={patient} ivLevel={ivLevel} />;
      case 'priority':

        return (
          <div className="max-w-4xl mx-auto space-y-6">
            <Card icon="⚡" title="Patient Urgency Queue">
              <div className="space-y-4">
                {[
                  { bed: '12', name: patient.name, level: ivLevel, status: ivLevel < 50 ? 'CRITICAL' : 'STABLE' },
                  { bed: '08', name: 'James Wilson', level: 320, status: 'STABLE' },
                  { bed: '02', name: 'Maria Garcia', level: 45, status: 'CRITICAL' },
                  { bed: '15', name: 'Ken Tanaka', level: 120, status: 'LOW' },
                ].sort((a, b) => a.level - b.level).map((p, i) => (
                  <div key={p.bed} className="flex items-center gap-6 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-slate-400">#{i + 1}</div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-white">{p.name}</div>
                      <div className="text-xs text-slate-500">Bed Identification: #{p.bed}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold" style={{ color: p.level < 100 ? 'var(--critical)' : 'var(--primary)' }}>{p.level} mL</div>
                      <div className="text-[10px] font-bold opacity-70 tracking-widest">{p.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );
      case 'iv':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card icon="💧" title="Live Drip Visualization">
              <div className="py-8 flex justify-center">
                <IVBottleGauge level={ivLevel} maxLevel={500} />
              </div>
            </Card>
            <div className="space-y-8">
              <Card icon="⏱️" title="Telemetry Metrics">
                <div className="space-y-4">
                  <PredictionBanner level={ivLevel} flowRate={flowRate} />
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { l: "Fluid Vol", v: `${ivLevel} mL` },
                      { l: "Flow Rate", v: `${flowRate} mL/min` },
                      { l: "Drip Rate", v: `${Math.round(drops)} dp/min` },
                      { l: "Time Remaining", v: flowRate > 0 ? `${Math.round(ivLevel / flowRate)} min` : "N/A" }
                    ].map(s => (
                      <div key={s.l} className="p-4 rounded-xl bg-slate-900/30 border border-slate-700/50">
                        <div className="text-[10px] font-bold text-slate-500 uppercase">{s.l}</div>
                        <div className="text-sm font-bold text-white mt-1">{s.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );
      case 'flowrate':
        return (
          <div className="max-w-4xl mx-auto">
            <Card icon="🌊" title="Intravenous Flow Profile">
              <FlowRateCard flowRate={flowRate} dropsPerMin={drops} dark />
            </Card>
          </div>
        );
      case 'bedmap':
        return (
          <Card icon="🛏️" title="Ward Bed Occupancy Map">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`p-6 rounded-3xl border ${i === 3 ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-slate-800/40 border-slate-700/50'} relative group min-h-[180px]`}>
                  <div className="flex justify-between items-start mb-6 pt-2">
                    <span className={`text-[10px] font-black tracking-widest ${i === 3 ? 'text-cyan-400' : 'text-slate-600'} uppercase`}>BED #{10 + i}</span>
                    <div className={`w-3 h-3 rounded-full ${i === 3 ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-slate-700'}`}></div>
                  </div>
                  {i === 3 ? (
                    <div className="space-y-4">
                      <div className="text-lg font-bold text-white mb-1 truncate">{patient.name}</div>
                      <div className="text-[10px] text-cyan-400 font-bold tracking-tight uppercase">VOL: {ivLevel} mL</div>
                      <div className="w-full h-2 bg-slate-700 rounded-full mt-4 overflow-hidden">
                        <div className="h-full bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.5)]" style={{ width: `${(ivLevel / 500) * 100}%` }}></div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-24 flex items-center justify-center text-[10px] font-bold text-slate-700 uppercase tracking-widest border-2 border-dashed border-slate-700/30 rounded-2xl">
                      Available
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        );
      case 'patient':
        return (
          <div className="max-w-5xl mx-auto">
            <Card icon="🏥" title="Medical Record Observation">
              <PatientCard patient={patient} dark />
            </Card>
          </div>
        );
      case 'nurse':
        return (
          <div className="max-w-3xl mx-auto">
            <Card icon="👩‍⚕️" title="Clinical Staff Assignment">
              <NurseSection nurse={nurse} ivLevel={ivLevel} onAssign={setNurse} dark />
            </Card>
          </div>
        );
      case 'device':
        return (
          <div className="max-w-4xl mx-auto">
            <Card icon="🔌" title="System Diagnostic Console">
              <DeviceHealth status={devStatus} weight={ivLevel} flowRate={flowRate} isStale={isStale} />
            </Card>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className={`app-shell flex ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-[#f8fafc] theme-light'}`}>
      <aside className={`sidebar flex-shrink-0 ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">💉</div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="logo-text uppercase tracking-tighter text-white">Smart IV Monitor</span>
              <span className="text-[9px] font-bold text-cyan-400/80 uppercase tracking-widest">ICU System v2.0</span>
            </div>
          )}
        </div>
        <nav className="sidebar-scroll">
          {NAV_GROUPS.map(group => (
            <div key={group.label} className="mb-4">
              <div className="nav-group-label">{group.label}</div>
              {group.items.map(item => (
                <div key={item.id} className={`nav-item ${activePage === item.id ? 'active' : ''}`} onClick={() => setActivePage(item.id)}>
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </div>
              ))}
            </div>
          ))}
        </nav>
        <div className="p-6 mt-auto border-t border-slate-700/50">
          <button onClick={() => setCollapsed(!collapsed)} className="w-full py-2 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700/50 text-slate-400 transition-all">
            {collapsed ? '▶' : 'COLLAPSE NAV'}
          </button>
        </div>
      </aside>

      <main className={`main-wrapper transition-all duration-300 ${collapsed ? 'collapsed' : ''}`}>
        <header className="header-glass mb-8">
          <div className="flex items-center gap-3">
            <span className="text-xl">🏥</span>
            <div className="hidden sm:block">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none mb-1">Authenticated Terminal</div>
              <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">{pageTitle}</h2>
            </div>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-6">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-xl hover:bg-slate-700/50 transition-all shadow-md"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <div className="hidden lg:flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-700/50">
              <div className={`dot-glow ${devStatus === 'online' ? 'success' : 'critical'}`}></div>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{devStatus === 'online' ? 'Line Encrypted' : 'Signal Lost'}</span>
            </div>
            <div className="hidden sm:block text-right">
              <div className="text-[9px] font-bold text-slate-500 uppercase">Current Telemetry Time</div>
              <div className="text-xs font-mono font-bold text-cyan-400">{fmt(lastUpdate)}</div>
            </div>
            <Toggle value={simMode} onChange={setSimMode} />
          </div>
        </header>

        <div className="mb-10 px-4">
          <h1 className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'} uppercase tracking-tighter mb-2`}>{pageTitle}</h1>
          <p className="text-slate-500 text-sm font-medium tracking-tight">{pageSub}</p>
        </div>

        <div className="pb-12">
          {renderContent()}
        </div>

        <footer className="mt-auto pt-8 border-t border-slate-800 flex justify-between items-center opacity-40 hover:opacity-100 transition-opacity">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Smart IV ICU Intelligence · Built for Hospital Efficiency</div>
          <div className="text-[10px] font-black text-slate-500">2026 DASHBOARD CORE</div>
        </footer>
      </main>
    </div>
  );
}

export default App;
