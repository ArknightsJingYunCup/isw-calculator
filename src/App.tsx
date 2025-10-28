import { Component, createSignal, For, Match, Show, Switch } from "solid-js";
import "./App.css";
import { Dialog, TextField as KTextField, Checkbox as KCheckbox, Select } from "@kobalte/core";

import { BannedOperator as BannedOperator, BannedOperatorInfos, BossOperation, BossOperationInfos, Collectible, EmergencyOperation, EmergencyOperationInfos, HiddenOperation, HiddenOperationInfos, KingsCollectible, Squad } from "./data/sarkaz";
import { AddEmergencyRecordModal, EmergencyOperationRecord } from "./components/AddEmergencyRecordModal";
import { createStore } from "solid-js/store";
import { AddBossRecordModal, BossOperationRecord } from "./components/AddBossRecordModal";
import { readJson, saveJson } from "./lib";
import { AddHiddenRecordModal, HiddenOperationRecord } from "./components/AddHiddenRecordModal";

type BannedOperatorRecord = {
  operator: BannedOperator,
  banned: boolean,
}

type KingsCollectibleRecord = {
  collectible: KingsCollectible,
  owned: boolean,
}

type Store = {
  collectible: Collectible | null,
  squad: Squad | null,
  emergencyRecords: EmergencyOperationRecord[],
  hiddenRecords: HiddenOperationRecord[],
  bossRecords: BossOperationRecord[],
  collectionsCnt: number,
  killedHiddenCnt: number,
  refreshCnt: number,
  withdrawCnt: number,
  score: number,
  bannedOperatorRecords: BannedOperatorRecord[],
  kingsCollectibleRecords: KingsCollectibleRecord[],
  kingOfTerra: boolean,
}

const testStoreValue: Store = {
  squad: Squad.BlueprintSurveyingSquad,
  collectible: Collectible.DoodleInTheEraOfHope,
  collectionsCnt: 0,
  killedHiddenCnt: 0,
  refreshCnt: 0,
  withdrawCnt: 0,
  score: 0,
  bannedOperatorRecords: Object.values(BannedOperator).map((operator) => ({
    operator: operator as BannedOperator,
    banned: true
  })),
  kingsCollectibleRecords: Object.values(KingsCollectible).map((collectible) => ({
    collectible: collectible as KingsCollectible,
    owned: false
  })),
  emergencyRecords: [
    {
      operation: EmergencyOperation.AGreatGame,
      refresh: false,
      perfect: false,
    },
    {
      operation: EmergencyOperation.AGreatGame,
      refresh: false,
      perfect: false,
    },
    {
      operation: EmergencyOperation.AGreatGame,
      refresh: false,
      perfect: false,
    },
    {
      operation: EmergencyOperation.AGreatGame,
      refresh: false,
      perfect: false,
    },
    {
      operation: EmergencyOperation.AGreatGame,
      refresh: false,
      perfect: true,
    }
  ],
  hiddenRecords: [
    {
      operation: HiddenOperation.DuckHighway,
      emergency: true,
      perfect: true
    }
  ],
  bossRecords: [
    {
      operation: BossOperation.Audience,
      chaos: false,
    }, {
      operation: BossOperation.CivitasSancta,
      chaos: true,
    }
  ],
  kingOfTerra: false,
};

const defaultStoreValue: Store = {
  squad: null,
  collectible: null,
  collectionsCnt: 0,
  killedHiddenCnt: 0,
  refreshCnt: 0,
  withdrawCnt: 0,
  score: 0,
  bannedOperatorRecords: Object.values(BannedOperator).map((operator) => ({
    operator: operator as BannedOperator,
    banned: true
  })),
  kingsCollectibleRecords: Object.values(KingsCollectible).map((collectible) => ({
    collectible: collectible as KingsCollectible,
    owned: false
  })),
  kingOfTerra: false,
  emergencyRecords: [],
  hiddenRecords: [],
  bossRecords: [],
};

function App() {
  const [isMobile, setIsMobile] = createSignal(window.innerWidth <= 600);

  const [store, setStore] = createStore<Store>({ ...defaultStoreValue });
  // const [store, setStore] = createStore<Store>({ ...testStoreValue });

  const calcEmergencyRecordScore = (idx: number) => {
    const record = store.emergencyRecords[idx];
    const info = EmergencyOperationInfos[record.operation];
    const score = info.score * (record.perfect ? 1.2 : 1) * (
      record.refresh ? (
        store.collectible == Collectible.HatredInTheEraOfDeathFeud ? 0.1 : 0.3
      ) : 1
    );
    return score;
  }


  const calcHiddenRecordScore = (idx: number) => {
    const record = store.hiddenRecords[idx];
    const info = HiddenOperationInfos[record.operation];
    const score = (record.emergency ? info.emergency_score : info.score) * (record.perfect ? 1 : 0.5);
    return score;
  }

  const calcBossRecordScore = (idx: number) => {
    const record = store.bossRecords[idx];
    const info = BossOperationInfos[record.operation];
    const score = record.chaos ? info.chaos_score : info.score;
    return score;
  }

  const calcEmergencySum = () => {
    const emergencySum = store.emergencyRecords.reduce((sum, _, idx) => sum + calcEmergencyRecordScore(idx), 0);
    return emergencySum;
  }

  const calcHiddenSum = () => {
    const hiddenSum = store.hiddenRecords.reduce((sum, _, idx) => sum + calcHiddenRecordScore(idx), 0);
    return hiddenSum;
  }

  const calcBossSum = () => {
    const sum = store.bossRecords.reduce((sum, _, idx) => sum + calcBossRecordScore(idx), 0);
    return sum;
  }

  const toggleBannedOperator = (operator: BannedOperator) => {
    setStore("bannedOperatorRecords", (operators) => operators.map((item) => {
      return item.operator != operator ? item : { ...item, banned: !item.banned }
    }));
  }

  const calcBannedSum = () => {
    return store.bannedOperatorRecords.reduce((sum, record) => sum + (record.banned ? BannedOperatorInfos[record.operator] : 0), 0);
  }

  const toggleKingsCollectible = (collectible: KingsCollectible) => {
    setStore("kingsCollectibleRecords", (collectibles) => collectibles.map((item) => {
      return item.collectible != collectible ? item : { ...item, owned: !item.owned }
    }));
  }

  const calcKingsCollectibleSum = () => {
    const kingsCollectibleCnt = store.kingsCollectibleRecords.reduce((sum, record) => sum + (record.owned ? 1 : 0), 0);
    let score = 0;
    if (kingsCollectibleCnt > 1) {
      score = (kingsCollectibleCnt - 1) * -20;
    }
    if (store.kingOfTerra) {
      score -= 40;
    }
    if (kingsCollectibleCnt == 4) {
      score -= 20;
    }
    return score
  }

  const collectibleScore = () => store.collectible == Collectible.DoodleInTheEraOfHope ? 3 : 0;
  const calcCollectionsScore = () => {
    return store.collectionsCnt * collectibleScore();
  }

  const calcHiddenScore = () => {
    return store.killedHiddenCnt * 10;
  }

  const maxRefreshCnt = () => store.squad == Squad.BlueprintSurveyingSquad ? 15 : 8;
  const calcRefreshScore = () => {
    return store.refreshCnt > maxRefreshCnt() ? (store.refreshCnt - maxRefreshCnt()) * -50 : 0;
  }

  const calcWithdrawScore = () => {
    return store.withdrawCnt > 40 ? (store.withdrawCnt - 40) * -50 : 0;
  }

  const calcScore = () => {
    return store.score * 0.5
  }

  const calcTotalSum = () => {
    return calcScore()
      + calcEmergencySum() + calcHiddenSum() + calcBossSum()
      + calcCollectionsScore() + calcHiddenScore() + calcRefreshScore() + calcWithdrawScore()
      + calcBannedSum() + calcKingsCollectibleSum();
  }

  // 开局设置
  const OpeningPart: Component = () => <>
    <div class="flex flex-col gap-2 p-4 bg-white rounded-lg shadow shrink-0 z-20">
      <h6 class="text-xl font-semibold">开局设置</h6>
      <div class="flex gap-4 flex-wrap justify-stretch">
        <div class="min-w-[150px] flex-grow">
          <Select.Root
            value={store.squad || ''}
            onChange={(value) => setStore("squad", value as Squad)}
            options={Object.values(Squad)}
            placeholder="开局分队"
            itemComponent={(props) => (
              <Select.Item item={props.item} class="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                <Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
              </Select.Item>
            )}
          >
            <Select.Trigger class="w-full border border-gray-300 rounded px-3 py-2 hover:border-gray-400 focus:border-blue-500 focus:outline-none">
              <Select.Value<string>>
                {(state) => state.selectedOption() || "开局分队"}
              </Select.Value>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content class="bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto">
                <Select.Listbox />
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        <div class="min-w-[150px] flex-grow">
          <Select.Root
            value={store.collectible || ''}
            onChange={(value) => setStore("collectible", value as Collectible)}
            options={Object.values(Collectible)}
            placeholder="开局藏品"
            itemComponent={(props) => (
              <Select.Item item={props.item} class="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                <Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
              </Select.Item>
            )}
          >
            <Select.Trigger class="w-full border border-gray-300 rounded px-3 py-2 hover:border-gray-400 focus:border-blue-500 focus:outline-none">
              <Select.Value<string>>
                {(state) => state.selectedOption() || "开局藏品"}
              </Select.Value>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content class="bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto">
                <Select.Listbox />
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
      </div>
    </div>
  </>

  // 紧急作战
  const [emergencyOpen, setEmergencyOpen] = createSignal(false);
  const addEmergencyRecord = (record: EmergencyOperationRecord) => {
    setStore('emergencyRecords', (operations) => [...operations, record])
  }
  const updateEmergencyRecord = (idx: number, record: EmergencyOperationRecord) => {
    setStore('emergencyRecords', (operations) => operations.map((operation, i) =>
      i !== idx ? operation : record
    ))
  }
  const removeEmergencyRecord = (idx: number) => {
    setStore('emergencyRecords', (operations) => operations.filter((_, i) =>
      i !== idx
    ))
  }
  const EmergencyPart = () => <>
    <AddEmergencyRecordModal open={emergencyOpen} onClose={() => {
      setEmergencyOpen(false);
    }} onAddRecord={addEmergencyRecord} />
    <div class="flex flex-col gap-2 p-4 bg-white rounded-lg shadow shrink-0">
      <div class="flex items-center gap-4">
        <h6 class="text-xl font-semibold">紧急作战</h6>
        <button class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm" onClick={() => {
          setEmergencyOpen(true)
        }}>
          添加
        </button>
        <div class="flex-grow" />
        <span>该部分得分: {calcEmergencySum().toFixed(1)}</span>
      </div>
      <div class="flex justify-stretch gap-2">
        <div class="flex-1 overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b">
                <th class="min-w-[60px] text-left p-2">名称</th>
                <th class="text-left p-2">无漏</th>
                <th class="text-left p-2">刷新</th>
                <th class="text-right p-2">分数</th>
                <th class="text-center p-2">操作</th>
              </tr>
            </thead>
            <tbody>
              <For each={store.emergencyRecords}>
                {(item, idx) => (
                  <tr class="border-b last:border-0">
                    <td class="p-2">{item.operation}</td>
                    <td class="p-2">
                      <KCheckbox.Root
                        checked={item.perfect}
                        onChange={(v) => {
                          updateEmergencyRecord(idx(), { ...item, perfect: v });
                        }}
                        class="inline-flex items-center"
                      >
                        <KCheckbox.Input class="sr-only" />
                        <KCheckbox.Control class="w-5 h-5 border-2 border-gray-400 rounded flex items-center justify-center ui-checked:bg-blue-500 ui-checked:border-blue-500">
                          <KCheckbox.Indicator>
                            <svg class="w-3 h-3 text-white" viewBox="0 0 12 10" fill="none">
                              <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                          </KCheckbox.Indicator>
                        </KCheckbox.Control>
                      </KCheckbox.Root>
                    </td>
                    <td class="p-2">
                      <KCheckbox.Root
                        checked={item.refresh}
                        onChange={(v) => {
                          updateEmergencyRecord(idx(), { ...item, refresh: v });
                        }}
                        class="inline-flex items-center"
                      >
                        <KCheckbox.Input class="sr-only" />
                        <KCheckbox.Control class="w-5 h-5 border-2 border-gray-400 rounded flex items-center justify-center ui-checked:bg-blue-500 ui-checked:border-blue-500">
                          <KCheckbox.Indicator>
                            <svg class="w-3 h-3 text-white" viewBox="0 0 12 10" fill="none">
                              <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                          </KCheckbox.Indicator>
                        </KCheckbox.Control>
                      </KCheckbox.Root>
                    </td>
                    <td class="text-right p-2">{calcEmergencyRecordScore(idx()).toFixed(1)}</td>
                    <td class="text-center p-2">
                      <button class="text-red-500 hover:text-red-700 p-1" onClick={() => { removeEmergencyRecord(idx()) }}>
                        <span class="i-mdi-delete text-xl"></span>
                      </button>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </>

  // 隐藏作战
  const [hiddenOpen, setHiddenOpen] = createSignal(false);
  const addHiddenRecord = (record: HiddenOperationRecord) => {
    setStore('hiddenRecords', (operations) => [...operations, record])
  }
  const updateHiddenRecord = (idx: number, record: HiddenOperationRecord) => {
    setStore('hiddenRecords', (operations) => operations.map((operation, i) =>
      i !== idx ? operation : record
    ))
  }
  const removeHiddenRecord = (idx: number) => {
    setStore('hiddenRecords', (operations) => operations.filter((_, i) =>
      i !== idx
    ))
  }
  const HiddenPart = () => <>
    <AddHiddenRecordModal open={hiddenOpen} onClose={() => {
      setHiddenOpen(false);
    }} onAddRecord={addHiddenRecord} />
    <div class="flex flex-col gap-2 p-4 bg-white rounded-lg shadow shrink-0">
      <div class="flex items-center gap-4">
        <h6 class="text-xl font-semibold">隐藏作战</h6>
        <button class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm" onClick={() => {
          setHiddenOpen(true)
        }}>
          添加
        </button>
        <div class="flex-grow" />
        <span>该部分得分: {calcHiddenSum().toFixed(1)}</span>
      </div>
      <div class="flex justify-stretch gap-2">
        <div class="flex-1 overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b">
                <th class="text-left p-2">名称</th>
                <th class="text-left p-2">无漏</th>
                <th class="text-right p-2">分数</th>
                <th class="text-center p-2">操作</th>
              </tr>
            </thead>
            <tbody>
              <For each={store.hiddenRecords}>
                {(item, idx) => (
                  <tr class="border-b last:border-0">
                    <td class="p-2" classList={{ "text-red-500": item.emergency }}>
                      {item.operation}
                      <Show when={item.emergency}>
                        （紧急）
                      </Show>
                    </td>
                    <td class="p-2">
                      <KCheckbox.Root
                        checked={item.perfect}
                        onChange={(v) => {
                          updateHiddenRecord(idx(), { ...item, perfect: v });
                        }}
                        class="inline-flex items-center"
                      >
                        <KCheckbox.Input class="sr-only" />
                        <KCheckbox.Control class="w-5 h-5 border-2 border-gray-400 rounded flex items-center justify-center ui-checked:bg-blue-500 ui-checked:border-blue-500">
                          <KCheckbox.Indicator>
                            <svg class="w-3 h-3 text-white" viewBox="0 0 12 10" fill="none">
                              <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                          </KCheckbox.Indicator>
                        </KCheckbox.Control>
                      </KCheckbox.Root>
                    </td>
                    <td class="text-right p-2">{calcHiddenRecordScore(idx()).toFixed(1)}</td>
                    <td class="text-center p-2">
                      <button class="text-red-500 hover:text-red-700 p-1" onClick={() => removeHiddenRecord(idx())}>
                        <span class="i-mdi-delete text-xl"></span>
                      </button>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </>

  // 领袖作战
  const [bossOpen, setBossOpen] = createSignal(false);
  const addBossRecord = (record: BossOperationRecord) => {
    setStore('bossRecords', (operations) => [...operations, record])
  }
  const removeBossRecord = (idx: number) => {
    setStore('bossRecords', (operations) => operations.filter((_, i) =>
      i !== idx
    ))
  }
  const BossPart = () => <>
    <AddBossRecordModal open={bossOpen} onClose={() => { setBossOpen(false); }} onAddRecord={addBossRecord} />
    <div class="flex flex-col gap-2 p-4 bg-white rounded-lg shadow shrink-0">
      <div class="flex items-center gap-4">
        <h6 class="text-xl font-semibold">领袖作战</h6>
        <button class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm" onClick={() => { setBossOpen(true) }}>
          添加
        </button>
        <div class="flex-grow" />
        <span>该部分得分: {calcBossSum().toFixed(1)}</span>
      </div>

      <div class="flex-1 overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b">
              <th class="text-left p-2">名称</th>
              <th class="p-2">&nbsp;&nbsp;&nbsp;&nbsp;</th>
              <th class="p-2">&nbsp;&nbsp;&nbsp;&nbsp;</th>
              <th class="text-right p-2">分数</th>
              <th class="text-center p-2">操作</th>
            </tr>
          </thead>
          <tbody>
            <For each={store.bossRecords}>
              {(item, idx) => (
                <tr class="border-b last:border-0">
                  <td class="p-2" classList={{ "text-red-500": item.chaos }}>
                    {item.operation}
                    <Show when={item.chaos}>
                      （混乱）
                    </Show>
                  </td>
                  <td class="p-2"></td>
                  <td class="p-2"></td>
                  <td class="text-right p-2">{calcBossRecordScore(idx()).toFixed(1)}</td>
                  <td class="text-center p-2">
                    <button class="text-red-500 hover:text-red-700 p-1" onClick={() => removeBossRecord(idx())}>
                      <span class="i-mdi-delete text-xl"></span>
                    </button>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  </>

  // 阵容补偿
  const OperatorPart = () => <>
    <div class="flex flex-col gap-2 p-4 bg-white rounded-lg shadow shrink-0">
      <div class="flex items-center gap-4">
        <h6 class="text-xl font-semibold">阵容补偿</h6>
        <div class="flex-grow" />
        <span>该部分得分: {calcBannedSum()}</span>
      </div>
      <div class="flex flex-wrap gap-2">
        <For each={store.bannedOperatorRecords}>{(item) => <>
          <button
            class="px-3 py-1 rounded border transition-colors"
            classList={{
              "border-green-500 text-green-600 hover:bg-green-50": item.banned,
              "border-gray-400 text-gray-600 hover:bg-gray-50": !item.banned
            }}
            onClick={() => {
              toggleBannedOperator(item.operator)
            }}
          >
            {item.operator}
            <Show when={item.banned}>
              <span class="text-green-600">（+{BannedOperatorInfos[item.operator]}）</span>
            </Show>
          </button>
        </>}</For>
      </div>
    </div>
  </>

  // 国王收藏品
  const KingsCollectivesPart = () => <>
    <div class="flex flex-col gap-2 p-4 bg-white rounded-lg shadow shrink-0">
      <div class="flex items-center gap-4">
        <h6 class="text-xl font-semibold">国王套</h6>
        <div class="flex-grow" />
        <span>该部分得分: {calcKingsCollectibleSum()}</span>
      </div>
      <button
        class="px-3 py-2 rounded border transition-colors"
        classList={{
          "bg-red-500 text-white hover:bg-red-600": store.kingOfTerra,
          "border-gray-400 text-gray-600 hover:bg-gray-50": !store.kingOfTerra
        }}
        onClick={() => {
          setStore("kingOfTerra", v => !v)
          setStore("kingsCollectibleRecords", (collectibles) => collectibles.map((item) => {
            return { ...item, owned: store.kingOfTerra }
          }));
        }}
      >
        泰拉之王
      </button>
      <div class="flex flex-wrap gap-2">
        <For each={store.kingsCollectibleRecords}>{(item) => <>
          <button
            class="px-3 py-1 rounded border transition-colors"
            classList={{
              "border-red-500 text-red-600 hover:bg-red-50": item.owned,
              "border-gray-400 text-gray-600 hover:bg-gray-50": !item.owned
            }}
            onClick={() => {
              if (item.owned) {
                setStore("kingOfTerra", false)
              }
              toggleKingsCollectible(item.collectible)
            }}
          >
            {item.collectible}
          </button>
        </>}</For>
      </div>
    </div>
  </>

  // 结算 & 其他
  const SumPart: Component = () => <>
    <div class="flex flex-col gap-2 flex-grow p-4 bg-white rounded-lg shadow shrink-0">
      <h6 class="text-xl font-semibold pb-2">结算</h6>
      <div class="flex flex-col gap-2 flex-1">
        <div class="flex flex-col gap-1">
          <label class="text-sm text-gray-600">藏品数量</label>
          <input
            type="number"
            class="border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:outline-none"
            value={store.collectionsCnt}
            onInput={(e) => setStore("collectionsCnt", parseInt(e.currentTarget.value) || 0)}
          />
          <span class="text-xs" classList={{
            "text-green-600": store.collectible == Collectible.DoodleInTheEraOfHope,
            "text-red-600": store.collectible != Collectible.DoodleInTheEraOfHope
          }}>
            {store.collectible == Collectible.DoodleInTheEraOfHope
              ? `${store.collectionsCnt} * ${collectibleScore()} = ${calcCollectionsScore()}`
              : "无希望时代的涂鸦"
            }
          </span>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm text-gray-600">击杀隐藏数量</label>
          <input
            type="number"
            class="border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:outline-none"
            value={store.killedHiddenCnt}
            onInput={(e) => setStore("killedHiddenCnt", parseInt(e.currentTarget.value) || 0)}
          />
          <span class="text-xs text-gray-600">{store.killedHiddenCnt} * 10 = {calcHiddenScore()}</span>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm text-gray-600">刷新次数</label>
          <input
            type="number"
            class="border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:outline-none"
            value={store.refreshCnt}
            onInput={(e) => setStore("refreshCnt", parseInt(e.currentTarget.value) || 0)}
          />
          <span class="text-xs" classList={{
            "text-green-600": store.refreshCnt <= maxRefreshCnt(),
            "text-red-600": store.refreshCnt > maxRefreshCnt()
          }}>
            {store.refreshCnt <= maxRefreshCnt()
              ? `<= ${maxRefreshCnt()}`
              : `${store.refreshCnt - maxRefreshCnt()} x -50 = ${calcRefreshScore()}`
            }
          </span>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm text-gray-600">取钱数量</label>
          <input
            type="number"
            class="border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:outline-none"
            value={store.withdrawCnt}
            onInput={(e) => setStore("withdrawCnt", parseInt(e.currentTarget.value) || 0)}
          />
          <span class="text-xs" classList={{
            "text-green-600": store.withdrawCnt <= 40,
            "text-red-600": store.withdrawCnt > 40
          }}>
            {store.withdrawCnt <= 40
              ? "<= 40"
              : `${store.withdrawCnt - 40} x -50 = ${calcWithdrawScore()}`
            }
          </span>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm text-gray-600">结算分</label>
          <input
            type="number"
            class="border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:outline-none"
            value={store.score}
            onInput={(e) => setStore("score", parseInt(e.currentTarget.value) || 0)}
          />
          <span class="text-xs text-gray-600">{store.score} x 0.5 = {calcScore()}</span>
        </div>
      </div>
    </div>
  </>


  const [copyJsonOpen, setCopyJsonOpen] = createSignal(false);
  const [loadJsonOpen, setLoadJsonOpen] = createSignal(false);
  const [json, setJson] = createSignal("");

  enum Tab {
    Operation = "作战",
    OperatorsAndKingsCollectible = "阵容和国王套",
    Others = "其他",
  }
  const [tab, setTab] = createSignal(Tab.Operation);

  return <>
    <Switch>
      {/* 窄屏界面 */}
      <Match when={isMobile()}>
        <div class="flex h-full box-border flex-col">
          <OpeningPart />
          <div class="flex flex-col flex-grow gap-2 overflow-y-auto p-2">
            <Switch>
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
            </Switch>
          </div>
          <div class="flex flex-col gap-2 shrink-0 bg-white border-t shadow-lg">
            <div class="flex gap-2 p-2">
              <span>总分：
                <span class="text-2xl">{calcTotalSum()}</span>
              </span>
              <div class="flex-grow" />
              <button class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm" onClick={() => { setStore({ ...defaultStoreValue }) }}>清零</button>

              <Dialog.Root open={copyJsonOpen()} onOpenChange={setCopyJsonOpen}>
                <Dialog.Portal>
                  <Dialog.Overlay class="fixed inset-0 bg-black/50" />
                  <div class="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Content class="bg-white rounded-lg shadow-xl p-4 w-1/2 max-h-[80%] flex flex-col gap-2">
                      <Dialog.Title class="text-lg font-semibold">数据 JSON</Dialog.Title>
                      <textarea class="border border-gray-300 rounded px-3 py-2 min-h-24 max-h-24 resize-none" value={json()} readonly />
                      <div class="flex gap-4 justify-end">
                        <Dialog.CloseButton class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">关闭</Dialog.CloseButton>
                      </div>
                    </Dialog.Content>
                  </div>
                </Dialog.Portal>
              </Dialog.Root>

              <button class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm" onClick={async () => {
                setJson(JSON.stringify(store));
                setCopyJsonOpen(true);
              }}>复制 json</button>

              <Dialog.Root open={loadJsonOpen()} onOpenChange={setLoadJsonOpen}>
                <Dialog.Portal>
                  <Dialog.Overlay class="fixed inset-0 bg-black/50" />
                  <div class="fixed inset-0 flex items-center justify-center p-4">
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
                        <Dialog.CloseButton class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">取消</Dialog.CloseButton>
                      </div>
                    </Dialog.Content>
                  </div>
                </Dialog.Portal>
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
      <Match when={!isMobile()}>
        <div class="flex gap-2 h-full box-border p-2">
          <div class="flex flex-col gap-2 flex-1 h-full overflow-y-scroll pr-2">
            <OpeningPart />

            <EmergencyPart />
            <HiddenPart />
            <BossPart />

            <OperatorPart />

            <KingsCollectivesPart />

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

export default App;
