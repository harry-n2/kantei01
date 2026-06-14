import React, { useState } from 'react';
import { UploadField } from './UploadField';
import { PrivacyPolicy } from './PrivacyPolicy';
import { Button } from './ui/Button';
import { Spacer } from './ui/Spacer';
import { ShieldCheck } from 'lucide-react';
import type { DiagnosisInput, Sex } from '@/types/kantei';

type DiagnosisFormProps = {
    onSubmit: (input: DiagnosisInput, leftHand: File, rightHand: File, facePhoto: File) => void;
};

const TODAY = new Date().toISOString().slice(0, 10);

export const DiagnosisForm: React.FC<DiagnosisFormProps> = ({ onSubmit }) => {
    const [fullName, setFullName] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [sex, setSex] = useState<Sex | ''>('');
    const [area, setArea] = useState('');
    const [job, setJob] = useState('');
    const [leftHand, setLeftHand] = useState<File | null>(null);
    const [rightHand, setRightHand] = useState<File | null>(null);
    const [facePhoto, setFacePhoto] = useState<File | null>(null);
    const [agreed, setAgreed] = useState(false);
    const [policyOpen, setPolicyOpen] = useState(false);
    const [error, setError] = useState('');

    const birthValid = birthdate !== '' && birthdate <= TODAY;

    const isValid =
        fullName.trim() !== '' &&
        birthValid &&
        sex !== '' &&
        area.trim() !== '' &&
        job.trim() !== '' &&
        leftHand !== null &&
        rightHand !== null &&
        facePhoto !== null &&
        agreed;

    const handleSubmit = () => {
        if (!isValid) {
            setError('未入力の項目、または同意のチェックがあります。ご確認ください。');
            return;
        }
        setError('');
        onSubmit(
            { fullName: fullName.trim(), birthdate, sex: sex as Sex, area: area.trim(), job: job.trim() },
            leftHand as File,
            rightHand as File,
            facePhoto as File,
        );
    };

    const inputClass =
        'w-full bg-background border border-white/10 rounded-lg p-3.5 text-base text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/20';

    return (
        <section className="w-full bg-surface py-10 px-4 md:px-8 shadow-inner border-y border-white/5">
            <div className="container max-w-xl mx-auto flex flex-col items-center">

                <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-2">
                    <span className="text-primary mr-2">Step.1</span>
                    鑑定情報を入力する
                </h2>
                <p className="text-text-muted text-sm text-center mb-8">
                    超詳細な手相鑑定書をお作りするため、<br />以下の情報と両手のひらの写真をご用意ください。
                </p>

                <div className="w-full space-y-5">
                    <div>
                        <label className="block text-text-main text-sm font-medium mb-1.5">お名前（本名）<span className="text-primary ml-1">必須</span></label>
                        <input type="text" value={fullName} required maxLength={50}
                            onChange={(e) => setFullName(e.target.value)} placeholder="例：山田 太郎" className={inputClass} />
                    </div>

                    <div>
                        <label className="block text-text-main text-sm font-medium mb-1.5">生年月日<span className="text-primary ml-1">必須</span></label>
                        <input type="date" value={birthdate} required max={TODAY}
                            onChange={(e) => setBirthdate(e.target.value)} className={inputClass} />
                        {birthdate !== '' && !birthValid && (
                            <p className="text-red-400 text-xs mt-1">正しい生年月日を入力してください。</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-text-main text-sm font-medium mb-1.5">性別<span className="text-primary ml-1">必須</span></label>
                        <select value={sex} required onChange={(e) => setSex(e.target.value as Sex)} className={inputClass}>
                            <option value="" disabled>選択してください</option>
                            <option value="male">男性</option>
                            <option value="female">女性</option>
                            <option value="other">その他・回答しない</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-text-main text-sm font-medium mb-1.5">お住まい（市区町村まで）<span className="text-primary ml-1">必須</span></label>
                        <input type="text" value={area} required maxLength={60}
                            onChange={(e) => setArea(e.target.value)} placeholder="例：東京都渋谷区" className={inputClass} />
                    </div>

                    <div>
                        <label className="block text-text-main text-sm font-medium mb-1.5">職業<span className="text-primary ml-1">必須</span></label>
                        <input type="text" value={job} required maxLength={50}
                            onChange={(e) => setJob(e.target.value)} placeholder="例：会社員" className={inputClass} />
                    </div>

                    <Spacer size="sm" />

                    {/* 顔写真（人相） */}
                    <div className="w-1/2 mx-auto">
                        <UploadField label="顔写真（正面）" side="face" onImageSelect={setFacePhoto} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <UploadField label="左手のひら" side="left" onImageSelect={setLeftHand} />
                        <UploadField label="右手のひら" side="right" onImageSelect={setRightHand} />
                    </div>

                    {/* プライバシー注記（実態=72h一時保持に整合） */}
                    <div className="flex items-start gap-2 bg-background/60 p-4 rounded-lg border border-white/10 text-sm">
                        <ShieldCheck size={16} className="text-primary shrink-0 mt-0.5" />
                        <p className="text-text-muted leading-relaxed">
                            ご入力情報と画像は鑑定書の作成とLINEでのご案内に利用し、
                            <span className="text-text-main">72時間以内に自動削除</span>します。第三者へ提供することはありません。
                        </p>
                    </div>

                    {/* 同意 */}
                    <label className="flex items-start gap-2 text-sm cursor-pointer">
                        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                            className="mt-1 accent-primary w-4 h-4 shrink-0" />
                        <span className="text-text-muted">
                            <button type="button" onClick={() => setPolicyOpen(true)} className="text-primary underline">プライバシーポリシー</button>
                            に同意します。
                        </span>
                    </label>

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <Spacer size="sm" />

                    <Button size="lg" disabled={!isValid} onClick={handleSubmit}
                        className="w-full shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                        手相鑑定書を作成する
                    </Button>
                </div>
            </div>

            <PrivacyPolicy open={policyOpen} onClose={() => setPolicyOpen(false)} />
        </section>
    );
};
