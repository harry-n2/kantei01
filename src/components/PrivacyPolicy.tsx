import React from 'react';
import { X } from 'lucide-react';

type PrivacyPolicyProps = {
    open: boolean;
    onClose: () => void;
};

// プライバシーポリシー（モーダル）
// ※ 事業者名・問い合わせ先はプレースホルダ。確定後に差し替えること。
export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ open, onClose }) => {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="プライバシーポリシー"
        >
            <div
                className="relative w-full max-w-lg max-h-[80vh] overflow-y-auto bg-surface border border-primary/30 rounded-2xl p-6 text-left"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-text-muted hover:text-white transition-colors"
                    aria-label="閉じる"
                >
                    <X size={20} />
                </button>

                <h3 className="text-lg font-serif font-bold text-primary-glow mb-4">プライバシーポリシー</h3>

                <div className="space-y-4 text-sm text-text-muted leading-relaxed">
                    <section>
                        <h4 className="text-text-main font-bold mb-1">1. 取得する情報</h4>
                        <p>本サービスは、鑑定書の作成のため、お名前・生年月日・性別・お住まい（市区町村まで）・職業、および手のひらの画像・顔写真を取得します。</p>
                    </section>
                    <section>
                        <h4 className="text-text-main font-bold mb-1">2. 利用目的</h4>
                        <p>取得した情報は、(1) 手相鑑定書の生成、(2) ご希望に応じたLINEでの個別鑑定のご案内、の目的でのみ利用します。</p>
                    </section>
                    <section>
                        <h4 className="text-text-main font-bold mb-1">3. 保持期間と削除</h4>
                        <p>取得した情報および生成結果は、鑑定後72時間以内に自動的に削除します。手のひらの画像・顔写真は鑑定処理の完了後に破棄されます。</p>
                    </section>
                    <section>
                        <h4 className="text-text-main font-bold mb-1">4. 第三者提供</h4>
                        <p>法令に基づく場合を除き、取得した情報を第三者へ提供することはありません。鑑定の生成には外部のAIサービスを利用します。</p>
                    </section>
                    <section>
                        <h4 className="text-text-main font-bold mb-1">5. 鑑定の性質</h4>
                        <p>本サービスはAIを用いた娯楽目的の占いです。将来の出来事や成果を保証するものではありません。</p>
                    </section>
                    <section>
                        <h4 className="text-text-main font-bold mb-1">6. お問い合わせ</h4>
                        <p>事業者：[事業者名（未確定）]<br />連絡先：[連絡先（未確定）]</p>
                    </section>
                </div>
            </div>
        </div>
    );
};
