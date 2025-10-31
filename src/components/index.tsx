import { Accessor, Component, For, Index, JSX, Setter } from "solid-js";
import { EnumLike, enumValues, StringEnum } from "../lib/utils";
import { createListCollection, Select, ToggleGroup } from "@ark-ui/solid";
import { Dialog } from "@ark-ui/solid/dialog";
import { Portal } from "solid-js/web";

export function EnumSelectInput<E extends StringEnum>(
  e: E,
  selected: Accessor<E[keyof E] | null>, setSelected: (v: E[keyof E]) => void,
  // entryElem: (value: E[keyof E]) => JSX.Element
) {
  const collection = createListCollection({ items: enumValues(e) });
  return <>
    <div class="min-w-[150px] flex-grow">
      <Select.Root
        collection={collection}
        value={selected() ? [selected()!] : []}
        onValueChange={(e) => setSelected(e.items[0])}
      >
        <Select.Control>
          <Select.Trigger class="w-full border rounded px-3 py-2"
            classList={{
              "border-gray-300 hover:border-gray-400": selected() !== null,
              "border-red-400 text-red-400 hover:border-red-500 hover:text-red-500": selected() === null,
            }}>
            <Select.ValueText placeholder="开局分队" />
          </Select.Trigger>
        </Select.Control>
        {selected() === null && <span class="text-red-500 text-sm">*未选择开局分队</span>}
        <Portal>
          <Select.Positioner>
            <Select.Content class="bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto z-20">
              <Index each={collection.items}>
                {(item) => (
                  <Select.Item item={item()} class="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                    <Select.ItemText>{item()}</Select.ItemText>
                  </Select.Item>
                )}
              </Index>
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    </div>
  </>
}

export function MultiSelectInput<T>(
  items: T[],
  selected: Accessor<T[]>, setSelected: Setter<T[]>,
  entryElem: (item: T) => JSX.Element
) {
  return <>
    <div class="flex flex-wrap gap-2">
      <For each={items}>{(item) => {
        return <>
          <button
            class="px-3 py-1 rounded border transition-colors"
            classList={{
              "border-green-500 text-green-600 hover:bg-green-50": selected().includes(item),
              "border-gray-400 text-gray-600 hover:bg-gray-50": !selected().includes(item)
            }}
            onClick={() => {
              if (selected().includes(item)) {
                setSelected((selected) => selected.filter((_value) => _value !== item));
              } else {
                setSelected((selected) => [...selected, item]);
              }
            }}
          >
            {entryElem(item)}
          </button>
        </>
      }}</For>
    </div>
  </>
}

export function EnumMultiSelectInput<E extends EnumLike>(
  e: E,
  selected: Accessor<E[keyof E][]>, setSelected: Setter<E[keyof E][]>,
  entryElem: (value: E[keyof E]) => JSX.Element
) {
  return MultiSelectInput(enumValues(e), selected, setSelected, entryElem);
}

export const NumberInput: Component<{ value: Accessor<number>, setValue: (v: number) => void, upperLimit?: number }> = (props) => {
  return <input
    type="number"
    class="w-full border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:outline-none"
    value={props.value()}
    onInput={(e) => {
      const value = parseInt(e.currentTarget.value) || 0;
      if (!props.upperLimit || value <= props.upperLimit) {
        props.setValue(value);
      };
    }}
  />
}

export function createCollectibleInput(collectibleCnt: Accessor<number>, setCollectibleCnt: Setter<number>, unitScore: number, maxScore: number): {
  score: Accessor<number>,
  ui: () => JSX.Element,
} {
  const score = () => Math.min(collectibleCnt() * unitScore, maxScore);
  return {
    score,
    ui: () => <>
      <div class="flex flex-col gap-1">
        <label class="text-sm text-gray-600">藏品数量</label>
        <NumberInput value={collectibleCnt} setValue={setCollectibleCnt} />
        <span class="text-xs" classList={{
          "text-green-600": score() == maxScore,
        }}>
          {`min(${collectibleCnt()} * ${unitScore}, ${maxScore}) = ${score()}`}
        </span>
      </div>
    </>,
  }
}

export function createWithdrawInput(withdraw: Accessor<number>, setWithdraw: Setter<number>, maxWithdraw: number, unitExceedScore: number): {
  score: Accessor<number>,
  ui: () => JSX.Element,
} {
  let score = () => withdraw() > maxWithdraw ? (withdraw() - maxWithdraw) * unitExceedScore : 0;
  return {
    score,
    ui: () => <>
      <div class="flex flex-col gap-1">
        <label class="text-sm text-gray-600">取钱数量</label>
        <NumberInput value={withdraw} setValue={setWithdraw} />
        <span class="text-xs" classList={{
          "text-green-600": withdraw() <= maxWithdraw,
          "text-red-600": withdraw() > maxWithdraw
        }}>
          {withdraw() <= maxWithdraw
            ? `<= ${maxWithdraw}`
            : `${withdraw() - maxWithdraw} x ${unitExceedScore} = ${score()}`
          }
        </span>
      </div>
    </>,
  }
}


export type ModifierRecord<O extends StringEnum, M extends StringEnum> = {
  operation: O[keyof O],
  modifiers: M[keyof M][],
  extraData?: Record<string, any>, // 支持额外数据，如数量等
}
export type LevelModifierRecord<L extends StringEnum, O extends StringEnum, M extends StringEnum> = {
  [level in L[keyof L]]: ModifierRecord<O, M> | null
}
export type LevelOperationListMap<L extends StringEnum, O extends StringEnum> = {
  [level in L[keyof L]]: O[keyof O][]
}

// O: Operation, M: Modifier
export type OperationModifierMap<O extends StringEnum, M extends StringEnum> = {
  [operation in O[keyof O]]?: ModifierMap<M>
}
export type FullOperationModifierMap<O extends StringEnum, M extends StringEnum> = {
  [operation in O[keyof O]]: ModifierMap<M>
}
export type ModifierMap<M extends StringEnum> = {
  [key in M[keyof M]]?: (v: number) => number
}

export function ModifierSelector<O extends StringEnum, M extends StringEnum>(
  entry: O[keyof O],
  operationModifierMap: FullOperationModifierMap<O, M>,
  modifiers: Accessor<M[keyof M][]>,
  onUpdateModifiers: (modifiers: M[keyof M][]) => void,
) {
  const modifierMap: ModifierMap<M> = operationModifierMap[entry];
  const allModifiers = Object.keys(modifierMap).map((key) => key as M[keyof M]);

  const mainLabel =
    `${entry}${allModifiers[0].length > 0 ? `（${allModifiers[0]}）` : ""}`;

  return <>
    <div class="flex border border-gray-300 rounded overflow-hidden">
      <ToggleGroup.Root
        multiple
        value={modifiers()}
        onValueChange={(e) => {
          if (!e.value.includes(allModifiers[0])) {
            onUpdateModifiers([]);
          } else {
            // 按照定义顺序排列选中的 modifiers
            const selectedSet = new Set(e.value as M[keyof M][]);
            const orderedModifiers = allModifiers.filter(m => selectedSet.has(m));
            onUpdateModifiers(orderedModifiers);
          }
        }}
        class="flex"
      >
        <For each={allModifiers}>{(modifier, idx) => {
          const isSelected = () => modifiers().includes(modifier);
          const isLast = () => idx() === allModifiers.length - 1;
          const disabled = () => modifiers().length === 0 && idx() !== 0;
          return <ToggleGroup.Item
            value={modifier}
            class="px-3 py-1 transition-colors cursor-pointer"
            classList={{
              "text-white": isSelected(),
              "text-sm": idx() !== 0,
              "bg-blue-500 ": isSelected() && idx() === 0,
              "bg-green-500": isSelected() && idx() !== 0,
              "text-gray-700 hover:bg-gray-50": !isSelected(),
              "opacity-50 cursor-not-allowed": disabled(),
              "border-r border-gray-300": !isLast(),
            }}
            disabled={disabled()}
          >
            {idx() === 0 ? mainLabel : modifier}
          </ToggleGroup.Item>
        }}</For>
      </ToggleGroup.Root>
    </div>
  </>;
}



export function AddDefaultModifierRecordModal<L extends StringEnum, O extends StringEnum, M extends StringEnum>(props: {
  open: Accessor<boolean>,
  onClose: () => void,
  onAddRecord: (record: ModifierRecord<O, M>) => void,
  title: string,
  operationEnum: O,
  operationModifierMap: FullOperationModifierMap<O, M>,
  levelOperationMap?: {
    levels: L,
    levelKeys: (keyof L)[],
    map: { [level in L[keyof L]]: O[keyof O][] }
  },
  extraOperations?: {
    label: string,
    operations: O[keyof O][]
  }
}) {
  const { open, onClose, onAddRecord, title, operationEnum, operationModifierMap, levelOperationMap, extraOperations } = props;

  // 获取 default modifier key（第一个 modifier 键）
  const getDefaultModifier = (operation: O[keyof O]): M[keyof M] => {
    const modifiers = Object.keys(operationModifierMap[operation]) as M[keyof M][];
    return modifiers[0];
  };

  const createRecord = (operation: O[keyof O]): ModifierRecord<O, M> => {
    return {
      operation,
      modifiers: [getDefaultModifier(operation)]
    };
  };

  return <>
    <Dialog.Root open={open()} onOpenChange={(details) => !details.open && onClose()}>
      <Portal>
        <Dialog.Backdrop class="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Positioner class="fixed inset-0 flex items-center justify-center p-4 z-40">
          <Dialog.Content class="bg-white rounded-lg shadow-xl p-4 w-1/2 max-h-[80%] flex flex-col">
            <Dialog.Title class="text-xl font-semibold mb-2">{title}</Dialog.Title>
            <div class="flex flex-col gap-4 overflow-y-auto">
              {/* 如果提供了 levelOperationMap，按照 level 分组显示 */}
              {levelOperationMap ? (
                <>
                  <For each={levelOperationMap.levelKeys}>{(levelKey, idx) => {
                    const level = levelOperationMap.levels[levelKey];
                    const operations = levelOperationMap.map[level];
                    return <>
                      <div class="flex flex-col gap-2">
                        <span class="font-medium">第 {idx() + 1} 层：{level}</span>
                        <div class="flex flex-wrap gap-2">
                          <For each={operations}>{(operation) => <>
                            <button
                              class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                              onClick={() => {
                                onAddRecord(createRecord(operation as O[keyof O]));
                                onClose();
                              }}
                            >
                              {operation}
                            </button>
                          </>}</For>
                        </div>
                      </div>
                    </>
                  }}</For>
                  {/* 如果提供了 extraOperations，显示额外操作 */}
                  {extraOperations && (
                    <div class="flex flex-col gap-2">
                      <span class="font-medium">{extraOperations.label}</span>
                      <div class="flex flex-wrap gap-2">
                        <For each={extraOperations.operations}>{(operation) => <>
                          <button
                            class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                            onClick={() => {
                              onAddRecord(createRecord(operation as O[keyof O]));
                              onClose();
                            }}
                          >
                            {operation}
                          </button>
                        </>}</For>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* 如果没有提供 levelOperationMap，直接显示所有 operations */
                <div class="flex flex-wrap gap-2">
                  <For each={enumValues(operationEnum)}>{(operation) => <>
                    <button
                      class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                      onClick={() => {
                        onAddRecord(createRecord(operation as O[keyof O]));
                        onClose();
                      }}
                    >
                      {operation}
                    </button>
                  </>}</For>
                </div>
              )}
            </div>
            <div class="flex gap-4 justify-end mt-4">
              <Dialog.CloseTrigger class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">取消</Dialog.CloseTrigger>
            </div>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  </>
}

export function createModifierRecordTable<O extends StringEnum, M extends StringEnum>(props: {
  records: Accessor<ModifierRecord<O, M>[]>,
  operationModifierMap: FullOperationModifierMap<O, M>,
  onUpdateRecord: (index: number, record: ModifierRecord<O, M>) => void,
  onRemoveRecord: (index: number) => void,
  extraUI?: (record: ModifierRecord<O, M>, index: number, onUpdate: (record: ModifierRecord<O, M>) => void) => JSX.Element,
  calculateScore?: (record: ModifierRecord<O, M>) => number, // 自定义分数计算
}): {
  score: Accessor<number>,
  ui: () => JSX.Element,
} {
  const { records, operationModifierMap, onUpdateRecord, onRemoveRecord, extraUI, calculateScore } = props;

  const recordsScore = () => records().map((record) => {
    if (calculateScore) {
      return calculateScore(record);
    }
    return record.modifiers.reduce((sum, modifier) => {
      const modifierMap = operationModifierMap[record.operation];
      return modifierMap[modifier]!(sum);
    }, 0);
  });
  const score = () => recordsScore().reduce((sum, x) => sum + x, 0);

  return {
    score,
    ui: () => <>
      <div class="flex flex-col gap-2">
        <For each={records()}>
          {(record, idx) => {
            const modifierMap = operationModifierMap[record.operation];
            const allModifiers = Object.keys(modifierMap) as M[keyof M][];
            const defaultModifier = allModifiers[0];
            const nonDefaultModifiers = allModifiers.slice(1);

            return (
              <div class="flex gap-2 items-center">
                <div class="flex gap-2 items-center">
                  {/* <span class="text-gray-500 text-medium">[{idx()}]</span> */}
                  <span>+{recordsScore()[idx()].toFixed(1)}</span>
                  {/* Label for operation */}
                  <span class="font-medium whitespace-nowrap">{record.operation}</span>
                </div>

                {/* ToggleGroup for non-default modifiers */}
                {nonDefaultModifiers.length > 0 && (
                  <div class="flex border border-gray-300 rounded overflow-hidden">
                    <ToggleGroup.Root
                      multiple
                      value={record.modifiers.filter(m => m !== defaultModifier)}
                      onValueChange={(e) => {
                        // 始终保留默认 modifier，并按照定义顺序排列其他选中的 modifiers
                        const selectedSet = new Set(e.value as M[keyof M][]);
                        const orderedModifiers = allModifiers.filter(m =>
                          m === defaultModifier || selectedSet.has(m)
                        );
                        onUpdateRecord(idx(), {
                          ...record,
                          modifiers: orderedModifiers
                        });
                      }}
                      class="flex flex-grow"
                    >
                      <For each={nonDefaultModifiers}>{(modifier, modifierIdx) => {
                        const isSelected = () => record.modifiers.includes(modifier);
                        const isLast = () => modifierIdx() === nonDefaultModifiers.length - 1;

                        return (
                          <ToggleGroup.Item
                            value={modifier}
                            class="px-3 py-1 transition-colors cursor-pointer flex-grow text-sm"
                            classList={{
                              "text-white bg-green-500": isSelected(),
                              "text-gray-700 hover:bg-gray-50": !isSelected(),
                              "border-r border-gray-300": !isLast(),
                            }}
                          >
                            {modifier}
                          </ToggleGroup.Item>
                        );
                      }}</For>
                    </ToggleGroup.Root>
                  </div>
                )}

                {/* Extra UI (e.g., for quantity input) */}
                {extraUI && extraUI(record, idx(), (updatedRecord) => onUpdateRecord(idx(), updatedRecord))}

                <div class="flex-grow" />

                {/* Delete button */}
                <button
                  class="text-red-500 hover:text-red-700 p-2 border border-gray-300 rounded hover:bg-red-50 shrink-0"
                  onClick={() => onRemoveRecord(idx())}
                  aria-label="删除"
                >
                  <div class="i-mdi-delete text-xl" />
                </button>
              </div>
            );
          }}
        </For>
      </div>
    </>
  }
}