import React from "react";
import { CyberCard } from "./CyberCard";
import { BrainCircuit, Zap } from "lucide-react"; // Using Lucide Icons

export function ProductDisplay() {
  return (
      <CyberCard title="Item_Details // v2.0">
            <div className="flex flex-col items-center text-center space-y-4">
                    {/* Product Image / Icon */}
                            <div className="w-24 h-24 bg-cyber-dark rounded-full flex items-center justify-center border-2 border-neon-green/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                                      <BrainCircuit className="w-12 h-12 text-neon-green" />
                                              </div>

                                                      {/* Product Info */}
                                                              <div>
                                                                        <h1 className="text-2xl font-bold text-cyber-text">Neural Link v2</h1>
                                                                                  <p className="text-cyber-muted text-sm mt-1">
                                                                                              Direct cortex interface. Zero latency.
                                                                                                        </p>
                                                                                                                </div>

                                                                                                                        {/* Price Tag */}
                                                                                                                                <div className="flex items-center gap-2 bg-cyber-black px-4 py-2 rounded border border-cyber-border">
                                                                                                                                          <Zap className="w-4 h-4 text-neon-yellow" />
                                                                                                                                                    <span className="text-lg font-mono text-white">0.05 SOL</span>
                                                                                                                                                            </div>
                                                                                                                                                                  </div>
                                                                                                                                                                      </CyberCard>
                                                                                                                                                                        );
                                                                                                                                                                        }