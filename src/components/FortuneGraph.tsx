import React from 'react';
import type { GraphPoint } from '@/types/kantei';

type FortuneGraphProps = {
    points: GraphPoint[];
    currentAge: number;
};

// 総合運勢グラフ（自前SVG・追加ライブラリなし）
export const FortuneGraph: React.FC<FortuneGraphProps> = ({ points, currentAge }) => {
    const data = [...points].sort((a, b) => a.age - b.age);
    if (data.length < 2) return null;

    const W = 320;
    const H = 160;
    const padX = 28;
    const padY = 18;

    const ages = data.map((d) => d.age);
    const minAge = Math.min(...ages);
    const maxAge = Math.max(...ages);
    const ageSpan = Math.max(1, maxAge - minAge);

    const x = (age: number) => padX + ((age - minAge) / ageSpan) * (W - padX * 2);
    const y = (score: number) => padY + (1 - Math.max(0, Math.min(100, score)) / 100) * (H - padY * 2);

    const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(d.age).toFixed(1)} ${y(d.score).toFixed(1)}`).join(' ');
    const areaPath = `${linePath} L ${x(maxAge).toFixed(1)} ${H - padY} L ${x(minAge).toFixed(1)} ${H - padY} Z`;

    // 現在年齢に最も近い点
    const nearest = data.reduce((acc, d) =>
        Math.abs(d.age - currentAge) < Math.abs(acc.age - currentAge) ? d : acc, data[0]);

    return (
        <div className="w-full">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="総合運勢グラフ">
                {/* 横グリッド */}
                {[0, 25, 50, 75, 100].map((g) => (
                    <line
                        key={g}
                        x1={padX}
                        x2={W - padX}
                        y1={y(g)}
                        y2={y(g)}
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth={1}
                    />
                ))}

                {/* 面塗り */}
                <defs>
                    <linearGradient id="fg-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path d={areaPath} fill="url(#fg-fill)" />

                {/* 折れ線 */}
                <path d={linePath} fill="none" stroke="#FCD34D" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />

                {/* 各点 */}
                {data.map((d) => (
                    <circle key={d.age} cx={x(d.age)} cy={y(d.score)} r={2.5} fill="#FCD34D" />
                ))}

                {/* 現在地マーカー */}
                <circle cx={x(nearest.age)} cy={y(nearest.score)} r={5} fill="#F59E0B" stroke="#fff" strokeWidth={1.5} />
                <text x={x(nearest.age)} y={y(nearest.score) - 10} textAnchor="middle" fontSize="9" fill="#FCD34D">
                    現在 {currentAge}歳
                </text>

                {/* X軸ラベル（両端） */}
                <text x={padX} y={H - 4} fontSize="8" fill="#94A3B8">{minAge}歳</text>
                <text x={W - padX} y={H - 4} textAnchor="end" fontSize="8" fill="#94A3B8">{maxAge}歳</text>
            </svg>
        </div>
    );
};
