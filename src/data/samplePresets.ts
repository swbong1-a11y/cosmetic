export interface AvoidedPreset {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
}

export const AVOIDED_PRESETS: AvoidedPreset[] = [
  {
    id: "sensitive",
    name: "민감성 피부 핵심 기피",
    description: "인공향료, 변성알코올, 페녹시에탄올, 파라벤 등 피부 자극 유발 대표 성분",
    ingredients: ["인공향료", "변성알코올", "에탄올", "페녹시에탄올", "파라벤", "피이지", "합성착색료"],
  },
  {
    id: "acne",
    name: "여드름/지성 모공 막힘 성분",
    description: "코메도제닉(모공 막힘) 지수가 높은 오일 및 지방산 유도체",
    ingredients: ["스테아릭애씨드", "미리스틱애씨드", "코코넛오일", "아이소프로필미리스테이트", "팔미틱애씨드", "시어버터"],
  },
  {
    id: "caution20",
    name: "대한민국 20가지 주의성분",
    description: "화해 및 뷰티 케어에서 지정한 대표적인 피부 주의 및 기피 성분",
    ingredients: [
      "파라벤",
      "페녹시에탄올",
      "피이지",
      "미네랄오일",
      "소듐라우릴설페이트",
      "트리에탄올아민",
      "인공향료",
      "디부틸히드록시톨루엔(BHT)",
      "아이소프로필알코올",
    ],
  },
  {
    id: "allergens",
    name: "식약처 고시 알레르기 유발 25종",
    description: "천연 에센셜 오일 및 향료에 자주 포함되는 접촉성 알레르기 유발 성분",
    ingredients: ["리모넨", "리날룰", "시트로넬올", "제라니올", "벤질알코올", "쿠마린", "유제놀", "신나밀알코올"],
  },
  {
    id: "pregnancy",
    name: "임산부 주의 성분",
    description: "체내 흡수 또는 자극 우려가 있어 임산부 시기 기피되는 성분",
    ingredients: ["레티놀", "비타민A", "살리실산", "벤조페논-3", "하이드로퀴논", "파라벤"],
  },
];

export interface SampleCosmetic {
  title: string;
  category: string;
  imageUrl?: string;
  rawText: string;
  suggestedAvoids: string[];
}

export const SAMPLE_COSMETICS: SampleCosmetic[] = [
  {
    title: "글로벌 세라마이드 하이드레이팅 크림 (영문 INCI 표기)",
    category: "수분 보습 크림",
    rawText: `Water/Aqua/Eau, Glycerin, Caprylic/Capric Triglyceride, Butylene Glycol, Cetearyl Alcohol, Dimethicone, PEG-100 Stearate, Glyceryl Stearate, Ceramide NP, Sodium Hyaluronate, Phenoxyethanol, Ethylhexylglycerin, Fragrance/Parfum, Limonene, Linalool, Carbomer, Tromethamine, Disodium EDTA.`,
    suggestedAvoids: ["실리콘", "피이지", "페녹시에탄올", "향료", "리모넨"],
  },
  {
    title: "시카 수딩 카밍 토너 (저자극 진정 토너)",
    category: "진정 토너",
    rawText: `병풀추출물, 정제수, 부틸렌글라이콜, 1,2-헥산다이올, 글리세린, 마데카소사이드, 아시아티코사이드, 판테놀, 알란토인, 소듐하이알루로네이트, 잔탄검, 다이포타슘글리시리제이트.`,
    suggestedAvoids: ["파라벤", "알코올", "향료", "피이지"],
  },
  {
    title: "딥 포어 오일 컨트롤 클렌징 폼 (지성/모공용)",
    category: "클렌징 폼",
    rawText: `Water, Myristic Acid, Glycerin, Stearic Acid, Potassium Hydroxide, Lauric Acid, Alcohol Denat., PEG-32, Glyceryl Stearate, PEG-100 Stearate, Sodium Lauryl Sulfate, Cocamidopropyl Betaine, Melaleuca Alternifolia (Tea Tree) Leaf Oil, Methylparaben, Propylparaben, BHT, Disodium EDTA.`,
    suggestedAvoids: ["스테아릭애씨드", "미리스틱애씨드", "알코올", "설페이트", "파라벤", "BHT"],
  },
];
