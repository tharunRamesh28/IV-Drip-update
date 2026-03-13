import React from 'react';

function AlertPanel({ alerts }) {
    if (!alerts || alerts.length === 0) {
        return (
            <div className="rounded-3xl p-6 flex flex-col items-center justify-center gap-4 bg-slate-900/40 border border-slate-700/50 shadow-inner group">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
                    ✅
                </div>
                <div className="text-center">
                    <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Status Nominal</div>
                    <div className="text-xs text-slate-500 font-medium">No telemetry alerts detected.<br />Patient IV monitoring is stable.</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {alerts.map((alert, i) => (
                <div key={i} className={`rounded-2xl p-5 border animate-fade-in relative overflow-hidden group ${alert.blinking ? 'animate-blink' : ''}`} style={{
                    background: alert.level === 'critical' ? 'rgba(255, 59, 59, 0.08)' : 'rgba(255, 204, 0, 0.08)',
                    borderColor: alert.level === 'critical' ? 'var(--critical)' : 'var(--warning)',
                    boxShadow: alert.level === 'critical' ? '0 0 25px rgba(255, 59, 59, 0.2)' : '0 0 20px rgba(255, 204, 0, 0.1)'
                }}>
                    <div className="absolute top-0 right-0 p-2 text-[8px] font-black tracking-widest text-white/20 uppercase">Alert ID: #{i + 100}</div>
                    <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${alert.level === 'critical' ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-amber-500/20 text-amber-500 border border-amber-500/30'}`}>
                            {alert.level === 'critical' ? '🚨' : '⚠️'}
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-black uppercase tracking-wider mb-1" style={{ color: alert.level === 'critical' ? 'var(--critical)' : 'var(--warning)' }}>
                                {alert.title}
                            </div>
                            <div className="text-xs text-white font-medium leading-relaxed">
                                {alert.message}
                            </div>
                            <div className="mt-3 flex items-center gap-2">
                                <div className="px-3 py-1 rounded-full text-[9px] font-black tracking-widest text-white uppercase" style={{ background: alert.level === 'critical' ? 'var(--critical)' : 'var(--warning)' }}>
                                    {alert.level === 'critical' ? 'CRITICAL ALERT' : 'SYSTEM WARNING'}
                                </div>
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">WARD Bed #12</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default AlertPanel;
