import React from "react";
import { Sparkles, ShieldAlert, Database, FileJson } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xs font-bold text-lg">
            INCI
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                화장품 전성분 분석 및 기피 성분 추출기
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Sparkles className="w-3 h-3" /> AI 정밀 추출
              </span>
            </div>
            <p className="text-xs text-slate-500">
              이미지 OCR 텍스트 추출 · 한국어 표준 성분명 번역 · EWG 유해성 등급 · 기피 성분 매칭 대조
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 self-end sm:self-center">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
            <Database className="w-3.5 h-3.5 text-teal-600" />
            <span>KCA & EWG SkinDeep DB</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
            <FileJson className="w-3.5 h-3.5 text-indigo-600" />
            <span>표준 JSON 규격</span>
          </div>
        </div>
      </div>
    </header>
  );
};
