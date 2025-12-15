interface ControlPanelProps {
    onAttack: (type: 'CRYPTOMINER' | 'RANSOMWARE' | 'DDOS') => void;
    onDefense: () => void;
    onAnalyze: () => void;
}

export function ControlPanel({ onAttack, onDefense, onAnalyze }: ControlPanelProps) {
    return (
        <div className="flex-1 border border-white/10 bg-white/5 p-4 flex flex-col gap-2">
            <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Simulate Threat Vector</div>

            <button
                onClick={() => onAnalyze()}
                className="mb-4 p-3 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 transition-colors text-left text-sm font-bold flex items-center gap-2"
            >
                🧠 AI THREAT ANALYSIS
            </button>

            <AttackButton label="⚡ EXECUTE: MINER" onClick={() => onAttack('CRYPTOMINER')} />
            <AttackButton label="🔒 EXECUTE: RANSOMWARE" onClick={() => onAttack('RANSOMWARE')} />
            <AttackButton label="🌊 EXECUTE: DDoS" onClick={() => onAttack('DDOS')} />

            <div className="flex-1" />

            <button
                onClick={onDefense}
                className="p-4 bg-cyan-500/10 border border-cyan-400 text-cyan-400 font-bold hover:bg-cyan-400 hover:text-black transition-all uppercase tracking-widest text-center shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
                INITIATE COUNTERMEASURES
            </button>
        </div>
    );
}

function AttackButton({ label, onClick }: { label: string, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="p-3 border border-pink-500/50 text-pink-400 hover:bg-pink-500/10 transition-colors text-left text-sm font-bold active:bg-pink-500/20"
        >
            {label}
        </button>
    );
}
