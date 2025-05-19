const { contextBridge, ipcRenderer, nativeTheme } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // クリップボード更新イベント
  onClipboardUpdated: (callback) => ipcRenderer.on("clipboard-updated", (event, value) => callback(value)),

  // ダークモードの状態取得（true = dark）
  getSystemTheme: () => nativeTheme.shouldUseDarkColors,

  // テーマ設定 ("light" | "dark" | "system")
  setTheme: (theme) => {
    nativeTheme.themeSource = theme;
  },
});
