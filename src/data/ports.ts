// ============================================================
// 港口配置 — 12 港口 × 5 区域
// 坐标用于自动计算航线距离，取代手动 ROUTES 表
// ============================================================

export interface PortConfig {
  readonly id: string;
  readonly name: string;
  readonly regionId: string; // 指向 RegionConfig.id
  readonly description: string;
  readonly specialties: readonly string[]; // 特产商品 id
  /// 港口级价格微调（乘数），在区域系数之上叠加。null=不微调
  readonly localPriceModifiers: Record<string, number> | null;
  readonly x: number; // 坐标 — 用于计算航线距离
  readonly y: number;
}

export const PORTS: readonly PortConfig[] = [
  // ========================
  // 东亚
  // ========================
  {
    id: "quanzhou",
    name: "泉州",
    regionId: "east_asia",
    description: "宋元时期东方第一大港，商贾云集",
    specialties: ["silk", "porcelain", "tea"],
    localPriceModifiers: { silk: 0.85, porcelain: 0.85, tea: 0.8 },
    x: 48,
    y: 32,
  },
  {
    id: "nagasaki",
    name: "长崎",
    regionId: "east_asia",
    description: "日本唯一的对外窗口，白银与武士的国度",
    specialties: ["jade"],
    localPriceModifiers: { jade: 0.8, gold: 1.2 },
    x: 51,
    y: 35,
  },
  {
    id: "malacca",
    name: "马六甲",
    regionId: "east_asia",
    description: "东西方海上十字路口，香料集散之地",
    specialties: ["spice", "pepper"],
    localPriceModifiers: { spice: 0.85, pepper: 0.8 },
    x: 44,
    y: 26,
  },
  // ========================
  // 印度洋
  // ========================
  {
    id: "goa",
    name: "果阿",
    regionId: "indian_ocean",
    description: "印度西海岸明珠，胡椒与棉布的集散地",
    specialties: ["pepper", "cotton"],
    localPriceModifiers: { pepper: 0.8, cotton: 0.85 },
    x: 34,
    y: 22,
  },
  {
    id: "calicut",
    name: "卡利卡特",
    regionId: "indian_ocean",
    description: "马拉巴尔海岸的香料之港",
    specialties: ["pepper", "spice"],
    localPriceModifiers: { pepper: 0.75, spice: 0.85 },
    x: 33,
    y: 20,
  },
  {
    id: "aden",
    name: "亚丁",
    regionId: "indian_ocean",
    description: "红海咽喉，东西方贸易的中转要冲",
    specialties: ["dried_fruit"],
    localPriceModifiers: { dried_fruit: 0.8 },
    x: 26,
    y: 23,
  },
  // ========================
  // 非洲
  // ========================
  {
    id: "mombasa",
    name: "蒙巴萨",
    regionId: "africa",
    description: "东非最大港口，象牙与黄金的出口门户",
    specialties: ["ivory", "gold"],
    localPriceModifiers: { ivory: 0.75, gold: 0.8 },
    x: 22,
    y: 14,
  },
  {
    id: "sofala",
    name: "索法拉",
    regionId: "africa",
    description: "东南非古港，传说中盛产黄金之地",
    specialties: ["gold", "ivory"],
    localPriceModifiers: { gold: 0.75, ivory: 0.8 },
    x: 21,
    y: 10,
  },
  // ========================
  // 地中海
  // ========================
  {
    id: "alexandria",
    name: "亚历山大",
    regionId: "mediterranean",
    description: "埃及的明珠，托勒密时代的学术与贸易中心",
    specialties: ["glassware"],
    localPriceModifiers: { glassware: 0.85 },
    x: 18,
    y: 24,
  },
  {
    id: "venice",
    name: "威尼斯",
    regionId: "mediterranean",
    description: "亚得里亚海的女王，欧洲与东方的桥梁",
    specialties: ["glassware", "silk"],
    localPriceModifiers: { glassware: 0.8, silk: 0.9 },
    x: 13,
    y: 25,
  },
  // ========================
  // 北海
  // ========================
  {
    id: "london",
    name: "伦敦",
    regionId: "north_sea",
    description: "泰晤士河畔的大都会，北海贸易的核心",
    specialties: ["wool", "tin"],
    localPriceModifiers: { wool: 0.8, tin: 0.85 },
    x: 8,
    y: 30,
  },
  {
    id: "hamburg",
    name: "汉堡",
    regionId: "north_sea",
    description: "汉萨同盟的明珠，北欧商路的枢纽",
    specialties: ["timber", "dried_fruit"],
    localPriceModifiers: { timber: 0.8, dried_fruit: 0.9 },
    x: 6,
    y: 27,
  },
] as const;
