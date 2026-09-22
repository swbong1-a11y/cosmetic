import React, { useState } from "react";
import { Header } from "./components/Header";
import { AvoidedIngredientsInput } from "./components/AvoidedIngredientsInput";
import { UploadSection } from "./components/UploadSection";
import { AnalysisOverview } from "./components/AnalysisOverview";
import { AvoidedAlertBox } from "./components/AvoidedAlertBox";
import { IngredientList } from "./components/IngredientList";
import { AnalysisResult, AnalysisRequest } from "./types";
import { SampleCosmetic } from "./data/samplePresets";
import {
  RotateCcw,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";

export default function App() {
  const [avoidedList, setAvoidedList] = useState<string[]>([
    "파라벤",
    "페녹시에탄올",
    "피이지",
    "실리콘",
    "인공향료",
  ]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleAnalyze = async (payload: {
    imageBase64?: string;
    imageMimeType?: string;
    rawText?: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const requestBody: AnalysisRequest = {
        imageBase64: payload.imageBase64,
        imageMimeType: payload.imageMimeType,
        rawText: payload.rawText,
        avoidedIngredients: avoidedList,
      };

      const response = await fetch("/api/analyze-ingredients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `서버 오류가 발생했습니다. (상태 코드: ${response.status})`
        );
      }

      const data: AnalysisResult = await response.json();
      setAnalysisResult(data);
    } catch (err: any) {
      console.error("분석 실패:", err);
      setError(err.message || "성분표 분석 도중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleSelect = (sample: SampleCosmetic) => {
    if (sample.suggestedAvoids && sample.suggestedAvoids.length > 0) {
      // Append suggested avoids if not already present
      const combined = Array.from(new Set([...avoidedList, ...sample.suggestedAvoids]));
      setAvoidedList(combined);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setError(null);
  };

  const handleCopyRawData = () => {
    if (!analysisResult) return;
    navigator.clipboard.writeText(JSON.stringify(analysisResult, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Error notification */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <strong className="font-bold text-sm block mb-0.5">분석 오류 발생</strong>
              {error}
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-xs text-rose-500 hover:text-rose-800 font-semibold"
            >
              닫기
            </button>
          </div>
        )}

        {/* Input & Configuration Section (Shown always or minimized when results exist) */}
        {!analysisResult ? (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-md">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  신뢰성 높은 화장품 데이터베이스 기반 전문 분석기
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
                  화장품 전성분표 이미지 추출 및 기피 성분 정밀 대조
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  화장품 단상자나 용기 뒷면의 전성분 사진을 업로드하세요. AI가 이미지 속 모든 텍스트를 추출하고 공식 대한민국 화장품 표준 한글명으로 번역한 뒤, 사용자의 기피 성분 목록과 정밀 대조하여 유해성 등급(EWG)과 상세 설명을 표준 JSON 규격 및 대시보드로 제공합니다.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Image/Text Upload (7 cols) */}
              <div className="lg:col-span-7">
                <UploadSection
                  onAnalyze={handleAnalyze}
                  isLoading={isLoading}
                  onSampleSelect={handleSampleSelect}
                />
              </div>

              {/* Right Column: Avoided Ingredients Configuration (5 cols) */}
              <div className="lg:col-span-5">
                <AvoidedIngredientsInput
                  avoidedList={avoidedList}
                  onChange={setAvoidedList}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Results Dashboard View */
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-700">분석 완료 제품:</span>
                <span className="text-sm font-extrabold text-slate-900">
                  {analysisResult.productSummary.detectedProductName || "화장품 전성분표"}
                </span>
                <span className="text-xs text-slate-500">
                  (총 {analysisResult.productSummary.totalIngredientsCount}개 성분 추출됨)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyRawData}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium flex items-center gap-1.5 transition-colors"
                  title="전문가용 원본 JSON 데이터 클립보드 복사"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">복사됨!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>데이터 복사</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  새로운 제품 분석하기
                </button>
              </div>
            </div>

            {/* Overall Executive Summary Banner & Metric Cards */}
            <AnalysisOverview
              summary={analysisResult.productSummary}
              cautionCategories={analysisResult.cautionCategories}
            />

            {/* If avoided matches exist, display urgent alert box immediately */}
            {analysisResult.avoidedIngredientsMatches?.length > 0 && (
              <AvoidedAlertBox matches={analysisResult.avoidedIngredientsMatches} />
            )}

            {/* Smart Curated Ingredient Report */}
            <IngredientList ingredients={analysisResult.ingredients} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-2xs text-slate-500">
          대한민국 화장품 전성분 표시제 및 대한화장품협회 성분사전, EWG SkinDeep 기준 데이터 제공 · 의료적 진단을 대신하지 않으므로 개인 피부 타입에 맞게 테스트 후 사용을 권장합니다.
        </div>
      </footer>
    </div>
  );
}
