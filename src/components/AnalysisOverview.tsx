import React from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Flame,
  CheckCircle,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { ProductSummary, CautionCategories } from "../types";

interface Props {
  summary: ProductSummary;
  cautionCategories: CautionCategories;
}

export const AnalysisOverview: React.FC<Props> = ({
  summary,
  cautionCategories,
}) => {
  const getVerdictStyle = () => {
    switch (summary.avoidanceVerdict) {
      case "DANGER":
        return {
          bg: "bg-rose-50 border-rose-200 text-rose-900",
          badgeBg: "bg-rose-600 text-white",
          icon: <Flame className="w-5 h-5 text-rose-600" />,
          title: "사용 주의 (기피 성분 및 고위험 성분 다수 포함)",
        };
      case "WARNING":
        return {
          bg: "bg-rose-50/70 border-rose-200 text-rose-900",
          badgeBg: "bg-rose-500 text-white",
          icon: <ShieldAlert className="w-5 h-5 text-rose-600" />,
          title: "기피 성분 검출됨 (사용 전 전성분 주의 요망)",
        };
      case "CAUTION":
        return {
          bg: "bg-amber-50 border-amber-200 text-amber-900",
          badgeBg: "bg-amber-500 text-white",
          icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
          title: "주의 필요 (피부 타입별 반응 확인 권장)",
        };
      case "SAFE":
      default:
        return {
          bg: "bg-emerald-50 border-emerald-200 text-emerald-900",
          badgeBg: "bg-emerald-600 text-white",
          icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
          title: "기피 성분 미검출 (안심 사용 권장)",
        };
    }
  };

  const verdict = getVerdictStyle();

  return (
    <div className="space-y-4">
      {/* Primary Verdict Banner */}
      <div className={`p-4 rounded-xl border ${verdict.bg} shadow-xs`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/80 shadow-2xs">
              {verdict.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${verdict.badgeBg}`}>
                  {summary.avoidanceVerdict}
                </span>
                <h3 className="font-bold text-base">{verdict.title}</h3>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                추출된 제품명:{" "}
                <span className="font-semibold text-slate-800">
                  {summary.detectedProductName || "제품 라벨 인식 완료"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold self-end sm:self-center">
            {summary.matchedAvoidCount > 0 ? (
              <span className="px-3 py-1.5 rounded-lg bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1.5 font-bold animate-pulse">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                기피 성분 {summary.matchedAvoidCount}개 검출
              </span>
            ) : (
              <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                기피 성분 0개 (안전)
              </span>
            )}
          </div>
        </div>

        {/* Detailed Safety Summary Narrative */}
        <div className="mt-3 pt-3 border-t border-slate-200/60 text-xs text-slate-700 leading-relaxed bg-white/40 p-3 rounded-lg">
          <div className="flex items-center gap-1 font-semibold text-slate-900 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            성분 종합 평가 요약:
          </div>
          {summary.overallSafetySummary}
        </div>
      </div>

      {/* Numerical Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {/* Total Ingredients */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500 mb-1">총 전성분 수</div>
          <div className="text-xl font-extrabold text-slate-900">
            {summary.totalIngredientsCount}
            <span className="text-xs font-normal text-slate-400 ml-1">개</span>
          </div>
        </div>

        {/* Difficult Ingredients Decoded */}
        <div className="bg-indigo-50/60 p-3 rounded-xl border border-indigo-200/80 shadow-2xs">
          <div className="text-xs font-medium text-indigo-700 mb-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            어려운 성분 해설
          </div>
          <div className="text-xl font-extrabold text-indigo-700">
            {summary.difficultIngredientsCount ?? 0}
            <span className="text-xs font-normal text-indigo-400 ml-1">개</span>
          </div>
        </div>

        {/* Avoided Matches */}
        <div
          className={`p-3 rounded-xl border shadow-2xs ${
            summary.matchedAvoidCount > 0
              ? "bg-rose-50/50 border-rose-200"
              : "bg-white border-slate-200"
          }`}
        >
          <div className="text-xs font-medium text-slate-500 mb-1">기피 성분 매칭</div>
          <div
            className={`text-xl font-extrabold ${
              summary.matchedAvoidCount > 0 ? "text-rose-600" : "text-emerald-600"
            }`}
          >
            {summary.matchedAvoidCount}
            <span className="text-xs font-normal text-slate-400 ml-1">개</span>
          </div>
        </div>

        {/* EWG Green (Low Hazard) */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            EWG 그린 (1-2)
          </div>
          <div className="text-xl font-extrabold text-emerald-600">
            {summary.lowHazardCount}
            <span className="text-xs font-normal text-slate-400 ml-1">개</span>
          </div>
        </div>

        {/* EWG Yellow (Moderate Hazard) */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            EWG 옐로우 (3-6)
          </div>
          <div className="text-xl font-extrabold text-amber-600">
            {summary.moderateHazardCount}
            <span className="text-xs font-normal text-slate-400 ml-1">개</span>
          </div>
        </div>

        {/* EWG Red (High Hazard) */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            EWG 레드 (7-10)
          </div>
          <div className="text-xl font-extrabold text-rose-600">
            {summary.highHazardCount}
            <span className="text-xs font-normal text-slate-400 ml-1">개</span>
          </div>
        </div>

        {/* 20 Caution Ingredients & Allergens */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500 mb-1">
            주의 / 알레르기
          </div>
          <div className="text-sm font-bold text-slate-700 flex items-center gap-1">
            <span className="text-rose-600 font-extrabold text-base">
              {cautionCategories.twentyCautionIngredients?.length || 0}
            </span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-amber-600 font-extrabold text-base">
              {cautionCategories.allergens?.length || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
