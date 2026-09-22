import React from "react";
import { ShieldAlert, AlertCircle, ArrowRight, Info } from "lucide-react";
import { AvoidedMatch } from "../types";

interface Props {
  matches: AvoidedMatch[];
}

export const AvoidedAlertBox: React.FC<Props> = ({ matches }) => {
  if (matches.length === 0) return null;

  return (
    <div className="bg-rose-50/90 border border-rose-300 rounded-xl p-5 shadow-xs">
      <div className="flex items-center gap-2 mb-3">
        <ShieldAlert className="w-5 h-5 text-rose-600 animate-bounce" />
        <h3 className="text-sm font-bold text-rose-900">
          기피 성분 검출 경고 리포트 (총 {matches.length}개 일치)
        </h3>
      </div>
      <p className="text-xs text-rose-700 mb-3">
        사용자가 지정한 기피 단어와 직·간접적으로 일치하거나 화학적 파생 관계에 있는 성분이 제품 전성분표에서 확인되었습니다.
      </p>

      <div className="space-y-2.5">
        {matches.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg border border-rose-200 p-3.5 shadow-2xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-sm bg-rose-100 text-rose-800 border border-rose-200">
                  기피어: {item.userAvoidedTerm}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-sm font-bold text-slate-900">
                  {item.matchedIngredientKorean}
                </span>
                {item.matchedIngredientOriginal &&
                  item.matchedIngredientOriginal !== item.matchedIngredientKorean && (
                    <span className="text-xs text-slate-500 font-mono">
                      ({item.matchedIngredientOriginal})
                    </span>
                  )}
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    item.hazardLevel === "HIGH"
                      ? "bg-rose-600 text-white"
                      : item.hazardLevel === "MODERATE"
                      ? "bg-amber-500 text-white"
                      : "bg-emerald-600 text-white"
                  }`}
                >
                  EWG {item.hazardGrade}
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <div>
                <span className="font-semibold text-slate-700">대조 사유: </span>
                {item.matchReason}
              </div>
              <div className="flex items-start gap-1 text-rose-800 bg-rose-50/50 p-2 rounded-md border border-rose-100">
                <Info className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="font-semibold">잠재적 위험 및 주의사항:</strong>{" "}
                  {item.riskDetails}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
