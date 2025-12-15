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
    flag?: string;
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
        { pid: 885, name: 'helix_daemon', user: 'admin', cpu: 1.2, status: 'running' },
        { pid: 1102, name: 'docker_engine', user: 'root', cpu: 2.5, status: 'running' }
    ];

    public tick(): SystemState {
        // 1. Physics Engine
        let cpuBase = this.cpuHistory[this.cpuHistory.length - 1];
        let entropyBase = this.entropyHistory[this.entropyHistory.length - 1];
        let integrity = 100;

        // Recovery Logic (Self-Healing if no attack)
        if (this.activeAttack === 'NONE') {
            cpuBase += (Math.random() - 0.5) * 5;
            cpuBase = Math.max(2, Math.min(10, cpuBase));
            entropyBase += (Math.random() - 0.5) * 0.01;
            entropyBase = Math.max(0.1, Math.min(0.3, entropyBase));
        }

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
        this.entropyHistory.push(entropyBase);
        this.entropyHistory.shift();

        // Status Logic
        let status: 'SECURE' | 'WARNING' | 'CRITICAL' = 'SECURE';
        if (cpuBase > 50) status = 'WARNING';
        if (cpuBase > 80 || entropyBase > 0.8) status = 'CRITICAL';

        return {
            cpu: cpuBase,
            ram: 15 + (cpuBase * 0.2),
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
        return `[DEFENSE] HELIX Immune Response Triggered. Threat Neutralized.`;
    }

    private _updateProcesses(cpuLoad: number): Process[] {
        const procs = [...this.processes];

        // Dynamic Process Injection
        if (this.activeAttack === 'CRYPTOMINER') {
            this._upsertProcess(procs, { pid: 6666, name: 'xmrig-cuda', user: 'www-data', cpu: cpuLoad - 5, status: 'running' });
        } else if (this.activeAttack === 'RANSOMWARE') {
            this._upsertProcess(procs, { pid: 7712, name: 'encrypt_fs.py', user: 'root', cpu: cpuLoad - 15, status: 'running' });
            this._upsertProcess(procs, { pid: 7713, name: 'gpg --encrypt', user: 'root', cpu: 15.0, status: 'running' });
        } else if (this.activeAttack === 'DDOS') {
            this._upsertProcess(procs, { pid: 8899, name: 'syn_flood', user: 'nobody', cpu: cpuLoad - 2, status: 'running' });
        } else {
            // Remove malicious processes if secure
            return procs.filter(p => p.pid < 5000).sort((a, b) => b.cpu - a.cpu);
        }

        return procs.sort((a, b) => b.cpu - a.cpu).slice(0, 8);
    }

    private _upsertProcess(procs: Process[], newProc: Process) {
        const idx = procs.findIndex(p => p.pid === newProc.pid);
        if (idx >= 0) procs[idx] = newProc;
        else procs.push(newProc);
    }

    private _generatePacket(): Packet {
        // Realistic Traffic Patterns
        if (this.activeAttack === 'DDOS') {
            const ddosIps = ['192.168.1.105', '192.168.1.106', '10.5.0.2', '172.16.8.99'];
            return {
                id: Math.random().toString(36),
                timestamp: new Date().toLocaleTimeString(),
                src: ddosIps[Math.floor(Math.random() * ddosIps.length)],
                dst: 'SERVER:80',
                proto: 'TCP_SYN',
                hex: 'FLOOD ' + Math.random().toString(16).substr(2, 8).toUpperCase(),
                flag: 'Suspicious'
            };
        }

        if (this.activeAttack === 'CRYPTOMINER') {
            return {
                id: Math.random().toString(36),
                timestamp: new Date().toLocaleTimeString(),
                src: '192.168.1.5',
                dst: '84.12.33.1:4444', // Classic mining port
                proto: 'STRATUM',
                hex: 'JOB_ID ' + Math.random().toString(16).substr(2, 6).toUpperCase(),
                flag: 'Outbound'
            };
        }

        // Normal Traffic
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
