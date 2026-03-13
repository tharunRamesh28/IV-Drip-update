import React from 'react';

function FlowRateCard({ flowRate, dropsPerMin }) {
    const isFlowing = flowRate > 0;

    return (
        <div className="flex flex-col gap-8 py-2">
            <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-3xl bg-slate-900/40 border border-slate-700/50 flex flex-col gap-1 items-center justify-center transition-all hover:bg-slate-900/60 group">
                    <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Flow Velocity</div>
                    <div className="text-4xl font-black text-white tracking-tighter tabular-nums">
                        {flowRate.toFixed(1)} <span className="text-xs text-slate-500 font-bold">ML/M</span>
                    </div>
                </div>
                <div className="p-5 rounded-3xl bg-slate-900/40 border border-slate-700/50 flex flex-col gap-1 items-center justify-center transition-all hover:bg-slate-900/60 group">
                    <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Drip Rhythm</div>
                    <div className="text-4xl font-black text-white tracking-tighter tabular-nums">
                        {Math.round(dropsPerMin)} <span className="text-xs text-slate-500 font-bold">DP/M</span>
                    </div>
                </div>
            </div>

            {/* ── 3D Telemetry Wave Profile ── */}
            <div className="relative h-24 w-full rounded-2xl bg-slate-950 overflow-hidden border border-slate-800 shadow-inner group">
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent"></div>

                {/* ── Layered 3D Wave SVGs ── */}
                <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                    {/* Background Wave */}
                    <path
                        className={isFlowing ? "animate-wave-slow" : ""}
                        d="M0 60 Q100 40 200 60 T400 60 V100 H0 Z"
                        fill="rgba(6, 182, 212, 0.1)"
                    />
                    {/* Middle Wave */}
                    <path
                        className={isFlowing ? "animate-wave-mid" : ""}
                        d="M0 70 Q100 50 200 70 T400 70 V100 H0 Z"
                        fill="rgba(6, 182, 212, 0.2)"
                    />
                    {/* Foreground Wave - 3D Accent */}
                    <path
                        className={isFlowing ? "animate-wave-fast" : ""}
                        d="M0 80 Q100 60 200 80 T400 80 V100 H0 Z"
                        fill="rgba(6, 182, 212, 0.4)"
                    />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/50 backdrop-blur-sm shadow-xl">
                        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em]">Telemetry Wave Profile</span>
                    </div>
                </div>
            </div>

            <div className={`p-4 rounded-2xl border transition-all duration-500 flex items-center gap-4 ${isFlowing ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-900/20 border-slate-800'}`}>
                <div className={`w-3 h-3 rounded-full ${isFlowing ? 'bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]' : 'bg-slate-700'}`}></div>
                <div className="flex-1">
                    <div className={`text-[10px] font-black uppercase tracking-widest ${isFlowing ? 'text-emerald-400' : 'text-slate-600'}`}>
                        {isFlowing ? 'Active Fluid Delivery' : 'Inert State Detected'}
                    </div>
                    <div className="text-[11px] text-slate-500 font-bold leading-tight">
                        {isFlowing ? 'Drip delivery speed consistent with ICU standards.' : 'Protocol standby: checking line pressure...'}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FlowRateCard;
