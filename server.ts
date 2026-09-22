import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase JSON body limit for high-res cosmetic label images
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));

// Lazy init of GoogleGenAI
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Cosmetic ingredient analysis endpoint
app.post("/api/analyze-ingredients", async (req: Request, res: Response) => {
  try {
    const { imageBase64, imageMimeType, rawText, avoidedIngredients } = req.body;

    if (!imageBase64 && !rawText) {
      return res.status(400).json({
        error: "이미지 또는 성분 텍스트 중 하나는 반드시 제공되어야 합니다.",
      });
    }

    const ai = getGenAI();

    const avoidListText = Array.isArray(avoidedIngredients) && avoidedIngredients.length > 0
      ? avoidedIngredients.join(", ")
      : "기피 성분 없음 (전체 성분 기본 위험도 분석만 수행)";

    const systemInstruction = `너는 대한민국 최고의 화장품 성분 분석 전문가이자 정밀 데이터 추출기(Cosmetic Ingredient Analyst & Data Extractor)이다.
너의 임무는 제공된 화장품 전성분표(이미지 또는 텍스트)에서 모든 성분을 누락 없이 추출하고, 대한민국 화장품 표준 한글 성분명(대한화장품협회 성분사전 및 식약처 고시 기준)으로 번역 및 표준화한 후, 사용자의 '기피 성분 목록'과 대조하여 정밀한 결과를 반환하는 것이다.

[중요 분석 지침]
1. 원문 추출 및 한글화:
   - 영문/라틴어 INCI 표기 또는 이미지 상의 모든 성분을 하나도 빠짐없이 차례대로 추출할 것.
   - 각 성분의 공식 대한민국 표준 한글 성분명으로 정확하게 매핑할 것 (예: Water -> 정제수, Glycerin -> 글리세린, Niacinamide -> 나이아신아마이드, Butylene Glycol -> 부틸렌글라이콜).
2. 기피 성분 엄격 대조:
   - 사용자가 제공한 기피 성분 목록과 비교하여, 직/간접적 일치, 화학적 계열, 파생 성분(예: '파라벤'인 경우 메틸파라벤, 에틸파라벤, 프로필파라벤, 부틸파라벤 등 모두 감지; '실리콘'인 경우 디메티콘, 사이클로펜타실록세인 등 감지; '설페이트'인 경우 SLS, SLES 등 감지; '알코올'인 경우 변성알코올, 에탄올 감지)을 철저히 대조할 것.
   - 일치하는 성분은 isAvoided=true로 지정하고 matchedAvoidTerm에 해당 기피어를 명시할 것.
3. EWG 유해성 등급 및 안전성 데이터베이스:
   - EWG Skin Deep 및 화장품 안전성 데이터베이스 기준 유해 등급(1~10) 및 등급 수준(LOW: 1-2 그린, MODERATE: 3-6 옐로우, HIGH: 7-10 레드, UNKNOWN: 미확인)을 명확히 지정할 것.
   - 20가지 주의 성분(화해/대한민국 대표 기준) 및 식약처 고시 알레르기 유발 주의성분(25종) 포함 여부를 식별할 것.
   - 각 성분의 주요 기능/역할(예: 보습제, 피부컨디셔닝제, 계면활성제, 방부제, 점증제 등)과 안전성 요약/주의사항을 과학적 사실에 기반하여 상세히 작성할 것.
4. 어려운 화학 성분에 대한 상세 쉬운 설명(easyExplanation) 및 예상 EWG 위험도(expectedEwgGrade) 필수 산출:
   - 화장품에 흔히 쓰이지만 일반인이 이름만 봐서는 정체를 알기 어려운 화학 성분(예: 사이클로펜타실록세인, 디메티콘, 디소듐이디티에이, 하이드록시에틸아크릴레이트, 트리에탄올아민, 폴리솔베이트, 피이지 화합물, 페녹시에탄올, 에틸헥실글리세린, 카보머, 트로메타민, 각종 지방산 에스터 등)에 대해 isDifficultChemical: true로 설정할 것.
   - simplePurpose: 소비자가 단번에 이해할 수 있는 쉬운 배합 목적 (예: "물과 기름이 분리되지 않고 로션 제형을 유지하도록 돕는 유화제", "피부에 부드러운 실크막을 씌워 수분 증발을 막아주는 실리콘 오일", "제품이 상하지 않게 지켜주는 방부제").
   - potentialSideEffects: 잠재적 부작용 및 피부 타입별 주의점 (예: "지성 피부의 경우 모공을 막아 트러블을 유발할 수 있음", "민감한 피부에 가려움증이나 홍반을 일으킬 수 있음", "EWG 1등급으로 피부 자극이 거의 없는 안전한 성분").
   - plainSummary: 일반인을 위한 명쾌한 1줄 요약.
   - expectedEwgGrade: EWG SkinDeep 기준 예상 위험 등급(grade: "1-2", "3", "7" 등), 위험 점수(hazardScore: 1~10 정수), 카테고리(LOW/MODERATE/HIGH/UNKNOWN), 그리고 과학적 평가 근거(reasoning).
   - difficultIngredientsHighlights: 주요 난해 성분들을 모아놓은 하이라이트 배열을 함께 작성할 것.
5. 제품 요약:
   - 전체 검출 성분 수, 기피 성분 검출 수, 고위험/중위험/저위험 개수, 난해 성분 개수, 최종 안전성 판정(SAFE: 기피성분 0개 및 위험성분 없음, CAUTION: 주의 필요, WARNING: 기피성분 발견, DANGER: 고위험 성분 또는 다수의 기피성분 포함)을 산출할 것.
6. 출력 형식:
   - 반드시 지정된 JSON 스키마 규격만을 따르고 다른 부연설명이나 마크다운 잡음 없이 순수 JSON으로만 출력할 것.`;

    const userPrompt = `[사용자 기피 성분 목록]:
${avoidListText}

${rawText ? `[사용자 제공 전성분 텍스트]:\n${rawText}` : `[요청]: 첨부된 화장품 전성분표 이미지에서 모든 성분을 추출하여 분석해주세요.`}`;

    const contentsPayload: any[] = [];

    if (imageBase64) {
      // Clean base64 string if data URI scheme was included
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
      const mime = imageMimeType || "image/jpeg";
      contentsPayload.push({
        inlineData: {
          mimeType: mime,
          data: cleanBase64,
        },
      });
    }

    contentsPayload.push({ text: userPrompt });

    const candidateModels = [
      "gemini-3.1-flash-lite",
      "gemini-flash-latest",
      "gemini-3.8-flash",
    ];

    const generateWithCascade = async () => {
      let lastError: any = null;

      for (const modelName of candidateModels) {
        try {
          console.log(`Analyzing cosmetic ingredients with model: ${modelName}`);
          const response = await ai.models.generateContent({
            model: modelName,
            contents: contentsPayload,
            config: {
              systemInstruction,
              temperature: 0.1, // High deterministic precision for OCR and chemical data
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  productSummary: {
                    type: Type.OBJECT,
                    properties: {
                      detectedProductName: { type: Type.STRING },
                      totalIngredientsCount: { type: Type.INTEGER },
                      extractedRawText: { type: Type.STRING },
                      matchedAvoidCount: { type: Type.INTEGER },
                      highHazardCount: { type: Type.INTEGER },
                      moderateHazardCount: { type: Type.INTEGER },
                      lowHazardCount: { type: Type.INTEGER },
                      unknownHazardCount: { type: Type.INTEGER },
                      difficultIngredientsCount: { type: Type.INTEGER },
                      overallSafetySummary: { type: Type.STRING },
                      avoidanceVerdict: { type: Type.STRING },
                    },
                    required: [
                      "detectedProductName",
                      "totalIngredientsCount",
                      "extractedRawText",
                      "matchedAvoidCount",
                      "highHazardCount",
                      "moderateHazardCount",
                      "lowHazardCount",
                      "unknownHazardCount",
                      "difficultIngredientsCount",
                      "overallSafetySummary",
                      "avoidanceVerdict",
                    ],
                  },
                  avoidedIngredientsMatches: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        userAvoidedTerm: { type: Type.STRING },
                        matchedIngredientKorean: { type: Type.STRING },
                        matchedIngredientOriginal: { type: Type.STRING },
                        matchReason: { type: Type.STRING },
                        hazardGrade: { type: Type.STRING },
                        hazardLevel: { type: Type.STRING },
                        riskDetails: { type: Type.STRING },
                      },
                      required: [
                        "userAvoidedTerm",
                        "matchedIngredientKorean",
                        "matchedIngredientOriginal",
                        "matchReason",
                        "hazardGrade",
                        "hazardLevel",
                        "riskDetails",
                      ],
                    },
                  },
                  difficultIngredientsHighlights: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        koreanName: { type: Type.STRING },
                        originalName: { type: Type.STRING },
                        simplePurpose: { type: Type.STRING },
                        potentialSideEffects: { type: Type.STRING },
                        plainSummary: { type: Type.STRING },
                        expectedEwgGrade: { type: Type.STRING },
                        hazardLevel: { type: Type.STRING },
                      },
                      required: [
                        "koreanName",
                        "originalName",
                        "simplePurpose",
                        "potentialSideEffects",
                        "plainSummary",
                        "expectedEwgGrade",
                        "hazardLevel",
                      ],
                    },
                  },
                  ingredients: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        order: { type: Type.INTEGER },
                        originalName: { type: Type.STRING },
                        koreanName: { type: Type.STRING },
                        ewgGrade: { type: Type.STRING },
                        hazardLevel: { type: Type.STRING },
                        isAvoided: { type: Type.BOOLEAN },
                        matchedAvoidTerm: { type: Type.STRING },
                        functions: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                        },
                        description: { type: Type.STRING },
                        cautionNotes: { type: Type.STRING },
                        isCaution20: { type: Type.BOOLEAN },
                        isAllergen: { type: Type.BOOLEAN },
                        easyExplanation: {
                          type: Type.OBJECT,
                          properties: {
                            isDifficultChemical: { type: Type.BOOLEAN },
                            simplePurpose: { type: Type.STRING },
                            potentialSideEffects: { type: Type.STRING },
                            plainSummary: { type: Type.STRING },
                          },
                          required: [
                            "isDifficultChemical",
                            "simplePurpose",
                            "potentialSideEffects",
                            "plainSummary",
                          ],
                        },
                        expectedEwgGrade: {
                          type: Type.OBJECT,
                          properties: {
                            grade: { type: Type.STRING },
                            hazardScore: { type: Type.INTEGER },
                            category: { type: Type.STRING },
                            reasoning: { type: Type.STRING },
                          },
                          required: ["grade", "hazardScore", "category", "reasoning"],
                        },
                      },
                      required: [
                        "order",
                        "originalName",
                        "koreanName",
                        "ewgGrade",
                        "hazardLevel",
                        "isAvoided",
                        "functions",
                        "description",
                        "cautionNotes",
                        "isCaution20",
                        "isAllergen",
                        "easyExplanation",
                        "expectedEwgGrade",
                      ],
                    },
                  },
                  cautionCategories: {
                    type: Type.OBJECT,
                    properties: {
                      twentyCautionIngredients: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      allergens: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      comedogenic: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                    },
                    required: ["twentyCautionIngredients", "allergens", "comedogenic"],
                  },
                },
                required: [
                  "productSummary",
                  "avoidedIngredientsMatches",
                  "difficultIngredientsHighlights",
                  "ingredients",
                  "cautionCategories",
                ],
              },
            },
          });

          if (response.text) {
            return response;
          }
        } catch (err: any) {
          console.warn(`Model ${modelName} failed:`, err.message || err);
          lastError = err;
          // Short pause before trying next candidate
          await new Promise((res) => setTimeout(res, 500));
        }
      }

      throw lastError || new Error("모든 AI 모델에서 응답 생성에 실패했습니다.");
    };

    const response = await generateWithCascade();

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("Gemini 모델에서 빈 응답이 반환되었습니다.");
    }

    const parsedJson = JSON.parse(textOutput);
    return res.json(parsedJson);
  } catch (error: any) {
    console.error("Analysis error:", error);
    let userFriendlyMessage = "성분 분석 처리 중 오류가 발생했습니다. 다시 시도해 주세요.";

    const rawMsg = error?.message || "";
    if (rawMsg.includes("429") || rawMsg.includes("RESOURCE_EXHAUSTED") || rawMsg.includes("quota")) {
      userFriendlyMessage = "AI 모델의 일일 무료 할당량 또는 일시적 호출 한도가 초과되었습니다. 잠시 후(약 20~30초 뒤) 다시 시도해 주시기 바랍니다.";
    } else if (rawMsg.includes("503") || rawMsg.includes("high demand") || rawMsg.includes("UNAVAILABLE")) {
      userFriendlyMessage = "AI 서버에 일시적인 트래픽이 집중되었습니다. 잠시 후 다시 시도해 주세요.";
    } else if (error?.message) {
      try {
        const parsed = JSON.parse(error.message);
        if (parsed?.error?.message) {
          userFriendlyMessage = parsed.error.message;
        }
      } catch {
        // Not a JSON error string
      }
    }

    return res.status(500).json({
      error: userFriendlyMessage,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Cosmetic Analyzer server running on http://localhost:${PORT}`);
  });
}

startServer();
