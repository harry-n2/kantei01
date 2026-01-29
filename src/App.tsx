import React, { useState, useEffect } from 'react';
import { DiagnosisForm } from './components/DiagnosisForm';
import { Footer } from './components/Footer';

// === 1. パス解決の完全固定 ===
const QR_PATH = `${import.meta.env.BASE_URL}LineQR_WTN.png`;

// スロットキーワード（既存維持）
const SLOT_KEYWORDS = [
    "運命の激変期", "金運覚醒", "至上の出会い", "才能の開花", "精神的自立",
    "予期せぬ吉報", "仕事の転換点", "ソウルメイト", "富の再構築", "過去の精算",
    "情熱の再燃", "直感の鋭化", "環境の大掃除", "良縁の引き寄せ", "自己超越",
    "未知への挑戦", "忍耐の結実", "カリスマ性の発現", "真実の愛", "資産形成の好機",
    "デトックス完了", "創造性の爆発", "社会的成功", "深い癒やし", "自由への扉",
    "パートナーシップ", "天職との遭遇", "バイタリティUP", "旅立ちの刻", "奇跡の前兆"
];

// --- 2. 既存ロジック：流年法年齢算出 ---
const calculateFortuneYears = (currentAge: number) => {
    // 過去の転機を複数生成（2〜4個）
    const pastAges: number[] = [];
    const pastCount = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < pastCount; i++) {
        const age = Math.max(1, currentAge - Math.floor(Math.random() * 8 + 3) - (i * 5));
        pastAges.push(age);
    }
    pastAges.sort((a, b) => b - a);

    // 未来の転機を複数生成（3〜5個）
    const futureAges: number[] = [];
    const count = Math.floor(Math.random() * 3) + 3;
    for (let i = 0; i < count; i++) {
        const age = currentAge + Math.floor(Math.random() * 5 + 1) + (i * 3);
        futureAges.push(age);
    }

    return { pastAges, futureAges };
};

const App = () => {
    const [status, setStatus] = useState<'input' | 'analyzing' | 'result'>('input');
    const [isAdmin, setIsAdmin] = useState(false);
    const [tapCount, setTapCount] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const [keyword, setKeyword] = useState("挑戦");
    const [results, setResults] = useState({ pastAges: [] as number[], futureAges: [] as number[] });

    // スロット演出の自動開始
    useEffect(() => {
        let count = 0;
        const interval = setInterval(() => {
            setIsSpinning(true);
            setKeyword(SLOT_KEYWORDS[Math.floor(Math.random() * SLOT_KEYWORDS.length)]);
            count++;
            if (count > 20) {
                clearInterval(interval);
                setIsSpinning(false);
                setKeyword(SLOT_KEYWORDS[new Date().getDate() % SLOT_KEYWORDS.length]);
            }
        }, 100);
        return () => clearInterval(interval);
    }, []);

    const handleAdminTrigger = () => {
        setTapCount(prev => {
            if (prev + 1 >= 5) { setIsAdmin(true); return 0; }
            return prev + 1;
        });
    };

    const handleDiagnosisSubmit = (age: number) => {
        setStatus('analyzing');
        setTimeout(() => {
            setResults(calculateFortuneYears(age));
            setStatus('result');
        }, 3000);
    };

    return (
        <div className="bg-[#0a0e1a] min-h-screen text-white font-sans flex flex-col items-center relative overflow-x-hidden">

            {/* 管理者バー */}
            {isAdmin && (
                <div className="fixed top-0 w-full bg-red-600 p-2 z-[9999] flex justify-between px-6 text-[10px] font-bold shadow-xl animate-fadeIn">
                    <span>ADMINISTRATOR MODE ENABLED</span>
                    <button onClick={() => setIsAdmin(false)} className="bg-white text-black px-2 py-0.5 rounded">CLOSE</button>
                </div>
            )}

            {/* ヘッダーセクション */}
            <header className="mt-20 text-center animate-fadeIn border-b border-white/5 pb-10 w-full">
                <p className="text-[#b7964b] text-[10px] tracking-[0.3em] font-bold mb-2 uppercase">Today's Keyword</p>
                <div className={`text-4xl font-black drop-shadow-lg mb-2 ${isSpinning ? 'animate-pulse' : ''}`}>
                    {keyword}
                </div>
                <p className="text-gray-500 text-[10px] mt-2 italic">今日のあなたの運勢を切り拓く鍵</p>
            </header>

            <main className="w-full max-w-sm px-6 flex-grow mt-12 mb-20 flex flex-col items-center">

                {status === 'input' && (
                    <div className="w-full animate-fadeIn">
                        <DiagnosisForm onSubmit={handleDiagnosisSubmit} />
                    </div>
                )}

                {status === 'analyzing' && (
                    <div className="flex flex-col items-center py-24 animate-pulse">
                        <div className="w-16 h-16 border-4 border-[#b7964b] border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_15px_rgba(183,150,75,0.4)]"></div>
                        <p className="text-[#b7964b] font-bold tracking-[0.2em] text-sm text-center">AI流年解析アルゴリズムを<br />実行中...</p>
                    </div>
                )}

                {/* --- 3. 【重要】鑑定結果カード --- */}
                {status === 'result' && (
                    <div className="animate-slideUp flex flex-col items-center w-full">
                        <div className="bg-[#111827] border-[1.5px] border-[#b7964b]/40 rounded-[2.8rem] p-10 w-full flex flex-col items-center shadow-[0_0_60px_rgba(0,0,0,0.6)] relative overflow-hidden">
                            <h2 className="text-[#fcd34d] text-xl font-bold mb-8 tracking-[0.3em]">鑑定結果</h2>

                            {/* 過去の転機 */}
                            <div className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 mb-6 text-center ring-1 ring-white/5 shadow-inner">
                                <p className="text-[10px] text-gray-400 mb-3 font-medium">過去の重大な転機</p>
                                <p className="text-[9px] text-gray-500 mb-3">あなたの経験と照らし合わせて精度を確認してください</p>
                                <div className="space-y-2">
                                    {results.pastAges.map((age, index) => (
                                        <div key={index} className="text-2xl font-black text-[#b7964b] opacity-90">
                                            {age}歳
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 未来の転機 */}
                            <div className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 mb-8 text-center ring-1 ring-white/5 shadow-inner">
                                <p className="text-[10px] text-gray-400 mb-2 font-medium">未来の重大な転機</p>

                                {/* 管理者モード: 全て表示 / 通常モード: 最初の2つのみ表示 */}
                                <div className="space-y-3">
                                    {(isAdmin ? results.futureAges : results.futureAges.slice(0, 2)).map((age, index) => (
                                        <div key={index} className={`text-3xl font-black text-[#fcd34d] select-none opacity-80 ${isAdmin ? '' : 'blur-md'}`}>
                                            {age}歳
                                        </div>
                                    ))}

                                    {/* 通常モードで隠された転機がある場合 */}
                                    {!isAdmin && results.futureAges.length > 2 && (
                                        <div className="text-sm text-gray-500 mt-2">
                                            他 {results.futureAges.length - 2}件の転機
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 inline-block bg-[#b7964b]/20 border border-[#b7964b]/40 px-3 py-1 rounded text-[9px] text-[#fcd34d] font-bold">
                                    ※詳細はLINE鑑定書にて解禁
                                </div>
                            </div>

                            {/* 詳細情報への誘導メッセージ */}
                            <div className="bg-[#1a1f2e] border border-[#b7964b]/30 rounded-xl p-5 mb-6">
                                <p className="text-[11px] text-gray-300 text-center leading-relaxed mb-3 font-medium">
                                    あなたの手相に刻まれた<span className="text-[#fcd34d] font-bold">「成功の予兆」</span>を検出しました。
                                </p>

                                <div className="bg-black/30 rounded-lg p-4 mb-3">
                                    <p className="text-[10px] text-[#fcd34d] font-bold mb-2 text-center">⚠️ 現在表示されているのは一部の情報のみです</p>
                                    <ul className="text-[9px] text-gray-400 space-y-1.5 text-left">
                                        <li>• 未来の転機の<span className="text-white font-bold">具体的な時期</span></li>
                                        <li>• その時期に<span className="text-white font-bold">どう行動すべきか</span>の詳細アドバイス</li>
                                        <li>• 転機を最大限に活かすための<span className="text-white font-bold">準備方法</span></li>
                                        <li>• あなた専用の<span className="text-white font-bold">運命のロードマップ</span></li>
                                    </ul>
                                </div>

                                <p className="text-[10px] text-center text-gray-400 leading-tight">
                                    これらの詳細情報は、<span className="text-[#fcd34d] font-bold">公式LINE登録者限定</span>で<br />
                                    個別鑑定メッセージとして無料でお届けします。
                                </p>
                            </div>

                            {/* 【強制表示】LINE QRコード：計画書に基づき物理固定 */}
                            <div className="bg-white p-3 rounded-[2rem] mb-10 shadow-xl ring-8 ring-[#b7964b]/5">
                                <img
                                    src={QR_PATH}
                                    alt="LINE QRコード"
                                    className="w-36 h-36 object-contain block mx-auto"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.parentElement!.innerHTML = '<div class="text-black font-bold p-10 text-center text-xs leading-tight">LINE友だち追加で<br/>詳細鑑定を受け取る</div>';
                                    }}
                                />
                            </div>

                            {/* 緑のLINEボタン：絶対固定 */}
                            <a
                                href="https://lin.ee/WdYf2tq"
                                className="w-full bg-[#00D656] hover:bg-[#00c24e] text-white font-black py-5 rounded-full text-center text-sm shadow-[0_10px_25px_rgba(0,214,86,0.3)] transition-all active:scale-95"
                            >
                                詳細鑑定をLINEで今すぐ開く
                            </a>

                            <p className="text-[8px] text-gray-600 mt-6 tracking-tight italic">※スパム送信なし。個人情報は厳密に管理されます。</p>
                        </div>

                        <button
                            onClick={() => setStatus('input')}
                            className="mt-10 text-gray-600 text-xs underline decoration-gray-800 tracking-widest hover:text-gray-400 transition-colors"
                        >
                            入力をやり直す
                        </button>
                    </div>
                )}
            </main>

            <Footer onClick={handleAdminTrigger} />
        </div>
    );
};

export default App;
