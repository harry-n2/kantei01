// 手相鑑定書のデータ構造（フォーム入力 + Gemini生成結果）
// サンプル鑑定書（Lark docx 由来）の章立てに準拠。

export type Sex = 'male' | 'female' | 'other';

// フォームで収集する入力（個人情報）
export type DiagnosisInput = {
    fullName: string;       // 本名
    birthdate: string;      // YYYY-MM-DD
    sex: Sex;
    area: string;           // 住所（市区町村まで） 例: 東京都渋谷区
    job: string;            // 職業
};

// クライアントからAPIへ送るペイロード
export type DiagnosisRequest = DiagnosisInput & {
    age: number;                 // birthdate から算出
    leftImage: ImagePayload;     // 左手（本質・内面）
    rightImage: ImagePayload;    // 右手（現在・社会面）
    faceImage: ImagePayload;     // 顔（人相・正面）
    apiKey: string;              // ユーザー自身のGemini APIキー（BYOK・保存しない）
};

export type ImagePayload = {
    mimeType: string;   // image/jpeg 等
    data: string;       // base64（data URLのプレフィックスは除去）
};

// 手相7線の所見
export type PalmLine = {
    line: string;        // 生命線 / 知能線 / 感情線 / 運命線 / 太陽線 / 財運線 / 結婚線
    shape: string;       // 形状（起点終点・枝分かれ等）
    density: string;     // 濃淡
    observation: string; // 観察された特徴
    advice: string;      // 助言
};

// 人相（顔）の所見
export type PhysiognomyFeature = {
    part: string;        // 額 / 眉 / 目 / 鼻 / 口 / 輪郭 など
    observation: string; // 観察された特徴
    advice: string;      // 助言
};

export type Fortunes = {
    love: string;          // 恋愛運
    idealPartner: string;  // 理想のパートナー像
    money: string;         // 金運・財運
    work: string;          // 仕事運・道職運
    health: string;        // 健康運
};

export type GraphPoint = {
    age: number;    // 年齢
    score: number;  // 総合運勢スコア 0-100
};

export type AgeAdvice = {
    band: string;  // 〜50 / 50〜60 / 60〜70 / 70〜
    text: string;
};

export type Lucky = {
    color: string;
    direction: string;
    item: string;
    action: string;
};

// Gemini が生成する鑑定本体
export type KanteiContent = {
    zodiac: string;           // 星座（生年月日から）
    summary: string;          // 総合鑑定
    sevenLines: PalmLine[];   // 手相7線
    physiognomy: PhysiognomyFeature[]; // 人相（顔）
    fortunes: Fortunes;
    lifeGraph: GraphPoint[];  // 総合運勢の年齢推移
    ageAdvice: AgeAdvice[];   // 年代別アドバイス
    lucky: Lucky;
};

// 画面に渡す最終結果（入力プロフィール + 生成本体）
export type KanteiResultData = {
    profile: DiagnosisInput & { age: number };
    content: KanteiContent;
};
