import { Accessor, Component, createEffect, createSignal, For, Match, Show, Switch, Index, Setter, JSX } from "solid-js";
import { Dialog } from "@ark-ui/solid/dialog";
import { Checkbox } from "@ark-ui/solid/checkbox";
import { Portal } from "solid-js/web";

import { createStore, produce } from "solid-js/store";
import { enumKeys, enumValues, readJson, saveJson, StringEnum } from "../lib/utils";
import { createMediaQuery } from "@solid-primitives/media";
import { AddDefaultModifierRecordModal, createCollectibleInput, createModifierRecordTable, createWithdrawInput, EnumMultiSelectInput, EnumSelectInput, FullOperationModifierMap, LevelModifierRecord, LevelOperationListMap, ModifierRecord, ModifierSelector, NumberInput, OperationModifierMap } from "../components";

function levelNum(level: Level): number {
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
  玛恩纳 = "玛恩纳",
  隐德莱希 = "隐德莱希",
  逻各斯 = "逻各斯",
  阿斯卡纶 = "阿斯卡纶",
  娜仁图亚 = "娜仁图亚",
  琳琅诗怀雅 = "琳琅诗怀雅",
  安洁莉娜 = "安洁莉娜",
  凯尔希 = "凯尔希",
  麒麟R夜刀 = "麒麟R夜刀",
  伊内斯 = "伊内斯",
  空弦 = "空弦",
  妮芙 = "妮芙",
  迷迭香 = "迷迭香",
}

const limitedOperatorCostMap: { [key in LimitedOperator]: number } = {
  [LimitedOperator.电弧]: 7,
  [LimitedOperator.新约能天使]: 5,
  [LimitedOperator.维什戴尔]: 5,
  [LimitedOperator.丰川祥子]: 5,
  [LimitedOperator.司霆惊蛰]: 5,
  [LimitedOperator.斩业星熊]: 4,
  [LimitedOperator.酒神]: 4,
  [LimitedOperator.水月]: 4,
  [LimitedOperator.玛恩纳]: 3,
  [LimitedOperator.隐德莱希]: 3,
  [LimitedOperator.逻各斯]: 3,
  [LimitedOperator.阿斯卡纶]: 3,
  [LimitedOperator.娜仁图亚]: 3,
  [LimitedOperator.琳琅诗怀雅]: 3,
  [LimitedOperator.安洁莉娜]: 1,
  [LimitedOperator.凯尔希]: 1,
  [LimitedOperator.麒麟R夜刀]: 1,
  [LimitedOperator.伊内斯]: 1,
  [LimitedOperator.空弦]: 1,
  [LimitedOperator.妮芙]: 1,
  [LimitedOperator.迷迭香]: 1,
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

// MARK: EmergencyOperation
enum Level {
  First = "洪陆楼",
  Second = "山水阁",
  Third = "云瓦亭",
  Fourth = "汝吾门",
  Fifth = "见字祠",
  Sixth = "始末陵/明灭顶",
}
const levelKeys: (keyof typeof Level)[] = enumKeys(Level);
enum EmergencyOperation {
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
const levelEmergencyOperationMap: LevelOperationListMap<typeof Level, typeof EmergencyOperation> = {
  [Level.First]: [
    EmergencyOperation.其他,
  ],
  [Level.Second]: [
    EmergencyOperation.其他,
  ],
  [Level.Third]: [
    EmergencyOperation.其他,
  ],
  [Level.Fourth]: [
    EmergencyOperation.峥嵘战功,
    EmergencyOperation.赶场戏班,
    EmergencyOperation.其他,
  ],
  [Level.Fifth]: [
    EmergencyOperation.青山不语,
    EmergencyOperation.离域检查,
    EmergencyOperation.薄礼一份,
    EmergencyOperation.邙山镇地方志,
    EmergencyOperation.不成烟火,
    EmergencyOperation.其他,
  ],
  [Level.Sixth]: [
    EmergencyOperation.炎灼,
    EmergencyOperation.人镇,
    EmergencyOperation.借力打力,
    EmergencyOperation.越山海,
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
  破岁阵祀 = "破岁阵祀",
  昔字如烟 = "昔字如烟",
  天数将易 = "天数将易",
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
    BonusBossOperation.破岁阵祀,
    BonusBossOperation.天数将易,
    BonusBossOperation.昔字如烟,
    BonusBossOperation.往昔难忆,
  ],
  [Level.Sixth]: [
    BonusBossOperation.末狩,
  ]
}

// 每通过一个紧急作战，加20分（以结算页面为准）。
const emergencyOperationBaseScore = 20;
// 无漏通过以下紧急关时，获得对应分数
// 无漏定义为：关卡内未损失目标生命值，且摧毁所有雕伥。非无漏时，紧急作战加分降为原有的50%

enum EmergencyOperationModifier {
  default = "",
  perfect = "无漏",
}

// 使用 Modifier 系统定义紧急作战的加分规则
const emergencyOperationModifierMap: FullOperationModifierMap<typeof EmergencyOperation, typeof EmergencyOperationModifier> = {
  [EmergencyOperation.峥嵘战功]: {
    [EmergencyOperationModifier.default]: (v: number) => v + emergencyOperationBaseScore,
    [EmergencyOperationModifier.perfect]: (v: number) => v + 40,
  },
  [EmergencyOperation.赶场戏班]: {
    [EmergencyOperationModifier.default]: (v: number) => v + emergencyOperationBaseScore,
    [EmergencyOperationModifier.perfect]: (v: number) => v + 40,
  },
  [EmergencyOperation.青山不语]: {
    [EmergencyOperationModifier.default]: (v: number) => v + emergencyOperationBaseScore,
    [EmergencyOperationModifier.perfect]: (v: number) => v + 60,
  },
  [EmergencyOperation.离域检查]: {
    [EmergencyOperationModifier.default]: (v: number) => v + emergencyOperationBaseScore,
    [EmergencyOperationModifier.perfect]: (v: number) => v + 40,
  },
  [EmergencyOperation.薄礼一份]: {
    [EmergencyOperationModifier.default]: (v: number) => v + emergencyOperationBaseScore,
    [EmergencyOperationModifier.perfect]: (v: number) => v + 40,
  },
  [EmergencyOperation.邙山镇地方志]: {
    [EmergencyOperationModifier.default]: (v: number) => v + emergencyOperationBaseScore,
    [EmergencyOperationModifier.perfect]: (v: number) => v + 60,
  },
  [EmergencyOperation.不成烟火]: {
    [EmergencyOperationModifier.default]: (v: number) => v + emergencyOperationBaseScore,
    [EmergencyOperationModifier.perfect]: (v: number) => v + 50,
  },
  [EmergencyOperation.炎灼]: {
    [EmergencyOperationModifier.default]: (v: number) => v + emergencyOperationBaseScore,
    [EmergencyOperationModifier.perfect]: (v: number) => v + 60,
  },
  [EmergencyOperation.人镇]: {
    [EmergencyOperationModifier.default]: (v: number) => v + emergencyOperationBaseScore,
    [EmergencyOperationModifier.perfect]: (v: number) => v + 60,
  },
  [EmergencyOperation.借力打力]: {
    [EmergencyOperationModifier.default]: (v: number) => v + emergencyOperationBaseScore,
    [EmergencyOperationModifier.perfect]: (v: number) => v + 70,
  },
  [EmergencyOperation.越山海]: {
    [EmergencyOperationModifier.default]: (v: number) => v + emergencyOperationBaseScore,
    [EmergencyOperationModifier.perfect]: (v: number) => v + 100,
  },
  [EmergencyOperation.其他]: {
    [EmergencyOperationModifier.default]: (v: number) => v + emergencyOperationBaseScore,
  },
}

type EmergencyOperationRecord = ModifierRecord<typeof EmergencyOperation, typeof EmergencyOperationModifier>;

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
  squad: Squad | null,
  limitedOperators: LimitedOperator[],
  emergencyRecords: EmergencyOperationRecord[],
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

const testStoreValue: Store = {
  // squad: Squad.游客分队,
  squad: null,
  limitedOperators: [
    LimitedOperator.电弧
  ],
  emergencyRecords: [
    {
      operation: EmergencyOperation.峥嵘战功,
      modifiers: [EmergencyOperationModifier.default, EmergencyOperationModifier.perfect],
    },
    {
      operation: EmergencyOperation.峥嵘战功,
      modifiers: [EmergencyOperationModifier.default],
    }
  ],
  bossRecords: {
    [BossLevel.Third]: {
      operation: BonusBossOperation.夕娥忆,
      modifiers: [OperationModifier.perfect],
    },
    [BossLevel.Fifth]: {
      operation: BonusBossOperation.往昔难忆,
      modifiers: [OperationModifier.default, OperationModifier.perfect, OperationModifier.忘生玲珑],
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
    normal: 0,
    withBonus: 0,
  },
  score: 20,
};

const defaultStoreValue: Store = {
  squad: null,
  limitedOperators: [],
  emergencyRecords: [],
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
};

const operationModiferMap: OperationModifierMap<typeof BonusBossOperation, typeof OperationModifier> = {
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
  [BonusBossOperation.破岁阵祀]: {
    [OperationModifier.default]: (v: number) => v + 50,
  },
  [BonusBossOperation.天数将易]: {
    [OperationModifier.default]: (v: number) => v + 150,
  },
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
        (sum, modifier) => operationModiferMap[bossRecords()[x]!.operation]![modifier]!(sum), 0)
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
          <span>该部分得分: {score().toFixed(1)}</span>
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
                  operationModiferMap,
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
  const score = () => normalCnt() * 10 + withBonusCnt() * 30;
  return {
    score,
    ui: () => <>
      <div class="flex flex-col gap-2">
        <span>临时招募</span>
        <div class="flex gap-1 max-w-full">
          <div class="flex flex-col gap-1 flex-1 min-w-0">
            <label class="text-sm text-gray-600">无鸭爵金砖（+10）</label>
            <NumberInput value={normalCnt} setValue={setNormalCnt} />
          </div>
          <div class="flex flex-col gap-1 flex-1 min-w-0">
            <label class="text-sm text-gray-600">有鸭爵金砖（+30）</label>
            <NumberInput value={withBonusCnt} setValue={setWithBonusCnt} />
          </div>
        </div>
        <span class="text-xs">
          {`${normalCnt()} x 10 + ${withBonusCnt()} x 30 = ${score()}`}
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
        <span>临时招募</span>
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
  const sm = createMediaQuery("(max-width: 600px)");

  // const [store, setStore] = createStore<Store>({ ...defaultStoreValue });
  const [store, setStore] = createStore<Store>({ ...testStoreValue });

  // MARK: UI: 开局设置
  const OpeningPart: Component = () => <>
    <div class="flex flex-col gap-2 p-4 bg-white rounded-lg shadow shrink-0 z-20">
      <h6 class="text-xl font-semibold">开局设置</h6>
      <div class="flex gap-4 flex-wrap justify-stretch">
        {EnumSelectInput(Squad, () => store.squad, (v) => setStore("squad", v))}
      </div>
    </div>
  </>

  // MARK: UI: 紧急作战
  const [emergencyOpen, setEmergencyOpen] = createSignal(false);
  const addEmergencyRecord = (record: EmergencyOperationRecord) => {
    setStore('emergencyRecords', (operations) => [...operations, record])
  }
  const updateEmergencyRecord = (idx: number, record: EmergencyOperationRecord) => {
    setStore('emergencyRecords', idx, record)
  }
  const removeEmergencyRecord = (idx: number) => {
    setStore('emergencyRecords', (operations) => operations.filter((_, i) =>
      i !== idx
    ))
  }

  const calcEmergencySum = () => {
    return store.emergencyRecords.reduce((sum, record) => {
      return record.modifiers.reduce((recordSum, modifier) => {
        return emergencyOperationModifierMap[record.operation][modifier]!(recordSum);
      }, 0);
    }, 0);
  }
  const { score: emergencyScore, ui: emergencyUI } = createModifierRecordTable({
    records: () => store.emergencyRecords,
    operationModifierMap: emergencyOperationModifierMap,
    onUpdateRecord: updateEmergencyRecord,
    onRemoveRecord: removeEmergencyRecord,
  });

  const EmergencyPart = () => <>
    <AddDefaultModifierRecordModal
      open={emergencyOpen}
      onClose={() => setEmergencyOpen(false)}
      onAddRecord={addEmergencyRecord}
      title="添加紧急作战"
      operationEnum={EmergencyOperation}
      operationModifierMap={emergencyOperationModifierMap}
      levelOperationMap={{
        levels: Level,
        levelKeys: levelKeys,
        map: levelEmergencyOperationMap
      }}
    />
    <div class="flex flex-col gap-2 p-4 bg-white rounded-lg shadow shrink-0">
      <div class="flex items-center gap-4">
        <h6 class="text-xl font-semibold">紧急作战</h6>
        <button class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm" onClick={() => {
          setEmergencyOpen(true)
        }}>
          添加
        </button>
        <div class="flex-grow" />
        <span>该部分得分: {emergencyScore().toFixed(1)}</span>
      </div>
      {emergencyUI()}
    </div>
  </>

  // // 隐藏作战
  // const [hiddenOpen, setHiddenOpen] = createSignal(false);
  // const addHiddenRecord = (record: HiddenOperationRecord) => {
  //   setStore('hiddenRecords', (operations) => [...operations, record])
  // }
  // const updateHiddenRecord = (idx: number, record: HiddenOperationRecord) => {
  //   setStore('hiddenRecords', (operations) => operations.map((operation, i) =>
  //     i !== idx ? operation : record
  //   ))
  // }
  // const removeHiddenRecord = (idx: number) => {
  //   setStore('hiddenRecords', (operations) => operations.filter((_, i) =>
  //     i !== idx
  //   ))
  // }
  // const HiddenPart = () => <>
  //   <AddHiddenRecordModal open={hiddenOpen} onClose={() => {
  //     setHiddenOpen(false);
  //   }} onAddRecord={addHiddenRecord} />
  //   <div class="flex flex-col gap-2 p-4 bg-white rounded-lg shadow shrink-0">
  //     <div class="flex items-center gap-4">
  //       <h6 class="text-xl font-semibold">隐藏作战</h6>
  //       <button class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm" onClick={() => {
  //         setHiddenOpen(true)
  //       }}>
  //         添加
  //       </button>
  //       <div class="flex-grow" />
  //       <span>该部分得分: {calcHiddenSum().toFixed(1)}</span>
  //     </div>
  //     <div class="flex justify-stretch gap-2">
  //       <div class="flex-1 overflow-x-auto">
  //         <table class="w-full text-sm">
  //           <thead>
  //             <tr class="border-b">
  //               <th class="text-left p-2">名称</th>
  //               <th class="text-left p-2">无漏</th>
  //               <th class="text-right p-2">分数</th>
  //               <th class="text-center p-2">操作</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             <For each={store.hiddenRecords}>
  //               {(item, idx) => (
  //                 <tr class="border-b last:border-0">
  //                   <td class="p-2" classList={{ "text-red-500": item.emergency }}>
  //                     {item.operation}
  //                     <Show when={item.emergency}>
  //                       （紧急）
  //                     </Show>
  //                   </td>
  //                   <td class="p-2">
  //                     <KCheckbox.Root
  //                       checked={item.perfect}
  //                       onChange={(v) => {
  //                         updateHiddenRecord(idx(), { ...item, perfect: v });
  //                       }}
  //                       class="inline-flex items-center"
  //                     >
  //                       <KCheckbox.Input class="sr-only" />
  //                       <KCheckbox.Control class="w-5 h-5 border-2 border-gray-400 rounded flex items-center justify-center ui-checked:bg-blue-500 ui-checked:border-blue-500">
  //                         <KCheckbox.Indicator>
  //                           <svg class="w-3 h-3 text-white" viewBox="0 0 12 10" fill="none">
  //                             <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  //                           </svg>
  //                         </KCheckbox.Indicator>
  //                       </KCheckbox.Control>
  //                     </KCheckbox.Root>
  //                   </td>
  //                   <td class="text-right p-2">{calcHiddenRecordScore(idx()).toFixed(1)}</td>
  //                   <td class="text-center p-2">
  //                     <button class="text-red-500 hover:text-red-700 p-1" onClick={() => removeHiddenRecord(idx())}>
  //                       <span class="i-mdi-delete text-xl"></span>
  //                     </button>
  //                   </td>
  //                 </tr>
  //               )}
  //             </For>
  //           </tbody>
  //         </table>
  //       </div>
  //     </div>
  //   </div>
  // </>
  // MARK: UI: 领袖作战
  const { score: bossScore, ui: bossUI } = createBossOperationInput(() => store.bossRecords, (bossRecords) => setStore('bossRecords', bossRecords));


  const calcLimitedOperatorCosts = () => {
    return store.limitedOperators.reduce((sum, operator) => sum + limitedOperatorCostMap[operator], 0);
  }
  const calcLimitedOperatorsSum = () => {
    return Math.max(0, (calcLimitedOperatorCosts() - 10)) * -200;
  }

  // MARK: UI: 阵容规则
  const LimitedOperatorsPart = () => <>
    <div class="flex flex-col gap-2 p-4 bg-white rounded-lg shadow shrink-0">
      <div class="flex items-center gap-4">
        <h6 class="text-xl font-semibold">阵容规则</h6>
        <div class="flex-grow" />
        <span>阵容消耗: <span class={calcLimitedOperatorCosts() > 10 ? "text-red-600" : "text-green-600"}>{calcLimitedOperatorCosts()} / 10</span></span>
        <span>该部分得分: {calcLimitedOperatorsSum()}</span>
      </div>
      <span>选手比赛中最多抓取总价值不超过10分的干员，每超过1分，扣200分。</span>
      {EnumMultiSelectInput(LimitedOperator, () => store.limitedOperators, (v) => setStore("limitedOperators", v), (v) => v)}
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
    40, -50
  );
  // 3. 比赛过程中，选取临时招募干员可获得加分。每个六星干员+50 分，每个五星干员+20分，每个四星干员+10 分。
  const { score: tmpOperatorScore, ui: tmpOperatorUI } = createTmpOperatorInput(
    () => store.tmpOperatorsCnt, (v) => setStore("tmpOperatorsCnt", v)
  );
  // 4. 每击杀一个鸭/狗/熊/鼠，+20分。若持有鸭爵金币额外+10分。
  const { score: hiddensScore, ui: hiddensUI } = createHiddensInput(
    () => store.hiddensCnt, (v) => setStore("hiddensCnt", v)
  );
  // 5. 比赛时，每名选手的基础结算分倍率为1。使用游客分队比赛时，该倍率-0.1。抓取干员电弧时，该倍率-0.05。
  const factor = () => {
    return 1.0 +
      (store.squad == Squad.游客分队 ? -0.1 : 0) +
      (store.limitedOperators.includes(LimitedOperator.电弧) ? -0.05 : 0);
  }
  const factoredScore = () => {
    return store.score * factor();
  }

  // MARK: UI: 结算 & 其他
  const SumPart: Component = () => <>
    <div class="flex flex-col gap-2 flex-grow p-4 bg-white rounded-lg shadow shrink-0 max-w-60">
      <h6 class="text-xl font-semibold pb-2">结算</h6>
      <div class="flex flex-col gap-2 flex-1">
        <div class="flex flex-col gap-1">
          <label class="text-sm text-gray-600">倍率：{factor()}</label>
        </div>
        {/* 收藏品 */}
        {collectiblesUI()}
        {/* 取钱 */}
        {withdrawUI()}
        {/* 临时招募 */}
        {tmpOperatorUI()}
        {/* 隐藏击杀 */}
        {hiddensUI()}
        <div class="flex flex-col gap-1">
          <label class="text-sm text-gray-600">结算分</label>
          <NumberInput value={() => store.score} setValue={(v) => setStore("score", v)} />
          <span class="text-xs text-gray-600">{store.score} x {factor()} = {factoredScore()}</span>
        </div>
      </div>
    </div>
  </>

  const calcTotalSum = () => {
    return emergencyScore() + bossScore() +
      calcLimitedOperatorsSum() + collectiblesScore() + withdrawScore() + tmpOperatorScore() + hiddensScore();
  }

  const [copyJsonOpen, setCopyJsonOpen] = createSignal(false);
  const [loadJsonOpen, setLoadJsonOpen] = createSignal(false);
  const [json, setJson] = createSignal("");

  // TODO: 窄屏适配
  enum Tab {
    Operation = "作战",
    OperatorsAndKingsCollectible = "阵容和国王套",
    Others = "其他",
  }
  const [tab, setTab] = createSignal(Tab.Operation);

  return <>
    <Switch>
      {/* 窄屏界面 */}
      <Match when={sm()}>
        <div class="flex h-full box-border flex-col">
          <OpeningPart />
          <div class="flex flex-col flex-grow gap-2 overflow-y-auto p-2">
            {/* <Switch>
              <Match when={tab() == Tab.Operation}>
                <EmergencyPart />
                <HiddenPart />
                <BossPart />
              </Match>
              <Match when={tab() == Tab.OperatorsAndKingsCollectible}>
                <OperatorPart />
                <KingsCollectivesPart />
              </Match>
              <Match when={tab() == Tab.Others}>
                <SumPart />
              </Match>
            </Switch> */}
          </div>
          <div class="flex flex-col gap-2 shrink-0 bg-white border-t shadow-lg">
            <div class="flex gap-2 p-2">
              <span>总分：
                <span class="text-2xl">{calcTotalSum()}</span>
              </span>
              <div class="flex-grow" />
              <button class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm" onClick={() => { setStore({ ...defaultStoreValue }) }}>清零</button>

              <Dialog.Root open={copyJsonOpen()} onOpenChange={(details) => setCopyJsonOpen(details.open)}>
                <Portal>
                  <Dialog.Backdrop class="fixed inset-0 bg-black/50" />
                  <Dialog.Positioner class="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Content class="bg-white rounded-lg shadow-xl p-4 w-1/2 max-h-[80%] flex flex-col gap-2">
                      <Dialog.Title class="text-lg font-semibold">数据 JSON</Dialog.Title>
                      <textarea class="border border-gray-300 rounded px-3 py-2 min-h-24 max-h-24 resize-none" value={json()} readonly />
                      <div class="flex gap-4 justify-end">
                        <Dialog.CloseTrigger class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">关闭</Dialog.CloseTrigger>
                      </div>
                    </Dialog.Content>
                  </Dialog.Positioner>
                </Portal>
              </Dialog.Root>

              <button class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm" onClick={async () => {
                setJson(JSON.stringify(store));
                setCopyJsonOpen(true);
              }}>复制 json</button>

              <Dialog.Root open={loadJsonOpen()} onOpenChange={(details) => setLoadJsonOpen(details.open)}>
                <Portal>
                  <Dialog.Backdrop class="fixed inset-0 bg-black/50" />
                  <Dialog.Positioner class="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Content class="bg-white rounded-lg shadow-xl p-4 w-1/2 max-h-[80%] flex flex-col gap-2">
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

              <button class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm" onClick={async () => {
                setLoadJsonOpen(true);
              }}>导入 json</button>
            </div>
            <div class="flex w-full border-t">
              <For each={Object.values(Tab)}>{(item) =>
                <button
                  class="flex-1 py-3 text-sm transition-colors"
                  classList={{
                    "bg-blue-500 text-white": tab() === item,
                    "bg-white text-gray-700 hover:bg-gray-50": tab() !== item
                  }}
                  onClick={() => setTab(item)}
                >
                  {item}
                </button>
              }</For>
            </div>
          </div>
        </div>
      </Match>

      {/* 宽屏界面 */}
      <Match when={!sm()}>
        <div class="flex gap-2 h-full box-border p-2">
          <div class="flex flex-col gap-2 flex-1 h-full overflow-y-scroll pr-2">
            <span>
              单个“常乐”节点最多可获得1次烛火。
              单个“诡异行商”“易与”节点最多刷新4次。
              “昔字如烟”，“往昔难忆”关卡中，不允许在“岁躯”落下前在所在其地块部署任何单位。
            </span>
            <OpeningPart />
            <EmergencyPart />
            {/* <HiddenPart /> */}
            {/* <BossPart /> */}
            {bossUI()}
            <LimitedOperatorsPart />
          </div>
          <div class="flex flex-col min-w-[200px] gap-2">
            <SumPart />
            <div class="flex flex-col gap-2 p-4 bg-white rounded-lg shadow">
              <span class="text-2xl">总计：{calcTotalSum().toFixed(1)}</span>
              <div class="flex gap-2">
                <button class="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => { setStore({ ...defaultStoreValue }) }}>清零</button>
                <button class="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50" onClick={async () => {
                  let content = JSON.stringify(store)
                  await saveJson(content);
                }}>保存</button>
                <button class="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50" onClick={async () => {
                  const content = await readJson();
                  let data = JSON.parse(content);
                  console.log(data)
                  setStore(data as Store)
                }}>加载</button>
              </div>
            </div>
          </div>
        </div>
      </Match>
    </Switch>
  </>;
}