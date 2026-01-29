import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const KEYWORDS = ["飛躍", "転機", "決断", "富", "再会", "運命", "挑戦", "愛"];

export const SlotMachine: React.FC = () => {
    const [keyword, setKeyword] = useState(KEYWORDS[0]);
    const [isSpinning, setIsSpinning] = useState(true);

    useEffect(() => {
        // Auto start spinning
        const spinDuration = 2500; // 2.5s spin
        const interval = setInterval(() => {
            setKeyword(KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)]);
        }, 100);

        const timer = setTimeout(() => {
            clearInterval(interval);
            setIsSpinning(false);
            // Determine final result (randomly or fixed for demo)
            setKeyword(KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)]);
        }, spinDuration);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="text-primary-glow font-bold text-lg mb-2 tracking-widest">
                TODAY'S KEYWORD
            </div>

            {/* Slot Container */}
            <div className="relative p-1 rounded-xl bg-gradient-to-br from-yellow-600 via-yellow-300 to-yellow-700 shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                <div className="bg-surface rounded-lg px-8 py-4 border border-yellow-500/30 flex items-center justify-center min-w-[280px] min-h-[100px] overflow-hidden relative">

                    {/* Background Grid/Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:16px_16px]"></div>

                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={isSpinning ? 'spinning' : keyword}
                            initial={{ y: 20, opacity: 0, filter: 'blur(5px)' }}
                            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                            exit={{ y: -20, opacity: 0, filter: 'blur(5px)' }}
                            transition={{ duration: 0.1 }}
                            className="text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-500 z-10 drop-shadow-sm"
                        >
                            {keyword}
                        </motion.div>
                    </AnimatePresence>

                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
                </div>
            </div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: isSpinning ? 0 : 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 text-text-muted text-sm"
            >
                あなたの人生を動かす鍵
            </motion.p>
        </div>
    );
};
