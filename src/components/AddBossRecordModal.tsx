import { Accessor, Component, For, Show } from "solid-js";
import { BossOperation, BossOperationInfos, Level } from "../data/sarkaz";
import { Dialog } from "@kobalte/core";

export type BossOperationRecord = {
  operation: BossOperation,
  chaos: boolean,
}

export const AddBossRecordModal: Component<{
  open: Accessor<boolean>,
  onClose: () => void,
  onAddRecord: (record: BossOperationRecord) => void
}> = ({ open, onClose, onAddRecord }) => {

  return <>
    <Dialog.Root open={open()} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 bg-black/50 z-50" />
        <div class="fixed inset-0 flex items-center justify-center p-4 z-50">
          <Dialog.Content class="bg-white rounded-lg shadow-xl p-4 w-1/2 max-h-[80%] flex flex-col">
            <Dialog.Title class="text-xl font-semibold mb-2">添加领袖作战</Dialog.Title>
            <div class="flex flex-col gap-4 overflow-y-auto">
              <For each={[Level.Third, Level.Fifth, Level.Sixth]}>{(level) => <>
                <div class="flex flex-col gap-2">
                  <span class="font-medium">{level}</span>
                  <div class="flex flex-wrap gap-2">
                    <For each={Object.values(BossOperation).filter((operation) => BossOperationInfos[operation].level == level)}>{(operation) => <>
                      <Show when={BossOperationInfos[operation].score !== 0}>
                        <button class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50" onClick={() => {
                          onAddRecord({
                            operation,
                            chaos: false
                          } as BossOperationRecord);
                          onClose();
                        }}>{operation}</button>
                      </Show>
                      <Show when={BossOperationInfos[operation].chaos_score !== 0}>
                        <button class="px-3 py-1 border border-red-500 text-red-600 rounded hover:bg-red-50" onClick={() => {
                          onAddRecord({
                            operation,
                            chaos: true
                          } as BossOperationRecord);
                          onClose();
                        }}>{operation}（混乱）</button>
                      </Show>
                    </>}</For>
                  </div>
                </div>
              </>}</For>
            </div>

            <div class="flex gap-4 justify-end mt-4">
              <Dialog.CloseButton class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">取消</Dialog.CloseButton>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  </>
}
