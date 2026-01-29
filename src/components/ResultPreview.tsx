import React, { useEffect, useState } from 'react';
import { LifeLineChart } from './LifeLineChart';
import { motion } from 'framer-motion';
import { Scan, CheckCircle2 } from 'lucide-react';
import { Spacer } from './ui/Spacer';

type ResultPreviewProps = {
    age: number;
};

export const ResultPreview: React.FC<ResultPreviewProps> = ({ age }) => {
    const [step, setStep] = useState<'analyzing' | 'complete'>('analyzing');

    useEffect(() => {
        // Simulate AI Analysis
        const timer = setTimeout(() => {
            setStep('complete');
        }, 4000); // 4 seconds analysis
        return () => clearTimeout(timer);
    }, []);

    if (step === 'analyzing') {
        return (
            <div className="w-full h-96 flex flex-col items-center justify-center text-center p-8 bg-surface/50 backdrop-blur rounded-xl border border-white/5">
                <Scan size={48} className="text-primary animate-pulse mb-6" />
                <h3 className="text-xl font-bold text-white mb-2">生命線をスキャン中...</h3>
                <p className="text-text-muted text-sm">
                    画像から流年（人生の刻）を抽出しています。<br />
                    完了までそのままでお待ちください。
                </p>
                <div className="w-64 h-1 bg-white/10 rounded-full mt-6 overflow-hidden">
                    <div className="h-full bg-primary animate-[scan_2s_ease-in-out_infinite] w-full origin-left transform scale-x-0"></div>
                </div>
            </div>
        );
    }

    // Mock Data relative to current age
    const mockPoints = [
        { age: age - 7, label: "環境の変化", type: 'past' as const },
        { age: age - 3, label: "出会い/別れ", type: 'past' as const },
        { age: age + 2, label: "？？？", type: 'future' as const },
        { age: age + 5, label: "？？？", type: 'future' as const },
        { age: age + 12, label: "？？？", type: 'future' as const },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full bg-surface border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl"
        >
            <div className="flex items-center gap-2 mb-6">
                <CheckCircle2 size={24} className="text-secondary" />
                <h3 className="text-xl md:text-2xl font-bold text-white">解析が完了しました</h3>
            </div>

            <p className="text-text-main text-lg leading-loose mb-8">
                あなたの手のひらには、過去に起きた<span className="text-primary font-bold">「{age - 3}歳頃の転機」</span>がはっきりと刻まれています。<br />
                この時期、心当たりはありませんか？<br />
                <span className="text-base text-text-muted mt-2 block">（AIは線の濃淡から、あなたの人生の密度を読み取っています）</span>
            </p>

            <div className="bg-background/50 p-4 rounded-xl border border-white/5 overflow-hidden">
                <h4 className="text-xs font-bold text-text-muted mb-4 tracking-widest text-center">LIFE TIMELINE PREVIEW</h4>
                <LifeLineChart currentAge={age} points={mockPoints} />
            </div>

            <Spacer size="md" />

            <p className="text-center text-text-main font-bold">
                そして、まもなく...<br />
                <span className="text-3xl text-primary-glow font-serif block mt-2">
                    {age + 2}歳に、次の転機
                </span>
                が訪れる予兆が出ています。
            </p>

        </motion.div>
    );
};
