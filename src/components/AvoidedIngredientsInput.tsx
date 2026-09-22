import React, { useState, KeyboardEvent } from "react";
import { Plus, X, Tag, Sparkles, Trash2 } from "lucide-react";
import { AVOIDED_PRESETS, AvoidedPreset } from "../data/samplePresets";

interface Props {
  avoidedList: string[];
  onChange: (list: string[]) => void;
  disabled?: boolean;
}

export const AvoidedIngredientsInput: React.FC<Props> = ({
  avoidedList,
  onChange,
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddTag = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    if (!avoidedList.includes(trimmed)) {
      onChange([...avoidedList, trimmed]);
    }
    setInputValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag(inputValue);
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    onChange(avoidedList.filter((_, i) => i !== indexToRemove));
  };

  const handleApplyPreset = (preset: AvoidedPreset) => {
    const combined = Array.from(new Set([...avoidedList, ...preset.ingredients]));
    onChange(combined);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-rose-500" />
          <h2 className="text-sm font-bold text-slate-800">
            사용자 기피 성분 목록 ({avoidedList.length})
          </h2>
          <span className="text-xs text-slate-500">
            *입력 시 전성분과 자동 대조됩니다
          </span>
        </div>
        {avoidedList.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            disabled={disabled}
            className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            전체 비우기
          </button>
        )}
      </div>

      {/* Preset recommendations */}
      <div className="mb-3">
        <div className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          원클릭 추천 기피 카테고리:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {AVOIDED_PRESETS.map((preset) => {
            const isFullyApplied = preset.ingredients.every((ing) =>
              avoidedList.includes(ing)
            );
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                disabled={disabled || isFullyApplied}
                title={preset.description}
                className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-all ${
                  isFullyApplied
                    ? "bg-slate-100 text-slate-400 border-slate-200 cursor-default"
                    : "bg-rose-50/60 text-rose-700 border-rose-200 hover:bg-rose-100 active:scale-95"
                }`}
              >
                + {preset.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Input box */}
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="기피 성분 직접 입력 (예: 파라벤, 실리콘, 알코올, 피이지 입력 후 Enter)"
            className="w-full text-sm px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
          />
        </div>
        <button
          type="button"
          onClick={() => handleAddTag(inputValue)}
          disabled={disabled || !inputValue.trim()}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white rounded-lg text-sm font-medium flex items-center gap-1 transition-colors"
        >
          <Plus className="w-4 h-4" />
          추가
        </button>
      </div>

      {/* Active tags */}
      {avoidedList.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-200 min-h-[44px]">
          {avoidedList.map((term, index) => (
            <span
              key={`${term}-${index}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-100/90 text-rose-800 border border-rose-200 shadow-2xs group"
            >
              <span>{term}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(index)}
                disabled={disabled}
                className="text-rose-400 hover:text-rose-700 focus:outline-none"
                title="삭제"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <div className="text-center py-3 text-xs text-slate-400 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
          설정된 기피 성분이 없습니다. 위의 추천 버튼을 클릭하거나 직접 입력해주세요.
        </div>
      )}
    </div>
  );
};
