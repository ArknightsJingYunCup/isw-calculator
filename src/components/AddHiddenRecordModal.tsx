import { Accessor, Component, For, Show } from "solid-js";
import { HiddenOperation, HiddenOperationInfos } from "../data/sarkaz";
import { Dialog } from "@kobalte/core";

// 非无漏 *50%
export type HiddenOperationRecord = {
  operation: HiddenOperation,
  emergency: boolean,
  perfect: boolean,
}

export const AddHiddenRecordModal: Component<{
  open: Accessor<boolean>,
  onClose: () => void,
  onAddRecord: (operation: HiddenOperationRecord) => void
}> = ({ open, onClose, onAddRecord }) => {

  return <>
    <Dialog.Root open={open()} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 bg-black/50 z-50" />
        <div class="fixed inset-0 flex items-center justify-center p-4 z-50">
          <Dialog.Content class="bg-white rounded-lg shadow-xl p-4 w-1/2 max-h-[80%] flex flex-col">
            <Dialog.Title class="text-xl font-semibold mb-2">添加隐藏作战</Dialog.Title>
            <div class="flex flex-col gap-4 overflow-y-auto">
              <For each={Object.values(HiddenOperation)}>{(operation) => <>
                <div class="flex flex-wrap gap-2">
                  <Show when={HiddenOperationInfos[operation].score !== 0}>
                    <button class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50" onClick={() => {
                      onAddRecord({
                        operation,
                        emergency: false,
                        perfect: false,
                      } as HiddenOperationRecord);
                      onClose();
                    }}>{operation}</button>
                  </Show>
                  <Show when={HiddenOperationInfos[operation].emergency_score !== 0}>
                    <button class="px-3 py-1 border border-red-500 text-red-600 rounded hover:bg-red-50" onClick={() => {
                      onAddRecord({
                        operation,
                        emergency: true,
                        perfect: false,
                      } as HiddenOperationRecord);
                      onClose();
                    }}>{operation}（紧急）</button>
                  </Show>
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
