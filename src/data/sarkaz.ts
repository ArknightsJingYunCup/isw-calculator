export enum Squad {
  AdaptableSquad = '因地制宜分队',
  RevenantEscortSquad = '魂灵护送分队',
  KnowledgeableSquad = '博闻广记分队',
  BlueprintSurveyingSquad = '蓝图测绘分队',
  LeaderSquad = '指挥分队',
  GatheringSquad = '集群分队',
  SupportSquad = '后勤分队',
  SpearheadSquad = '矛头分队',
  TacticalAssaultSquad = '突击战术分队',
  TacticalFortificationSqaud = '堡垒战术分队',
  TacticalRangedSquad = '远程战术分队',
  TacticaDestructionSquad = '破坏战术分队',
  FirstClassSquad = '高规格分队',
}

export enum Collectible {
  DoodleInTheEraOfHope = "希望时代的涂鸦",
  HatredInTheEraOfDeathFeud = "死仇时代的恨意",
  None = "未获取"
}

export enum Level {
  First = "融魂之始",
  Second = "锻铁根须",
  Third = "灰铸迷城",
  Fourth = "或然歧域",
  Fifth = "虚实疆界",
  Sixth = "辉光天顶",
  Secret = "诡谲断章",
}

// 紧急作战
export enum EmergencyOperation {
  AGreatGame = "大棋一盘",
  GirimoireOfChaos = "溃乱魔典",
  ClashOfFantasies = "假想对冲",
  ScarletPassage = "猩红甬道",
  NecroticInvestigation = "朽败考察",
  GapBetweenEras = "年代断层（击破所有年代之刺）",
  AsylumInAnotherCity = "寄人城池下",
  PlannedFarming = "计划耕种",
  PassageLockdown = "通道封锁",
  DivineDesire = "神圣的渴求",
  SearchForConsensus = "谋求共识",
  UnionOfWitchcraftAndArts = "巫咒同盟",
}

export type EmergencyOperationInfo = {
  level: Level;
  score: number;
}

// 刷新 *30% / 私仇刷新 *10%
// 无漏 *120%
export const EmergencyOperationInfos: { [key: string]: EmergencyOperationInfo } = {
  // 第三层
  [EmergencyOperation.AGreatGame]: {
    level: Level.Third,
    score: 25
  },
  [EmergencyOperation.GirimoireOfChaos]: {
    level: Level.Third,
    score: 25
  },
  [EmergencyOperation.ClashOfFantasies]: {
    level: Level.Fourth,
    score: 40
  },
  [EmergencyOperation.ScarletPassage]: {
    level: Level.Fourth,
    score: 40,
  },
  [EmergencyOperation.NecroticInvestigation]: {
    level: Level.Fourth,
    score: 40,
  },
  [EmergencyOperation.GapBetweenEras]: {
    level: Level.Fourth,
    score: 40,
  },
  [EmergencyOperation.AsylumInAnotherCity]: {
    level: Level.Fifth,
    score: 60,
  },
  [EmergencyOperation.PlannedFarming]: {
    level: Level.Fifth,
    score: 60,
  },
  [EmergencyOperation.PassageLockdown]: {
    level: Level.Fifth,
    score: 30,
  },
  [EmergencyOperation.UnionOfWitchcraftAndArts]: {
    level: Level.Fifth,
    score: 30,
  },
  [EmergencyOperation.DivineDesire]: {
    level: Level.Sixth,
    score: 80,
  },
  [EmergencyOperation.SearchForConsensus]: {
    level: Level.Sixth,
    score: 80,
  }
}

// 隐藏作战
export enum HiddenOperation {
  FailedTestOfCourage = "失败的试胆",
  Inheritance = "继承（击破所有“门”）",
  TheSideOfBattlefield = "战场侧面",
  SignalLights = "信号灯",
  RobbingTheImaginary = "劫虚济实",
  ToysRevenge = "玩具的报复",
  DuckHighway = "鸭速公路",
}

export type HiddenOperationInfo = {
  score: number;
  emergency_score: number;
}

// 非无漏 *50%
export const HiddenOperationInfos: { [key: string]: HiddenOperationInfo } = {
  [HiddenOperation.FailedTestOfCourage]: {
    score: 10,
    emergency_score: 0,
  },
  [HiddenOperation.Inheritance]: {
    score: 15,
    emergency_score: 30,
  },
  [HiddenOperation.TheSideOfBattlefield]: {
    score: 0,
    emergency_score: 40,
  },
  [HiddenOperation.SignalLights]: {
    score: 10,
    emergency_score: 20,
  },
  [HiddenOperation.RobbingTheImaginary]: {
    score: 15,
    emergency_score: 30,
  },
  [HiddenOperation.ToysRevenge]: {
    score: 10,
    emergency_score: 0,
  },
  [HiddenOperation.DuckHighway]: {
    score: 30,
    emergency_score: 40,
  },
}

// 领袖作战
export enum BossOperation {
  VeilOfPossibility = "或然面纱",
  Devotion = "奉献",
  Decapitation = "斩首",
  BeneathTheCrown = "王冠之下",
  SonglessCourtyard = "离歌的庭院",
  TheUnstoppable = "赴敌者",
  UrgentTeaching = "紧急授课",
  Audience = "朝谒",
  CivitasSancta = "圣城",
}

export type BossOperationInfo = {
  level: Level;
  score: number;
  chaos_score: number;
}

export const BossOperationInfos: { [key: string]: BossOperationInfo } = {
  [BossOperation.VeilOfPossibility]: {
    level: Level.Third,
    score: 20,
    chaos_score: 0,
  },
  [BossOperation.Devotion]: {
    level: Level.Third,
    score: 20,
    chaos_score: 0,
  },
  [BossOperation.Decapitation]: {
    level: Level.Third,
    score: 20,
    chaos_score: 0,
  },
  [BossOperation.BeneathTheCrown]: {
    level: Level.Third,
    score: 40,
    chaos_score: 0,
  },
  [BossOperation.SonglessCourtyard]: {
    level: Level.Third,
    score: 40,
    chaos_score: 0,
  },
  [BossOperation.TheUnstoppable]: {
    level: Level.Third,
    score: 40,
    chaos_score: 0,
  },
  [BossOperation.UrgentTeaching]: {
    level: Level.Fifth,
    score: 30,
    chaos_score: 60,
  },
  [BossOperation.Audience]: {
    level: Level.Fifth,
    score: 150,
    chaos_score: 200,
  },
  [BossOperation.CivitasSancta]: {
    level: Level.Sixth,
    score: 200,
    chaos_score: 250,
  },
}

export enum BannedOperator {
  Wisdel = "维什戴尔",

  Logos = "Logos",
  Yato2 = "麒麟R夜刀",

  Ray = "莱伊",
  Nymph = "妮芙",
  Ascln = "阿斯卡纶",
  Texas2 = "缄默德克萨斯",
  Ulpia = "乌尔比安",
  Agoat2 = "纯烬艾雅法拉",

  Kalts = "凯尔希（特限模组）",
  Phatom = "傀影（特限模组）",
}

// 3) d) 结算时，若全程未招募干员维什戴尔，则额外获得130分加分；若全程未招募干员逻各
//       斯、麒麟R夜刀，每未招募一名干员额外获得70分加分；若全程未招募干员莱伊、妮
//       芙、阿斯卡纶、缄默德克萨斯、乌尔比安、纯烬艾雅法拉时，每未招募一名干员额外获
//       得40分加分；若全程未招募干员凯尔希、傀影，或招募干员后未使用其α模组，每未
//       招募一名干员额外获得40分加分；
export const BannedOperatorInfos: { [key: string]: number } = {
  [BannedOperator.Wisdel]: 160,

  [BannedOperator.Logos]: 70,
  [BannedOperator.Yato2]: 70,

  [BannedOperator.Ray]: 40,
  [BannedOperator.Nymph]: 40,
  [BannedOperator.Ascln]: 40,
  [BannedOperator.Texas2]: 40,
  [BannedOperator.Ulpia]: 40,
  [BannedOperator.Agoat2]: 40,

  [BannedOperator.Kalts]: 40,
  [BannedOperator.Phatom]: 40,
}

export enum KingsCollectible {
  KingsCrown = "诸王的冠冕",
  KingsNewLance = "国王的新枪",
  KingsFellowShip = "国王的铠甲",
  KingsStaff = "国王的延伸",
}
