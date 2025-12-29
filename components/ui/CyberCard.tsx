import React from "react";
import { clsx } from "clsx";

interface CyberCardProps {
  children: React.ReactNode;
    className?: string;
      title?: string;
      }

      export function CyberCard({ children, className, title }: CyberCardProps) {
        return (
            <div className={clsx("relative group", className)}>
                  {/* The Glowing Border Effect */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-green to-neon-blue rounded-lg opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                              
                                    {/* The Main Card Content */}
                                          <div className="relative flex flex-col p-6 bg-cyber-gray border border-cyber-border rounded-lg shadow-2xl h-full">
                                                  {title && (
                                                            <div className="mb-4 pb-2 border-b border-cyber-border/50 flex items-center justify-between">
                                                                        <h3 className="text-neon-blue font-bold tracking-wider uppercase text-sm">
                                                                                      {title}
                                                                                                  </h3>
                                                                                                              {/* Decorative Schematic Lines */}
                                                                                                                          <div className="flex gap-1">
                                                                                                                                        <div className="w-1 h-1 bg-cyber-muted rounded-full"></div>
                                                                                                                                                      <div className="w-1 h-1 bg-cyber-muted rounded-full"></div>
                                                                                                                                                                    <div className="w-1 h-1 bg-cyber-muted rounded-full"></div>
                                                                                                                                                                                </div>
                                                                                                                                                                                          </div>
                                                                                                                                                                                                  )}
                                                                                                                                                                                                          {children}
                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                      );
                                                                                                                                                                                                                      }