import { Terminal, Wifi } from 'lucide-react';
import { LogEntry, Packet } from '../lib/simulation';
import { useRef, useEffect } from 'react';

interface NetworkLogProps {
    packets: Packet[];
    logs: LogEntry[];
}

export function NetworkLog({ packets, logs }: NetworkLogProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            // Optional: Auto-scroll logic if desired, but logs usually append to top in this UI
        }
    }, [logs]);

    return (
        <div className="col-span-12 md:col-span-3 flex flex-col gap-4 h-full">
            {/* NETWORK TAP */}
            <div className="h-1/3 border border-white/10 bg-black p-2 font-mono text-[10px] overflow-hidden opacity-90 relative">
                <div className="text-cyan-500 mb-2 flex items-center gap-2 border-b border-white/10 pb-1 sticky top-0 bg-black z-10">
                    <Wifi size={10} /> NETWORK TAP (eth0)
                </div>
                <div className="flex flex-col gap-1">
                    {packets.map(pkt => (
                        <div key={pkt.id} className="border-b border-white/5 pb-1 last:border-0 animate-in slide-in-from-right-2 duration-300">
                            <div className="flex justify-between text-slate-500">
                                <span>{pkt.timestamp}</span>
                                <span className="text-yellow-500/80">{pkt.proto}</span>
                            </div>
                            <div className="text-cyan-900/80 truncate font-mono">{pkt.hex}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* SYSTEM LOGS */}
            <div className="flex-1 border border-white/10 bg-black p-3 font-mono text-xs overflow-hidden flex flex-col">
                <div className="text-slate-500 mb-2 flex items-center gap-2 border-b border-white/10 pb-1"><Terminal size={12} /> SYSTEM LOGS</div>
                <div className="flex-1 overflow-y-auto flex flex-col gap-1 pr-1 scrollbar-thin scrollbar-thumb-gray-800" ref={scrollRef}>
                    {logs.map(log => (
                        <div key={log.id} className="border-l-2 pl-2 border-white/10 hover:bg-white/5 p-1 transition-colors animate-in fade-in duration-300">
                            <span className="text-slate-600 text-[10px] mr-2 block">{log.timestamp}</span>
                            <div className="flex items-start gap-2">
                                <span className={`font-bold text-[10px] ${log.level === 'CRIT' ? 'text-red-500 bg-red-950/30 px-1 rounded' :
                                        log.level === 'WARN' ? 'text-yellow-500' :
                                            log.level === 'SYS' ? 'text-cyan-500' : 'text-slate-400'
                                    }`}>
                                    [{log.level}]
                                </span>
                                <span className={`text-sm ${log.level === 'CRIT' ? 'text-white' : 'text-slate-300'}`}>{log.message}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
