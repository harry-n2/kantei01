import React, { useState } from 'react';
import { UploadField } from './UploadField';
import { Button } from './ui/Button';
import { Spacer } from './ui/Spacer';
import { ShieldCheck } from 'lucide-react';

type DiagnosisFormProps = {
    onSubmit: (age: number) => void;
};

export const DiagnosisForm: React.FC<DiagnosisFormProps> = ({ onSubmit }) => {
    const [age, setAge] = useState<string>('');
    const [leftHand, setLeftHand] = useState<File | null>(null);
    const [rightHand, setRightHand] = useState<File | null>(null);

    const isValid = age !== '' && !isNaN(Number(age)) && leftHand !== null && rightHand !== null;

    const handleSubmit = () => {
        if (isValid) {
            onSubmit(Number(age));
        }
    };

    return (
        <section className="w-full bg-surface py-10 px-4 md:px-8 shadow-inner border-y border-white/5">
            <div className="container max-w-2xl mx-auto flex flex-col items-center">

                <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-2">
                    <span className="text-primary mr-2">Step.1</span>
                    あなたの手相を読み込む
                </h2>
                <p className="text-text-muted text-sm text-center mb-8">
                    精度の高い解析を行うため、両手のひらの写真と<br />現在の年齢を入力してください。
                </p>

                <div className="w-full space-y-8">

                    {/* Age Input */}
                    <div className="w-full">
                        <label className="block text-text-main text-lg font-medium mb-2">現在の年齢</label>
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            placeholder="例: 25"
                            className="w-full bg-background border border-white/10 rounded-lg p-4 text-xl text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/20"
                        />
                    </div>

                    {/* Hands Upload */}
                    <div className="grid grid-cols-2 gap-4">
                        <UploadField
                            label="左手のひら"
                            side="left"
                            onImageSelect={setLeftHand}
                        />
                        <UploadField
                            label="右手のひら"
                            side="right"
                            onImageSelect={setRightHand}
                        />
                    </div>

                    <Spacer size="sm" />

                    {/* Privacy Note */}
                    <div className="flex items-start gap-2 bg-red-900/20 p-4 rounded-lg border border-red-500/30 text-sm">
                        <ShieldCheck size={16} className="text-red-400 shrink-0 mt-0.5" />
                        <p className="text-red-300 font-bold">
                            ※アップロードされた写真はAI解析のために一時的に使用され、
                            解析完了後、サーバーから即座に削除されます。
                            第三者に保存・公開されることは一切ありません。
                        </p>
                    </div>

                    <Spacer size="sm" />

                    <Button
                        size="lg"
                        disabled={!isValid}
                        onClick={handleSubmit}
                        className="w-full shadow-[0_0_30px_rgba(245,158,11,0.3)]"
                    >
                        運命のシナリオを解析する
                    </Button>

                </div>
            </div>
        </section>
    );
};
