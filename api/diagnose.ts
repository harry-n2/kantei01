// Vercel Serverless Function: 手相鑑定の生成
// - GEMINI_API_KEY はサーバー側のみ（クライアントへ露出しない）
// - 品質優先のため既定モデルは Gemini Pro系（GEMINI_MODEL で上書き可・実装時に最新IDを確認）
// - レート制限・簡易キャッシュはベストエフォート（ウォームインスタンス内のみ・永続化は要KV）
// - 個人情報の72h一時保持(LINE送客用)は KV 環境変数がある場合のみ書込（未設定時はスキップ）
//
// 注意: 本ファイルは src/ 外（Vercelが個別にビルド）。ローカルの `vite build` の型検査対象外。

type ReqLike = {
    method?: string;
    body?: unknown;
    headers: Record<string, string | string[] | undefined>;
};
type ResLike = {
    status: (code: number) => ResLike;
    json: (body: unknown) => void;
    setHeader: (k: string, v: string) => void;
};

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-pro';
const TTL_SECONDS = 72 * 60 * 60; // 72時間

// --- ベストエフォートのレート制限（IPごと・1分5件） ---
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
    const now = Date.now();
    const arr = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
    arr.push(now);
    hits.set(ip, arr);
    return arr.length > RATE_LIMIT;
}

// --- ベストエフォートのキャッシュ（同一入力→同一鑑定。永続化は要KV） ---
const cache = new Map<string, unknown>();

async function sha256(text: string): Promise<string> {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

// --- 72h一時保持（LINE送客用）。KV未設定時はスキップ ---
async function storeForLineFollowup(key: string, payload: unknown): Promise<void> {
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;
    if (!url || !token) {
        console.warn('[diagnose] KV未設定のため一時保持をスキップ（LINE送客用の保存は無効）');
        return;
    }
    try {
        // Upstash/Vercel KV REST: SET key value EX ttl
        await fetch(`${url}/set/${encodeURIComponent(key)}?EX=${TTL_SECONDS}`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
    } catch (e) {
        console.error('[diagnose] 一時保持の書込に失敗', e);
    }
}

// Gemini 構造化出力スキーマ
const responseSchema = {
    type: 'OBJECT',
    properties: {
        zodiac: { type: 'STRING' },
        summary: { type: 'STRING' },
        sevenLines: {
            type: 'ARRAY',
            items: {
                type: 'OBJECT',
                properties: {
                    line: { type: 'STRING' },
                    shape: { type: 'STRING' },
                    density: { type: 'STRING' },
                    observation: { type: 'STRING' },
                    advice: { type: 'STRING' },
                },
                required: ['line', 'shape', 'density', 'observation', 'advice'],
            },
        },
        physiognomy: {
            type: 'ARRAY',
            items: {
                type: 'OBJECT',
                properties: {
                    part: { type: 'STRING' },
                    observation: { type: 'STRING' },
                    advice: { type: 'STRING' },
                },
                required: ['part', 'observation', 'advice'],
            },
        },
        fortunes: {
            type: 'OBJECT',
            properties: {
                love: { type: 'STRING' },
                idealPartner: { type: 'STRING' },
                money: { type: 'STRING' },
                work: { type: 'STRING' },
                health: { type: 'STRING' },
            },
            required: ['love', 'idealPartner', 'money', 'work', 'health'],
        },
        lifeGraph: {
            type: 'ARRAY',
            items: {
                type: 'OBJECT',
                properties: {
                    age: { type: 'INTEGER' },
                    score: { type: 'INTEGER' },
                },
                required: ['age', 'score'],
            },
        },
        ageAdvice: {
            type: 'ARRAY',
            items: {
                type: 'OBJECT',
                properties: {
                    band: { type: 'STRING' },
                    text: { type: 'STRING' },
                },
                required: ['band', 'text'],
            },
        },
        lucky: {
            type: 'OBJECT',
            properties: {
                color: { type: 'STRING' },
                direction: { type: 'STRING' },
                item: { type: 'STRING' },
                action: { type: 'STRING' },
            },
            required: ['color', 'direction', 'item', 'action'],
        },
    },
    required: ['zodiac', 'summary', 'sevenLines', 'physiognomy', 'fortunes', 'lifeGraph', 'ageAdvice', 'lucky'],
};

function buildPrompt(p: {
    fullName: string;
    birthdate: string;
    sex: string;
    area: string;
    job: string;
    age: number;
}): string {
    const sexJa = p.sex === 'male' ? '男性' : p.sex === 'female' ? '女性' : 'その他';
    return [
        'あなたは経験豊富な手相・人相鑑定のプロです。以下のプロフィールと、両手の手のひら写真および顔写真（人相）をもとに、超詳細な鑑定書を作成してください。',
        '右手=現在・社会面、左手=本質・内面 として読み解いてください。顔写真は人相として読み解いてください。',
        '',
        '【プロフィール】',
        `氏名: ${p.fullName}`,
        `生年月日: ${p.birthdate}（満${p.age}歳）`,
        `性別: ${sexJa}`,
        `居住地: ${p.area}`,
        `職業: ${p.job}`,
        '',
        '【鑑定要件】',
        '・生命線/知能線/感情線/運命線/太陽線/財運線/結婚線 の7線を、線の形状・濃淡・枝分かれ・起点終点まで観察し、各線に具体的な助言を添える。',
        '・人相（顔）は、額/眉/目/鼻/口/輪郭 などの観点で観察し、各項目に具体的な助言を添える。',
        '・恋愛運/理想のパートナー像/金運・財運/仕事運/健康運 は特に充実した助言にする。',
        '・年代別アドバイス（〜50歳/50〜60代/60〜70代/70歳〜）を出力する。',
        '・総合運勢の年齢推移を、20歳〜80歳の範囲で8〜10点、score=0〜100 で出力する（本文と矛盾しないこと）。',
        '・ラッキーカラー/方位/アイテム/開運行動 を出力する。',
        '',
        '【重要・トーン】',
        'これは娯楽目的の占いです。「絶対」「必ず」「100%」などの断定や、健康・投資の確約は避け、前向きで思いやりのある表現にしてください。',
        '顔写真については、個人の特定・人種や容姿に関する断定的/差別的な評価は行わず、人相占いの範囲で前向きな所見と助言に留めてください。',
        '出力は指定されたJSONスキーマのみ。日本語で記述すること。',
    ].join('\n');
}

export default async function handler(req: ReqLike, res: ResLike) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        res.status(500).json({ error: 'サーバー設定エラー（APIキー未設定）。管理者にお問い合わせください。' });
        return;
    }

    const fwd = req.headers['x-forwarded-for'];
    const ip = (Array.isArray(fwd) ? fwd[0] : fwd)?.split(',')[0]?.trim() || 'unknown';
    if (rateLimited(ip)) {
        res.status(429).json({ error: 'アクセスが集中しています。少し時間をおいて再度お試しください。' });
        return;
    }

    const body = (req.body || {}) as Record<string, unknown>;
    const fullName = String(body.fullName || '').trim();
    const birthdate = String(body.birthdate || '').trim();
    const sex = String(body.sex || '').trim();
    const area = String(body.area || '').trim();
    const job = String(body.job || '').trim();
    const age = Number(body.age);
    const leftImage = body.leftImage as { mimeType?: string; data?: string } | undefined;
    const rightImage = body.rightImage as { mimeType?: string; data?: string } | undefined;
    const faceImage = body.faceImage as { mimeType?: string; data?: string } | undefined;

    if (!fullName || !birthdate || !sex || !area || !job || !Number.isFinite(age) ||
        !leftImage?.data || !rightImage?.data || !faceImage?.data) {
        res.status(400).json({ error: '入力が不足しています。すべての必須項目と手相・顔写真をご確認ください。' });
        return;
    }

    const profile = { fullName, birthdate, sex, area, job, age };

    // キャッシュ参照（同一入力→同一鑑定）
    const cacheKey = await sha256(JSON.stringify({ profile, l: leftImage.data, r: rightImage.data, f: faceImage.data }));
    if (cache.has(cacheKey)) {
        res.status(200).json(cache.get(cacheKey));
        return;
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;
    const geminiBody = {
        contents: [
            {
                role: 'user',
                parts: [
                    { text: buildPrompt(profile) },
                    { text: '右手（現在・社会面）の画像:' },
                    { inline_data: { mime_type: rightImage.mimeType || 'image/jpeg', data: rightImage.data } },
                    { text: '左手（本質・内面）の画像:' },
                    { inline_data: { mime_type: leftImage.mimeType || 'image/jpeg', data: leftImage.data } },
                    { text: '顔写真（人相）の画像:' },
                    { inline_data: { mime_type: faceImage.mimeType || 'image/jpeg', data: faceImage.data } },
                ],
            },
        ],
        generationConfig: {
            responseMimeType: 'application/json',
            responseSchema,
            temperature: 0.7,
        },
    };

    let geminiRes: globalThis.Response;
    try {
        geminiRes = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(geminiBody),
        });
    } catch (e) {
        console.error('[diagnose] Gemini呼び出しに失敗', e);
        res.status(502).json({ error: '鑑定エンジンへの接続に失敗しました。時間をおいて再度お試しください。' });
        return;
    }

    if (!geminiRes.ok) {
        const detail = await geminiRes.text().catch(() => '');
        console.error('[diagnose] Geminiエラー', geminiRes.status, detail);
        res.status(502).json({ error: '鑑定の生成に失敗しました。時間をおいて再度お試しください。' });
        return;
    }

    let content: unknown;
    try {
        const data = (await geminiRes.json()) as {
            candidates?: { content?: { parts?: { text?: string }[] } }[];
        };
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error('空のレスポンス');
        content = JSON.parse(text);
    } catch (e) {
        console.error('[diagnose] レスポンス解析に失敗', e);
        res.status(502).json({ error: '鑑定結果の解析に失敗しました。時間をおいて再度お試しください。' });
        return;
    }

    cache.set(cacheKey, content);

    // LINE送客用の一時保持（72h・KV未設定時はスキップ）
    await storeForLineFollowup(`kantei:${cacheKey}`, { profile, content, savedAt: Date.now() });

    res.status(200).json(content);
}
