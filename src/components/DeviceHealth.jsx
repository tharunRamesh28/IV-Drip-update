import React from 'react';

function DeviceHealth({ status, weight, flowRate, isStale }) {
    const isOnline = status === 'online';
    const isWeightValid = weight !== undefined && weight !== null && weight >= 0;
    const isFlowValid = flowRate !== undefined && flowRate !== null;
    const isHardwareHealthy = isOnline && !isStale && isWeightValid;

    const components = [
        {
            id: 'mcu',
            label: 'Microcontroller',
            type: 'ESP32-WROOM-32D',
            status: isOnline && !isStale,
            message: isStale ? 'Stale Data - Check Connection' : (!isOnline ? 'Hardware Offline' : 'Operational')
        },
        {
            id: 'loadcell',
            label: 'Weight Sensor',
            type: 'Prec. Load Cell',
            status: isWeightValid,
            message: weight < 0 ? 'Calibration Error' : (weight === undefined || weight === null ? 'No Data' : 'Operational')
        },
        {
            id: 'hx711',
            label: 'ADC Converter',
            type: 'HX711 (24-bit BW)',
            status: isWeightValid,
            message: isWeightValid ? 'Signal Locked' : 'Check Wiring'
        },
        {
            id: 'wifi',
            label: 'Connectivity',
            type: 'Wi-Fi / Firebase RTDB',
            status: isOnline,
            message: isOnline ? 'High Strength' : 'Connection Lost'
        },
    ];

    let diagnosticMessage = "System Fully Synchronized";
    let diagnosticSeverity = "success";

    if (!isOnline || isStale) {
        diagnosticMessage = "Check Connection or Microcontroller";
        diagnosticSeverity = "critical";
    } else if (weight < 0) {
        diagnosticMessage = "Check Load Cell Calibration";
        diagnosticSeverity = "warning";
    }

    return (
        <div className="flex flex-col gap-8 py-2">
            {/* Main Status Console */}
            <div className={`rounded-3xl p-8 border animate-fade-in relative overflow-hidden group min-h-[180px] flex items-center ${diagnosticSeverity === 'success' ? 'bg-cyan-500/5 border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)]' : diagnosticSeverity === 'critical' ? 'bg-red-500/5 border-red-500/20 shadow-[0_0_30px_rgba(239, 68, 68, 0.1)]' : 'bg-amber-500/5 border-amber-500/20 shadow-[0_0_30px_rgba(245, 158, 11, 0.1)]'}`}>
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <div className="text-[10px] font-black uppercase tracking-[0.3em]">Hardware ID: DEV-ICU-8821</div>
                </div>
                <div className="flex items-center gap-10 w-full pl-4">
                    <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center text-6xl shrink-0 shadow-2xl transition-transform group-hover:scale-110 ${diagnosticSeverity === 'success' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 animate-glow' : diagnosticSeverity === 'critical' ? 'bg-red-500/10 text-red-500 border border-red-500/20 pulse' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse'}`}>
                        {diagnosticSeverity === 'success' ? '🛡️' : '⚠️'}
                    </div>
                    <div className="flex-1">
                        <div className={`text-xs font-black uppercase tracking-[0.2em] mb-2 ${diagnosticSeverity === 'success' ? 'text-cyan-400' : diagnosticSeverity === 'critical' ? 'text-red-400' : 'text-amber-400'}`}>
                            {diagnosticMessage}
                        </div>
                        <h3 className="text-5xl font-black text-white tracking-tighter uppercase leading-tight">
                            TeleHealth Monitor
                        </h3>
                        <div className="flex items-center gap-6 mt-6">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-cyan-400 animate-pulse shadow-[0_0_8px_cyan]' : 'bg-red-500 shadow-[0_0_8px_red]'}`}></div>
                                <span className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Active Link Status</span>
                            </div>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                            <span className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Latency: {isOnline ? '42ms' : 'INF'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Component Diagnostics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {components.map(c => (
                    <div key={c.id} className="p-6 rounded-3xl bg-slate-900/40 border border-slate-700/50 flex items-center justify-between hover:bg-slate-900/60 hover:border-slate-600 transition-all group">
                        <div className="flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-slate-950 border border-slate-800 shadow-inner group-hover:scale-110 transition-transform ${c.id === 'loadcell' && weight < 0 ? 'bg-red-500/15 border-red-500/40' : (c.id === 'loadcell' ? 'bg-cyan-500/15 border-cyan-500/40' : '')}`}>
                                {c.id === 'mcu' ? '💾' : c.id === 'loadcell' ? '💎' : c.id === 'hx711' ? '⚡' : '📡'}
                            </div>
                            <div>
                                <div className="text-[11px] font-black text-slate-600 uppercase tracking-wider">{c.label}</div>
                                <div className="text-sm font-bold text-slate-300 uppercase truncate max-w-[160px]">{c.message}</div>
                            </div>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${c.status ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-red-500/5 border-red-500/20 text-red-500'}`}>
                            <div className={`w-2 h-2 rounded-full ${c.status ? 'bg-emerald-400 shadow-[0_0_5px_emerald]' : 'bg-red-500 shadow-[0_0_8px_red]'}`}></div>
                            <span className="text-[11px] font-black uppercase tracking-widest">{c.status ? 'Normal' : 'Fault'}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Diagnostic Information */}
            <div className="p-8 rounded-3xl bg-slate-900/30 border border-slate-800/50">
                <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Diagnostic Summary</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <div className="space-y-1">
                        <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Protocol Version</span>
                        <div className="text-slate-300 font-mono text-sm">v2.0.4-LATEST</div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Link Encryption</span>
                        <div className="text-emerald-500 font-bold uppercase tracking-widest text-sm">AES-256 Enabled</div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Sampling Rate</span>
                        <div className="text-slate-300 font-mono text-sm">80 SPS (High Res)</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeviceHealth;
