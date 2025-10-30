import { Accessor, Component, createSignal, JSX, Setter } from "solid-js";

export const NumberInput: Component<{ value: Accessor<number>, setValue: Setter<number> }> = (props) => {
  return <input
    type="number"
    class="border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:outline-none"
    value={props.value()}
    onInput={(e) => props.setValue(parseInt(e.currentTarget.value) || 0)}
  />
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