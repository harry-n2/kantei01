import { useState, useEffect } from 'react';
import { DiagnosisForm } from './components/DiagnosisForm';
import { KanteiResult } from './components/KanteiResult';
import { Footer } from './components/Footer';
import { requestDiagnosis } from './lib/diagnose';
import type { DiagnosisInput, KanteiResultData } from './types/kantei';

const SLOT_KEYWORDS = [
    "運命の激変期", "金運覚醒", "至上の出会い", "才能の開花", "精神的自立",
    "予期せぬ吉報", "仕事の転換点", "ソウルメイト", "富の再構築", "過去の精算",
    "情熱の再燃", "直感の鋭化", "環境の大掃除", "良縁の引き寄せ", "自己超越",
    "未知への挑戦", "忍耐の結実", "カリスマ性の発現", "真実の愛", "資産形成の好機",
    "デトックス完了", "創造性の爆発", "社会的成功", "深い癒やし", "自由への扉",
    "パートナーシップ", "天職との遭遇", "バイタリティUP", "旅立ちの刻", "奇跡の前兆"
];

type Status = 'input' | 'analyzing' | 'result' | 'error';

const App = () => {
    const [status, setStatus] = useState<Status>('input');
    const [isSpinning, setIsSpinning] = useState(false);
    const [keyword, setKeyword] = useState("挑戦");
    const [result, setResult] = useState<KanteiResultData | null>(null);
    const [errorMsg, setErrorMsg] = useState('');

    // スロット演出（ヘッダーの装飾）
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

    const handleSubmit = async (input: DiagnosisInput, leftHand: File, rightHand: File, facePhoto: File) => {
        setStatus('analyzing');
        setErrorMsg('');
        try {
            const data = await requestDiagnosis(input, leftHand, rightHand, facePhoto);
            setResult(data);
            setStatus('result');
        } catch (e) {
            setErrorMsg(e instanceof Error ? e.message : '鑑定の生成に失敗しました。');
            setStatus('error');
        }
    };

    const reset = () => {
        setResult(null);
        setErrorMsg('');
        setStatus('input');
    };

    return (
        <div className="bg-[#0a0e1a] min-h-screen text-white font-sans flex flex-col items-center relative overflow-x-hidden">

            <header className="mt-20 text-center animate-fadeIn border-b border-white/5 pb-10 w-full">
                <p className="text-[#b7964b] text-[10px] tracking-[0.3em] font-bold mb-2 uppercase">Today's Keyword</p>
                <div className={`text-4xl font-black drop-shadow-lg mb-2 ${isSpinning ? 'animate-pulse' : ''}`}>
                    {keyword}
                </div>
                <p className="text-gray-500 text-[10px] mt-2 italic">今日のあなたの運勢を切り拓く鍵</p>
            </header>

            <main className="w-full max-w-xl px-6 flex-grow mt-12 mb-20 flex flex-col items-center">

                {status === 'input' && (
                    <div className="w-full animate-fadeIn">
                        <DiagnosisForm onSubmit={handleSubmit} />
                    </div>
                )}

                {status === 'analyzing' && (
                    <div className="flex flex-col items-center py-24 animate-pulse">
                        <div className="w-16 h-16 border-4 border-[#b7964b] border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_15px_rgba(183,150,75,0.4)]"></div>
                        <p className="text-[#b7964b] font-bold tracking-[0.2em] text-sm text-center">
                            AIが手相を読み解いています...<br />完了まで少々お待ちください
                        </p>
                    </div>
                )}

                {status === 'result' && result && (
                    <div className="animate-slideUp w-full">
                        <KanteiResult data={result} onReset={reset} />
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center py-24 text-center animate-fadeIn">
                        <p className="text-red-400 font-bold mb-6 leading-relaxed">{errorMsg}</p>
                        <button
                            onClick={reset}
                            className="text-text-muted text-sm underline decoration-white/20 tracking-widest hover:text-text-main transition-colors"
                        >
                            入力に戻る
                        </button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default App;
