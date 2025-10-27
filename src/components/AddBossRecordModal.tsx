import { Accessor, Component, For, Show } from "solid-js";
import { BossOperation, BossOperationInfos, Level } from "../data/sarkaz";
import { Box, Button, Modal, Paper, Typography } from "@suid/material";

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
    <Modal open={open()} onClose={() => {
      onClose();
    }}>
      <Paper sx={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: "50%", maxHeight: "80%",
        padding: 2,
        display: "flex", flexDirection: "column"
      }}>
        <Typography variant="h6" sx={{ marginBottom: 1 }}>添加领袖作战</Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }}>
          <For each={[Level.Third, Level.Fifth, Level.Sixth]}>{(level) => <>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <span>{level}</span>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                <For each={Object.values(BossOperation).filter((operation) => BossOperationInfos[operation].level == level)}>{(operation) => <>
                  <Show when={BossOperationInfos[operation].score !== 0}>
                    <Button variant="outlined" onClick={() => {
                      onAddRecord({
                        operation,
                        chaos: false
                      } as BossOperationRecord);
                      onClose();
                    }}>{operation}</Button>
                  </Show>
                  <Show when={BossOperationInfos[operation].chaos_score !== 0}>
                    <Button variant="outlined" color="error" onClick={() => {
                      onAddRecord({
                        operation,
                        chaos: true
                      } as BossOperationRecord);
                      onClose();
                    }}>{operation}（混乱）</Button>
                  </Show>
                </>}</For>
              </Box>
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