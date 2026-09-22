import React from "react";
import { IngredientDetail } from "../types";
import {
  X,
  Sparkles,
  Target,
  AlertCircle,
  FlaskConical,
  ShieldCheck,
  ShieldAlert,
  Info,
} from "lucide-react";

interface Props {
  ingredient: IngredientDetail | null;
  onClose: () => void;
}

export const IngredientDetailModal: React.FC<Props> = ({ ingredient, onClose }) => {
  if (!ingredient) return null;

  const isHigh = ingredient.hazardLevel === "HIGH";
  const isMod = ingredient.hazardLevel === "MODERATE";
  const isLow = ingredient.hazardLevel === "LOW";

  const score = ingredient.expectedEwgGrade?.hazardScore || (isHigh ? 8 : isMod ? 4 : 1);
  const clampedScore = Math.max(1, Math.min(10, score));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 pr-8 mb-4">
          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 shrink-0">
            #{ingredient.order}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-slate-900">
                {ingredient.koreanName}
              </h3>
              {ingredient.isAvoided && (
                <span className="px-2 py-0.5 rounded-md text-2xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                  기피 성분
                </span>
              )}
              {ingredient.isCaution20 && (
                <span className="px-2 py-0.5 rounded-md text-2xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  20가지 주의
                </span>
              )}
              {ingredient.isAllergen && (
                <span className="px-2 py-0.5 rounded-md text-2xs font-bold bg-orange-100 text-orange-800 border border-orange-200">
                  알레르기 유발
                </span>
              )}
            </div>
            {ingredient.originalName && (
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                INCI: {ingredient.originalName}
              </p>
            )}
          </div>
        </div>

        {/* EWG Hazard Meter Card */}
        <div
          className={`rounded-xl p-3.5 mb-4 border ${
            isHigh
              ? "bg-rose-50/70 border-rose-200 text-rose-900"
              : isMod
              ? "bg-amber-50/70 border-amber-200 text-amber-900"
              : "bg-emerald-50/70 border-emerald-200 text-emerald-900"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold flex items-center gap-1.5">
              {isHigh ? (
                <ShieldAlert className="w-4 h-4 text-rose-600" />
              ) : isMod ? (
                <ShieldAlert className="w-4 h-4 text-amber-600" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              )}
              <span>예상 EWG 위험 등급: {ingredient.ewgGrade || "그린"}</span>
            </span>
            <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-white/80 shadow-2xs font-mono">
              위험도 {clampedScore} / 10
            </span>
          </div>

          {/* 10-step visual gauge */}
          <div className="flex items-center gap-1 my-1.5">
            {Array.from({ length: 10 }).map((_, idx) => {
              const step = idx + 1;
              const isFilled = step <= clampedScore;
              let barColor = "bg-slate-200";
              if (isFilled) {
                if (step <= 2) barColor = "bg-emerald-500";
                else if (step <= 6) barColor = "bg-amber-500";
                else barColor = "bg-rose-500";
              }
              return (
                <div
                  key={idx}
                  className={`h-2 flex-1 rounded-2xs transition-all ${barColor}`}
                />
              );
            })}
          </div>

          {ingredient.expectedEwgGrade?.reasoning && (
            <p className="text-2xs mt-1.5 opacity-90 leading-relaxed">
              💡 <strong>평가 근거:</strong> {ingredient.expectedEwgGrade.reasoning}
            </p>
          )}
        </div>

        {/* Easy Explanation (Purpose & Side Effects) */}
        {ingredient.easyExplanation && (
          <div className="space-y-2.5 mb-4">
            {ingredient.easyExplanation.plainSummary && (
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-2xs font-bold text-teal-800 uppercase block">
                    소비자 1줄 요약
                  </span>
                  <p className="text-xs text-teal-950 font-medium leading-relaxed">
                    {ingredient.easyExplanation.plainSummary}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
                  <Target className="w-3.5 h-3.5 text-teal-600" />
                  <span>배합 목적 (왜 넣었을까?)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {ingredient.easyExplanation.simplePurpose || "피부 보습 및 제형 안정화"}
                </p>
              </div>

              <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>잠재적 부작용 & 주의점</span>
                </div>
                <p className="text-xs text-amber-950/90 leading-relaxed">
                  {ingredient.easyExplanation.potentialSideEffects || "일반적인 피부에 특이 부작용 없음"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Function Tags & Description */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div>
            <span className="text-2xs font-bold text-slate-400 block mb-1">
              공식 배합 기능
            </span>
            <div className="flex flex-wrap gap-1.5">
              {ingredient.functions.map((fn, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-slate-100 text-slate-700 text-2xs font-medium rounded-md"
                >
                  {fn}
                </span>
              ))}
            </div>
          </div>

          {ingredient.description && (
            <div>
              <span className="text-2xs font-bold text-slate-400 block mb-1">
                상세 해설
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {ingredient.description}
              </p>
            </div>
          )}

          {ingredient.cautionNotes && ingredient.cautionNotes !== "없음" && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800">
              <strong>주의사항:</strong> {ingredient.cautionNotes}
            </div>
          )}
        </div>

        {/* Footer Close */}
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
