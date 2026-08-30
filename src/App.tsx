import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Circle } from 'lucide-react';

const MENU_TEXT = `AUTOMATED LINUX BOOTSTRAP & MANAGEMENT SUITE <<<
Host: old-node | Arch: x86_64 | OS: Ubuntu 22.04.4 LTS
========================================================================

[1] 🚀 Full First-Time Install & Setup
[2] 🩺 Quick System Diagnostic & Hardware Audit
[3] ⚡ Wake Local Servers (Frontend :3000 & Backend :5000)
[4] 🌐 Start Remote Tunnel (Cloudflare / SSH / ngrok)
[5] 📦 Create System & Config Backup (.tar.gz)
[6] 🔄 Restore System from Backup Archive
[7] 🛑 Stop All Running Dragon 9 Services
[8] 📋 View Live Logs & Tmux Sessions
[9] 📱 Mobile Pairing & Network Quick Info
[10] ⚙️ Install Systemd Boot Auto-Start Service
[11] 🚪 Clear Terminal / Reset Menu
[12] 📡 Toggle Live Broadcast Stream`;

const VALID_COMMANDS = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
  'clear',
  './dragon9_bootstrap.sh --start',
  './dragon9_bootstrap.sh --tunnel',
  './dragon9_bootstrap.sh --stop',
  './dragon9_bootstrap.sh --logs'
];

const Colorize = ({ text }: { text: string }) => {
  const parts = text.split(/(\[SUCCESS\]|\[INFO\]|\[PORT\]|\[TMUX\]|\[TUNNEL\]|\[STOP\]|\[LOGS\]|\[INSTALL\]|\[DIAGNOSTIC\]|\[BACKUP\]|\[AUTO-START\]|\[BROADCAST\]|http[s]?:\/\/[^\s]+)/g);
  
  return (
    <>
      {parts.map((part, i) => {
        if (part === '[SUCCESS]') return <span key={i} className="text-[#22C55E] font-bold">{part}</span>;
        if (part === '[INFO]') return <span key={i} className="text-[#3B82F6] font-bold">{part}</span>;
        if (part === '[PORT]' || part === '[TUNNEL]') return <span key={i} className="text-cyan-400 font-bold">{part}</span>;
        if (part === '[TMUX]' || part === '[LOGS]') return <span key={i} className="text-purple-400 font-bold">{part}</span>;
        if (part === '[STOP]') return <span key={i} className="text-red-400 font-bold">{part}</span>;
        if (part === '[INSTALL]' || part === '[DIAGNOSTIC]' || part === '[BACKUP]' || part === '[AUTO-START]') return <span key={i} className="text-[#EAB308] font-bold">{part}</span>;
        if (part === '[BROADCAST]') return <span key={i} className="text-emerald-400 font-bold">{part}</span>;
        if (part.startsWith('http')) return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{part}</a>;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
};

type Packet = { id: number, protocol: string, src: string, dst: string, size: number, hash: string };

export default function App() {
  const [history, setHistory] = useState<string[]>([MENU_TEXT]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState({
    backend: '[STOPPED]',
    frontend: '[STOPPED]',
    tunnel: '[INACTIVE]',
    ip: '192.168.1.145'
  });
  const [packets, setPackets] = useState<Packet[]>([]);
  const [isBroadcasting, setIsBroadcasting] = useState(true);
  const packetIdRef = useRef(0);
  
  const suggestion = input ? VALID_COMMANDS.find(cmd => cmd.startsWith(input)) || '' : '';
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, status]);

  useEffect(() => {
    if (!isBroadcasting) return;
    const interval = setInterval(() => {
      const protocols = ['TCP', 'UDP', 'ICMP', 'WSS', 'TLS'];
      const p = protocols[Math.floor(Math.random() * protocols.length)];
      const src = `192.168.1.${Math.floor(Math.random() * 200) + 20}`;
      const dst = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      const size = Math.floor(Math.random() * 1500) + 40;
      const hash = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const newPacket: Packet = {
        id: packetIdRef.current++,
        protocol: p,
        src,
        dst,
        size,
        hash
      };
      
      setPackets(prev => [newPacket, ...prev].slice(0, 100));
    }, 80); // Very fast for smooth scrolling effect
    
    return () => clearInterval(interval);
  }, [isBroadcasting]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    
    setHistory(prev => [...prev, `Select an option [1-12] or type a command below:\n$ ${trimmed}`]);
    
    let newStatus = { ...status };
    let response = '';

    if (trimmed === '3' || trimmed === './dragon9_bootstrap.sh --start') {
      response = `[PORT] Checking port 5000 (Backend API)... [CLEAR]
[PORT] Checking port 3000 (Frontend Web)... [CLEAR]
[TMUX] Launching backend in detached session 'dragon9-backend' on port 5000...
[TMUX] Launching frontend in detached session 'dragon9-frontend' on port 3000...
[SUCCESS] Dragon 9 servers successfully awakened!

Local: http://localhost:3000
Mobile: http://${status.ip}:3000`;
      newStatus.backend = '[RUNNING [PID 4102]]';
      newStatus.frontend = '[RUNNING [PID 4118]]';
    } else if (trimmed === '4' || trimmed === './dragon9_bootstrap.sh --tunnel') {
      response = `[TUNNEL] Launching Cloudflare quick tunnel for port 3000...
[SUCCESS] Cloudflare tunnel active in session 'dragon9-tunnel'!
================================================================
PUBLIC REMOTE URL: https://dragon9-jm26n.trycloudflare.com
LOCAL BACKEND API: http://${status.ip}:5000/api/health
================================================================
[INFO] Scan from any mobile device worldwide without opening ports.`;
      newStatus.tunnel = '[ACTIVE (https://dragon9-jm26n.trycloudflare.com)]';
    } else if (trimmed === '9' || trimmed === '[Option 9]') {
      response = `================================================================
MOBILE DEVICE PAIRING ON LOCAL WI-FI NETWORK:
1. Connect your smartphone/tablet to the same Wi-Fi/LAN router.
2. Open Safari or Chrome on your phone.
3. Navigate directly to: http://${status.ip}:3000
4. Backend Health: http://${status.ip}:5000/api/health
================================================================`;
    } else if (trimmed === '11' || trimmed === 'clear') {
      setHistory([MENU_TEXT]);
      setStatus(newStatus);
      setInput('');
      return;
    } else if (trimmed === '12') {
      const nextState = !isBroadcasting;
      setIsBroadcasting(nextState);
      response = `[BROADCAST] ${nextState ? 'Starting' : 'Pausing'} high-frequency network data broadcast stream...`;
    } else if (trimmed === '7' || trimmed === './dragon9_bootstrap.sh --stop') {
      response = `[STOP] Terminating backend session 'dragon9-backend'...
[STOP] Terminating frontend session 'dragon9-frontend'...
[STOP] Closing Cloudflare tunnel session 'dragon9-tunnel'...
[SUCCESS] All Dragon 9 services have been stopped.`;
      newStatus.backend = '[STOPPED]';
      newStatus.frontend = '[STOPPED]';
      newStatus.tunnel = '[INACTIVE]';
    } else if (trimmed === '8' || trimmed === './dragon9_bootstrap.sh --logs') {
       response = `[LOGS] Attaching to active tmux sessions...
(Select a session to view: 1=backend, 2=frontend, 3=tunnel)
Press Ctrl+b, d to detach.`;
    } else if (trimmed === '1') {
       response = `[INSTALL] Beginning full first-time install...
[INSTALL] Updating apt repositories... OK
[INSTALL] Installing Node.js and dependencies... OK
[INSTALL] Setting up database schemas... OK
[SUCCESS] Installation complete!`;
    } else if (trimmed === '2') {
       response = `[DIAGNOSTIC] Running system audit...
CPU: AMD Ryzen 7 (8 cores) - OK
RAM: 32GB (14GB free) - OK
Disk: 1TB NVMe (80% free) - OK
Network: Active (eth0) - OK
[SUCCESS] System is healthy.`;
    } else if (trimmed === '5') {
       response = `[BACKUP] Compressing workspace configuration and database...
[BACKUP] Creating archive dragon9_backup_latest.tar.gz... OK
[SUCCESS] Backup saved to /var/backups/dragon9/`;
    } else if (trimmed === '6') {
       response = `[RESTORE] Restoring from dragon9_backup_latest.tar.gz...
[RESTORE] Extracting files... OK
[RESTORE] Restoring database schema... OK
[SUCCESS] System restored successfully.`;
    } else if (trimmed === '10') {
       response = `[AUTO-START] Generating systemd unit file...
[AUTO-START] Enabling dragon9.service... OK
[SUCCESS] Services will auto-start on next reboot.`;
    } else if (trimmed !== '') {
      response = `bash: ${trimmed}: command not found`;
    }

    if (response) {
      setHistory(prev => [...prev, response]);
    }
    
    setStatus(newStatus);
    setInput('');
  };

  const statusLine = `STATUS: Backend: ${status.backend} | Frontend: ${status.frontend} | Tunnel: ${status.tunnel} | IP: ${status.ip}`;

  const getStatusIndicator = (stateString: string) => {
    if (stateString.includes('RUNNING')) return 'bg-[#22C55E] shadow-[0_0_8px_#22C55E]';
    if (stateString.includes('ACTIVE')) return 'bg-[#3B82F6] shadow-[0_0_8px_#3B82F6]';
    if (stateString.includes('INACTIVE') || stateString.includes('STOPPED')) return 'bg-[#64748B]';
    return 'bg-[#EAB308] shadow-[0_0_8px_#EAB308]';
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#0B0E14] overflow-hidden text-[#CBD5E1] font-[ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace]">
      <header className="flex justify-between items-center px-4 sm:px-8 py-4 sm:py-6 border-b border-[#1E293B]">
        <div className="flex flex-col">
          <h1 className="text-lg sm:text-xl font-bold tracking-widest text-white">DRAGON 9 <span className="font-light text-slate-500">/ BOOTSTRAP SUITE</span></h1>
          <p className="text-[10px] sm:text-xs text-slate-500 uppercase mt-1">Automated Linux Management & Deployment</p>
        </div>
        <div className="hidden sm:flex gap-8 text-[11px]">
          <div className="flex flex-col"><span className="text-slate-500 uppercase">Host</span><span className="text-slate-200">old-node</span></div>
          <div className="flex flex-col"><span className="text-slate-500 uppercase">Architecture</span><span className="text-slate-200">x86_64</span></div>
          <div className="flex flex-col"><span className="text-slate-500 uppercase">OS Release</span><span className="text-slate-200">Ubuntu 22.04.4 LTS</span></div>
        </div>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-[#1E293B] h-auto sm:h-20 shrink-0">
        <div className="flex items-center p-4 sm:px-8 border-b sm:border-b-0 border-r border-[#1E293B]">
          <div className={`w-2.5 h-2.5 rounded-full inline-block mr-3 shrink-0 ${getStatusIndicator(status.backend)}`}></div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[10px] uppercase text-slate-500 truncate">Backend</span>
            <span className="text-xs sm:text-sm font-bold text-white truncate">{status.backend}</span>
          </div>
        </div>
        <div className="flex items-center p-4 sm:px-8 border-b sm:border-b-0 sm:border-r border-[#1E293B]">
          <div className={`w-2.5 h-2.5 rounded-full inline-block mr-3 shrink-0 ${getStatusIndicator(status.frontend)}`}></div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[10px] uppercase text-slate-500 truncate">Frontend</span>
            <span className="text-xs sm:text-sm font-bold text-white truncate">{status.frontend}</span>
          </div>
        </div>
        <div className="flex items-center p-4 sm:px-8 border-r border-[#1E293B]">
          <div className={`w-2.5 h-2.5 rounded-full inline-block mr-3 shrink-0 ${getStatusIndicator(status.tunnel)}`}></div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[10px] uppercase text-slate-500 truncate">Tunnel</span>
            <span className="text-xs sm:text-sm font-bold text-white truncate">{status.tunnel}</span>
          </div>
        </div>
        <div className="flex items-center p-4 sm:px-8">
          <div className="w-2.5 h-2.5 rounded-full inline-block mr-3 shrink-0 bg-[#EAB308] shadow-[0_0_8px_#EAB308]"></div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[10px] uppercase text-slate-500 truncate">Public IP</span>
            <span className="text-xs sm:text-sm font-bold text-white truncate">{status.ip}</span>
          </div>
        </div>
      </div>

      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0">
        <nav className="hidden md:flex col-span-3 border-r border-[#1E293B] p-6 flex-col gap-1.5 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <span className="text-[10px] text-slate-500 uppercase mb-4 tracking-tighter shrink-0">System Commands</span>
          
          <button onClick={() => handleCommand('1')} className="flex items-center gap-3 p-2 bg-slate-800/30 border border-slate-700/50 rounded text-xs hover:bg-slate-700/50 text-left transition-all">
            <span className="text-slate-500 font-bold">[1]</span> Full First-Time Setup
          </button>
          <button onClick={() => handleCommand('2')} className="flex items-center gap-3 p-2 text-xs hover:bg-slate-800/30 rounded text-left text-slate-400 transition-all">
            <span className="text-slate-600 font-bold">[2]</span> Quick Diagnostics
          </button>
          <button onClick={() => handleCommand('3')} className="flex items-center gap-3 p-2 text-xs hover:bg-slate-800/30 rounded text-left text-slate-400 transition-all">
            <span className="text-slate-600 font-bold">[3]</span> Wake Local Servers
          </button>
          <button onClick={() => handleCommand('4')} className="flex items-center gap-3 p-2 text-xs hover:bg-slate-800/30 rounded text-left text-slate-400 transition-all">
            <span className="text-slate-600 font-bold">[4]</span> Start Remote Tunnel
          </button>
          <button onClick={() => handleCommand('5')} className="flex items-center gap-3 p-2 text-xs hover:bg-slate-800/30 rounded text-left text-slate-400 transition-all">
            <span className="text-slate-600 font-bold">[5]</span> Create Backup (.gz)
          </button>
          <button onClick={() => handleCommand('6')} className="flex items-center gap-3 p-2 text-xs hover:bg-slate-800/30 rounded text-left text-slate-400 transition-all">
            <span className="text-slate-600 font-bold">[6]</span> Restore from Archive
          </button>
          <button onClick={() => handleCommand('7')} className="flex items-center gap-3 p-2 text-xs hover:bg-red-900/20 rounded text-left text-red-400 transition-all">
            <span className="text-red-900 font-bold">[7]</span> Stop All Services
          </button>
          <button onClick={() => handleCommand('8')} className="flex items-center gap-3 p-2 bg-slate-800/30 border border-slate-700/50 rounded text-xs hover:bg-slate-700/50 text-left text-blue-400 transition-all">
            <span className="text-blue-900 font-bold">[8]</span> View Live Logs
          </button>
          <button onClick={() => handleCommand('9')} className="flex items-center gap-3 p-2 text-xs hover:bg-slate-800/30 rounded text-left text-slate-400 transition-all">
            <span className="text-slate-600 font-bold">[9]</span> Mobile Pairing Info
          </button>
          <button onClick={() => handleCommand('10')} className="flex items-center gap-3 p-2 text-xs hover:bg-slate-800/30 rounded text-left text-slate-400 transition-all">
            <span className="text-slate-600 font-bold">[10]</span> Install Systemd Unit
          </button>
          <button onClick={() => handleCommand('11')} className="flex items-center gap-3 p-2 text-xs hover:bg-slate-800/30 rounded text-left text-slate-500 italic transition-all">
            <span className="text-slate-700 font-bold">[11]</span> Reset Terminal
          </button>
          
          <button onClick={() => handleCommand('12')} className={`flex items-center gap-3 p-2 text-xs border border-transparent rounded text-left transition-all mt-auto ${isBroadcasting ? 'hover:bg-amber-900/20 hover:border-amber-800/30 text-amber-400' : 'hover:bg-emerald-900/20 hover:border-emerald-800/30 text-emerald-400'}`}>
            <span className={`font-bold ${isBroadcasting ? 'text-amber-600' : 'text-emerald-600'}`}>[12]</span> {isBroadcasting ? 'Pause' : 'Start'} Broadcast
          </button>
        </nav>

        <section className="col-span-1 md:col-span-9 lg:col-span-6 p-4 sm:p-6 flex flex-col gap-2 min-h-0 bg-[#0B0E14]">
          <div className="flex justify-between items-center mb-2 shrink-0">
            <span className="text-[10px] text-slate-500 uppercase">Console Output / dragon9_bootstrap.sh</span>
            <span className="text-[10px] px-2 py-0.5 bg-slate-800 rounded text-slate-400">tmux: 3 sessions</span>
          </div>
          
          <div 
            className="flex-1 bg-black/40 rounded-lg p-4 sm:p-6 border border-[#1E293B] text-[12px] leading-relaxed overflow-y-auto cursor-text flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            onClick={() => document.getElementById('cmd-input')?.focus()}
          >
            <div className="flex-1">
              {history.map((block, i) => (
                <div key={i} className="mb-4 text-slate-300">
                  <Colorize text={block} />
                </div>
              ))}
            </div>

            <div className="flex mt-4 shrink-0 items-center relative">
              <span className="text-green-500 mr-2">$</span>
              <form 
                onSubmit={(e) => { e.preventDefault(); handleCommand(input); }}
                className="flex-1 relative flex items-center"
              >
                <div className="absolute inset-0 pointer-events-none flex items-center overflow-hidden whitespace-pre font-mono">
                  <span className="opacity-0">{input}</span>
                  <span className="text-slate-600">{suggestion ? suggestion.slice(input.length) : ''}</span>
                </div>
                <input
                  id="cmd-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.key === 'Tab' || e.key === 'ArrowRight') && suggestion) {
                      e.preventDefault();
                      setInput(suggestion);
                    }
                  }}
                  className="w-full bg-transparent border-none outline-none text-white focus:ring-0 p-0 shadow-none caret-white relative z-10"
                  autoComplete="off"
                  autoFocus
                  spellCheck="false"
                  placeholder={input ? "" : "Select an option [1-12] or type a command..."}
                />
              </form>
            </div>
            <div ref={bottomRef} className="h-1" />
          </div>
        </section>

        <aside className="hidden lg:flex col-span-3 border-l border-[#1E293B] p-6 flex-col gap-6 min-h-0">
          
          <div className="flex flex-col gap-2 flex-1 min-h-0">
            <div className="flex justify-between items-center shrink-0">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest">Live Broadcast</span>
              <span className={`text-[9px] flex items-center gap-1.5 font-bold ${isBroadcasting ? 'text-emerald-500' : 'text-slate-600'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isBroadcasting ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></span>
                {isBroadcasting ? 'LIVE' : 'PAUSED'}
              </span>
            </div>
            <div className="bg-[#080B10] border border-[#1E293B] rounded-lg flex-1 overflow-y-auto flex flex-col-reverse font-mono text-[9px] p-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
               {packets.map(p => (
                 <div key={p.id} className="flex gap-2 text-slate-400 border-b border-[#1E293B]/50 py-1.5 last:border-0 hover:bg-[#1E293B]/30 transition-colors">
                   <span className={`w-8 shrink-0 font-bold ${p.protocol === 'WSS' ? 'text-purple-400' : p.protocol === 'TLS' ? 'text-emerald-400' : p.protocol === 'ICMP' ? 'text-red-400' : p.protocol === 'TCP' ? 'text-blue-400' : 'text-slate-500'}`}>{p.protocol}</span>
                   <span className="flex-1 truncate">{p.src} <span className="text-slate-600 px-0.5">&rarr;</span> {p.dst}</span>
                   <span className="text-slate-500 shrink-0 tabular-nums">{p.size}b</span>
                 </div>
               ))}
            </div>
          </div>
          
          <div className="flex flex-col gap-2 shrink-0">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Active Endpoints</span>
            <div className="flex flex-col gap-3 p-4 bg-slate-800/10 rounded-lg border border-[#1E293B]">
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-500">LOCAL WEB</span>
                <span className="text-[11px] text-blue-400">localhost:3000</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-500">WIFI LAN</span>
                <span className="text-[11px] text-blue-400">{status.ip}:3000</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-500">BACKEND API</span>
                <span className="text-[11px] text-blue-400">:5000/api/health</span>
              </div>
            </div>
          </div>
        </aside>
      </main>

      <footer className="h-10 sm:h-12 border-t border-[#1E293B] shrink-0 flex items-center px-4 sm:px-8 text-[11px] text-slate-500 bg-[#0B0E14]">
        <span className="mr-2 text-green-500">$</span><span className="animate-pulse">_</span>
        <div className="ml-auto flex gap-4 sm:gap-6 italic">
          <span className="hidden sm:inline">v0.9.2-beta</span>
          <span>System uptime: 12d 4h 12m</span>
        </div>
      </footer>
    </div>
  );
}
