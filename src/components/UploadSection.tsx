import React, { useState, useRef, ChangeEvent, DragEvent, ClipboardEvent } from "react";
import {
  UploadCloud,
  Image as ImageIcon,
  FileText,
  Camera,
  X,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { SAMPLE_COSMETICS, SampleCosmetic } from "../data/samplePresets";

interface Props {
  onAnalyze: (payload: {
    imageBase64?: string;
    imageMimeType?: string;
    rawText?: string;
  }) => void;
  isLoading: boolean;
  onSampleSelect: (sample: SampleCosmetic) => void;
}

export const UploadSection: React.FC<Props> = ({
  onAnalyze,
  isLoading,
  onSampleSelect,
}) => {
  const [mode, setMode] = useState<"image" | "text">("image");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedMimeType, setSelectedMimeType] = useState<string>("image/jpeg");
  const [rawText, setRawText] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file reading
  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일(PNG, JPG, WEBP 등)만 업로드할 수 있습니다.");
      return;
    }
    setSelectedMimeType(file.type);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Clipboard paste support (screenshots)
  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          processFile(file);
          setMode("image");
          break;
        }
      }
    }
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleStartAnalysis = () => {
    if (mode === "image") {
      if (!selectedImage) return;
      onAnalyze({
        imageBase64: selectedImage,
        imageMimeType: selectedMimeType,
      });
    } else {
      if (!rawText.trim()) return;
      onAnalyze({
        rawText: rawText.trim(),
      });
    }
  };

  const handleLoadSample = (sample: SampleCosmetic) => {
    setMode("text");
    setRawText(sample.rawText);
    onSampleSelect(sample);
  };

  return (
    <div
      onPaste={handlePaste}
      className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs"
    >
      {/* Mode Selector & Sample Presets Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setMode("image")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              mode === "image"
                ? "bg-white text-emerald-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            전성분표 이미지 업로드
          </button>
          <button
            type="button"
            onClick={() => setMode("text")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              mode === "text"
                ? "bg-white text-emerald-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            성분 텍스트 직접 입력
          </button>
        </div>

        {/* Quick Sample Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <span className="text-slate-400 font-medium whitespace-nowrap">테스트 샘플:</span>
          {SAMPLE_COSMETICS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleLoadSample(sample)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-200 transition-colors whitespace-nowrap"
            >
              {sample.category}
            </button>
          ))}
        </div>
      </div>

      {/* Input Body */}
      {mode === "image" ? (
        <div>
          {!selectedImage ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-emerald-500 bg-emerald-50/50 scale-[0.99]"
                  : "border-slate-300 hover:border-emerald-500 hover:bg-slate-50/70"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <UploadCloud className="w-7 h-7" />
              </div>
              <p className="text-sm font-semibold text-slate-800 mb-1">
                화장품 뒷면 전성분표 사진을 드래그하거나 클릭하여 업로드
              </p>
              <p className="text-xs text-slate-500 mb-3">
                JPG, PNG, WEBP 지원 · 클립보드 이미지 붙여넣기(Ctrl+V) 가능 · 한국어/영문 INCI 모두 지원
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full font-medium">
                <Camera className="w-3.5 h-3.5" />
                모바일 카메라 촬영 사진도 즉시 분석 가능
              </div>
            </div>
          ) : (
            <div className="relative rounded-xl border border-slate-200 bg-slate-50 p-4 overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  업로드된 전성분표 이미지
                </div>
                <button
                  type="button"
                  onClick={handleClearImage}
                  className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  이미지 변경
                </button>
              </div>
              <div className="max-h-72 flex justify-center items-center rounded-lg bg-black/5 overflow-hidden">
                <img
                  src={selectedImage}
                  alt="업로드된 화장품 전성분 라벨"
                  className="max-h-72 object-contain rounded-lg"
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={5}
            placeholder="화장품 전성분 목록을 복사하여 붙여넣으세요 (예: 정제수, 글리세린, 부틸렌글라이콜, 나이아신아마이드, 페녹시에탄올... 또는 영문 INCI 표기)"
            className="w-full p-3.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
          />
          <div className="flex justify-between items-center mt-1 text-xs text-slate-500">
            <span>쉼표(,) 또는 띄어쓰기로 구분된 성분 텍스트 지원</span>
            <span>{rawText.length} 자 입력됨</span>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="text-xs text-slate-500">
          안내: 이미지 속 모든 성분을 추출해 한국어 표준명으로 번역하고 기피 성분을 대조합니다.
        </div>
        <button
          type="button"
          onClick={handleStartAnalysis}
          disabled={
            isLoading || (mode === "image" ? !selectedImage : !rawText.trim())
          }
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-slate-300 disabled:to-slate-300 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-xs transition-all active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>전성분 정밀 추출 및 DB 대조 중...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>전성분 정밀 분석 및 대조 시작</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
