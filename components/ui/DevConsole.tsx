"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { Terminal, X, ChevronRight, Activity } from "lucide-react";
import { clsx } from "clsx";

type LogType = "info" | "success" | "warning" | "error";

interface LogEntry {
  id: number;
  type: LogType;
  message: string;
  timestamp: string;
}

interface ConsoleContextType {
  isOpen: boolean;
  toggle: () => void;
  addLog: (message: string, type?: LogType) => void;
  clear: () => void;
}

const ConsoleContext = createContext<ConsoleContextType | undefined>(undefined);

export function useConsole() {
  const context = useContext(ConsoleContext);
  if (!context) throw new Error("useConsole must be used within ConsoleProvider");
  return context;
}

export function ConsoleProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = (message: string, type: LogType = "info") => {
    const entry: LogEntry = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date().toLocaleTimeString().split(" ")[0],
    };
    setLogs((prev) => [...prev, entry]);
    // Force open on error or warning so the user SEES it
    if (type === "error" || type === "warning") setIsOpen(true);
  };

  const toggle = () => setIsOpen((prev) => !prev);
  const clear = () => setLogs([]);

  return (
    <ConsoleContext.Provider value={{ isOpen, toggle, addLog, clear }}>
      {children}
      <DevConsoleUI isOpen={isOpen} logs={logs} close={() => setIsOpen(false)} />
    </ConsoleContext.Provider>
  );
}

function DevConsoleUI({ isOpen, logs, close }: { isOpen: boolean; logs: LogEntry[]; close: () => void }) {
  const endRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll logic
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs, isOpen]);

  return (
    // FIX: Z-Index 9999 ensures it sits on top of EVERYTHING
    <div
      className={clsx(
        "fixed bottom-0 left-0 right-0 z-[9999] transition-transform duration-300 ease-in-out border-t-2 border-neon-blue shadow-[0_-5px_20px_rgba(0,0,0,0.8)]",
        isOpen ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="bg-cyber-black/95 backdrop-blur-xl h-[40vh] flex flex-col font-mono text-sm border-x border-cyber-border/30 max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-cyber-border bg-cyber-gray/80">
          <div className="flex items-center gap-2 text-neon-blue">
            <Terminal className="w-4 h-4 animate-pulse" />
            <span className="font-bold tracking-wider text-xs">X-RAY CONSOLE // LIVE</span>
          </div>
          <button onClick={close} className="p-1 hover:bg-white/10 rounded text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logs */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-cyber-border">
            {logs.length === 0 && (
                <div className="text-cyber-muted opacity-50 italic text-center mt-10">
                    -- System Ready. Waiting for interactions --
                </div>
            )}
            {logs.map((log) => (
            <div key={log.id} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300 border-b border-white/5 pb-2 last:border-0">
              <span className="text-cyber-muted text-[10px] mt-1 shrink-0">{log.timestamp}</span>
              <div className="flex items-start gap-2">
                <ChevronRight className={clsx("w-3 h-3 mt-1 shrink-0", 
                    log.type === "success" ? "text-neon-green" : 
                    log.type === "error" ? "text-neon-red" : "text-neon-blue"
                )} />
                <span className={clsx("break-words",
                    log.type === "success" ? "text-neon-green" : 
                    log.type === "error" ? "text-neon-red font-bold" : "text-cyber-text"
                )}>
                    {log.message}
                </span>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Status Bar */}
        <div className="p-2 px-4 border-t border-cyber-border text-[10px] text-cyber-muted flex justify-between bg-black">
            <span>NETWORK: DEVNET</span>
            <span className="flex items-center gap-1 text-neon-green">
                <Activity className="w-3 h-3" /> LISTENING
            </span>
        </div>
      </div>
    </div>
  );
}
