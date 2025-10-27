import { Accessor, Component, For } from "solid-js";
import { EmergencyOperation, EmergencyOperationInfos, Level } from "../data/sarkaz";
import { Box, Button, Modal, Paper, Typography } from "@suid/material";

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
    <Modal open={open()} onClose={() => {
      onClose();
    }}>
      <Paper sx={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: "50%", maxHeight: "80%",
        padding: 2,
        display: "flex", flexDirection: "column"
      }}>
        <Typography variant="h6" sx={{ marginBottom: 1 }}>添加紧急作战</Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }}>
          <For each={[Level.Third, Level.Fourth, Level.Fifth, Level.Sixth]}>{(level) => <>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <span>{level}</span>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                <For each={Object.values(EmergencyOperation).filter((operation) => EmergencyOperationInfos[operation].level == level)}>{(operation) => <>
                  <Button variant="outlined" onClick={() => {
                    onAddRecord({
                      operation,
                      refresh: false,
                      perfect: false,
                    } as EmergencyOperationRecord);
                    onClose();
                  }}>{operation}</Button>
                </>}</For>
              </Box>
            </Box>
          </>}</For>
        </Box>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "end" }}>
          <Button variant="outlined" onClick={onClose}>取消</Button>
        </Box>
      </Paper>
    </Modal>
  </>
}