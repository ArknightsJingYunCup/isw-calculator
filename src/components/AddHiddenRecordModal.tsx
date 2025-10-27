import { Accessor, Component, For, Show } from "solid-js";
import { HiddenOperation, HiddenOperationInfos } from "../data/sarkaz";
import { Box, Button, Modal, Paper, Typography } from "@suid/material";

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
    <Modal open={open()} onClose={() => {
      onClose();
    }}>
      <Paper sx={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: "50%", maxHeight: "80%",
        padding: 2,
        display: "flex", flexDirection: "column"
      }}>
        <Typography variant="h6" sx={{ marginBottom: 1 }}>添加隐藏作战</Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }}>
          <For each={Object.values(HiddenOperation)}>{(operation) => <>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Show when={HiddenOperationInfos[operation].score !== 0}>
                <Button variant="outlined" onClick={() => {
                  onAddRecord({
                    operation,
                    emergency: false,
                    perfect: false,
                  } as HiddenOperationRecord);
                  onClose();
                }}>{operation}</Button>
              </Show>
              <Show when={HiddenOperationInfos[operation].emergency_score !== 0}>
                <Button variant="outlined" color="error" onClick={() => {
                  onAddRecord({
                    operation,
                    emergency: true,
                    perfect: false,
                  } as HiddenOperationRecord);
                  onClose();
                }}>{operation}（紧急）</Button>
              </Show>
            </Box>
          </>}</For>
        </Box>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "end" }}>
          {/* <Button variant="contained" onClick={() => {
            onAdd(EmergencyOperation.AGreatGame);
          }}>添加</Button> */}
          <Button variant="outlined" onClick={onClose}>取消</Button>
        </Box>
      </Paper>
    </Modal>
  </>
}