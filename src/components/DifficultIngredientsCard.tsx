import React from "react";
import { DifficultIngredientHighlight } from "../types";
import { FlaskConical, Target, AlertCircle, Sparkles, ShieldCheck, ShieldAlert } from "lucide-react";

interface Props {
  highlights?: DifficultIngredientHighlight[];
}

export const DifficultIngredientsCard: React.FC<Props> = ({ highlights }) => {
  if (!highlights || highlights.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-900/90 via-slate-900 to-indigo-950 rounded-2xl p-5 text-white shadow-md border border-indigo-500/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
            <FlaskConical className="w-4 h-4 text-indigo-300" />
          </div>
          <div>
            <h3 className="text-sm font-bold flex items-center gap-1.5">
              <span>라벨 속 어려운 화학 성분 집중 해설</span>
              <span className="px-2 py-0.5 rounded-full text-2xs bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                {highlights.length}개 주요 성분
              </span>
            </h3>
            <p className="text-2xs text-slate-300">
              일반인이 이해하기 어려운 전문 화학 성분의 쉬운 배합 목적과 예상 EWG 위험도를 선별 요약했습니다.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {highlights.map((item, idx) => {
          const isHigh = item.hazardLevel === "HIGH";
          const isMod = item.hazardLevel === "MODERATE";

          return (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-xs rounded-xl p-3.5 border border-white/10 hover:border-indigo-400/40 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <h4 className="font-bold text-xs text-white">
                      {item.koreanName}
                    </h4>
                    {item.originalName && (
                      <span className="text-3xs text-indigo-200/70 font-mono block">
                        {item.originalName}
                      </span>
                    )}
                  </div>

                  <span
                    className={`shrink-0 px-2 py-0.5 rounded-md text-3xs font-bold ${
                      isHigh
                        ? "bg-rose-500/30 text-rose-300 border border-rose-500/40"
                        : isMod
                        ? "bg-amber-500/30 text-amber-300 border border-amber-500/40"
                        : "bg-emerald-500/30 text-emerald-300 border border-emerald-500/40"
                    }`}
                  >
                    EWG {item.expectedEwgGrade}
                  </span>
                </div>

                {item.plainSummary && (
                  <div className="text-2xs text-teal-300 font-semibold mb-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-teal-400 shrink-0" />
                    <span>{item.plainSummary}</span>
                  </div>
                )}

                <div className="space-y-1.5 text-2xs">
                  <div className="bg-slate-900/40 rounded-md p-2 border border-white/5">
                    <span className="text-3xs font-bold text-indigo-300 uppercase block mb-0.5">
                      🎯 배합 목적:
                    </span>
                    <p className="text-slate-200 leading-relaxed">
                      {item.simplePurpose}
                    </p>
                  </div>

                  <div className="bg-slate-900/40 rounded-md p-2 border border-white/5">
                    <span className="text-3xs font-bold text-amber-300 uppercase block mb-0.5">
                      ⚠️ 잠재적 부작용:
                    </span>
                    <p className="text-slate-200 leading-relaxed">
                      {item.potentialSideEffects}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
