"use client";

import { useEffect, useState } from 'react';
import { CortexSimulator, SystemState, LogEntry, Packet } from '../lib/simulation';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Shield, Activity } from 'lucide-react';
import { MetricCard } from '@/components/MetricCard';
import { ControlPanel } from '@/components/ControlPanel';
import { NetworkLog } from '@/components/NetworkLog';

export default function Dashboard() {
    const [sim] = useState(() => new CortexSimulator());
    const [state, setState] = useState<SystemState | null>(null);
    const [history, setHistory] = useState<{ time: number, cpu: number, entropy: number }[]>([]);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [packets, setPackets] = useState<Packet[]>([]);

    // Simulation Loop
    useEffect(() => {
        const interval = setInterval(() => {
            const newState = sim.tick();
            setState(newState);

            setHistory(prev => {
                const next = [...prev, { time: Date.now(), cpu: newState.cpu, entropy: newState.entropy * 100 }];
                if (next.length > 30) next.shift();
                return next;
            });

            setPackets(prev => [newState.network_traffic[0], ...prev].slice(0, 10));

            if (newState.status === 'CRITICAL' && Math.random() > 0.8) {
                addLog('CRIT', `HELIX DETECTED ANOMALY: ${newState.cpu.toFixed(1)}% LOAD`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [sim]);

    const addLog = (level: 'INFO' | 'WARN' | 'CRIT' | 'SYS', msg: string) => {
        setLogs(prev => [{
            id: Math.random().toString(),
            timestamp: new Date().toLocaleTimeString(),
            level,
            message: msg
        }, ...prev].slice(0, 30));
    };

    const handleAttack = (type: 'CRYPTOMINER' | 'RANSOMWARE' | 'DDOS') => {
        const msg = sim.injectAttack(type);
        addLog('WARN', msg);
    };

    const handleDefense = () => {
        const msg = sim.countermeasure();
        addLog('SYS', msg);
    };

    const handleAnalyze = async () => {
        if (!state) return;
        addLog('INFO', 'Initiating HELIX Neural Analysis...');

        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cpu: state.cpu,
                    entropy: state.entropy,
                    processes: state.processes,
                    attackType: state.cpu > 80 ? 'Suspected Mining' : state.entropy > 0.8 ? 'Data Exfiltration' : undefined,
                    logs: logs.slice(0, 5) // Context window
                })
            });

            const data = await res.json();

            if (res.ok && data.analysis) {
                addLog('SYS', `[AI] DIAGNOSIS: ${data.analysis}`);
                addLog('SYS', `[AI] ACTION: ${data.action}`);
            } else {
                addLog('WARN', `AI ERROR: ${data.details || data.error || "Unknown Failure"}`);
                if (data.code === 401) addLog('CRIT', 'INVALID API KEY. CHECK VERCEL SETTINGS.');
            }

        } catch (e) {
            console.error(e);
            addLog('WARN', 'Critical Failure: AI Uplink Unreachable.');
        }
    };

    if (!state) return <div className="bg-black h-screen w-full text-emerald-500 font-mono flex items-center justify-center animate-pulse">INITIALIZING HELIX CORE...</div>;

    return (
        <div className="min-h-screen bg-black text-slate-300 font-mono p-4 selection:bg-emerald-500 selection:text-black overflow-y-auto relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0a0a0f_0%,_#000_100%)] z-0 pointer-events-none" />
            <div className="scanlines" />

            <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-4 min-h-[95vh]">

                {/* HEADER */}
                <header className="flex justify-between items-center border-b border-white/10 pb-4 backdrop-blur-md sticky top-0 z-50 bg-black/50">
                    <div className="flex items-center gap-3">
                        <Shield className="w-8 h-8 text-emerald-400" />
                        <div>
                            <h1 className="text-2xl font-bold tracking-[0.2em] text-white font-display">HELIX</h1>
                            <div className="text-[10px] text-emerald-500 tracking-widest uppercase">Autonomous Cyber Immune System</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className={`px-4 py-1 border ${state.status === 'SECURE' ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'border-red-500 text-red-500 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.4)]'} transition-all duration-300 font-bold tracking-widest`}>
                            {state.status}
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-12 gap-4 flex-1">

                    {/* LEFT: METRICS & CONTROLS */}
                    <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
                        <MetricCard type="CPU" value={state.cpu} label="CORE LOAD" />
                        <MetricCard type="ENTROPY" value={state.entropy} label="DATA ENTROPY" sublabel="Shannon Index (0-1)" />
                        <ControlPanel onAttack={handleAttack} onDefense={handleDefense} onAnalyze={handleAnalyze} />
                    </div>

                    {/* CENTER: VISUALIZATION */}
                    <div className="col-span-12 md:col-span-6 flex flex-col gap-4">
                        {/* MAIN CHART */}
                        <div className="h-[300px] border border-white/10 bg-white/5 p-4 relative overflow-hidden backdrop-blur-sm">
                            <div className="absolute top-2 left-4 text-xs text-emerald-500/50 flex items-center gap-2 font-bold tracking-wider">
                                <Activity size={12} />
                                REAL-TIME THREAT SIGNATURE
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={history}>
                                    <defs>
                                        <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="time" hide />
                                    <YAxis domain={[0, 100]} hide />
                                    <Area type="monotone" dataKey="cpu" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" isAnimationActive={false} />
                                    <Line type="step" dataKey="entropy" stroke="#ec4899" strokeWidth={2} dot={false} isAnimationActive={false} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* PROCESS LIST */}
                        <div className="flex-1 min-h-[300px] border border-white/10 bg-white/5 p-4 overflow-hidden backdrop-blur-sm">
                            <div className="text-xs text-slate-500 mb-2 font-bold tracking-wider">LIVE PROCESS MONITOR</div>
                            <table className="w-full text-xs font-mono">
                                <thead className="text-slate-600 border-b border-white/5">
                                    <tr>
                                        <th className="text-left pb-2">PID</th>
                                        <th className="text-left pb-2">PROCESS</th>
                                        <th className="text-left pb-2">USER</th>
                                        <th className="text-right pb-2">CPU</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {state.processes.map(p => (
                                        <tr key={p.pid} className={p.cpu > 50 ? 'text-pink-500 animate-pulse font-bold' : 'text-slate-400'}>
                                            <td className="py-1">{p.pid}</td>
                                            <td>{p.name}</td>
                                            <td>{p.user}</td>
                                            <td className="text-right">{p.cpu.toFixed(1)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* RIGHT: LOGS & NETWORK */}
                    <NetworkLog packets={packets} logs={logs} />

                </div>
            </div>
        </div>
    );
}
