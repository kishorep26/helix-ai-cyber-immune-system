interface ControlPanelProps {
    onAttack: (type: 'CRYPTOMINER' | 'RANSOMWARE' | 'DDOS') => void;
    onDefense: () => void;
    onAnalyze: () => void;
}

export function ControlPanel({ onAttack, onDefense, onAnalyze }: ControlPanelProps) {
    return (
        <div className="flex-1 border border-white/10 bg-white/5 p-4 flex flex-col gap-3 backdrop-blur-sm">
            <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-bold">Threat Simulation</div>

            <button
                onClick={() => onAnalyze()}
                className="cyber-btn mb-4 w-full p-3 bg-cyan-950/30 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all text-sm font-bold flex items-center justify-center gap-2 group"
            >
                <span className="group-hover:animate-pulse">🧠</span>
                NEURAL THREAT ANALYSIS
            </button>

            <div className="flex flex-col gap-2">
                <AttackButton label="⚡ INJECT: CRYPTOMINER" onClick={() => onAttack('CRYPTOMINER')} color="pink" />
                <AttackButton label="🔒 INJECT: RANSOMWARE" onClick={() => onAttack('RANSOMWARE')} color="purple" />
                <AttackButton label="🌊 INJECT: DDoS FLOOD" onClick={() => onAttack('DDOS')} color="blue" />
            </div>

            <div className="flex-1" />

            <button
                onClick={onDefense}
                className="cyber-btn w-full p-4 bg-emerald-950/30 border border-emerald-500/50 text-emerald-400 font-bold hover:bg-emerald-500/20 hover:border-emerald-400 hover:text-white transition-all uppercase tracking-widest text-center shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
            >
                INITIATE SENTINEL DEFENSE
            </button>
        </div>
    );
}

function AttackButton({ label, onClick, color }: { label: string, onClick: () => void, color: string }) {
    const colorClasses = {
        pink: "border-pink-500/30 text-pink-400 hover:bg-pink-500/10 hover:border-pink-500",
        purple: "border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500",
        blue: "border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500"
    };

    return (
        <button
            onClick={onClick}
            className={`cyber-btn w-full p-3 border ${colorClasses[color as keyof typeof colorClasses]} transition-all text-left text-sm font-bold active:scale-[0.98]`}
        >
            {label}
        </button>
    );
}
