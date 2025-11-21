import { Accessor, Component, createSignal, For, Match, Switch, Setter, JSX } from "solid-js";
import { Dialog } from "@ark-ui/solid/dialog";
import { ToggleGroup } from "@ark-ui/solid/toggle-group";
import { Portal } from "solid-js/web";

import { createStore, produce } from "solid-js/store";
import { enumKeys, enumValues, readJson, saveJson, StringEnum } from "../lib/utils";
import { createMediaQuery } from "@solid-primitives/media";
import { AddDefaultTagRecordModal, Card, createCollectibleInput, createTagRecordTable, createWithdrawInput, EnumMultiSelectInput, EnumToggleGroup, LevelModifierRecord, LevelOperationListMap, ModifierSelector, NumberInput, OperationModifierMap, TagRecord, TagRecords, OperationModifiers } from "../components";

enum TagType {
  Boolean = "Boolean",
  Number = "Number",
}


export function levelNum(level: Level): number {
  return enumValues(Level).indexOf(level) + 1;
}

// MARK: LimitedOperator
enum LimitedOperator {
  电弧 = "电弧",
  新约能天使 = "新约能天使",
  维什戴尔 = "维什戴尔",
  丰川祥子 = "丰川祥子",
  司霆惊蛰 = "司霆惊蛰",
  斩业星熊 = "斩业星熊",
  酒神 = "酒神",
  水月 = "水月",
  灵知 = "灵知",
  圣聆初雪 = "圣聆初雪",
  娜仁图亚 = "娜仁图亚",
  玛恩纳 = "玛恩纳",
  隐德来希 = "隐德来希",
  逻各斯 = "逻各斯",
  阿斯卡纶 = "阿斯卡纶",
  琳琅诗怀雅 = "琳琅诗怀雅",
  凛御银灰 = "凛御银灰",
  迷迭香 = "迷迭香",
  凯尔希 = "凯尔希",
  霍尔海雅 = "霍尔海雅",
  安洁莉娜 = "安洁莉娜",
  麒麟R夜刀 = "麒麟R夜刀",
  伊内丝 = "伊内丝",
  空弦 = "空弦",
  妮芙 = "妮芙",
  艾拉 = "艾拉",
}

const limitedOperatorCostMap: { [key in LimitedOperator]: number } = {
  [LimitedOperator.电弧]: 7,
  [LimitedOperator.新约能天使]: 5,
  [LimitedOperator.维什戴尔]: 5,
  [LimitedOperator.丰川祥子]: 4,
  [LimitedOperator.司霆惊蛰]: 4,
  [LimitedOperator.斩业星熊]: 4,
  [LimitedOperator.酒神]: 4,
  [LimitedOperator.水月]: 4,
  [LimitedOperator.灵知]: 4,
  [LimitedOperator.圣聆初雪]: 4,
  [LimitedOperator.娜仁图亚]: 4,
  [LimitedOperator.玛恩纳]: 3,
  [LimitedOperator.隐德来希]: 3,
  [LimitedOperator.逻各斯]: 3,
  [LimitedOperator.阿斯卡纶]: 3,
  [LimitedOperator.琳琅诗怀雅]: 3,
  [LimitedOperator.凛御银灰]: 3,
  [LimitedOperator.迷迭香]: 2,
  [LimitedOperator.凯尔希]: 1,
  [LimitedOperator.霍尔海雅]: 1,
  [LimitedOperator.安洁莉娜]: 1,
  [LimitedOperator.麒麟R夜刀]: 1,
  [LimitedOperator.伊内丝]: 1,
  [LimitedOperator.空弦]: 1,
  [LimitedOperator.妮芙]: 1,
  [LimitedOperator.艾拉]: 1,
};

enum Squad {
  指挥分队 = "指挥分队",
  特勤分队 = "特勤分队",
  后勤分队 = "后勤分队",

  突击战术分队 = "突击战术分队",
  堡垒战术分队 = "堡垒战术分队",
  远程战术分队 = "远程战术分队",
  破坏战术分队 = "破坏战术分队",

  高台突破分队 = "高台突破分队",
  地面突破分队 = "地面突破分队",

  高规格分队 = "高规格分队",
  游客分队 = "游客分队",
  司岁台分队 = "司岁台分队",
  天师府分队 = "天师府分队",
  岁影回音分队 = "岁影回音分队",
  花团锦簇分队 = "花团锦簇分队",
  棋行险着分队 = "棋行险着分队",
}

enum OpeningSquad {
  其他 = "其他",
  棋行险着游客分队 = "棋行险着/游客分队",
}

const openingSquadFactorMap: { [key in OpeningSquad]: number } = {
  [OpeningSquad.其他]: 0,
  [OpeningSquad.棋行险着游客分队]: -0.05,
};

// MARK: EmergencyOperation
export enum Level {
  First = "洪陆楼",
  Second = "山水阁",
  Third = "云瓦亭",
  Fourth = "汝吾门",
  Fifth = "见字祠",
  Sixth = "始末陵/明灭顶",
}
const levelKeys: (keyof typeof Level)[] = enumKeys(Level);
// 紧急作战只显示 4、5、6 层
enum OperationLevel {
  Fourth = "汝吾门",
  Fifth = "见字祠",
  Sixth = "始末陵/明灭顶",
}
const emergencyLevelKeys: (keyof typeof OperationLevel)[] = enumKeys(OperationLevel);
enum Operation {
  峥嵘战功 = "峥嵘战功",
  赶场戏班 = "赶场戏班",
  青山不语 = "青山不语",
  离域检查 = "离域检查",
  薄礼一份 = "薄礼一份",
  邙山镇地方志 = "邙山镇地方志",
  不成烟火 = "不成烟火",
  炎灼 = "炎灼",
  人镇 = "人镇",
  借力打力 = "借力打力",
  越山海 = "越山海",
  其他 = "其他",
}

const levelOperationMap: LevelOperationListMap<typeof OperationLevel, typeof Operation> = {
  [OperationLevel.Fourth]: [
    Operation.峥嵘战功,
    Operation.赶场戏班,
  ],
  [OperationLevel.Fifth]: [
    Operation.青山不语,
    Operation.离域检查,
    Operation.薄礼一份,
    Operation.邙山镇地方志,
    Operation.不成烟火,
  ],
  [OperationLevel.Sixth]: [
    Operation.炎灼,
    Operation.人镇,
    Operation.借力打力,
    Operation.越山海,
  ]
}

enum BossLevel {
  Third = Level.Third,
  Fifth = Level.Fifth,
  Sixth = Level.Sixth,
}
enum BonusBossOperation {
  // 3
  夕娥忆 = "夕娥忆",
  仁义武 = "仁·义·武",
  求道 = "求道",
  // 5
  昔字如烟 = "昔字如烟",
  往昔难忆 = "往昔难忆",
  // 6
  末狩 = "末狩",
}
const levelBossOperationListMap: LevelOperationListMap<typeof BossLevel, typeof BonusBossOperation> = {
  [Level.Third]: [
    BonusBossOperation.夕娥忆,
    BonusBossOperation.仁义武,
    BonusBossOperation.求道,
  ],
  [Level.Fifth]: [
    BonusBossOperation.昔字如烟,
    BonusBossOperation.往昔难忆,
  ],
  [Level.Sixth]: [
    BonusBossOperation.末狩,
  ]
}

// 每通过一个紧急作战，加50分（以结算页面为准）。
const emergencyOperationBaseScore = 50;
// 无漏通过以下紧急关时，获得对应分数
// 无漏定义为：关卡内未损失目标生命值，且摧毁所有雕伥。非无漏时，紧急作战加分降为原有的50%

enum OperationTag {
  default = "",
  emergency = "紧急",
  perfect = "无漏",
}

// 决定了此 Tag 的输入控件类型
const operationTagTypeMap: { [key in OperationTag]: TagType } = {
  [OperationTag.default]: TagType.Boolean,
  [OperationTag.emergency]: TagType.Boolean,
  [OperationTag.perfect]: TagType.Boolean,
}

// 决定了输入的时候的 ToggleGroup 选项，以及名称
// 第一个 Modifier 为默认，Operation 被添加则带有此 Modifier，移除即移除整条记录，且显示为 Operation 名称与第一个 Modifier 的拼接
const OperationTags: { [key in Operation]: OperationTag[] } = {
  [Operation.峥嵘战功]: [OperationTag.emergency, OperationTag.perfect],
  [Operation.赶场戏班]: [OperationTag.emergency, OperationTag.perfect],
  [Operation.青山不语]: [OperationTag.emergency, OperationTag.perfect],
  [Operation.离域检查]: [OperationTag.emergency, OperationTag.perfect],
  [Operation.薄礼一份]: [OperationTag.emergency, OperationTag.perfect],
  [Operation.邙山镇地方志]: [OperationTag.emergency, OperationTag.perfect],
  [Operation.不成烟火]: [OperationTag.emergency, OperationTag.perfect],
  [Operation.炎灼]: [OperationTag.emergency, OperationTag.perfect],
  [Operation.人镇]: [OperationTag.emergency, OperationTag.perfect],
  [Operation.借力打力]: [OperationTag.emergency, OperationTag.perfect],
  [Operation.越山海]: [OperationTag.default, OperationTag.emergency, OperationTag.perfect],
  [Operation.其他]: [OperationTag.emergency, OperationTag.perfect],
}

// 通用的 Tag 加法 Modifier 创建函数
const createTagAddModifier = <T extends StringEnum>(tag: T[keyof T], value: number) =>
  (v: number, tags: TagRecords<T>) => tags[tag] ? v + value : v;

const emergencyBaseScoreModifier = createTagAddModifier(OperationTag.emergency, emergencyOperationBaseScore);

// 由 Tag 依次应用 Modifiers 得到最终分数
const emergencyOperationModifiers: OperationModifiers<typeof Operation, typeof OperationTag> = {
  [Operation.峥嵘战功]: [
    emergencyBaseScoreModifier,
    createTagAddModifier(OperationTag.perfect, 40),
  ],
  [Operation.赶场戏班]: [
    emergencyBaseScoreModifier,
    createTagAddModifier(OperationTag.perfect, 40),
  ],
  [Operation.青山不语]: [
    emergencyBaseScoreModifier,
    createTagAddModifier(OperationTag.perfect, 60),
  ],
  [Operation.离域检查]: [
    emergencyBaseScoreModifier,
    createTagAddModifier(OperationTag.perfect, 40),
  ],
  [Operation.薄礼一份]: [
    emergencyBaseScoreModifier,
    createTagAddModifier(OperationTag.perfect, 40),
  ],
  [Operation.邙山镇地方志]: [
    emergencyBaseScoreModifier,
    createTagAddModifier(OperationTag.perfect, 60),
  ],
  [Operation.不成烟火]: [
    emergencyBaseScoreModifier,
    createTagAddModifier(OperationTag.perfect, 50),
  ],
  [Operation.炎灼]: [
    emergencyBaseScoreModifier,
    createTagAddModifier(OperationTag.perfect, 60),
  ],
  [Operation.人镇]: [
    emergencyBaseScoreModifier,
    createTagAddModifier(OperationTag.perfect, 60),
  ],
  [Operation.借力打力]: [
    emergencyBaseScoreModifier,
    createTagAddModifier(OperationTag.perfect, 70),
  ],
  [Operation.越山海]: [
    emergencyBaseScoreModifier,
    (v: number, tags: TagRecords<typeof OperationTag>) => {
      if (tags[OperationTag.perfect]) {
        return v + (tags[OperationTag.emergency] ? 100 : 30);
      }
      return v;
    }
  ],
  [Operation.其他]: [
    emergencyBaseScoreModifier,
  ],
}

type OperationRecord = TagRecord<typeof Operation, typeof OperationTag>;

// MARK: SpecialEvent
enum SpecialEvent {
  源源不断 = "源源不断",
  闪闪发光 = "闪闪发光",
  循循善诱 = "循循善诱",
  易易鸭鸭 = "易易鸭鸭",
  紧急劫罚 = "紧急劫罚",
  生百相 = "生百相",
  硕果累累 = "硕果累累",
  以逸待劳 = "以逸待劳",
  喜从驼来 = "喜从驼来",
  硅基伥的宴席 = "硅基伥的宴席",
  彻底失控 = "彻底失控",
  为崖作伥 = "为崖作伥",
}

enum SpecialEventTag {
  default = "",
  emergency = "紧急",
  perfect = "无漏",
  count = "坠崖数", // 为崖作伥专用
}

// 决定了此 Tag 的输入控件类型
const specialEventTags: { [key in SpecialEventTag]: TagType } = {
  [SpecialEventTag.default]: TagType.Boolean,
  [SpecialEventTag.emergency]: TagType.Boolean,
  [SpecialEventTag.perfect]: TagType.Boolean,
  [SpecialEventTag.count]: TagType.Number,
}

// 决定了输入的时候的 ToggleGroup 选项，以及名称
const SpecialEventOperationTags: { [key in SpecialEvent]: SpecialEventTag[] } = {
  [SpecialEvent.源源不断]: [SpecialEventTag.default, SpecialEventTag.emergency, SpecialEventTag.perfect],
  [SpecialEvent.闪闪发光]: [SpecialEventTag.default, SpecialEventTag.emergency, SpecialEventTag.perfect],
  [SpecialEvent.循循善诱]: [SpecialEventTag.default, SpecialEventTag.emergency, SpecialEventTag.perfect],
  [SpecialEvent.易易鸭鸭]: [SpecialEventTag.default, SpecialEventTag.emergency, SpecialEventTag.perfect],
  [SpecialEvent.紧急劫罚]: [SpecialEventTag.default, SpecialEventTag.emergency, SpecialEventTag.perfect],
  [SpecialEvent.生百相]: [SpecialEventTag.default, SpecialEventTag.perfect],
  [SpecialEvent.硕果累累]: [SpecialEventTag.emergency, SpecialEventTag.perfect],
  [SpecialEvent.以逸待劳]: [SpecialEventTag.default, SpecialEventTag.perfect],
  [SpecialEvent.喜从驼来]: [SpecialEventTag.default, SpecialEventTag.perfect],
  [SpecialEvent.硅基伥的宴席]: [SpecialEventTag.emergency, SpecialEventTag.perfect],
  [SpecialEvent.彻底失控]: [SpecialEventTag.emergency, SpecialEventTag.perfect],
  [SpecialEvent.为崖作伥]: [SpecialEventTag.default, SpecialEventTag.perfect, SpecialEventTag.count],
}

// 注意：Modifier 的定义顺序很重要！
// Modifiers 通过 reduce 累积应用：default -> emergency -> perfect
// 
// 计算规则说明：
// 1. default: 给基础分（最终分数的 50%）
// 2. emergency: 如果是紧急版本，额外加分
// 3. perfect: 无漏时将当前分数 * 2（翻倍到 100%）
//
// 示例：
// - 源源不断 普通无漏 20分: (10) * 2 = 20
// - 源源不断 普通非无漏 10分: 10 (50%)
// - 源源不断 紧急无漏 30分: (10 + 5) * 2 = 30
// - 源源不断 紧急非无漏 15分: 10 + 5 (50%)
// - 为崖作伥 无漏 30分: (1.5 * 5) * 2 = 15 (假设坠崖数为5)
// - 为崖作伥 非无漏 7.5分: 1.5 * 5 = 7.5 (50%)
//
// 特殊事件无漏定义：关卡内未损失目标生命值，击杀所有鸭/狗/熊/鼠/雕伥/宝箱
// 非无漏时，特殊事件加分降为原有的50%
const perfectDoubleModifier = (v: number, tags: TagRecords<typeof SpecialEventTag>) => tags[SpecialEventTag.perfect] ? v * 2 : v;

const specialEventModifiers: OperationModifiers<typeof SpecialEvent, typeof SpecialEventTag> = {
  [SpecialEvent.源源不断]: [
    createTagAddModifier(SpecialEventTag.default, 10),   // 普通 10
    createTagAddModifier(SpecialEventTag.emergency, 5),  // 紧急 15 = 10 + 5
    perfectDoubleModifier,
  ],
  [SpecialEvent.闪闪发光]: [
    createTagAddModifier(SpecialEventTag.default, 10),   // 普通 10
    createTagAddModifier(SpecialEventTag.emergency, 5),  // 紧急 15 = 10 + 5
    perfectDoubleModifier,
  ],
  [SpecialEvent.循循善诱]: [
    createTagAddModifier(SpecialEventTag.default, 10),   // 普通 10
    createTagAddModifier(SpecialEventTag.emergency, 15), // 紧急 25 = 10 + 15
    perfectDoubleModifier,
  ],
  [SpecialEvent.易易鸭鸭]: [
    createTagAddModifier(SpecialEventTag.default, 25),   // 普通 25
    createTagAddModifier(SpecialEventTag.emergency, 25), // 紧急 50 = 25 + 25
    perfectDoubleModifier,
  ],
  [SpecialEvent.紧急劫罚]: [
    createTagAddModifier(SpecialEventTag.emergency, 30), // 紧急 30
    perfectDoubleModifier,
  ],
  [SpecialEvent.生百相]: [
    createTagAddModifier(SpecialEventTag.default, 20),   // 普通 20
    perfectDoubleModifier,
  ],
  [SpecialEvent.硕果累累]: [
    createTagAddModifier(SpecialEventTag.emergency, 30), // 紧急 30
    perfectDoubleModifier,
  ],
  [SpecialEvent.以逸待劳]: [
    createTagAddModifier(SpecialEventTag.default, 30),   // 普通 30
    perfectDoubleModifier,
  ],
  [SpecialEvent.喜从驼来]: [
    createTagAddModifier(SpecialEventTag.default, 15),   // 普通 15
    perfectDoubleModifier,
  ],
  [SpecialEvent.硅基伥的宴席]: [
    createTagAddModifier(SpecialEventTag.emergency, 25), // 紧急 25
    perfectDoubleModifier,
  ],
  [SpecialEvent.彻底失控]: [
    createTagAddModifier(SpecialEventTag.emergency, 30), // 紧急 30
    perfectDoubleModifier,
  ],
  [SpecialEvent.为崖作伥]: [
    (v: number, tags: TagRecords<typeof SpecialEventTag>) => {
      const count = typeof tags[SpecialEventTag.count] === 'number' ? tags[SpecialEventTag.count] : 0;
      return v + count * 1.5;  // 1.5 * count
    },
    perfectDoubleModifier,
  ],
}

type SpecialEventRecord = TagRecord<typeof SpecialEvent, typeof SpecialEventTag>;

// MARK: ChaosNode (是非境祸乱)
enum ChaosNode {
  地有四难 = "地有四难",
  迷惘 = "迷惘",
}

enum ChaosNodeTags {
  perfect = "无漏",
}

// 决定了此 Tag 的输入控件类型
const chaosNodeTagTypeMap: { [key in ChaosNodeTags]: TagType } = {
  [ChaosNodeTags.perfect]: TagType.Boolean,
}

// 决定了输入的时候的 ToggleGroup 选项，以及名称
const ChaosNodeOperationTags: { [key in ChaosNode]: ChaosNodeTags[] } = {
  [ChaosNode.地有四难]: [ChaosNodeTags.perfect],
  [ChaosNode.迷惘]: [ChaosNodeTags.perfect],
}

// 是非境祸乱加分规则
// 仅无漏通过时获得对应分数
const chaosNodeModifiers: OperationModifiers<typeof ChaosNode, typeof ChaosNodeTags> = {
  [ChaosNode.地有四难]: [
    createTagAddModifier(ChaosNodeTags.perfect, 30),
  ],
  [ChaosNode.迷惘]: [
    createTagAddModifier(ChaosNodeTags.perfect, 30),
  ],
}

type ChaosNodeRecord = TagRecord<typeof ChaosNode, typeof ChaosNodeTags>;

// MARK: Store
type TmpOperatorsCnt = {
  sixStar: number,
  fiveStar: number,
  fourStar: number,
}

type HiddensCnt = {
  normal: number,
  withBonus: number,
}

type BossRecords = LevelModifierRecord<typeof BossLevel, typeof BonusBossOperation, typeof OperationModifier>;
type Store = {
  squad: OpeningSquad,
  limitedOperators: LimitedOperator[],
  operationRecords: OperationRecord[],
  specialEventRecords: SpecialEventRecord[],
  chaosNodeRecords: ChaosNodeRecord[],
  bossRecords: BossRecords,
  withdrawCnt: number,
  collectiblesCnt: number,
  tmpOperatorsCnt: TmpOperatorsCnt,
  hiddensCnt: HiddensCnt,
  score: number,
}

enum OperationModifier {
  default = "",
  perfect = "无漏",
  忘生玲珑 = "忘生玲珑",
}

// 注意：Modifier 的定义顺序很重要，系统会自动确保按照枚举定义顺序应用
const createTestStoreValue = (): Store => ({
  squad: OpeningSquad.其他,
  limitedOperators: [
    LimitedOperator.电弧
  ],
  operationRecords: [
    {
      operation: Operation.峥嵘战功,
      tags: {
        [OperationTag.emergency]: true,
        [OperationTag.perfect]: true,
      },
    },
    {
      operation: Operation.赶场戏班,
      tags: {
        [OperationTag.emergency]: true,
      },
    },
    {
      operation: Operation.青山不语,
      tags: {
        [OperationTag.emergency]: true,
        [OperationTag.perfect]: true,
      },
    },
    {
      operation: Operation.越山海,
      tags: {
        [OperationTag.default]: true,
        [OperationTag.perfect]: true,
      },
    }
  ],
  specialEventRecords: [
    {
      operation: SpecialEvent.源源不断,
      tags: {
        [SpecialEventTag.default]: true,
        [SpecialEventTag.perfect]: true,
      }, // 普通无漏: (10) * 2 = 20
    },
    {
      operation: SpecialEvent.闪闪发光,
      tags: {
        [SpecialEventTag.default]: true,
        [SpecialEventTag.emergency]: true,
      }, // 紧急非无漏: 10 + 5 = 15
    },
    {
      operation: SpecialEvent.易易鸭鸭,
      tags: {
        [SpecialEventTag.default]: true,
        [SpecialEventTag.emergency]: true,
        [SpecialEventTag.perfect]: true,
      }, // 紧急无漏: (25 + 25) * 2 = 100
    },
    {
      operation: SpecialEvent.紧急劫罚,
      tags: {
        [SpecialEventTag.default]: true,
        [SpecialEventTag.emergency]: true,
        [SpecialEventTag.perfect]: true,
      }, // 紧急无漏: (0 + 30) * 2 = 60
    },
    {
      operation: SpecialEvent.生百相,
      tags: {
        [SpecialEventTag.default]: true,
      }, // 普通非无漏: 20
    },
    {
      operation: SpecialEvent.以逸待劳,
      tags: {
        [SpecialEventTag.default]: true,
        [SpecialEventTag.perfect]: true,
      }, // 普通无漏: 30 * 2 = 60
    },
    {
      operation: SpecialEvent.为崖作伥,
      tags: {
        [SpecialEventTag.default]: true,
        [SpecialEventTag.perfect]: true,
        [SpecialEventTag.count]: 5,
      }, // 无漏: 1.5 * 5 * 2 = 15, 非无漏: 1.5 * 5 = 7.5
    }
  ],
  chaosNodeRecords: [
    {
      operation: ChaosNode.地有四难,
      tags: {
        [ChaosNodeTags.perfect]: true,
      },
    },
    {
      operation: ChaosNode.迷惘,
      tags: {
        [ChaosNodeTags.perfect]: true,
      },
    }
  ],
  bossRecords: {
    [BossLevel.Third]: {
      operation: BonusBossOperation.夕娥忆,
      modifiers: [OperationModifier.perfect], // 只有 perfect modifier
    },
    [BossLevel.Fifth]: {
      operation: BonusBossOperation.往昔难忆,
      modifiers: [OperationModifier.default, OperationModifier.perfect, OperationModifier.忘生玲珑], // 全部 modifiers
    },
    [BossLevel.Sixth]: null,
  },
  withdrawCnt: 61,
  collectiblesCnt: 151,
  tmpOperatorsCnt: {
    sixStar: 2,
    fiveStar: 1,
    fourStar: 3,
  },
  hiddensCnt: {
    normal: 2,
    withBonus: 1,
  },
  score: 20,
});

const createDefaultStoreValue = (): Store => ({
  squad: OpeningSquad.其他,
  limitedOperators: [],
  operationRecords: [],
  specialEventRecords: [],
  chaosNodeRecords: [],
  bossRecords: {
    [Level.Third]: null,
    [Level.Fifth]: null,
    [Level.Sixth]: null,
  },
  withdrawCnt: 0,
  collectiblesCnt: 0,
  tmpOperatorsCnt: {
    sixStar: 0,
    fiveStar: 0,
    fourStar: 0,
  },
  hiddensCnt: {
    normal: 0,
    withBonus: 0,
  },
  score: 0,
});

// 注意：Modifier 的定义顺序很重要，系统会自动确保按照枚举定义顺序应用
const bossOperationModiferMap: OperationModifierMap<typeof BonusBossOperation, typeof OperationModifier> = {
  // 3
  [BonusBossOperation.夕娥忆]: {
    [OperationModifier.perfect]: (v: number) => v + 30,
  },
  [BonusBossOperation.仁义武]: {
    [OperationModifier.perfect]: (v: number) => v + 50,
  },
  [BonusBossOperation.求道]: {
    [OperationModifier.perfect]: (v: number) => v + 50,
  },
  // 5
  [BonusBossOperation.昔字如烟]: {
    [OperationModifier.default]: (v: number) => v + 200,
    [OperationModifier.perfect]: (v: number) => v + 50,
  },
  [BonusBossOperation.往昔难忆]: {
    [OperationModifier.default]: (v: number) => v + 300,
    [OperationModifier.perfect]: (v: number) => v + 50,
    [OperationModifier.忘生玲珑]: (v: number) => v + 250,
  },
  // 6
  [BonusBossOperation.末狩]: {
    [OperationModifier.default]: (v: number) => v + 300,
    [OperationModifier.perfect]: (v: number) => v + 50,
  },
}

// MARK: createBossOperationInput
function createBossOperationInput(
  bossRecords: Accessor<BossRecords>, setBossRecords: Setter<BossRecords>
): {
  score: Accessor<number>,
  ui: () => JSX.Element,
} {
  const levelScore = () => {
    return enumValues(BossLevel).map((x) =>
      bossRecords()[x] == null ? 0 : bossRecords()[x]!.modifiers.reduce(
        (sum, modifier) => bossOperationModiferMap[bossRecords()[x]!.operation]![modifier]!(sum), 0)
    );
  }
  const score = () => levelScore().reduce((sum, x) => sum + x, 0);
  return {
    score,
    ui: () => <>
      <div class="flex flex-col gap-2 bg-white shadow p-4 rounded-lg">
        <div class="flex items-center gap-4">
          <h6 class="text-xl font-semibold">领袖作战</h6>
          <div class="flex-grow" />
          <span>分数: {score().toFixed(2)}</span>
        </div>
        <For each={enumValues(BossLevel)}>{(level, idx) => {
          const operations = levelBossOperationListMap[level];
          return <>
            <div class="flex gap-2 items-baseline">
              <span class="font-medium">第 {levelNum(level as unknown as Level)} 层：{level}</span>
              <span class="text-xs">{levelScore()[idx()]}</span>
            </div>
            <div class="flex flex-wrap gap-2">
              <For each={operations}>{(operation) => {
                const record = () => bossRecords()[level];

                return ModifierSelector(
                  operation,
                  bossOperationModiferMap,
                  () => !record()?.operation || record()?.operation !== operation ? [] : record()?.modifiers || [],
                  (modifiers) => {
                    if (modifiers.length === 0) {
                      setBossRecords(produce((records) => {
                        records[level] = null;
                      }));
                    } else {
                      setBossRecords(produce((records) => {
                        records[level] = {
                          operation: operation,
                          modifiers: modifiers as OperationModifier[],
                        };
                      }));
                    }
                  }
                )
              }}</For>
            </div>
          </>
        }}</For>
      </div>
    </>
  }
}

// MARK: createHiddensInput
function createHiddensInput(
  hiddensCnt: Accessor<HiddensCnt>, setHiddensCnt: Setter<HiddensCnt>
): {
  score: Accessor<number>,
  ui: () => JSX.Element,
} {
  const normalCnt = () => hiddensCnt().normal;
  const withBonusCnt = () => hiddensCnt().withBonus;
  const setNormalCnt = (v: number): void => { setHiddensCnt((cnt) => ({ ...cnt, normal: v })); };
  const setWithBonusCnt = (v: number): void => { setHiddensCnt((cnt) => ({ ...cnt, withBonus: v })); };
  const score = () => normalCnt() * 20 + withBonusCnt() * 30;
  return {
    score,
    ui: () => <>
      <div class="flex flex-col gap-2">
        <span class="font-medium">隐藏击杀</span>
        <div class="flex gap-1 max-w-full">
          <div class="flex flex-col gap-1 flex-1 min-w-0">
            <label class="text-sm text-gray-600">无鸭爵金币（+20）</label>
            <NumberInput value={normalCnt} setValue={setNormalCnt} />
          </div>
          <div class="flex flex-col gap-1 flex-1 min-w-0">
            <label class="text-sm text-gray-600">有鸭爵金币（+30）</label>
            <NumberInput value={withBonusCnt} setValue={setWithBonusCnt} />
          </div>
        </div>
        <span class="text-xs">
          {`${normalCnt()} x 20 + ${withBonusCnt()} x 30 = ${score()}`}
        </span>
      </div>
    </>
  }
}

// MARK: createTmpOperatorInput
function createTmpOperatorInput(
  tmpOperatorsCnt: Accessor<TmpOperatorsCnt>, setTmpOperatorsCnt: Setter<TmpOperatorsCnt>
): {
  score: Accessor<number>,
  ui: () => JSX.Element,
} {
  const sixStarCnt = () => tmpOperatorsCnt().sixStar;
  const fiveStarCnt = () => tmpOperatorsCnt().fiveStar;
  const fourStarCnt = () => tmpOperatorsCnt().fourStar;
  const setSixStarCnt = (v: number): void => { setTmpOperatorsCnt((cnt) => ({ ...cnt, sixStar: v })); };
  const setFiveStarCnt = (v: number): void => { setTmpOperatorsCnt((cnt) => ({ ...cnt, fiveStar: v })); };
  const setFourStarCnt = (v: number): void => { setTmpOperatorsCnt((cnt) => ({ ...cnt, fourStar: v })); };

  const SIX_STAR_SCORE = 50;
  const FIVE_STAR_SCORE = 20;
  const FOUR_STAR_SCORE = 10;
  const score = () => sixStarCnt() * SIX_STAR_SCORE + fiveStarCnt() * FIVE_STAR_SCORE + fourStarCnt() * FOUR_STAR_SCORE;
  return {
    score,
    ui: () => <>
      <div class="flex flex-col gap-2">
        <span class="font-medium">临时招募</span>
        <div class="flex gap-1 max-w-full">
          <div class="flex flex-col gap-1 flex-1 min-w-0">
            <label class="text-sm text-gray-600">六星数量</label>
            <NumberInput value={sixStarCnt} setValue={setSixStarCnt} />
          </div>
          <div class="flex flex-col gap-1 flex-1 min-w-0">
            <label class="text-sm text-gray-600">五星数量</label>
            <NumberInput value={fiveStarCnt} setValue={setFiveStarCnt} />
          </div>
          <div class="flex flex-col gap-1 flex-1 min-w-0">
            <label class="text-sm text-gray-600">四星数量</label>
            <NumberInput value={fourStarCnt} setValue={setFourStarCnt} />
          </div>
        </div>
        <span class="text-xs">
          {`${sixStarCnt()} x ${SIX_STAR_SCORE} + ${fiveStarCnt()} x ${FIVE_STAR_SCORE} + ${fourStarCnt()} x ${FOUR_STAR_SCORE} = ${score()}`}
        </span>
      </div>
    </>
  }
}

export function JingYunCup4() {
  const sm = createMediaQuery("(max-width: 40rem)");

  const [store, setStore] = createStore<Store>(createDefaultStoreValue());
  // const [store, setStore] = createStore<Store>(createTestStoreValue());

  // MARK: UI: 开局设置
  const OpeningCard: Component = () => <>
    <Card>
      <h6 class="text-xl font-semibold">开局分队</h6>
      <div class="flex gap-2 sm:gap-4 flex-wrap justify-stretch">
        {EnumToggleGroup(
          OpeningSquad,
          () => store.squad,
          (v) => setStore("squad", v),
          (v) => <span>{v}{v === OpeningSquad.棋行险着游客分队 ? "（-0.05）" : ""}</span>
        )}
      </div>
    </Card>
  </>

  // MARK: UI: 作战
  const [operationOpen, setOperationOpen] = createSignal(false);
  const addOperationRecord = (record: OperationRecord) => {
    setStore('operationRecords', (operations) => [...operations, record])
  }
  const updateOperationRecord = (idx: number, record: OperationRecord) => {
    setStore('operationRecords', idx, record)
  }
  const removeOperationRecord = (idx: number) => {
    setStore('operationRecords', (operations) => operations.filter((_, i) =>
      i !== idx
    ))
  }

  const { score: operationScore, ui: operationUI } = createTagRecordTable({
    records: () => store.operationRecords,
    operationModifiers: emergencyOperationModifiers,
    operationTags: OperationTags,
    operationTagTypeMap: operationTagTypeMap,
    onUpdateRecord: updateOperationRecord,
    onRemoveRecord: removeOperationRecord,
  });

  const OperationCard = () => <>
    <AddDefaultTagRecordModal
      open={operationOpen}
      onClose={() => setOperationOpen(false)}
      onAddRecord={addOperationRecord}
      title="添加作战"
      operationEnum={Operation}
      operationTags={OperationTags}
      levelOperationMap={{
        levels: OperationLevel,
        levelKeys: emergencyLevelKeys,
        map: levelOperationMap
      }}
      extraOperations={{
        label: "其他",
        operations: [Operation.其他]
      }}
    />
    <Card>
      <div class="flex items-center gap-4">
        <h6 class="text-xl font-semibold">作战</h6>
        <button class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm" onClick={() => {
          setOperationOpen(true)
        }}>
          添加
        </button>
        <div class="flex-grow" />
        <span>分数: {operationScore().toFixed(2)}</span>
      </div>
      {operationUI()}
    </Card>
  </>

  // MARK: UI: 特殊事件
  const [specialEventOpen, setSpecialEventOpen] = createSignal(false);
  const addSpecialEventRecord = (record: SpecialEventRecord) => {
    setStore('specialEventRecords', (records) => [...records, record])
  }
  const updateSpecialEventRecord = (idx: number, record: SpecialEventRecord) => {
    setStore('specialEventRecords', idx, record)
  }
  const removeSpecialEventRecord = (idx: number) => {
    setStore('specialEventRecords', (records) => records.filter((_, i) => i !== idx))
  }

  const { score: specialEventScore, ui: specialEventUI } = createTagRecordTable({
    records: () => store.specialEventRecords,
    operationModifiers: specialEventModifiers,
    operationTags: SpecialEventOperationTags,
    operationTagTypeMap: specialEventTags,
    onUpdateRecord: updateSpecialEventRecord,
    onRemoveRecord: removeSpecialEventRecord,
  });

  const SpecialEventCard = () => <>
    <AddDefaultTagRecordModal
      open={specialEventOpen}
      onClose={() => setSpecialEventOpen(false)}
      onAddRecord={addSpecialEventRecord}
      title="添加特殊事件"
      operationEnum={SpecialEvent}
      operationTags={SpecialEventOperationTags}
    />
    <Card>
      <div class="flex items-center gap-4">
        <h6 class="text-xl font-semibold">特殊事件</h6>
        <button class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm" onClick={() => {
          setSpecialEventOpen(true)
        }}>
          添加
        </button>
        <div class="flex-grow" />
        <span>分数: {specialEventScore().toFixed(2)}</span>
      </div>
      {specialEventUI()}
    </Card>
  </>

  // MARK: UI: 是非境祸乱
  const [chaosNodeOpen, setChaosNodeOpen] = createSignal(false);
  const addChaosNodeRecord = (record: ChaosNodeRecord) => {
    setStore('chaosNodeRecords', (records) => [...records, record])
  }
  const updateChaosNodeRecord = (idx: number, record: ChaosNodeRecord) => {
    setStore('chaosNodeRecords', idx, record)
  }
  const removeChaosNodeRecord = (idx: number) => {
    setStore('chaosNodeRecords', (records) => records.filter((_, i) => i !== idx))
  }

  const { score: chaosNodeScore, ui: chaosNodeUI } = createTagRecordTable({
    records: () => store.chaosNodeRecords,
    operationModifiers: chaosNodeModifiers,
    operationTags: ChaosNodeOperationTags,
    operationTagTypeMap: chaosNodeTagTypeMap,
    onUpdateRecord: updateChaosNodeRecord,
    onRemoveRecord: removeChaosNodeRecord,
  });

  const ChaosNodeCard = () => <>
    <AddDefaultTagRecordModal
      open={chaosNodeOpen}
      onClose={() => setChaosNodeOpen(false)}
      onAddRecord={addChaosNodeRecord}
      title="添加是非境祸乱"
      operationEnum={ChaosNode}
      operationTags={ChaosNodeOperationTags}
    />
    <Card>
      <div class="flex items-center gap-4">
        <h6 class="text-xl font-semibold">是非境祸乱</h6>
        <button class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm" onClick={() => {
          setChaosNodeOpen(true)
        }}>
          添加
        </button>
        <div class="flex-grow" />
        <span>分数: {chaosNodeScore().toFixed(2)}</span>
      </div>
      {chaosNodeUI()}
    </Card>
  </>

  // MARK: UI: 领袖作战
  const { score: bossScore, ui: bossUI } = createBossOperationInput(() => store.bossRecords, (bossRecords) => setStore('bossRecords', bossRecords));


  const calcLimitedOperatorCosts = () => {
    return store.limitedOperators.reduce((sum, operator) => sum + limitedOperatorCostMap[operator], 0);
  }
  const calcLimitedOperatorsSum = () => {
    return Math.max(0, (calcLimitedOperatorCosts() - 10)) * -500;
  }

  // MARK: UI: 阵容规则
  const LimitedOperatorsPart = () => <>
    <div class="flex flex-col gap-2 p-4 bg-white rounded-lg shadow shrink-0">
      <div class="flex items-center gap-4">
        <h6 class="text-xl font-semibold">阵容规则</h6>
        <div class="flex-grow" />
        <span>阵容消耗: <span class={calcLimitedOperatorCosts() > 10 ? "text-red-600" : "text-green-600"}>{calcLimitedOperatorCosts()} / 10</span></span>
        <span>分数: {calcLimitedOperatorsSum()}</span>
      </div>
      <span>选手比赛中最多抓取总价值不超过10分的干员，每超过1分，扣500分。</span>
      {EnumMultiSelectInput(
        LimitedOperator,
        () => store.limitedOperators,
        (v) => setStore("limitedOperators", v),
        (v) => <span>{v}（{limitedOperatorCostMap[v]}）</span>,
      )}
    </div>
  </>

  // 1. 完成比赛时，每持有一个收藏品，额外加 5 分，上限750分。
  const { score: collectiblesScore, ui: collectiblesUI } = createCollectibleInput(
    () => store.collectiblesCnt, (v) => setStore("collectiblesCnt", v),
    5, 750
  );
  // 2. 比赛期间消耗前瞻性投资余额小于 60 的不扣分，若消耗量超过 60 源石锭，每超出 1 点源石锭扣除 50 分
  const { score: withdrawScore, ui: withdrawUI } = createWithdrawInput(
    () => store.withdrawCnt, (v) => setStore("withdrawCnt", v),
    60, -60
  );
  // 3. 比赛过程中，选取临时招募干员可获得加分。每个六星干员+50 分，每个五星干员+20分，每个四星干员+10 分。
  const { score: tmpOperatorScore, ui: tmpOperatorUI } = createTmpOperatorInput(
    () => store.tmpOperatorsCnt, (v) => setStore("tmpOperatorsCnt", v)
  );
  // 4. 每击杀一个鸭/狗/熊/鼠，+20分。若持有鸭爵金币额外+10分。
  const { score: hiddensScore, ui: hiddensUI } = createHiddensInput(
    () => store.hiddensCnt, (v) => setStore("hiddensCnt", v)
  );
  // 5. 比赛时，每名选手的基础结算分倍率为1。抓取干员电弧时，结算分系数-0.05。使用棋行险着/游客分队时，最终总分系数-0.05。
  // 结算分系数：只受电弧影响
  const settlementFactor = () => {
    return 1.0 + (store.limitedOperators.includes(LimitedOperator.电弧) ? -0.05 : 0);
  }
  const factoredScore = () => {
    return store.score * settlementFactor();
  }
  // 最终总分系数：只受分队影响
  const finalFactor = () => {
    return 1.0 + openingSquadFactorMap[store.squad];
  }

  // MARK: UI: 结算 & 其他
  const OtherCard: Component = () => <>
    <Card class="flex-1 overflow-y-auto">
      <h6 class="text-xl font-semibold pb-2">其他</h6>
      <div class="flex flex-col gap-2 flex-1">
        {/* 收藏品 */}
        {collectiblesUI()}
        {/* 取钱 */}
        {withdrawUI()}
        {/* 临时招募 */}
        {tmpOperatorUI()}
        {/* 隐藏击杀 */}
        {hiddensUI()}
      </div>
    </Card>
  </>


  enum Tab {
    Squad = "分队&阵容",
    Operation = "作战",
    Others = "其他",
  }
  const [tab, setTab] = createSignal(Tab.Squad);

  // 计算各 Tab 的分数
  const tabScoreMap: { [key in Tab]: () => number } = {
    [Tab.Squad]: () => calcLimitedOperatorsSum(),
    [Tab.Operation]: () => operationScore() + specialEventScore() + chaosNodeScore() + bossScore(),
    [Tab.Others]: () => collectiblesScore() + withdrawScore() + tmpOperatorScore() + hiddensScore(),
  };
  const calcTotalSum = () => {
    const baseTotal = enumValues(Tab).reduce((sum, tab) => sum + tabScoreMap[tab](), 0) + factoredScore();
    return baseTotal * finalFactor();
  }
  const baseTotalSum = () => {
    return enumValues(Tab).reduce((sum, tab) => sum + tabScoreMap[tab](), 0) + factoredScore();
  }

  const [copyJsonOpen, setCopyJsonOpen] = createSignal(false);
  const [loadJsonOpen, setLoadJsonOpen] = createSignal(false);
  const [json, setJson] = createSignal("");

  // 共用的总分、结算分显示和操作按钮组件
  const TotalAndActions = (props: { onCopyClicked: () => void; onImportClicked: () => void }) => (
    <>
      <div class="flex gap-2 mb-2 max-w-full">
        <div class="flex flex-col w-full gap-1">
          <label class="text-sm text-gray-600">结算分</label>
          <NumberInput class="w-full" value={() => store.score} setValue={(v) => setStore("score", v)} />
          <span class="text-xs text-gray-500">{store.score} x {settlementFactor().toFixed(2)} = {factoredScore().toFixed(2)}</span>
        </div>
      </div>
      <div class="flex gap-2 justify-between sm:flex-col max-w-full">
        <div class="flex flex-col">
          <span class="text-lg font-bold text-blue-600">
            总分：<span class="text-2xl">{calcTotalSum().toFixed(2)}</span>
          </span>
          <span class="text-xs text-gray-500">{baseTotalSum().toFixed(2)} x {finalFactor().toFixed(2)} = {calcTotalSum().toFixed(2)}</span>
        </div>
        <div class="flex gap-2 flex-shrink-0">
          <button class="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium sm:px-3 sm:py-2" onClick={() => { setStore(createDefaultStoreValue()) }}>清零</button>
          <button class="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 text-sm sm:px-3 sm:py-2" onClick={props.onCopyClicked}>导出</button>
          <button class="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 text-sm sm:px-3 sm:py-2" onClick={props.onImportClicked}>导入</button>
        </div>
      </div>
    </>
  );

  return <>
    <Switch>
      {/* 窄屏界面 */}
      <Match when={sm()}>
        <div class="flex h-full box-border flex-col">
          <div class="flex flex-col flex-grow gap-2 overflow-y-auto p-2">
            <Switch>
              <Match when={tab() == Tab.Operation}>
                <OperationCard />
                <SpecialEventCard />
                <ChaosNodeCard />
                {bossUI()}
              </Match>
              <Match when={tab() == Tab.Squad}>
                <OpeningCard />
                <LimitedOperatorsPart />
              </Match>
              <Match when={tab() == Tab.Others}>
                <OtherCard />
              </Match>
            </Switch>
          </div>
          <div class="flex flex-col shrink-0 bg-white border-t-2 border-gray-200 shadow-lg" style={`padding-bottom: max(env(safe-area-inset-bottom), 0px)`}>
            <div class="flex w-full">
              <ToggleGroup.Root
                value={[tab()]}
                onValueChange={(details) => {
                  if (details.value.length > 0) {
                    setTab(details.value[0] as Tab);
                  }
                }}
                class="flex w-full"
              >
                <For each={enumValues(Tab)}>{(tabValue) => (
                  <ToggleGroup.Item
                    value={tabValue}
                    class="flex-1 py-3 text-sm font-medium transition-colors flex flex-col items-center"
                    classList={{
                      "bg-blue-500 text-white": tab() === tabValue,
                      "bg-white text-gray-700 hover:bg-gray-50": tab() !== tabValue
                    }}
                  >
                    <div class="flex items-baseline gap-1">
                      <span>{tabValue}</span>
                      <span class="text-xs opacity-80">{tabScoreMap[tabValue]().toFixed(2)}</span>
                    </div>
                  </ToggleGroup.Item>
                )}</For>
              </ToggleGroup.Root>
            </div>
            <div class="px-3 py-3 gap-3 border-t border-gray-100">
              <TotalAndActions
                onCopyClicked={() => {
                  setJson(JSON.stringify(store));
                  setCopyJsonOpen(true);
                }}
                onImportClicked={() => setLoadJsonOpen(true)}
              />
              <Dialog.Root open={copyJsonOpen()} onOpenChange={(details) => setCopyJsonOpen(details.open)}>
                <Portal>
                  <Dialog.Backdrop class="fixed inset-0 bg-black/50" />
                  <Dialog.Positioner class="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Content class="bg-white rounded-lg shadow-xl p-4 w-[90%] sm:w-3/4 md:w-1/2 max-h-[80%] flex flex-col gap-2">
                      <Dialog.Title class="text-lg font-semibold">数据 JSON</Dialog.Title>
                      <textarea class="border border-gray-300 rounded px-3 py-2 min-h-24 max-h-24 resize-none" placeholder="数据json" value={json()} readonly />
                      <div class="flex gap-4 justify-end">
                        <Dialog.CloseTrigger class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">关闭</Dialog.CloseTrigger>
                      </div>
                    </Dialog.Content>
                  </Dialog.Positioner>
                </Portal>
              </Dialog.Root>

              <Dialog.Root open={loadJsonOpen()} onOpenChange={(details) => setLoadJsonOpen(details.open)}>
                <Portal>
                  <Dialog.Backdrop class="fixed inset-0 bg-black/50" />
                  <Dialog.Positioner class="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Content class="bg-white rounded-lg shadow-xl p-4 w-[90%] sm:w-3/4 md:w-1/2 max-h-[80%] flex flex-col gap-2">
                      <Dialog.Title class="text-lg font-semibold">导入 JSON</Dialog.Title>
                      <textarea
                        class="border border-gray-300 rounded px-3 py-2 min-h-24 max-h-24 resize-none"
                        value={json()}
                        onInput={(e) => setJson(e.currentTarget.value)}
                      />
                      <div class="flex gap-4 justify-end">
                        <button class="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => {
                          setStore(JSON.parse(json()))
                          setLoadJsonOpen(false);
                        }}>确定</button>
                        <Dialog.CloseTrigger class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">取消</Dialog.CloseTrigger>
                      </div>
                    </Dialog.Content>
                  </Dialog.Positioner>
                </Portal>
              </Dialog.Root>
            </div>
          </div>
        </div>
      </Match>

      {/* 宽屏界面 */}
      <Match when={!sm()}>
        <div class="flex gap-2 h-full box-border p-2">
          <div class="flex flex-col gap-2 flex-1 h-full overflow-y-scroll pr-2">
            {/* <span>
              单个“常乐”节点最多可获得1次烛火。
              单个“诡异行商”“易与”节点最多刷新4次。
              “昔字如烟”，“往昔难忆”关卡中，不允许在“岁躯”落下前在所在其地块部署任何单位。
            </span> */}
            <OpeningCard />
            <LimitedOperatorsPart />
            <OperationCard />
            <SpecialEventCard />
            <ChaosNodeCard />
            {bossUI()}
          </div>
          <div class="flex flex-col min-w-[200px] gap-2 max-w-60">
            <OtherCard />
            <div class="flex flex-col gap-2 p-4 bg-white rounded-lg shadow">
              <TotalAndActions
                onCopyClicked={() => {
                  setJson(JSON.stringify(store));
                  setCopyJsonOpen(true);
                }}
                onImportClicked={() => setLoadJsonOpen(true)}
              />
              <Dialog.Root open={copyJsonOpen()} onOpenChange={(details) => setCopyJsonOpen(details.open)}>
                <Portal>
                  <Dialog.Backdrop class="fixed inset-0 bg-black/50" />
                  <Dialog.Positioner class="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Content class="bg-white rounded-lg shadow-xl p-4 w-[90%] sm:w-3/4 md:w-1/2 max-h-[80%] flex flex-col gap-2">
                      <Dialog.Title class="text-lg font-semibold">数据 JSON</Dialog.Title>
                      <textarea class="border border-gray-300 rounded px-3 py-2 min-h-24 max-h-24 resize-none" placeholder="数据json" value={json()} readonly />
                      <div class="flex gap-4 justify-end">
                        <Dialog.CloseTrigger class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">关闭</Dialog.CloseTrigger>
                      </div>
                    </Dialog.Content>
                  </Dialog.Positioner>
                </Portal>
              </Dialog.Root>

              <Dialog.Root open={loadJsonOpen()} onOpenChange={(details) => setLoadJsonOpen(details.open)}>
                <Portal>
                  <Dialog.Backdrop class="fixed inset-0 bg-black/50" />
                  <Dialog.Positioner class="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Content class="bg-white rounded-lg shadow-xl p-4 w-[90%] sm:w-3/4 md:w-1/2 max-h-[80%] flex flex-col gap-2">
                      <Dialog.Title class="text-lg font-semibold">导入 JSON</Dialog.Title>
                      <textarea
                        class="border border-gray-300 rounded px-3 py-2 min-h-24 max-h-24 resize-none"
                        value={json()}
                        onInput={(e) => setJson(e.currentTarget.value)}
                      />
                      <div class="flex gap-4 justify-end">
                        <button class="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => {
                          setStore(JSON.parse(json()))
                          setLoadJsonOpen(false);
                        }}>确定</button>
                        <Dialog.CloseTrigger class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">取消</Dialog.CloseTrigger>
                      </div>
                    </Dialog.Content>
                  </Dialog.Positioner>
                </Portal>
              </Dialog.Root>
            </div>
          </div>
        </div>
      </Match>
    </Switch>
  </>;
}