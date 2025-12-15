export type SystemState = {
    cpu: number;
    ram: number;
    entropy: number;
    integrity: number;
    processes: Process[];
    network_traffic: Packet[];
    logs: LogEntry[];
    status: 'SECURE' | 'WARNING' | 'CRITICAL';
};

export type Process = {
    pid: number;
    name: string;
    user: string;
    cpu: number;
    status: 'running' | 'sleeping' | 'zombie';
};

export type Packet = {
    id: string;
    timestamp: string;
    src: string;
    dst: string;
    proto: string;
    hex: string;
};

export type LogEntry = {
    id: string;
    timestamp: string;
    level: 'INFO' | 'WARN' | 'CRIT' | 'SYS';
    message: string;
};

export class CortexSimulator {
    private cpuHistory: number[] = Array(60).fill(5);
    private entropyHistory: number[] = Array(60).fill(0.2);
    private activeAttack: 'NONE' | 'CRYPTOMINER' | 'RANSOMWARE' | 'DDOS' = 'NONE';
    private processes: Process[] = [
        { pid: 101, name: 'kernel_task', user: 'root', cpu: 0.5, status: 'running' },
        { pid: 452, name: 'networkd', user: 'root', cpu: 0.2, status: 'sleeping' },
        { pid: 885, name: 'cortex_daemon', user: 'admin', cpu: 1.2, status: 'running' },
        { pid: 1102, name: 'docker_engine', user: 'root', cpu: 2.5, status: 'running' }
    ];

    public tick(): SystemState {
        // 1. Physics Engine
        let cpuBase = this.cpuHistory[this.cpuHistory.length - 1];
        let entropyBase = 0.2;
        let integrity = 100;

        // Random Noise
        cpuBase += (Math.random() - 0.5) * 5;
        cpuBase = Math.max(2, Math.min(10, cpuBase)); // Idle state

        // Attack Dynamics
        if (this.activeAttack === 'CRYPTOMINER') {
            cpuBase = 85 + (Math.sin(Date.now() / 500) * 10);
            entropyBase = 0.6;
            integrity = 65;
        } else if (this.activeAttack === 'RANSOMWARE') {
            cpuBase = 60 + (Math.random() * 20);
            entropyBase = 0.95 + (Math.random() * 0.05); // High entropy
            integrity = 40;
        } else if (this.activeAttack === 'DDOS') {
            cpuBase = 95 + (Math.random() * 5);
            integrity = 50;
        }

        this.cpuHistory.push(cpuBase);
        this.cpuHistory.shift();

        // Status Logic
        let status: 'SECURE' | 'WARNING' | 'CRITICAL' = 'SECURE';
        if (cpuBase > 50) status = 'WARNING';
        if (cpuBase > 80 || entropyBase > 0.8) status = 'CRITICAL';

        return {
            cpu: cpuBase,
            ram: 15 + (cpuBase * 0.2), // Correlated RAM
            entropy: entropyBase,
            integrity: integrity,
            processes: this._updateProcesses(cpuBase),
            network_traffic: [this._generatePacket()],
            logs: [],
            status: status
        };
    }

    public injectAttack(type: 'CRYPTOMINER' | 'RANSOMWARE' | 'DDOS') {
        this.activeAttack = type;
        return `[INJECT] Initiating ${type} sequence...`;
    }

    public countermeasure() {
        this.activeAttack = 'NONE';
        this.cpuHistory = Array(60).fill(5);
        return `[DEFENSE] Threat neutralized. System re-imaged.`;
    }

    private _updateProcesses(cpuLoad: number): Process[] {
        const procs = [...this.processes];
        if (this.activeAttack === 'CRYPTOMINER') {
            if (!procs.find(p => p.name === 'xmrig')) {
                procs.unshift({ pid: 6666, name: 'xmrig', user: 'www-data', cpu: cpuLoad - 5, status: 'running' });
            } else {
                procs.find(p => p.name === 'xmrig')!.cpu = cpuLoad - 5;
            }
        }
        return procs.sort((a, b) => b.cpu - a.cpu).slice(0, 6);
    }

    private _generatePacket(): Packet {
        const protos = ['TCP', 'UDP', 'TLSv1.3', 'HTTP/2'];
        const ips = ['192.168.1.5', '10.0.0.8', '172.16.0.4'];
        const hex = Array(8).fill(0).map(() => Math.floor(Math.random() * 255).toString(16).padStart(2, '0').toUpperCase()).join(' ');

        return {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toLocaleTimeString(),
            src: ips[Math.floor(Math.random() * ips.length)],
            dst: 'SERVER',
            proto: protos[Math.floor(Math.random() * protos.length)],
            hex: hex
        };
    }
}
