import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import {
    Activity,
    Wind,
    Thermometer,
    AlertTriangle,
    TrendingUp,
    Heart,
    ShieldAlert,
    Zap,
    Info
} from 'lucide-react';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

function PatientHealthIntelligence({ patient, ivLevel }) {
    // State for simulated data
    const [vitals, setVitals] = useState({
        heartRate: 85,
        spO2: 98,
        temperature: 37.0,
        timestamp: Date.now()
    });

    // History for charts (Past, Current, Predicted)
    const [history, setHistory] = useState({
        heartRate: Array(10).fill(85),
        spO2: Array(10).fill(98),
        temperature: Array(10).fill(37.0)
    });

    const [alerts, setAlerts] = useState([
        { id: 1, type: 'info', title: 'System Online', message: 'Intelligence monitoring activated for Bed #' + patient.bed, time: 'Just now' }
    ]);

    // Simulation Logic
    useEffect(() => {
        const interval = setInterval(() => {
            setVitals(prev => {
                // Random but realistic fluctuations
                const hr = Math.max(60, Math.min(130, prev.heartRate + (Math.random() - 0.5) * 4));
                const spo2 = Math.max(85, Math.min(100, prev.spO2 + (Math.random() - 0.5) * 1));
                const temp = Math.max(36.0, Math.min(39.0, prev.temperature + (Math.random() - 0.5) * 0.2));

                // Update history
                setHistory(h => ({
                    heartRate: [...h.heartRate.slice(1), hr],
                    spO2: [...h.spO2.slice(1), spo2],
                    temperature: [...h.temperature.slice(1), temp]
                }));

                // AI Alert Simulation logic
                checkAlerts(hr, spo2, temp, ivLevel);

                return {
                    heartRate: Math.round(hr),
                    spO2: Math.round(spo2),
                    temperature: Math.round(temp * 10) / 10,
                    timestamp: Date.now()
                };
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [ivLevel, patient.bed]);

    const checkAlerts = (hr, spo2, temp, iv) => {
        const newAlerts = [];
        if (spo2 < 92) newAlerts.push({ id: Date.now(), type: 'critical', title: 'Oxygen saturation dropping', message: `Critical SpO2 level detected: ${Math.round(spo2)}%`, time: 'Now' });
        if (hr > 110) newAlerts.push({ id: Date.now() + 1, type: 'warning', title: 'Possible respiratory distress', message: `High heart rate detected: ${Math.round(hr)} BPM`, time: 'Now' });
        if (temp > 38) newAlerts.push({ id: Date.now() + 2, type: 'warning', title: 'Patient fever trend increasing', message: `Body temperature elevation: ${temp.toFixed(1)}°C`, time: 'Now' });
        if (iv < 50 && iv > 0) newAlerts.push({ id: Date.now() + 3, type: 'critical', title: 'IV drip almost empty', message: `Refill required immediately: ${iv} mL left`, time: 'Now' });

        if (newAlerts.length > 0) {
            setAlerts(prev => [...newAlerts, ...prev].slice(0, 5));
        }
    };

    // Rule 1: Health Condition Detection
    const getCondition = () => {
        const { heartRate, spO2, temperature } = vitals;
        let status = 'NORMAL';
        let color = 'var(--success)'; // Green

        const isHrWarning = heartRate > 100 && heartRate <= 120;
        const isHrCritical = heartRate > 120;
        const isSpo2Warning = spO2 >= 90 && spO2 <= 94;
        const isSpo2Critical = spO2 < 90;
        const isTempWarning = temperature > 37.5 && temperature <= 38.5;
        const isTempCritical = temperature > 38.5;

        if (isHrCritical || isSpo2Critical || isTempCritical) {
            status = 'CRITICAL';
            color = '#ef4444'; // Red
        } else if (isHrWarning || isSpo2Warning || isTempWarning) {
            status = 'WARNING';
            color = '#f59e0b'; // Yellow
        }

        return { status, color };
    };

    // Rule 2: Patient Risk Score
    const calculateRiskScore = () => {
        let score = 0;
        if (vitals.spO2 < 92) score += 4;
        if (vitals.heartRate > 110) score += 3;
        if (vitals.temperature > 38) score += 2;
        if (ivLevel < 50) score += 1;

        let condition = 'LOW RISK';
        if (score >= 7) condition = 'HIGH RISK';
        else if (score >= 4) condition = 'MODERATE RISK';

        return { score, condition };
    };

    const condition = getCondition();
    const risk = calculateRiskScore();

    // Rule 3: Vital Trend Prediction
    const getChartData = (label, data, color) => {
        const current = data[data.length - 1];
        // Simple prediction: add some trend-based randomness
        const predicted = current + (data[data.length - 1] - data[data.length - 2] || 0) + (Math.random() - 0.5) * 2;

        return {
            labels: [...Array(10).keys()].map(i => i < 9 ? `-${9 - i}s` : 'Now').concat(['+3s']),
            datasets: [
                {
                    label: label,
                    data: [...data, predicted],
                    borderColor: color,
                    backgroundColor: color + '20',
                    fill: true,
                    tension: 0.4,
                    pointRadius: (context) => context.dataIndex === 10 ? 8 : 4,
                    pointBackgroundColor: (context) => context.dataIndex === 10 ? '#fff' : color,
                    borderDash: (context) => context.dataIndex >= 9 ? [5, 5] : [],
                }
            ]
        };
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', font: { size: 10 } } },
            x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 10 } } }
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: (context) => {
                        if (context.dataIndex === 10) return `Predicted: ${context.raw.toFixed(1)}`;
                        return `${label}: ${context.raw.toFixed(1)}`;
                    }
                }
            }
        },
        animation: { duration: 1000 }
    };

    return (
        <div className="space-y-6 intelligence-page animate-fade-in">
            {/* Top Section: Health Status and Risk Score */}
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-7">
                    <div className="card h-full flex flex-col justify-between p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Patient Health Status</h3>
                                <div className="text-3xl font-black text-white">{condition.status}</div>
                            </div>
                            <div
                                className="px-4 py-2 rounded-full border text-xs font-black tracking-widest animate-pulse"
                                style={{ borderColor: condition.color, color: condition.color, backgroundColor: condition.color + '10' }}
                            >
                                LIVE ANALYSIS
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6 py-4">
                            <div className="text-center">
                                <div className="text-[10px] text-slate-500 font-bold uppercase mb-2">Heart Rate</div>
                                <div className="text-2xl font-black text-white">{vitals.heartRate} <span className="text-[10px] text-slate-500">BPM</span></div>
                                <div className={`h-1.5 w-12 mx-auto mt-2 rounded-full ${vitals.heartRate > 120 ? 'bg-red-500' : vitals.heartRate > 100 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                            </div>
                            <div className="text-center">
                                <div className="text-[10px] text-slate-500 font-bold uppercase mb-2">SpO2</div>
                                <div className="text-2xl font-black text-white">{vitals.spO2} <span className="text-[10px] text-slate-500">%</span></div>
                                <div className={`h-1.5 w-12 mx-auto mt-2 rounded-full ${vitals.spO2 < 90 ? 'bg-red-500' : vitals.spO2 < 95 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                            </div>
                            <div className="text-center">
                                <div className="text-[10px] text-slate-500 font-bold uppercase mb-2">Temperature</div>
                                <div className="text-2xl font-black text-white">{vitals.temperature} <span className="text-[10px] text-slate-500">°C</span></div>
                                <div className={`h-1.5 w-12 mx-auto mt-2 rounded-full ${vitals.temperature > 38.5 ? 'bg-red-500' : vitals.temperature > 37.5 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                            </div>
                        </div>

                        <div className="mt-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-700/50 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl">ℹ️</div>
                            <div className="text-xs text-slate-400 leading-relaxed">
                                Conditions are evaluated based on real-time telemetry. <span className="text-slate-200">Critical values</span> will trigger immediate audible and visual alarms at the nurse station.
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-5">
                    <div className="card h-full p-6 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">Patient Risk Score</h3>

                            <div className="flex flex-col items-center">
                                <div className="relative w-40 h-40">
                                    <svg className="w-full h-full" viewBox="0 0 100 100">
                                        <circle
                                            cx="50" cy="50" r="45"
                                            fill="none" stroke="#1e293b" strokeWidth="8"
                                        />
                                        <circle
                                            cx="50" cy="50" r="45"
                                            fill="none"
                                            stroke={risk.score >= 7 ? '#ef4444' : risk.score >= 4 ? '#f59e0b' : '#06b6d4'}
                                            strokeWidth="8"
                                            strokeDasharray={`${(risk.score / 10) * 283} 283`}
                                            strokeLinecap="round"
                                            transform="rotate(-90 50 50)"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <div className="text-5xl font-black text-white">{risk.score}</div>
                                        <div className="text-[10px] font-bold text-slate-500 uppercase">/ 10 Score</div>
                                    </div>
                                </div>

                                <div className="mt-6 text-center">
                                    <div className={`text-sm font-black tracking-[0.2em] uppercase ${risk.score >= 7 ? 'text-red-500' : risk.score >= 4 ? 'text-yellow-500' : 'text-cyan-500'}`}>
                                        {risk.condition}
                                    </div>
                                    <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">Calculated by AI Engine</div>
                                </div>
                            </div>
                        </div>

                        {/* Background decoration */}
                        <div className="absolute -bottom-10 -right-10 opacity-5">
                            <ShieldAlert size={200} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Vitals Digital Panel and Trends */}
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <div className="card p-6">
                        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6 border-b border-slate-700/50 pb-4">Digital Status Panel</h3>
                        <div className="space-y-8">
                            <div className="flex items-center gap-6 group">
                                <div className={`status-icon-wrap ${vitals.heartRate > 100 ? 'critical animate-pulse-heart' : 'normal animate-pulse-heart'}`} style={{ animationDuration: `${60 / (vitals.heartRate || 60)}s` }}>
                                    <Heart className={`${vitals.heartRate > 100 ? 'fill-red-500' : 'fill-cyan-500'}`} size={24} />
                                </div>
                                <div className="flex-1">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase">Heart Rhythm</div>
                                    <div className="text-lg font-black text-white">{vitals.heartRate} BPM</div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-[10px] font-bold ${vitals.heartRate > 100 ? 'text-red-500' : 'text-cyan-500'}`}>
                                        {vitals.heartRate > 120 ? 'CRITICAL' : vitals.heartRate > 100 ? 'TACHYCARDIA' : 'SINUS'}
                                    </div>
                                </div>
                            </div>


                            <div className="flex items-center gap-6 group">
                                <div className={`status-icon-wrap ${vitals.spO2 < 95 ? 'warning' : 'normal'}`}>
                                    <Wind className={`${vitals.spO2 < 95 ? 'text-yellow-500' : 'text-cyan-500'}`} />
                                </div>
                                <div className="flex-1">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase">Oxygen Saturation</div>
                                    <div className="text-lg font-black text-white">{vitals.spO2}% SpO2</div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-[10px] font-bold ${vitals.spO2 < 95 ? 'text-yellow-500' : 'text-cyan-500'}`}>
                                        {vitals.spO2 < 90 ? 'HYPOXIA' : vitals.spO2 < 95 ? 'LOW' : 'OPTIMAL'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 group">
                                <div className={`status-icon-wrap ${vitals.temperature > 37.5 ? 'critical' : 'normal'}`}>
                                    <Thermometer className={`${vitals.temperature > 37.5 ? 'text-red-500' : 'text-cyan-500'}`} />
                                </div>
                                <div className="flex-1">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase">Body Core Temp</div>
                                    <div className="text-lg font-black text-white">{vitals.temperature}°C</div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-[10px] font-bold ${vitals.temperature > 37.5 ? 'text-red-500' : 'text-cyan-500'}`}>
                                        {vitals.temperature > 38.5 ? 'HIGH FEVER' : vitals.temperature > 37.5 ? 'FEBRILE' : 'NORMAL'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card p-6 overflow-hidden">
                        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6 flex justify-between">
                            AI Alert Simulation
                            <span className="text-[8px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400">ACTIVE</span>
                        </h3>
                        <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                            {alerts.map(alert => (
                                <div key={alert.id} className={`p-4 rounded-2xl border ${alert.type === 'critical' ? 'bg-red-500/10 border-red-500/30' : alert.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-slate-800/40 border-slate-700/50'} animate-slide-in`}>
                                    <div className="flex justify-between items-start mb-1">
                                        <div className={`text-[10px] font-black uppercase ${alert.type === 'critical' ? 'text-red-400' : alert.type === 'warning' ? 'text-yellow-400' : 'text-cyan-400'}`}>
                                            {alert.title}
                                        </div>
                                        <span className="text-[8px] text-slate-500">{alert.time}</span>
                                    </div>
                                    <div className="text-xs text-slate-300 font-medium">{alert.message}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="card p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h4 className="text-white text-sm font-bold">Heart Rate Trend</h4>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Past 30s + Predicted Next 3s</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-black text-white">{vitals.heartRate}</div>
                                    <div className="text-[8px] text-cyan-400 font-bold uppercase">BPM Current</div>
                                </div>
                            </div>
                            <div className="h-40">
                                <Line data={getChartData('Heart Rate', history.heartRate, '#06b6d4')} options={chartOptions} />
                            </div>
                            <div className="mt-4 grid grid-cols-3 gap-2">
                                <div className="p-2 rounded-xl bg-slate-900/50 border border-slate-700/50">
                                    <div className="text-[8px] text-slate-500 uppercase mb-1">Low</div>
                                    <div className="text-xs font-bold text-slate-300">{Math.min(...history.heartRate).toFixed(0)}</div>
                                </div>
                                <div className="p-2 rounded-xl bg-slate-900/50 border border-slate-700/50">
                                    <div className="text-[8px] text-slate-500 uppercase mb-1">High</div>
                                    <div className="text-xs font-bold text-slate-300">{Math.max(...history.heartRate).toFixed(0)}</div>
                                </div>
                                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                                    <div className="text-[8px] text-cyan-400 uppercase mb-1">Predicted</div>
                                    <div className="text-xs font-bold text-white">{(history.heartRate[9] + 2).toFixed(0)}</div>
                                </div>
                            </div>
                        </div>

                        <div className="card p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h4 className="text-white text-sm font-bold">SpO2 Trend</h4>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Past 30s + Predicted Next 3s</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-black text-white">{vitals.spO2}%</div>
                                    <div className="text-[8px] text-cyan-400 font-bold uppercase">SpO2 Current</div>
                                </div>
                            </div>
                            <div className="h-40">
                                <Line data={getChartData('SpO2', history.spO2, '#10b981')} options={chartOptions} />
                            </div>
                            <div className="mt-4 grid grid-cols-3 gap-2">
                                <div className="p-2 rounded-xl bg-slate-900/50 border border-slate-700/50">
                                    <div className="text-[8px] text-slate-500 uppercase mb-1">Min</div>
                                    <div className="text-xs font-bold text-slate-300">{Math.min(...history.spO2).toFixed(0)}%</div>
                                </div>
                                <div className="p-2 rounded-xl bg-slate-900/50 border border-slate-700/50">
                                    <div className="text-[8px] text-slate-500 uppercase mb-1">Max</div>
                                    <div className="text-xs font-bold text-slate-300">{Math.max(...history.spO2).toFixed(0)}%</div>
                                </div>
                                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                                    <div className="text-[8px] text-emerald-400 uppercase mb-1">Predicted</div>
                                    <div className="text-xs font-bold text-white">{(history.spO2[9] + (Math.random() - 0.5)).toFixed(1)}%</div>
                                </div>
                            </div>
                        </div>

                        <div className="card p-6 md:col-span-2">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h4 className="text-white text-sm font-bold">Body Temperature Trend</h4>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Past 30s + Predicted Next 3s</p>
                                </div>
                                <div className="text-right flex items-center gap-4">
                                    <div>
                                        <div className="text-xl font-black text-white">{vitals.temperature}°C</div>
                                        <div className="text-[8px] text-cyan-400 font-bold uppercase">Current</div>
                                    </div>
                                </div>
                            </div>
                            <div className="h-48">
                                <Line data={getChartData('Temperature', history.temperature, '#f59e0b')} options={chartOptions} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default PatientHealthIntelligence;
