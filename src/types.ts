export type HazardLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'UNKNOWN';

export type AvoidanceVerdict = 'SAFE' | 'CAUTION' | 'WARNING' | 'DANGER';

export interface EasyExplanation {
  isDifficultChemical: boolean;
  simplePurpose: string;
  potentialSideEffects: string;
  plainSummary: string;
}

export interface ExpectedEwgInfo {
  grade: string;
  hazardScore: number;
  category: HazardLevel;
  reasoning: string;
}

export interface IngredientDetail {
  order: number;
  originalName: string;
  koreanName: string;
  ewgGrade: string;
  hazardLevel: HazardLevel;
  isAvoided: boolean;
  matchedAvoidTerm: string | null;
  functions: string[];
  description: string;
  cautionNotes: string;
  isCaution20: boolean;
  isAllergen: boolean;
  easyExplanation?: EasyExplanation;
  expectedEwgGrade?: ExpectedEwgInfo;
}

export interface DifficultIngredientHighlight {
  koreanName: string;
  originalName: string;
  simplePurpose: string;
  potentialSideEffects: string;
  plainSummary: string;
  expectedEwgGrade: string;
  hazardLevel: HazardLevel;
}

export interface AvoidedMatch {
  userAvoidedTerm: string;
  matchedIngredientKorean: string;
  matchedIngredientOriginal: string;
  matchReason: string;
  hazardGrade: string;
  hazardLevel: HazardLevel;
  riskDetails: string;
}

export interface ProductSummary {
  detectedProductName: string;
  totalIngredientsCount: number;
  extractedRawText: string;
  matchedAvoidCount: number;
  highHazardCount: number;
  moderateHazardCount: number;
  lowHazardCount: number;
  unknownHazardCount: number;
  difficultIngredientsCount?: number;
  overallSafetySummary: string;
  avoidanceVerdict: AvoidanceVerdict;
}

export interface CautionCategories {
  twentyCautionIngredients: string[];
  allergens: string[];
  comedogenic: string[];
}

export interface AnalysisResult {
  productSummary: ProductSummary;
  avoidedIngredientsMatches: AvoidedMatch[];
  difficultIngredientsHighlights?: DifficultIngredientHighlight[];
  ingredients: IngredientDetail[];
  cautionCategories: CautionCategories;
}

export interface AnalysisRequest {
  imageBase64?: string;
  imageMimeType?: string;
  rawText?: string;
  avoidedIngredients: string[];
}

