import React from 'react';

function PatientCard({ patient }) {
    if (!patient) return null;

    return (
        <div className="flex flex-col gap-6 py-2">
            <div className="flex items-center gap-4 border-b border-slate-700/50 pb-6 mb-2 group">
                <div className="w-14 h-14 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl shadow-inner group-hover:bg-slate-700 group-hover:scale-105 transition-all duration-300">
                    🧑‍⚕️
                </div>
                <div>
                    <h3 className="text-xl font-black text-white tracking-tighter uppercase leading-none">{patient.name}</h3>
                    <div className="flex items-center gap-2 mt-1.5 opacity-60 font-bold uppercase tracking-widest text-[9px]">
                        <span className="text-emerald-400">Stable</span>
                        <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                        <span className="text-white">Bed #{patient.bed}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                        <span className="text-cyan-400">ID: {patient.id}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {[
                    { label: "Assigned Physician", value: patient.doctor, icon: "👨‍⚕️" },
                    { label: "Admitted Diagnosis", value: patient.diagnosis, icon: "🩺" },
                    { label: "Intravenous Fluid", value: patient.ivType, icon: "💧" },
                    { label: "Date Admitted", value: patient.since, icon: "📅" }
                ].map(item => (
                    <div key={item.label} className="p-4 rounded-3xl bg-slate-900/40 border border-slate-700/50 flex flex-col gap-1 transition-all hover:bg-slate-900/60 hover:border-slate-600/50 group">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs group-hover:scale-110 transition-transform">{item.icon}</span>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
                        </div>
                        <div className="text-xs font-bold text-slate-300 leading-tight truncate">{item.value}</div>
                    </div>
                ))}
            </div>

            <div className="mt-4 p-5 rounded-3xl bg-slate-800/20 border border-slate-700/30">
                <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-3">Monitoring Protocol</div>
                <div className="space-y-2">
                    {[
                        { l: "Fluid Vol", v: "500 mL Continuous" },
                        { l: "Interval", v: "Every 4 Hours" },
                        { l: "Telemetry", v: "Smart ESP32 Live" }
                    ].map(x => (
                        <div key={x.l} className="flex justify-between items-center text-[10px] uppercase font-bold tracking-tight">
                            <span className="text-slate-500">{x.l}</span>
                            <span className="text-slate-400 opacity-80">{x.v}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PatientCard;
