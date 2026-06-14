import React from 'react';
import { motion } from 'framer-motion';
import { Hand, Heart, Coins, Briefcase, Activity, Sparkles, Compass, User } from 'lucide-react';
import type { KanteiResultData } from '@/types/kantei';
import { FortuneGraph } from './FortuneGraph';

type KanteiResultProps = {
    data: KanteiResultData;
    onReset: () => void;
};

const LINE_URL = 'https://lin.ee/WdYf2tq';

const sexLabel = (s: string) => (s === 'male' ? '男性' : s === 'female' ? '女性' : 'その他');

const Section: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode }> = ({
    title,
    icon,
    children,
}) => (
    <section className="w-full">
        <div className="flex items-center gap-2 mb-4">
            {icon && <span className="text-primary-glow">{icon}</span>}
            <h3 className="text-lg md:text-xl font-serif font-bold text-primary-glow tracking-wide">{title}</h3>
        </div>
        {children}
    </section>
);

export const KanteiResult: React.FC<KanteiResultProps> = ({ data, onReset }) => {
    const { profile, content } = data;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-xl mx-auto flex flex-col items-center"
        >
            <div className="w-full bg-[#111827] border-[1.5px] border-primary/40 rounded-[2rem] p-7 md:p-10 shadow-[0_0_60px_rgba(0,0,0,0.6)]">

                {/* ヘッダー */}
                <div className="text-center border-b border-white/10 pb-8 mb-8">
                    <p className="text-[10px] text-primary tracking-[0.3em] mb-3 uppercase">Palm Reading Report</p>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary-glow mb-1">手相鑑定書</h2>
                    <p className="text-text-muted text-xs mb-5">〜才能開花と豊かな未来への羅針盤〜</p>
                    <p className="text-text-main text-lg font-bold">{profile.fullName} 様</p>
                    <p className="text-text-muted text-xs mt-2">
                        {profile.age}歳・{sexLabel(profile.sex)}・{content.zodiac}<br />
                        {profile.area}／{profile.job}
                    </p>
                </div>

                {/* 総合鑑定 */}
                <div className="mb-10">
                    <Section title="総合鑑定" icon={<Sparkles size={20} />}>
                        <p className="text-text-main text-[1.05rem] leading-[1.9] whitespace-pre-wrap">{content.summary}</p>
                    </Section>
                </div>

                {/* 7線の詳細 */}
                <div className="mb-10">
                    <Section title="主要線の詳細鑑定" icon={<Hand size={20} />}>
                        <div className="space-y-4">
                            {content.sevenLines.map((l, i) => (
                                <div key={i} className="bg-black/30 border border-white/5 rounded-xl p-5">
                                    <p className="text-primary font-bold mb-2">{l.line}</p>
                                    <p className="text-text-muted text-sm leading-relaxed mb-1">
                                        <span className="text-text-main">形状：</span>{l.shape}
                                    </p>
                                    <p className="text-text-muted text-sm leading-relaxed mb-1">
                                        <span className="text-text-main">濃淡：</span>{l.density}
                                    </p>
                                    <p className="text-text-muted text-sm leading-relaxed mb-3">{l.observation}</p>
                                    <p className="text-text-main text-sm leading-relaxed bg-primary/5 border-l-2 border-primary/40 pl-3 py-2">
                                        助言：{l.advice}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Section>
                </div>

                {/* 人相鑑定 */}
                <div className="mb-10">
                    <Section title="人相鑑定" icon={<User size={20} />}>
                        <div className="space-y-4">
                            {content.physiognomy.map((f, i) => (
                                <div key={i} className="bg-black/30 border border-white/5 rounded-xl p-5">
                                    <p className="text-primary font-bold mb-2">{f.part}</p>
                                    <p className="text-text-muted text-sm leading-relaxed mb-3">{f.observation}</p>
                                    <p className="text-text-main text-sm leading-relaxed bg-primary/5 border-l-2 border-primary/40 pl-3 py-2">
                                        助言：{f.advice}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Section>
                </div>

                {/* 総合運勢グラフ */}
                <div className="mb-10">
                    <Section title="総合運勢グラフ">
                        <div className="bg-black/30 border border-white/5 rounded-xl p-4">
                            <FortuneGraph points={content.lifeGraph} currentAge={profile.age} />
                        </div>
                    </Section>
                </div>

                {/* 運勢別 */}
                <div className="mb-10 space-y-6">
                    <Section title="恋愛・パートナー運" icon={<Heart size={20} />}>
                        <p className="text-text-main text-[1.02rem] leading-[1.9] mb-3 whitespace-pre-wrap">{content.fortunes.love}</p>
                        <div className="bg-black/30 border border-white/5 rounded-xl p-4">
                            <p className="text-primary text-sm font-bold mb-1">理想のパートナー像</p>
                            <p className="text-text-muted text-sm leading-relaxed whitespace-pre-wrap">{content.fortunes.idealPartner}</p>
                        </div>
                    </Section>

                    <Section title="金運・財運" icon={<Coins size={20} />}>
                        <p className="text-text-main text-[1.02rem] leading-[1.9] whitespace-pre-wrap">{content.fortunes.money}</p>
                    </Section>

                    <Section title="仕事運・道職運" icon={<Briefcase size={20} />}>
                        <p className="text-text-main text-[1.02rem] leading-[1.9] whitespace-pre-wrap">{content.fortunes.work}</p>
                    </Section>

                    <Section title="健康運" icon={<Activity size={20} />}>
                        <p className="text-text-main text-[1.02rem] leading-[1.9] whitespace-pre-wrap">{content.fortunes.health}</p>
                    </Section>
                </div>

                {/* 年代別アドバイス */}
                <div className="mb-10">
                    <Section title="今後の運勢と開運アドバイス">
                        <div className="space-y-3">
                            {content.ageAdvice.map((a, i) => (
                                <div key={i} className="bg-black/30 border border-white/5 rounded-xl p-4">
                                    <p className="text-primary text-sm font-bold mb-1">{a.band}</p>
                                    <p className="text-text-muted text-sm leading-relaxed whitespace-pre-wrap">{a.text}</p>
                                </div>
                            ))}
                        </div>
                    </Section>
                </div>

                {/* ラッキーアイテム */}
                <div className="mb-10">
                    <Section title="ラッキーアイテム・開運法" icon={<Compass size={20} />}>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                ['ラッキーカラー', content.lucky.color],
                                ['ラッキー方位', content.lucky.direction],
                                ['ラッキーアイテム', content.lucky.item],
                                ['開運行動', content.lucky.action],
                            ].map(([k, v]) => (
                                <div key={k} className="bg-black/30 border border-white/5 rounded-xl p-4">
                                    <p className="text-primary text-xs font-bold mb-1">{k}</p>
                                    <p className="text-text-main text-sm">{v}</p>
                                </div>
                            ))}
                        </div>
                    </Section>
                </div>

                {/* LINE誘導 */}
                <div className="bg-[#1a1f2e] border border-primary/30 rounded-xl p-6 text-center">
                    <p className="text-text-main text-sm leading-relaxed mb-4">
                        この鑑定書をもとに、あなたの<span className="text-primary-glow font-bold">人生の重要な選択</span>について、
                        さらに深い個別鑑定をLINEでお届けしています。
                    </p>
                    <a
                        href={LINE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-[#00D656] hover:bg-[#00c24e] text-white font-bold py-4 rounded-full text-sm shadow-[0_8px_20px_rgba(0,214,86,0.3)] transition-all active:scale-95"
                    >
                        LINEで個別鑑定を受け取る
                    </a>
                    <p className="text-[10px] text-text-muted mt-3">登録は無料・解除も自由です。</p>
                </div>

                {/* 免責 */}
                <p className="text-[10px] text-text-muted/70 mt-6 leading-relaxed text-center">
                    ※本鑑定はAIを用いた娯楽目的のシミュレーションです。将来の出来事や成果を保証するものではありません。
                </p>
            </div>

            <button
                onClick={onReset}
                className="mt-8 text-text-muted text-xs underline decoration-white/20 tracking-widest hover:text-text-main transition-colors"
            >
                最初からやり直す
            </button>
        </motion.div>
    );
};
