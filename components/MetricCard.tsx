import { Cpu, Lock } from 'lucide-react';

interface MetricCardProps {
    type: 'CPU' | 'ENTROPY';
    value: number;
    label: string;
    sublabel?: string;
}

export function MetricCard({ type, value, label, sublabel }: MetricCardProps) {
    const isCritical = type === 'CPU' ? value > 80 : value > 0.8;
    const colorClass = isCritical ? 'text-red-500' : 'text-white';
    const displayValue = type === 'CPU' ? value.toFixed(1) + '%' : value.toFixed(3);

    return (
        <div className={`p-4 border ${isCritical ? 'border-red-500 bg-red-950/10' : 'border-white/10 bg-white/5'} transition-colors duration-300`}>
            <div className="flex justify-between mb-2 text-xs text-slate-500">
                <span>{label}</span>
                {type === 'CPU' ? <Cpu className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <div className={`text-4xl font-bold font-display ${colorClass}`}>
                {displayValue}
            </div>
            {type === 'CPU' && (
                <div className="h-1 w-full bg-white/10 mt-2">
                    <div
                        className={`h-full transition-all duration-300 ${isCritical ? 'bg-red-500' : 'bg-cyan-400'}`}
                        style={{ width: `${value}%` }}
                    />
                </div>
            )}
            {sublabel && <div className="text-xs text-slate-600 mt-1">{sublabel}</div>}
        </div>
    );
}
