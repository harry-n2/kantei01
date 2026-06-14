import type {
    DiagnosisInput,
    ImagePayload,
    KanteiContent,
    KanteiResultData,
} from '@/types/kantei';

// 生年月日から満年齢を算出
export function calcAge(birthdate: string, now: Date = new Date()): number {
    const b = new Date(birthdate);
    let age = now.getFullYear() - b.getFullYear();
    const m = now.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
    return age;
}

// 画像を最大辺 maxDim にリサイズし JPEG base64 へ変換（送信量・コスト削減）
export function fileToImagePayload(file: File, maxDim = 1024): Promise<ImagePayload> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(url);
            const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
            const w = Math.round(img.width * scale);
            const h = Math.round(img.height * scale);
            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('画像処理に失敗しました'));
                return;
            }
            ctx.drawImage(img, 0, 0, w, h);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            const data = dataUrl.split(',')[1] ?? '';
            resolve({ mimeType: 'image/jpeg', data });
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('画像を読み込めませんでした'));
        };
        img.src = url;
    });
}

// APIへ鑑定を依頼し、結果を取得
export async function requestDiagnosis(
    input: DiagnosisInput,
    leftHand: File,
    rightHand: File,
    facePhoto: File,
): Promise<KanteiResultData> {
    const age = calcAge(input.birthdate);
    const [leftImage, rightImage, faceImage] = await Promise.all([
        fileToImagePayload(leftHand),
        fileToImagePayload(rightHand),
        fileToImagePayload(facePhoto),
    ]);

    const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...input, age, leftImage, rightImage, faceImage }),
    });

    if (!res.ok) {
        let message = '鑑定の生成に失敗しました。時間をおいて再度お試しください。';
        try {
            const err = (await res.json()) as { error?: string };
            if (err?.error) message = err.error;
        } catch {
            // ignore parse error
        }
        throw new Error(message);
    }

    const content = (await res.json()) as KanteiContent;
    return {
        profile: { ...input, age },
        content,
    };
}
