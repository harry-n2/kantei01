import React from 'react';
import { Button } from './ui/Button';
import { ArrowRight, Lock } from 'lucide-react';

export const CtaSection: React.FC = () => {
    return (
        <section id="line-registration" className="w-full py-16 px-4 bg-gradient-to-b from-surface to-background relative overflow-hidden">

            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-primary/5 blur-[100px] pointer-events-none"></div>

            <div className="container max-w-lg mx-auto relative z-10 text-center">

                <h2 className="text-2xl md:text-4xl font-serif font-bold text-white mb-6 leading-tight">
                    転機の<span className="text-primary-glow">具体的な日付</span>と<br />
                    <span className="text-primary-glow">取るべき行動</span>を知る
                </h2>

                <p className="text-text-muted mb-10 leading-loose">
                    未来の転機は、準備ができている人にのみ<br className="hidden md:block" />幸運をもたらします。<br />
                    LINE登録して、あなたの運命の全貌を受け取ってください。
                </p>

                <a href="https://lin.ee/sXG6zVv" target="_blank" rel="noopener noreferrer" className="block w-full group">
                    <Button size="lg" className="w-full relative overflow-hidden shadow-[0_0_40px_rgba(245,158,11,0.4)] md:text-xl">
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            無料で詳細鑑定を受け取る
                            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                        {/* Shimmer Effect */}
                        <div className="absolute top-0 left-0 w-full h-full bg-white/20 -skew-x-12 -translate-x-full animate-[shimmer_2s_infinite]"></div>
                    </Button>
                </a>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-text-muted">
                    <Lock size={12} />
                    <span>情報は厳重に保護され、スパムは一切送信されません</span>
                </div>

            </div>
        </section>
    );
};
