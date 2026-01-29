import React from 'react';
import { motion } from 'framer-motion';

type TurningPoint = {
    age: number;
    label: string;
    type: 'past' | 'future';
};

type LifeLineChartProps = {
    currentAge: number;
    points: TurningPoint[];
};

export const LifeLineChart: React.FC<LifeLineChartProps> = ({ currentAge, points }) => {
    return (
        <div className="w-full py-8 relative flex flex-col items-center">
            {/* Vertical Line */}
            <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-1 bg-white/10 rounded-full transform md:-translate-x-1/2" />

            {/* Active Line (Gradient) */}
            <motion.div
                initial={{ height: 0 }}
                animate={{ height: "50%" }} // Approximate for demo
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute left-[20px] md:left-1/2 top-0 w-1 bg-gradient-to-b from-transparent to-primary rounded-full transform md:-translate-x-1/2 opacity-50"
            />

            <div className="w-full space-y-8 relative z-10 pl-[50px] md:pl-0">
                {points.map((point, index) => {
                    const isFuture = point.type === 'future';
                    const isLeft = index % 2 === 0;

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.2 + 0.5 }}
                            className={`relative flex items-center md:justify-center w-full ${isLeft ? 'md:flex-row-reverse' : 'md:flex-row'}`}
                        >
                            {/* Desktop: Spacer for centering */}
                            <div className="hidden md:block w-1/2" />

                            {/* Dot on Timeline */}
                            <div className="absolute left-[-34px] md:left-1/2 md:transform md:-translate-x-1/2 flex items-center justify-center w-8 h-8">
                                <div className={`w-4 h-4 rounded-full ${isFuture ? 'bg-surface border-2 border-white shadow-[0_0_10px_#fff] animate-pulse' : 'bg-primary shadow-[0_0_10px_#F59E0B]'}`} />
                            </div>

                            {/* Content Card */}
                            <div className={`w-full md:w-[45%] ${isLeft ? 'md:pr-8' : 'md:pl-8'}`}>
                                <div className={`p-4 rounded-lg border ${isFuture ? 'bg-surface/30 border-white/10 backdrop-blur-sm' : 'bg-surface border-primary/30'
                                    }`}>
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className={`text-xl font-bold font-serif ${isFuture ? 'text-white' : 'text-primary-glow'}`}>
                                            {point.age}歳
                                        </span>
                                        {point.age === currentAge && (
                                            <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">NOW</span>
                                        )}
                                    </div>
                                    <p className={`text-base font-medium ${isFuture ? 'text-text-muted blur-[2px] select-none' : 'text-text-main'}`}>
                                        {point.label}
                                    </p>
                                </div>
                            </div>

                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
