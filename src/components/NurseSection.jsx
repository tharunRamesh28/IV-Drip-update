import React, { useState } from 'react';

function NurseSection({ nurse, ivLevel, onAssign }) {
    const [isAssigning, setIsAssigning] = useState(false);
    const [name, setName] = useState('');
    const [shift, setShift] = useState('Day');

    const handleAssign = (e) => {
        e.preventDefault();
        onAssign({ name, shift, id: 'NR-2024-' + Math.floor(Math.random() * 900 + 100) });
        setIsAssigning(false);
        setName('');
    };

    if (isAssigning) {
        return (
            <div className="flex flex-col gap-6 animate-fade-in py-2">
                <form onSubmit={handleAssign} className="space-y-6">
                    <div className="space-y-4">
                        <div className="p-4 rounded-3xl bg-slate-900/40 border border-slate-700/50 flex items-center gap-4 group focus-within:border-cyan-500/50 transition-all">
                            <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">👩‍⚕️</span>
                            <input
                                type="text"
                                placeholder="Enter Clinical Provider Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-sm font-bold text-white placeholder:text-slate-600 tracking-tighter"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {['Day Shift', 'Night Shift'].map((s) => (
                                <div key={s}
                                    onClick={() => setShift(s)}
                                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-center gap-3 ${shift === s ? 'bg-cyan-500/10 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'bg-slate-900/40 border-slate-700/50 text-slate-500 hover:border-slate-500'}`}>
                                    <div className={`w-2 h-2 rounded-full ${shift === s ? 'bg-cyan-400 animate-pulse shadow-[0_0_8px_cyan]' : 'bg-slate-700'}`}></div>
                                    <span className="text-[10px] uppercase font-black tracking-widest">{s}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button type="submit" className="flex-1 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-cyan-900/20 active:scale-95 transition-all">Assign Clinical Duty</button>
                        <button type="button" onClick={() => setIsAssigning(false)} className="px-6 py-4 bg-slate-800 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-slate-700/50 hover:bg-slate-700 hover:text-white transition-all">Cancel</button>
                    </div>
                </form>
            </div>
        );
    }

    if (!nurse) {
        return (
            <div className="flex flex-col items-center justify-center gap-6 py-10 opacity-60 group cursor-pointer" onClick={() => setIsAssigning(true)}>
                <div className="w-20 h-20 rounded-[30%] bg-slate-900 border-2 border-dashed border-slate-700 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:bg-slate-800 group-hover:border-slate-500 transition-all duration-300">
                    🧑‍⚕️
                </div>
                <div className="text-center">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">No Duty Assigned</div>
                    <div className="text-xs text-slate-600 font-bold uppercase tracking-widest group-hover:text-cyan-400 transition-colors">Assign Active Clinical Staff Now</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 animate-fade-in py-2">
            <div className="flex items-center gap-5 group">
                <div className="w-16 h-16 rounded-[24px] bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-4xl shadow-2xl group-hover:rotate-6 group-hover:scale-105 transition-all duration-300">
                    👩‍⚕️
                </div>
                <div className="flex-1">
                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Assigned Clinical Specialist</div>
                    <h3 className="text-2xl font-black text-white tracking-tighter uppercase leading-none truncate">{nurse.name}</h3>
                    <div className="flex items-center gap-3 mt-3">
                        <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-black text-cyan-400 tracking-widest uppercase">{nurse.shift} SHIFT</span>
                        <span className="text-[9px] font-bold text-slate-600 tracking-widest uppercase">ID: {nurse.id}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-3xl bg-slate-900/40 border border-slate-700/50 flex flex-col gap-1 group hover:border-emerald-500/30 transition-all">
                    <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Duty Status</div>
                    <div className="text-xs font-black text-emerald-400 uppercase flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"></div>
                        Active Duty
                    </div>
                </div>
                <div className="p-5 rounded-3xl bg-slate-900/40 border border-slate-700/50 flex flex-col gap-1 group hover:border-cyan-500/30 transition-all">
                    <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Protocol Type</div>
                    <div className="text-xs font-black text-slate-300 uppercase">IV Observation</div>
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    className="flex-1 py-4 bg-slate-900/50 hover:bg-slate-800 text-slate-500 hover:text-white rounded-2xl font-black text-[9px] uppercase tracking-widest border border-slate-700 transition-all"
                    onClick={() => setIsAssigning(true)}
                >
                    Change Provider Duty
                </button>
            </div>
        </div>
    );
}

export default NurseSection;
