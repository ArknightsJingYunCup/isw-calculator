import { Accessor, Component, For } from "solid-js";
import { EmergencyOperation, EmergencyOperationInfos, Level } from "../data/sarkaz";
import { Dialog } from "@ark-ui/solid/dialog";
import { Portal } from "solid-js/web";

// 刷新 *30% / 死仇刷新 *10%
// 无漏 *120%
export type EmergencyOperationRecord = {
  operation: EmergencyOperation,
  refresh: boolean,
  perfect: boolean,
}

export const AddEmergencyRecordModal: Component<{
  open: Accessor<boolean>,
  onClose: () => void,
  onAddRecord: (operation: EmergencyOperationRecord) => void
}> = ({ open, onClose, onAddRecord }) => {
  return <>
    <Dialog.Root open={open()} onOpenChange={(details) => !details.open && onClose()}>
      <Portal>
        <Dialog.Backdrop class="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Positioner class="fixed inset-0 flex items-center justify-center p-4 z-40">
          <Dialog.Content class="bg-white rounded-lg shadow-xl p-4 w-1/2 max-h-[80%] flex flex-col">
            <Dialog.Title class="text-xl font-semibold mb-2">添加紧急作战</Dialog.Title>
            <div class="flex flex-col gap-4 overflow-y-auto">
              <For each={[Level.Third, Level.Fourth, Level.Fifth, Level.Sixth]}>{(level) => <>
                <div class="flex flex-col gap-2">
                  <span class="font-medium">{level}</span>
                  <div class="flex flex-wrap gap-2">
                    <For each={Object.values(EmergencyOperation).filter((operation) => EmergencyOperationInfos[operation].level == level)}>{(operation) => <>
                      <button class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50" onClick={() => {
                        onAddRecord({
                          operation,
                          refresh: false,
                          perfect: false,
                        } as EmergencyOperationRecord);
                        onClose();
                      }}>{operation}</button>
                    </>}</For>
                  </div>
                </div>
              </>}</For>
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
