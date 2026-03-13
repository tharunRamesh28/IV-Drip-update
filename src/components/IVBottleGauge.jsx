import React from 'react';

function IVBottleGauge({ level, maxLevel = 500 }) {
    const percentage = Math.min((level / maxLevel) * 100, 100);
    const isLow = percentage < 20;

    return (
        <div className="relative group w-48 h-72 flex items-center justify-center perspective-1000">
            {/* ── 3D Bottle Background Shadow ── */}
            <div className="absolute inset-0 bg-slate-900/20 blur-2xl rounded-full scale-110 -z-10 group-hover:bg-cyan-500/10 transition-all duration-700"></div>

            {/* ── Main Bottle Structure (3D Effect) ── */}
            <div className="relative w-28 h-56 rounded-[40px] border-4 border-slate-700/30 bg-white/5 backdrop-blur-md overflow-hidden shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] transform-gpu transition-all duration-500 hover:scale-105 hover:rotate-2">

                {/* ── Bottle Top/Neck ── */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-6 bg-slate-800/80 border-b-4 border-slate-700/50 rounded-b-xl"></div>

                {/* ── Fluid Layer ── */}
                <div
                    className="absolute bottom-0 left-0 w-full transition-all duration-1000 ease-in-out overflow-hidden"
                    style={{
                        height: `${percentage}%`,
                        background: isLow
                            ? 'linear-gradient(180deg, var(--critical) 0%, #7f1d1d 100%)'
                            : 'linear-gradient(180deg, var(--primary) 0%, var(--primary-dark) 100%)'
                    }}
                >
                    {/* ── High-Def 3D Waves ── */}
                    <div className="absolute top-[-10px] left-[-50%] w-[200%] h-12 animate-wave-fast opacity-50 bg-white/20 blur-sm rounded-[40%]"></div>
                    <div className="absolute top-[-15px] left-[-60%] w-[210%] h-14 animate-wave-slow opacity-30 bg-white/10 blur-sm rounded-[42%]"></div>

                    {/* ── Internal Bottle Lighting/Reflections ── */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-black/20 pointer-events-none"></div>
                </div>

                {/* ── Front Glass Reflections ── */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-10 left-4 w-1 h-32 bg-white/10 rounded-full blur-[1px]"></div>
                    <div className="absolute top-4 left-6 w-2 h-20 bg-white/5 rounded-full blur-[2px]"></div>
                </div>

                {/* ── Measurement Scale ── */}
                <div className="absolute inset-y-8 right-3 flex flex-col justify-between items-end opacity-20 group-hover:opacity-40 transition-opacity">
                    {[500, 400, 300, 200, 100, 0].map(val => (
                        <div key={val} className="flex items-center gap-1">
                            <span className="text-[6px] font-black text-white">{val}</span>
                            <div className="w-1.5 h-[1px] bg-white"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Bottom Value Label (Floating) ── */}
            <div className="absolute -bottom-10 flex flex-col items-center animate-fade-in">
                <div className={`text-4xl font-black tracking-tighter ${isLow ? 'text-red-500' : 'text-white'}`}>
                    {level}<span className="text-xs text-slate-500 ml-1 font-bold">ML</span>
                </div>
                <div className={`text-[9px] font-black uppercase tracking-widest mt-1 px-3 py-0.5 rounded-full border ${isLow ? 'border-red-500/50 text-red-400 bg-red-500/10' : 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5'}`}>
                    {isLow ? 'Low Resource' : 'Stable Volume'}
                </div>
            </div>
        </div>
    );
}

export default IVBottleGauge;
