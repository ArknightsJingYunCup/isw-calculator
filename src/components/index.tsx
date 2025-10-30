import { Accessor, Component, createSignal, For, Index, JSX, Setter } from "solid-js";
import { enumKeys, EnumLike, enumValues, StringEnum } from "../lib/utils";
import { createListCollection, Select } from "@ark-ui/solid";
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
          <Select.Trigger class="w-full border border-gray-300 rounded px-3 py-2 hover:border-gray-400 focus:border-blue-500 focus:outline-none">
            <Select.ValueText placeholder="开局分队" />
          </Select.Trigger>
        </Select.Control>
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

export function EnumMultiSelectInput<E extends EnumLike>(
  e: E,
  selected: Accessor<E[keyof E][]>, setSelected: Setter<E[keyof E][]>,
  entryElem: (value: E[keyof E]) => JSX.Element
) {
  return <>
    <div class="flex flex-wrap gap-2">
      <For each={enumKeys(e)}>{(key) => {
        const value = e[key];

        return <>
          <button
            class="px-3 py-1 rounded border transition-colors"
            classList={{
              "border-green-500 text-green-600 hover:bg-green-50": selected().includes(value),
              "border-gray-400 text-gray-600 hover:bg-gray-50": !selected().includes(value)
            }}
            onClick={() => {
              if (selected().includes(value)) {
                setSelected((selected) => selected.filter((_value) => _value !== value));
              } else {
                setSelected((selected) => [...selected, value]);
              }
            }}
          >
            {entryElem(value)}
          </button>
        </>
      }}</For>
    </div>
  </>
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