import { Component, createSignal, For, Match, Show, Switch } from "solid-js";
import "./App.css";
import { BottomNavigation, BottomNavigationAction, Box, Button, Card, Checkbox, FormControl, IconButton, InputLabel, MenuItem, Modal, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useMediaQuery } from "@suid/material";

import { BannedOperator as BannedOperator, BannedOperatorInfos, BossOperation, BossOperationInfos, Collectible, EmergencyOperation, EmergencyOperationInfos, HiddenOperation, HiddenOperationInfos, KingsCollectible, Squad } from "./data/sarkaz";
import { AddEmergencyRecordModal, EmergencyOperationRecord } from "./components/AddEmergencyRecordModal";
import { createStore } from "solid-js/store";
import { AddBossRecordModal, BossOperationRecord } from "./components/AddBossRecordModal";
import { readJson, saveJson } from "./lib";
import { AddHiddenRecordModal, HiddenOperationRecord } from "./components/AddHiddenRecordModal";
import { Delete } from "@suid/icons-material";

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
  const sm = useMediaQuery("(max-width: 600px)");

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

  // 3) e) 结算时，若持有超过1件“国王”藏品，从第二件藏品开始每持有一件藏品扣除20分；触
  //       发“诸王的冠冕”3层效果时，额外扣除40分；若集齐游戏内所有“国王”藏品，额外扣除
  //       20分；
  // 正赛：更改为 结算时，若持有超过1件“国王”藏品，从第二件藏品开始每持有一件藏品扣除20分；在“失落财宝”中选择《泰拉之王》时，额外扣除40分；若集齐游戏内所有“国王”藏品，额外扣除
  //       20分；
  //      
  const calcKingsCollectibleSum = () => {
    const kingsCollectibleCnt = store.kingsCollectibleRecords.reduce((sum, record) => sum + (record.owned ? 1 : 0), 0);
    // const ownedCrown = store.kingsCollectibleRecords.find((record) => record.collectible == KingsCollectible.KingsCrown && record.owned);
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

  /// Others ///

  // 3) f) 结算时，若持有“希望时代的涂鸦”，则每个藏品额外获得3分加分；
  const collectibleScore = () => store.collectible == Collectible.DoodleInTheEraOfHope ? 3 : 0;
  const calcCollectionsScore = () => {
    return store.collectionsCnt * collectibleScore();
  }

  // 3) a) 作战中，每击杀一个隐藏敌人（包括“鸭爵”、“高普尼克”、“流泪小子”与“圆仔”），额外获
  //       得10分加分；
  const calcHiddenScore = () => {
    return store.killedHiddenCnt * 10;
  }

  // 3) b) 每局游戏有8次刷新节点的机会，若选择蓝图测绘分队，则提升至15次。结算分数时，
  //        若本局游戏中刷新节点次数超过规定，每超出的一次刷新节点行为额外扣除50分。特
  //        殊地，持有“先知长角”且生效时，将节点刷新为“命运所指”的行为不计入刷新次数；
  const maxRefreshCnt = () => store.squad == Squad.BlueprintSurveyingSquad ? 15 : 8;
  const calcRefreshScore = () => {
    return store.refreshCnt > maxRefreshCnt() ? (store.refreshCnt - maxRefreshCnt()) * -50 : 0;
  }

  // 3) c) 每局游戏的源石锭余额减少总数超过40时，每额外减少1源石锭余额，额外扣除50分；
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
    {/* 开局设置 */}
    <Card sx={{ display: "flex", flexShrink: 0, flexDirection: "column", gap: 1, padding: 2, zIndex: 20 }}>
      <Typography variant="h6">开局设置</Typography>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "stretch" }}>
        <Box sx={{ minWidth: 150, flexGrow: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="squad-select-label">开局分队</InputLabel>
            <Select
              labelId="squad-select-label"
              id="squad-select"
              value={store.squad || ''} // use `|| ''` to prevent error
              label="开局分队"
              onChange={(e) => {
                setStore("squad", e.target.value);
              }}
            >
              <For each={Object.values(Squad)}>{(squad) => <>
                <MenuItem value={squad}>{squad}</MenuItem>
              </>}</For>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ minWidth: 150, flexGrow: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">开局藏品</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={store.collectible || ''}
              label="开局藏品"
              onChange={(e) => {
                setStore("collectible", e.target.value);
              }}
            >
              <For each={Object.values(Collectible)}>{(squad) => <>
                <MenuItem value={squad}>{squad}</MenuItem>
              </>}</For>
            </Select>
          </FormControl>
        </Box>
      </Box >
    </Card>
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
    {/* 紧急作战 */}
    <Card sx={{ display: "flex", flexShrink: 0, flexDirection: "column", gap: 1, padding: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="h6">紧急作战</Typography>
        <Button variant="contained" size="small" onClick={() => {
          setEmergencyOpen(true)
        }}>
          添加
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Typography>该部分得分: {calcEmergencySum().toFixed(1)}</Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "stretch", gap: 1 }}>
        {/* 紧急作战 */}
        <TableContainer component={Box} sx={{ flex: 1 }}>
          <Table aria-label="simple table" size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 60 }}>名称</TableCell>
                <TableCell>无漏</TableCell>
                <TableCell>刷新</TableCell>
                <TableCell align="right">分数</TableCell>
                <TableCell align="center">操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <For each={store.emergencyRecords}>
                {(item, idx) => (
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {item.operation}
                    </TableCell>
                    <TableCell>
                      <Checkbox size="small" checked={item.perfect} onChange={(_, v) => {
                        updateEmergencyRecord(idx(), { ...item, perfect: v });
                        console.log(item)
                      }} />
                    </TableCell>
                    <TableCell>
                      <Checkbox size="small" checked={item.refresh} onChange={(_, v) => {
                        updateEmergencyRecord(idx(), { ...item, refresh: v });
                      }} />
                    </TableCell>
                    <TableCell align="right">{calcEmergencyRecordScore(idx()).toFixed(1)}</TableCell>
                    <TableCell align="center">
                      <IconButton color="error" onClick={() => { removeEmergencyRecord(idx()) }}><Delete /></IconButton>
                    </TableCell>
                  </TableRow>
                )}
              </For>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Card >
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
    {/* 隐藏作战 */}
    <Card sx={{ display: "flex", flexShrink: 0, flexDirection: "column", gap: 1, padding: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="h6">隐藏作战</Typography>
        <Button variant="contained" size="small" onClick={() => {
          setHiddenOpen(true)
        }}>
          添加
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Typography>该部分得分: {calcHiddenSum().toFixed(1)}</Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "stretch", gap: 1 }}>
        {/* 隐藏作战 */}
        <TableContainer component={Box} sx={{ flex: 1 }}>
          <Table aria-label="simple table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>名称</TableCell>
                <TableCell>无漏</TableCell>
                <TableCell align="right">分数</TableCell>
                <TableCell align="center">操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <For each={store.hiddenRecords}>
                {(item, idx) => (
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" sx={{ color: item.emergency ? 'red' : 'auto' }}>
                      {item.operation}
                      <Show when={item.emergency}>
                        （紧急）
                      </Show>
                    </TableCell>
                    <TableCell>
                      <Checkbox size="small" checked={item.perfect} onChange={(_, v) => {
                        updateHiddenRecord(idx(), { ...item, perfect: v });
                      }} />
                    </TableCell>
                    <TableCell align="right">{calcHiddenRecordScore(idx()).toFixed(1)}</TableCell>
                    <TableCell align="center">
                      <IconButton color="error" onClick={() => removeHiddenRecord(idx())}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )}
              </For>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Card >
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
    {/* 领袖作战 */}
    <AddBossRecordModal open={bossOpen} onClose={() => { setBossOpen(false); }} onAddRecord={addBossRecord} />
    <Card sx={{ display: "flex", flexShrink: 0, flexDirection: "column", gap: 1, padding: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="h6">领袖作战</Typography>
        <Button variant="contained" size="small" onClick={() => { setBossOpen(true) }}>
          添加
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Typography>该部分得分: {calcBossSum().toFixed(1)}</Typography>
      </Box>

      {/* 领袖作战 */}
      <TableContainer component={Box} sx={{ flex: 1 }}>
        <Table aria-label="simple table" size="small">
          <TableHead>
            <TableRow>
              <TableCell>名称</TableCell>
              <TableCell>&nbsp;&nbsp;&nbsp;&nbsp;</TableCell>
              <TableCell>&nbsp;&nbsp;&nbsp;&nbsp;</TableCell>
              <TableCell align="right">分数</TableCell>
              <TableCell align="center">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <For each={store.bossRecords}>
              {(item, idx) => (
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row" sx={{ color: item.chaos ? 'red' : 'auto' }}>
                    {item.operation}
                    <Show when={item.chaos}>
                      （混乱）
                    </Show>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell align="right">{calcBossRecordScore(idx()).toFixed(1)}</TableCell>
                  <TableCell align="center">
                    <IconButton color="error" onClick={() => removeBossRecord(idx())}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )}
            </For>
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  </>

  // 阵容补偿
  const OperatorPart = () => <>
    {/* 阵容补偿 */}
    <Card sx={{ display: "flex", flexShrink: 0, flexDirection: "column", gap: 1, padding: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="h6">阵容补偿</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Typography>该部分得分: {calcBannedSum()}</Typography>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        <For each={store.bannedOperatorRecords}>{(item) => <>
          <Button variant="outlined" color={item.banned ? "success" : "secondary"} onClick={() => {
            toggleBannedOperator(item.operator)
          }}>
            {item.operator}
            <Show when={item.banned}>
              <span style={{ color: "green" }}>（+{BannedOperatorInfos[item.operator]}）</span>
            </Show>
          </Button>
        </>}</For>
      </Box>
    </Card>
  </>

  // 国王收藏品
  const KingsCollectivesPart = () => <>
    {/* 国王套 */}
    <Card sx={{ display: "flex", flexShrink: 0, flexDirection: "column", gap: 1, padding: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="h6">国王套</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Typography>该部分得分: {calcKingsCollectibleSum()}</Typography>
      </Box>
      <Button variant={store.kingOfTerra ? "contained" : "outlined"} color={store.kingOfTerra ? "error" : "secondary"} onClick={() => {
        setStore("kingOfTerra", v => !v)
        setStore("kingsCollectibleRecords", (collectibles) => collectibles.map((item) => {
          return { ...item, owned: store.kingOfTerra }
        }));
      }}>
        泰拉之王
      </Button>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        <For each={store.kingsCollectibleRecords}>{(item) => <>
          <Button variant="outlined" color={item.owned ? "error" : "secondary"} onClick={() => {
            if (item.owned) {
              setStore("kingOfTerra", false)
            }
            toggleKingsCollectible(item.collectible)
          }}>
            {item.collectible}
          </Button>
        </>}</For>
      </Box>
    </Card>
  </>

  // 结算 & 其他
  const SumPart: Component = () => <>
    {/* 结算部分（其他部分） */}
    <Card sx={{ display: "flex", flexDirection: "column", gap: 1, flexGrow: 1, padding: 2, flexShrink: 0 }}>
      <Typography variant="h6" sx={{ paddingBottom: 1 }}>结算</Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
        <TextField
          label="藏品数量"
          type="number"
          value={store.collectionsCnt}
          onChange={(_, value) => setStore("collectionsCnt", parseInt(value) || 0)}
          helperText={
            store.collectible == Collectible.DoodleInTheEraOfHope
              ? <span style={{ color: "green" }}>{store.collectionsCnt} * {collectibleScore()} = {calcCollectionsScore()}</span>
              : <span style={{ color: "red" }}>无希望时代的涂鸦</span>
          }
        />
        <TextField
          label="击杀隐藏数量"
          type="number"
          value={store.killedHiddenCnt}
          onChange={(_, value) => setStore("killedHiddenCnt", parseInt(value) || 0)}
          helperText={`${store.killedHiddenCnt} * 10 = ${calcHiddenScore()}`}
        />
        <TextField
          label="刷新次数"
          type="number"
          value={store.refreshCnt}
          onChange={(_, value) => setStore("refreshCnt", parseInt(value) || 0)}
          helperText={
            store.refreshCnt <= maxRefreshCnt()
              ? <span style={{ color: "green" }}>&lt;= {maxRefreshCnt()}</span>
              : <span style={{ color: "red" }}>{store.refreshCnt - maxRefreshCnt()} x -50 = {calcRefreshScore()}</span>
          }
        />
        <TextField
          label="取钱数量"
          type="number"
          value={store.withdrawCnt}
          onChange={(_, value) => setStore("withdrawCnt", parseInt(value) || 0)}
          sx={{
            color: store.withdrawCnt < 40 ? "green" : "red"
          }}
          helperText={
            store.withdrawCnt <= 40
              ? <span style={{ color: "green" }}>&lt;= 40</span>
              : <span style={{ color: "red" }}>{store.withdrawCnt - 40} x -50 = {calcWithdrawScore()}</span>
          }
        />
        <TextField
          label="结算分"
          type="number"
          value={store.score}
          onChange={(_, value) => setStore("score", parseInt(value) || 0)}
          helperText={`${store.score} x 0.5 = ${calcScore()}`}
        />
      </Box>
    </Card>
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
      <Match when={sm()}>
        <Box sx={{
          display: "flex", height: "100%", boxSizing: "border-box",
          flexDirection: "column"
        }}>
          <OpeningPart />
          <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, gap: 1, overflowY: "auto", padding: 1 }}>
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
          </Box>
          <Paper sx={{ display: "flex", flexDirection: "column", gap: 1, flexShrink: 0 }}>
            <Box sx={{ display: "flex", gap: 1, padding: 1 }}>
              <span>总分：
                <span style={{ "font-size": "x-large" }}>{calcTotalSum()}</span>
              </span>
              <Box sx={{ flexGrow: 1 }} />
              <Button variant="contained" size="small" onClick={() => { setStore({ ...defaultStoreValue }) }}>清零</Button>
              <Modal open={copyJsonOpen()} onClose={() => setCopyJsonOpen(false)}>
                <Paper sx={{
                  position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                  width: "50%", maxHeight: "80%",
                  padding: 2,
                  display: "flex", flexDirection: "column",
                  gap: 1
                }}>
                  <TextField label="数据 json"
                    multiline
                    minRows={4}
                    maxRows={4} value={json()} />
                  <Box sx={{ display: "flex", gap: 2, justifyContent: "end" }}>
                    <Button variant="outlined" onClick={() => setCopyJsonOpen(false)}>关闭</Button>
                  </Box>
                </Paper>
              </Modal>
              <Button variant="outlined" size="small" onClick={async () => {
                setJson(JSON.stringify(store));
                setCopyJsonOpen(true);
              }}>复制 json</Button>
              <Modal open={loadJsonOpen()} onClose={() => setLoadJsonOpen(false)}>
                <Paper sx={{
                  position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                  width: "50%", maxHeight: "80%",
                  padding: 2,
                  display: "flex", flexDirection: "column",
                  gap: 1
                }}>
                  <TextField label="数据 json"
                    multiline
                    minRows={4}
                    maxRows={4} value={json()} onChange={(_, v) => setJson(v)} />
                  <Box sx={{ display: "flex", gap: 2, justifyContent: "end" }}>
                    <Button variant="contained" onClick={() => {
                      setStore(JSON.parse(json()))
                      setLoadJsonOpen(false);
                    }}>确定</Button>
                    <Button variant="outlined" onClick={() => setLoadJsonOpen(false)}>取消</Button>
                  </Box>
                </Paper>
              </Modal>
              <Button variant="outlined" size="small" onClick={async () => {
                setLoadJsonOpen(true);
              }}>导入 json</Button>
            </Box>
            <BottomNavigation
              showLabels
              sx={{ width: "100%" }}
              value={tab()}
              onChange={(_, newValue) => setTab(newValue)}
            >
              <For each={Object.values(Tab)}>{(item) => <BottomNavigationAction label={item} value={item} />}</For>
            </BottomNavigation>
          </Paper>
        </Box>
      </Match>
      {/* 宽屏界面 */}
      <Match when={!sm()}>
        <Box sx={{
          display: "flex", gap: 1, height: "100%", boxSizing: "border-box",
          padding: 1
        }}>
          <Box sx={{
            display: "flex", flexDirection: "column",
            gap: 1, flex: 1,
            height: "100%", overflowY: "scroll",
            paddingRight: 1
          }}>
            <OpeningPart />

            <EmergencyPart />
            <HiddenPart />
            <BossPart />

            <OperatorPart />

            <KingsCollectivesPart />

          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", minWidth: 200, gap: 1 }}>
            <SumPart />
            <Card sx={{ display: "flex", flexDirection: "column", gap: 1, padding: 2 }}>
              <Typography sx={{ fontSize: "1.5rem" }}>总计：{calcTotalSum().toFixed(1)}</Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button variant="contained" onClick={() => { setStore({ ...defaultStoreValue }) }}>清零</Button>
                <Button variant="outlined" onClick={async () => {
                  let content = JSON.stringify(store)
                  await saveJson(content);
                }}>保存</Button>
                <Button variant="outlined" onClick={async () => {
                  const content = await readJson();
                  let data = JSON.parse(content);
                  console.log(data)
                  setStore(data as Store)
                }}>加载</Button>
              </Box>
            </Card>
          </Box>
        </Box>
      </Match>
    </Switch>
  </>;
}

export default App;
