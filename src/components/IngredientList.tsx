import React, { useState, useMemo } from "react";
import {
  Search,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  Sparkles,
  FlaskConical,
  Target,
  AlertCircle,
  Eye,
  EyeOff,
  Droplets,
  Layers,
  ListFilter,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { IngredientDetail } from "../types";
import { IngredientDetailModal } from "./IngredientDetailModal";

interface Props {
  ingredients: IngredientDetail[];
}

type MainViewMode = "curated" | "grouped" | "full";

export const IngredientList: React.FC<Props> = ({ ingredients }) => {
  const [mainMode, setMainMode] = useState<MainViewMode>("curated");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIngredient, setSelectedIngredient] = useState<IngredientDetail | null>(null);
  
  // Full view pagination
  const [visibleCount, setVisibleCount] = useState(10);
  const [expandAllFullCards, setExpandAllFullCards] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Record<number, boolean>>({});

  // Group view accordion states
  const [groupAccordion, setGroupAccordion] = useState({
    caution: true,
    difficult: true,
    safe: false,
  });

  // Segregated categories
  const cautionIngredients = useMemo(
    () =>
      ingredients.filter(
        (i) =>
          i.isAvoided ||
          i.isCaution20 ||
          i.isAllergen ||
          i.hazardLevel === "HIGH" ||
          i.hazardLevel === "MODERATE"
      ),
    [ingredients]
  );

  const difficultIngredients = useMemo(
    () =>
      ingredients.filter(
        (i) =>
          i.easyExplanation?.isDifficultChemical &&
          !i.isAvoided &&
          i.hazardLevel !== "HIGH"
      ),
    [ingredients]
  );

  // Top 5 core base ingredients (usually make up 90%+ of the cosmetic volume)
  const topCoreIngredients = useMemo(() => ingredients.slice(0, 5), [ingredients]);

  // Safe green ingredients
  const safeIngredients = useMemo(
    () =>
      ingredients.filter(
        (i) =>
          !i.isAvoided &&
          !i.isCaution20 &&
          !i.isAllergen &&
          i.hazardLevel === "LOW"
      ),
    [ingredients]
  );

  // Search filtered items (for full list)
  const searchFilteredIngredients = useMemo(() => {
    if (!searchTerm.trim()) return ingredients;
    const term = searchTerm.toLowerCase();
    return ingredients.filter(
      (item) =>
        item.koreanName.toLowerCase().includes(term) ||
        item.originalName.toLowerCase().includes(term) ||
        item.functions.some((f) => f.toLowerCase().includes(term)) ||
        (item.easyExplanation?.simplePurpose &&
          item.easyExplanation.simplePurpose.toLowerCase().includes(term)) ||
        (item.easyExplanation?.plainSummary &&
          item.easyExplanation.plainSummary.toLowerCase().includes(term))
    );
  }, [ingredients, searchTerm]);

  const toggleOrderExpand = (order: number) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [order]: !prev[order],
    }));
  };

  const getEwgBadge = (grade: string, level: string, score?: number) => {
    if (level === "HIGH") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
          EWG {grade} (위험 {score ? `${score}/10` : ""})
        </span>
      );
    }
    if (level === "MODERATE") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          EWG {grade} (보통 {score ? `${score}/10` : ""})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        EWG {grade || "1-2"} (그린 {score ? `${score}/10` : ""})
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Detail Modal */}
      <IngredientDetailModal
        ingredient={selectedIngredient}
        onClose={() => setSelectedIngredient(null)}
      />

      {/* Main View Mode Selector Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                성분 분석 리포트
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-2xs font-bold bg-slate-100 text-slate-700">
                총 {ingredients.length}개 전성분
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              전체 성분을 무작정 나열하지 않고 핵심 정보 위주로 한눈에 읽기 쉽게 정리했습니다.
            </p>
          </div>

          {/* 3 View Tabs */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setMainMode("curated")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                mainMode === "curated"
                  ? "bg-white text-teal-800 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>스마트 핵심 요약</span>
            </button>

            <button
              type="button"
              onClick={() => setMainMode("grouped")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                mainMode === "grouped"
                  ? "bg-white text-indigo-800 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>카테고리별 묶어보기</span>
            </button>

            <button
              type="button"
              onClick={() => setMainMode("full")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                mainMode === "full"
                  ? "bg-white text-slate-900 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ListFilter className="w-3.5 h-3.5 text-slate-600" />
              <span>전체 순서도 보기</span>
            </button>
          </div>
        </div>

        {/* Cosmetics Reading Rule Tip Banner */}
        <div className="mt-4 p-3 bg-teal-50/70 border border-teal-200/80 rounded-xl flex items-start gap-2.5">
          <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <div className="text-xs text-teal-950 leading-relaxed">
            <strong className="font-semibold text-teal-900">화장품 라벨 읽는 핵심 팁:</strong>{" "}
            화장품 전성분은 배합량이 많은 순서대로 표기됩니다. 보통{" "}
            <span className="font-bold underline decoration-teal-400">상위 1~5개 성분이 전체 용량의 90% 이상</span>
            을 차지하므로, <strong>상위 5대 성분</strong>과 <strong>주의/기피 성분</strong> 위주로 확인하시면 됩니다.
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: SMART CURATED VIEW (DEFAULT) */}
      {mainMode === "curated" && (
        <div className="space-y-4">
          {/* SECTION 1: Caution & Avoided Ingredients */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>1. 반드시 확인해야 할 주의 & 기피 성분</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-2xs font-bold ${
                        cautionIngredients.length > 0
                          ? "bg-rose-100 text-rose-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {cautionIngredients.length}개 발견
                    </span>
                  </h4>
                  <p className="text-2xs text-slate-500">
                    기피 성분 일치 항목, 20가지 주의 성분, 알레르기 유발 및 EWG 주의 등급
                  </p>
                </div>
              </div>
            </div>

            {cautionIngredients.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center gap-3 text-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold">기피 성분 및 고위험 주의 성분이 발견되지 않았습니다!</p>
                  <p className="text-emerald-700 text-2xs mt-0.5">
                    검토 대상 성분 중 피부 자극 또는 사용자 기피 항목에 해당하는 성분이 없어 안심할 수 있습니다.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {cautionIngredients.map((item) => (
                  <div
                    key={item.order}
                    onClick={() => setSelectedIngredient(item)}
                    className="p-3.5 rounded-xl border border-rose-200/80 bg-rose-50/30 hover:bg-rose-50/60 transition-colors cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-2xs font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded-md border border-slate-200">
                            #{item.order}
                          </span>
                          <h5 className="font-bold text-xs text-slate-900 group-hover:text-rose-700 transition-colors">
                            {item.koreanName}
                          </h5>
                          {item.originalName && (
                            <span className="text-3xs text-slate-500 font-mono">
                              ({item.originalName})
                            </span>
                          )}
                        </div>
                        {getEwgBadge(item.ewgGrade, item.hazardLevel, item.expectedEwgGrade?.hazardScore)}
                      </div>

                      {/* Reason badges */}
                      <div className="flex items-center gap-1.5 flex-wrap my-1.5">
                        {item.isAvoided && (
                          <span className="px-1.5 py-0.5 rounded-md text-3xs font-bold bg-rose-600 text-white">
                            🚫 기피 성분: {item.matchedAvoidTerm || "일치"}
                          </span>
                        )}
                        {item.isCaution20 && (
                          <span className="px-1.5 py-0.5 rounded-md text-3xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            ⚠️ 20가지 주의
                          </span>
                        )}
                        {item.isAllergen && (
                          <span className="px-1.5 py-0.5 rounded-md text-3xs font-bold bg-orange-100 text-orange-900 border border-orange-300">
                            알레르기 유발
                          </span>
                        )}
                      </div>

                      {/* Easy Explanation */}
                      {item.easyExplanation?.plainSummary ? (
                        <p className="text-2xs text-rose-950/90 font-medium bg-white/70 p-2 rounded-lg border border-rose-100 mt-2">
                          💡 {item.easyExplanation.plainSummary}
                        </p>
                      ) : (
                        item.cautionNotes &&
                        item.cautionNotes !== "없음" && (
                          <p className="text-2xs text-rose-800 bg-white/70 p-2 rounded-lg border border-rose-100 mt-2">
                            {item.cautionNotes}
                          </p>
                        )
                      )}
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-rose-100/60 flex items-center justify-between text-3xs text-rose-600 font-semibold">
                      <span>{item.functions.join(", ")}</span>
                      <span className="flex items-center gap-0.5 group-hover:underline">
                        자세히 보기 <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 2: Top 5 Core Base Ingredients */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>2. 화장품의 90% 이상을 차지하는 '핵심 베이스 5대 성분'</span>
                    <span className="px-2 py-0.5 rounded-full text-2xs font-bold bg-teal-100 text-teal-800">
                      상위 1~5번
                    </span>
                  </h4>
                  <p className="text-2xs text-slate-500">
                    전체 화장품의 제형과 주 보습/영양 골격을 결정짓는 가장 함량이 높은 성분들입니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {topCoreIngredients.map((item, idx) => (
                <div
                  key={item.order}
                  onClick={() => setSelectedIngredient(item)}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-teal-50/60 hover:border-teal-300 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-3xs font-extrabold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      {getEwgBadge(item.ewgGrade, item.hazardLevel)}
                    </div>

                    <h5 className="font-bold text-xs text-slate-900 group-hover:text-teal-700 transition-colors">
                      {item.koreanName}
                    </h5>
                    {item.originalName && (
                      <span className="text-3xs text-slate-500 font-mono block truncate">
                        {item.originalName}
                      </span>
                    )}

                    <div className="mt-2 text-2xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.easyExplanation?.simplePurpose || item.description || item.functions.join(", ")}
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-3xs text-slate-500">
                    <span className="truncate">{item.functions[0] || "베이스"}</span>
                    <span className="text-teal-600 font-semibold group-hover:underline">클릭</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: Difficult Chemical Ingredients decoded */}
          {difficultIngredients.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <FlaskConical className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>3. 이름이 낯선 화학 성분 쉬운 해설</span>
                      <span className="px-2 py-0.5 rounded-full text-2xs font-bold bg-indigo-100 text-indigo-800">
                        {difficultIngredients.length}개
                      </span>
                    </h4>
                    <p className="text-2xs text-slate-500">
                      합성 폴리머, PEG 유화제, 실리콘 등 화학명이 어려운 성분의 배합 이유와 예상 EWG 위험도
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {difficultIngredients.map((item) => (
                  <div
                    key={item.order}
                    onClick={() => setSelectedIngredient(item)}
                    className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/20 hover:bg-indigo-50/50 hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1.5 mb-1.5">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-3xs text-slate-500 font-mono">#{item.order}</span>
                            <h5 className="font-bold text-xs text-slate-900 group-hover:text-indigo-700 transition-colors">
                              {item.koreanName}
                            </h5>
                          </div>
                          {item.originalName && (
                            <span className="text-3xs text-slate-500 font-mono block">
                              {item.originalName}
                            </span>
                          )}
                        </div>
                        {getEwgBadge(item.ewgGrade, item.hazardLevel, item.expectedEwgGrade?.hazardScore)}
                      </div>

                      {item.easyExplanation?.plainSummary && (
                        <p className="text-2xs text-indigo-950 font-medium bg-white/80 p-2 rounded-lg border border-indigo-100 my-2">
                          💬 {item.easyExplanation.plainSummary}
                        </p>
                      )}

                      <div className="space-y-1.5 text-2xs">
                        <div className="bg-white/70 p-2 rounded-lg border border-slate-100">
                          <span className="text-3xs font-bold text-teal-700 block mb-0.5">
                            🎯 배합 목적:
                          </span>
                          <p className="text-slate-700 leading-relaxed">
                            {item.easyExplanation?.simplePurpose || item.functions.join(", ")}
                          </p>
                        </div>
                        {item.easyExplanation?.potentialSideEffects && (
                          <div className="bg-white/70 p-2 rounded-lg border border-slate-100">
                            <span className="text-3xs font-bold text-amber-700 block mb-0.5">
                              ⚠️ 주의점:
                            </span>
                            <p className="text-slate-700 leading-relaxed">
                              {item.easyExplanation.potentialSideEffects}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-indigo-100 flex items-center justify-between text-3xs text-indigo-600 font-semibold">
                      <span>{item.functions.join(", ")}</span>
                      <span className="flex items-center gap-0.5 group-hover:underline">
                        자세히 보기 <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 4: Safe Green & Base Ingredients Compact Cloud */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>4. 안심할 수 있는 그린 등급 & 기타 성분 모음</span>
                    <span className="px-2 py-0.5 rounded-full text-2xs font-bold bg-emerald-100 text-emerald-800">
                      {safeIngredients.length}개 성분
                    </span>
                  </h4>
                  <p className="text-2xs text-slate-500">
                    불필요하게 길게 늘어놓지 않고 콤팩트하게 모았습니다. 클릭하면 상세 해설을 확인할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>

            {/* Compact Chip Cloud */}
            <div className="flex flex-wrap gap-2 pt-1">
              {safeIngredients.map((item) => (
                <button
                  key={item.order}
                  type="button"
                  onClick={() => setSelectedIngredient(item)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 border border-slate-200 hover:border-emerald-300 text-xs font-medium transition-all group shadow-2xs"
                  title="클릭하여 상세 해설 보기"
                >
                  <span className="text-3xs font-mono text-slate-400 group-hover:text-emerald-600">
                    #{item.order}
                  </span>
                  <span>{item.koreanName}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: GROUPED ACCORDION VIEW */}
      {mainMode === "grouped" && (
        <div className="space-y-3">
          {/* Caution Group */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <button
              type="button"
              onClick={() =>
                setGroupAccordion((p) => ({ ...p, caution: !p.caution }))
              }
              className="w-full px-5 py-4 flex items-center justify-between bg-rose-50/50 hover:bg-rose-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>주의 및 기피 성분 그룹</span>
                    <span className="px-2 py-0.5 rounded-full text-2xs font-bold bg-rose-100 text-rose-800">
                      {cautionIngredients.length}개
                    </span>
                  </h4>
                  <p className="text-2xs text-slate-500">
                    기피 성분, 20가지 주의 성분, 알레르기 유발 물질
                  </p>
                </div>
              </div>
              {groupAccordion.caution ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {groupAccordion.caution && (
              <div className="p-4 border-t border-slate-100">
                {cautionIngredients.length === 0 ? (
                  <p className="text-xs text-slate-500 p-2">주의 성분이 없습니다.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {cautionIngredients.map((item) => (
                      <div
                        key={item.order}
                        onClick={() => setSelectedIngredient(item)}
                        className="p-3 rounded-xl border border-rose-200 bg-rose-50/20 hover:bg-rose-50/60 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-slate-900">
                            #{item.order} {item.koreanName}
                          </span>
                          {getEwgBadge(item.ewgGrade, item.hazardLevel)}
                        </div>
                        <p className="text-2xs text-slate-600 line-clamp-2">
                          {item.easyExplanation?.plainSummary || item.cautionNotes || item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Difficult Group */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <button
              type="button"
              onClick={() =>
                setGroupAccordion((p) => ({ ...p, difficult: !p.difficult }))
              }
              className="w-full px-5 py-4 flex items-center justify-between bg-indigo-50/50 hover:bg-indigo-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <FlaskConical className="w-5 h-5 text-indigo-600" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>이름이 낯선 화학 성분 그룹</span>
                    <span className="px-2 py-0.5 rounded-full text-2xs font-bold bg-indigo-100 text-indigo-800">
                      {difficultIngredients.length}개
                    </span>
                  </h4>
                  <p className="text-2xs text-slate-500">
                    합성 고분자, 실리콘, 유화제 등 쉬운 설명이 필요한 성분
                  </p>
                </div>
              </div>
              {groupAccordion.difficult ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {groupAccordion.difficult && (
              <div className="p-4 border-t border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {difficultIngredients.map((item) => (
                    <div
                      key={item.order}
                      onClick={() => setSelectedIngredient(item)}
                      className="p-3 rounded-xl border border-indigo-100 bg-indigo-50/20 hover:bg-indigo-50/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-900">
                          #{item.order} {item.koreanName}
                        </span>
                        {getEwgBadge(item.ewgGrade, item.hazardLevel)}
                      </div>
                      <p className="text-2xs text-slate-600 line-clamp-2">
                        {item.easyExplanation?.simplePurpose || item.easyExplanation?.plainSummary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Safe Green Group */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <button
              type="button"
              onClick={() =>
                setGroupAccordion((p) => ({ ...p, safe: !p.safe }))
              }
              className="w-full px-5 py-4 flex items-center justify-between bg-emerald-50/50 hover:bg-emerald-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>안전한 안심 성분 그룹</span>
                    <span className="px-2 py-0.5 rounded-full text-2xs font-bold bg-emerald-100 text-emerald-800">
                      {safeIngredients.length}개
                    </span>
                  </h4>
                  <p className="text-2xs text-slate-500">
                    정제수, 글리세린 및 EWG 그린 등급의 안전 성분
                  </p>
                </div>
              </div>
              {groupAccordion.safe ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {groupAccordion.safe && (
              <div className="p-4 border-t border-slate-100">
                <div className="flex flex-wrap gap-2">
                  {safeIngredients.map((item) => (
                    <button
                      key={item.order}
                      type="button"
                      onClick={() => setSelectedIngredient(item)}
                      className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-xs font-medium text-slate-800 transition-colors"
                    >
                      #{item.order} {item.koreanName}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW MODE 3: FULL SEQUENTIAL LIST (WITH SEARCH & PAGINATION) */}
      {mainMode === "full" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                전체 성분 순서도 ({searchFilteredIngredients.length}개)
              </h4>
              <p className="text-2xs text-slate-500">
                라벨 원본 기재 순서대로 확인합니다.
              </p>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setVisibleCount(10);
                }}
                placeholder="성분명 검색..."
                className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 w-48"
              />
            </div>
          </div>

          <div className="space-y-2.5">
            {searchFilteredIngredients.slice(0, visibleCount).map((item) => {
              const isExpanded = expandedOrders[item.order] ?? expandAllFullCards;
              return (
                <div
                  key={item.order}
                  className="rounded-xl border border-slate-200 p-3 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                        {item.order}
                      </span>
                      <div>
                        <span className="font-bold text-xs text-slate-900 mr-1.5">
                          {item.koreanName}
                        </span>
                        {item.originalName && (
                          <span className="text-3xs text-slate-400 font-mono">
                            {item.originalName}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {getEwgBadge(item.ewgGrade, item.hazardLevel)}
                      <button
                        type="button"
                        onClick={() => toggleOrderExpand(item.order)}
                        className="p-1 rounded-md hover:bg-slate-100 text-slate-500"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1.5 animate-in fade-in duration-100">
                      {item.easyExplanation?.plainSummary && (
                        <p className="text-teal-900 font-medium">
                          💡 {item.easyExplanation.plainSummary}
                        </p>
                      )}
                      <p>
                        <strong>배합 목적:</strong>{" "}
                        {item.easyExplanation?.simplePurpose || item.functions.join(", ")}
                      </p>
                      {item.easyExplanation?.potentialSideEffects && (
                        <p className="text-amber-800">
                          <strong>주의점:</strong> {item.easyExplanation.potentialSideEffects}
                        </p>
                      )}
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => setSelectedIngredient(item)}
                          className="text-2xs text-teal-700 font-semibold hover:underline flex items-center gap-1"
                        >
                          전체 상세 모달 열기 <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Load More Button */}
          {visibleCount < searchFilteredIngredients.length && (
            <div className="flex justify-center pt-2 gap-2">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 10)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                10개 더보기 ({visibleCount} / {searchFilteredIngredients.length})
              </button>
              <button
                type="button"
                onClick={() => setVisibleCount(searchFilteredIngredients.length)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                전체 한번에 펼치기 ({searchFilteredIngredients.length}개)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
