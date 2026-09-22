import React, { useState } from "react";
import { FileText, ArrowRight, Check, Copy } from "lucide-react";
import { IngredientDetail } from "../types";

interface Props {
  rawText: string;
  ingredients: IngredientDetail[];
}

export const RawTextComparison: React.FC<Props> = ({ rawText, ingredients }) => {
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [copiedKorean, setCopiedKorean] = useState(false);

  const koreanFullList = ingredients.map((i) => i.koreanName).join(", ");

  const handleCopyRaw = async () => {
    await navigator.clipboard.writeText(rawText);
    setCopiedRaw(true);
    setTimeout(() => setCopiedRaw(false), 2000);
  };

  const handleCopyKorean = async () => {
    await navigator.clipboard.writeText(koreanFullList);
    setCopiedKorean(true);
    setTimeout(() => setCopiedKorean(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5">
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-1">
          원문 텍스트 추출 & 한국어 표준 번역 대조
        </h3>
        <p className="text-xs text-slate-500">
          이미지 OCR로 감지된 전성분 원본 텍스트와 대한민국 표준 성분명 매핑 결과를 검증할 수 있습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Raw OCR text */}
        <div className="flex flex-col bg-slate-50 rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              이미지 추출 원문 텍스트 (OCR Raw Text)
            </span>
            <button
              type="button"
              onClick={handleCopyRaw}
              className="text-2xs px-2 py-1 bg-white hover:bg-slate-100 rounded border border-slate-200 text-slate-600 flex items-center gap-1 transition-colors"
            >
              {copiedRaw ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" /> 복사됨
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" /> 복사
                </>
              )}
            </button>
          </div>
          <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs font-mono text-slate-700 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap flex-1">
            {rawText || "추출된 원문 텍스트가 없습니다."}
          </div>
        </div>

        {/* Right: Korean Standard Translated List */}
        <div className="flex flex-col bg-teal-50/50 rounded-xl border border-teal-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-teal-600" />
              한국어 표준 성분명 번역 목록 ({ingredients.length}개)
            </span>
            <button
              type="button"
              onClick={handleCopyKorean}
              className="text-2xs px-2 py-1 bg-white hover:bg-teal-100 rounded border border-teal-200 text-teal-800 flex items-center gap-1 transition-colors"
            >
              {copiedKorean ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" /> 복사됨
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" /> 복사
                </>
              )}
            </button>
          </div>
          <div className="p-3 bg-white rounded-lg border border-teal-200 text-xs text-slate-800 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap flex-1">
            {koreanFullList || "번역된 성분이 없습니다."}
          </div>
        </div>
      </div>

      {/* 1:1 Mapping Pair list */}
      <div className="pt-2 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-700 mb-2">
          1:1 성분별 번역 매핑 테이블:
        </h4>
        <div className="max-h-64 overflow-y-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0">
              <tr>
                <th className="py-2 px-3 w-12 text-center">#</th>
                <th className="py-2 px-3">원문 추출 텍스트 (INCI)</th>
                <th className="py-2 px-3">대한민국 표준 한글 성분명</th>
                <th className="py-2 px-3">일치 상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ingredients.map((item) => (
                <tr key={item.order} className="hover:bg-slate-50">
                  <td className="py-1.5 px-3 text-center text-slate-400 font-mono text-2xs">
                    {item.order}
                  </td>
                  <td className="py-1.5 px-3 font-mono text-slate-600">
                    {item.originalName}
                  </td>
                  <td className="py-1.5 px-3 font-semibold text-slate-900">
                    {item.koreanName}
                  </td>
                  <td className="py-1.5 px-3">
                    <span className="text-2xs text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full font-medium">
                      표준 매핑 완료
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
