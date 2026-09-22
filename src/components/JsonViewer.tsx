import React, { useState } from "react";
import { Copy, Check, Download, FileCode, CheckCircle2 } from "lucide-react";
import { AnalysisResult } from "../types";

interface Props {
  data: AnalysisResult;
}

export const JsonViewer: React.FC<Props> = ({ data }) => {
  const [copied, setCopied] = useState(false);
  const [isPretty, setIsPretty] = useState(true);

  const jsonString = isPretty
    ? JSON.stringify(data, null, 2)
    : JSON.stringify(data);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("복사 실패:", err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cosmetic_ingredients_analysis_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const lineCount = jsonString.split("\n").length;
  const byteSize = new Blob([jsonString]).size;

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 text-slate-100 overflow-hidden shadow-md">
      {/* Header bar */}
      <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-semibold text-slate-200">
            analysis_result.json
          </span>
          <span className="text-2xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
            규격 JSON 출력 (유효함)
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="text-2xs text-slate-400 font-mono mr-2 hidden sm:block">
            {lineCount} 줄 · {(byteSize / 1024).toFixed(1)} KB
          </div>

          <button
            type="button"
            onClick={() => setIsPretty(!isPretty)}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-xs font-mono"
          >
            {isPretty ? "한 줄 요약 (Minify)" : "정렬 보기 (Format)"}
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors flex items-center gap-1.5 text-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>복사 완료!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>JSON 복사</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 text-xs"
            title="JSON 파일 다운로드"
          >
            <Download className="w-3.5 h-3.5" />
            <span>다운로드</span>
          </button>
        </div>
      </div>

      {/* Code Container */}
      <div className="p-4 overflow-x-auto max-h-[600px] font-mono text-2xs sm:text-xs leading-relaxed text-slate-300">
        <pre className="selection:bg-emerald-900 selection:text-emerald-200">
          <code>{jsonString}</code>
        </pre>
      </div>

      {/* Footer Info */}
      <div className="bg-slate-950/40 px-4 py-2 border-t border-slate-800/60 text-2xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>대한화장품협회(KCA) 표준 한글 성분명 및 EWG SkinDeep 등급 규격 준수</span>
        </div>
        <span>JSON schema version 1.0</span>
      </div>
    </div>
  );
};
