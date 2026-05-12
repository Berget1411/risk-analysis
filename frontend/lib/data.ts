export const AUTHORS = [
  "Felix Ekbrant",
  "Harald Janson",
  "Ludvig Bergström",
  "Eddie Xia",
];

export const GITHUB_URL = "https://github.com/Berget1411/risk-analysis";

export const PORTFOLIO_STATS = {
  trainingRows: 1_033_386,
  testRows: 291_649,
  trainingPeriod: "2021–2024",
  testPeriod: "2025",
  trainingClaims: 19_730,
  testClaims: 5_520,
  avgClaimFreq: 0.0214,
  zeroPct: 98,
  variables: [
    "Verksamhet",
    "Geografiskt Område",
    "Omsättning",
    "Försäkringsbelopp",
    "Självrisk",
    "Duration",
    "AntalSkador",
  ],
};

export const KEY_RESULTS = {
  observedClaims: 5_520,
  glmPredicted: 5_581,
  glmError: "+1,1%",
  xgbPredicted: 5_587.3,
  xgbError: "+1,22%",
  ci95Low: 5_503,
  ci95High: 5_658,
  ciWidth: "2,8%",
  overdispersion: 0.986,
};

export const MODEL_SELECTION_TABLE = [
  {
    model: "M0",
    description: "Intercept justerad för exponering",
    aic: 141_086,
    validationDeviance: 42_643,
  },
  {
    model: "M1",
    description: "Verksamhet + Geografi",
    aic: 139_723,
    validationDeviance: 42_105,
  },
  {
    model: "M2",
    description: "M1 + log(Omsättning)",
    aic: 136_971,
    validationDeviance: 41_002,
    selected: true,
  },
  {
    model: "M3",
    description: "M2 + log(Självrisk)",
    aic: 136_257,
    validationDeviance: 40_690,
  },
];

export const GLM_COEFFICIENTS = {
  intercept: -11.115,
  verksamhet: [
    { name: "VVS", beta: "+0,359", rateRatio: 1.432, ci: "1,372–1,494" },
    {
      name: "Takarbeten",
      beta: "+0,127",
      rateRatio: 1.135,
      ci: "1,067–1,207",
    },
    {
      name: "Byggföretag (ref.)",
      beta: "–",
      rateRatio: 1.0,
      ci: "–",
    },
    {
      name: "Övriga specialistföretag",
      beta: "–0,030",
      rateRatio: 0.97,
      ci: "0,932–1,010",
    },
    {
      name: "Grävning & Schaktning",
      beta: "–0,157",
      rateRatio: 0.855,
      ci: "0,808–0,905",
    },
    {
      name: "Elektriker",
      beta: "–0,360",
      rateRatio: 0.698,
      ci: "0,659–0,738",
    },
    { name: "Målare", beta: "–0,452", rateRatio: 0.637, ci: "0,601–0,675" },
  ],
  geografi: [
    {
      name: "Storstad",
      beta: "+0,379",
      rateRatio: 1.461,
      ci: "1,387–1,539",
    },
    {
      name: "Mellanstorstad",
      beta: "+0,185",
      rateRatio: 1.203,
      ci: "1,140–1,271",
    },
    { name: "Landsbygd (ref.)", beta: "–", rateRatio: 1.0, ci: "–" },
    {
      name: "Småstad",
      beta: "–0,279",
      rateRatio: 0.757,
      ci: "0,711–0,805",
    },
  ],
  logOmsattning: {
    beta: "+0,442",
    rateRatioPerDoubling: 1.358,
    ci: "1,345–1,371",
  },
};

export const MODEL_COMPARISON_TABLE = [
  {
    metric: "Totalt predikterat",
    glm: "5 580,6",
    xgboost: "5 587,3",
    diff: "+6,7",
  },
  { metric: "Observerat", glm: "5 520", xgboost: "5 520", diff: "0" },
  {
    metric: "Portföljfel",
    glm: "+1,10%",
    xgboost: "+1,22%",
    diff: "+0,12 %-enheter",
  },
  {
    metric: "Poisson deviance",
    glm: "41 889,2",
    xgboost: "41 855,7",
    diff: "–33,4 (–0,08%)",
  },
  { metric: "RMSE", glm: "0,1374", xgboost: "0,1374", diff: "0" },
  { metric: "MAE", glm: "0,0371", xgboost: "0,0371", diff: "0" },
];

export const HEATMAP_DATA = {
  verksamheter: [
    "VVS",
    "Takarbeten",
    "Byggföretag",
    "Övriga specialistföretag",
    "Grävning & Schaktning",
    "Elektriker",
    "Målare",
  ],
  geografier: ["Storstad", "Mellanstorstad", "Landsbygd", "Småstad"],
  values: [
    [0.0398, 0.0311, 0.0268, 0.0184],
    [0.0309, 0.025, 0.0212, 0.0154],
    [0.0268, 0.0222, 0.0193, 0.0141],
    [0.0266, 0.0211, 0.0173, 0.0137],
    [0.023, 0.0197, 0.0133, 0.012],
    [0.0184, 0.0162, 0.0129, 0.0097],
    [0.0165, 0.0145, 0.0114, 0.0097],
  ],
};

export const VERKSAMHET_CHART_DATA = [
  { name: "VVS", rateRatio: 1.432 },
  { name: "Takarbeten", rateRatio: 1.135 },
  { name: "Byggföretag (ref.)", rateRatio: 1.0 },
  { name: "Övriga", rateRatio: 0.97 },
  { name: "Grävning", rateRatio: 0.855 },
  { name: "Elektriker", rateRatio: 0.698 },
  { name: "Målare", rateRatio: 0.637 },
];

export const GEOGRAFI_CHART_DATA = [
  { name: "Storstad", rateRatio: 1.461 },
  { name: "Mellanstorstad", rateRatio: 1.203 },
  { name: "Landsbygd (ref.)", rateRatio: 1.0 },
  { name: "Småstad", rateRatio: 0.757 },
];

export const FEATURE_IMPORTANCE_DATA = [
  { feature: "log(Omsättning)", gain: 20.04 },
  { feature: "Geografiskt Område", gain: 8.26 },
  { feature: "Verksamhet", gain: 6.46 },
];

export const XGBOOST_CONFIGS = [
  { config: "shallow-fast", depth: 3, lr: 0.1, trees: 232, deviance: 41_002, selected: true },
  { config: "shallow-slow", depth: 3, lr: 0.05, trees: 389, deviance: 41_010 },
  { config: "medium-fast", depth: 5, lr: 0.1, trees: 198, deviance: 41_045 },
  { config: "medium-slow", depth: 5, lr: 0.05, trees: 312, deviance: 41_038 },
  { config: "deep-fast", depth: 7, lr: 0.1, trees: 156, deviance: 41_089 },
  { config: "deep-slow", depth: 7, lr: 0.05, trees: 245, deviance: 41_072 },
];

export const CORRELATION_MATRIX = [
  { var1: "Omsättning", var2: "Försäkringsbelopp", r: 0.57 },
  { var1: "Omsättning", var2: "Självrisk", r: 0.45 },
  { var1: "Försäkringsbelopp", var2: "Självrisk", r: 0.26 },
];

export const DECIL_DATA = [
  { decil: 1, omsattning: 0.005, forsakringsbelopp: 0.012 },
  { decil: 2, omsattning: 0.010, forsakringsbelopp: 0.014 },
  { decil: 3, omsattning: 0.012, forsakringsbelopp: 0.015 },
  { decil: 4, omsattning: 0.014, forsakringsbelopp: 0.018 },
  { decil: 5, omsattning: 0.017, forsakringsbelopp: 0.020 },
  { decil: 6, omsattning: 0.020, forsakringsbelopp: 0.021 },
  { decil: 7, omsattning: 0.023, forsakringsbelopp: 0.023 },
  { decil: 8, omsattning: 0.027, forsakringsbelopp: 0.025 },
  { decil: 9, omsattning: 0.032, forsakringsbelopp: 0.027 },
  { decil: 10, omsattning: 0.035, forsakringsbelopp: 0.033 },
];

export const PRICING_EXAMPLE = {
  verksamhet: "VVS",
  geografi: "Storstad",
  omsattning: 10_000_000,
  duration: 1.0,
  calculation: "exp(−11,115 + 0,359 + 0,379 + 0,442 · ln(10 000 000)) · 1,0",
  result: 0.039,
  portfolioAvg: 0.021,
  factor: 1.8,
};

export const UNCERTAINTY_STATS = {
  portfolioCI: "[5 503, 5 658]",
  portfolioRelative: "2,8%",
  rowLevelMin: "5,2%",
  rowLevelMax: "18,7%",
};

export const NAV_ITEMS = [
  { id: "inledning", label: "Inledning" },
  { id: "metod", label: "Metod & Data" },
  { id: "resultat", label: "Resultat" },
  { id: "analys", label: "Analys" },
  { id: "slutsats", label: "Slutsats" },
];
