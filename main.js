const { app, BrowserWindow, clipboard, nativeTheme, screen } = require("electron");
const path = require("path");

let mainWindow;
let lastClipboard = "";
let clipboardInterval;

function createWindow() {
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;

  const winWidth = Math.floor(screenWidth * 0.3); // 右30%
  const winHeight = Math.floor(screenHeight * 0.9); // 高さ90%
  const winX = screenWidth - winWidth;
  const winY = Math.floor((screenHeight - winHeight) / 2);

  mainWindow = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    x: winX,
    y: winY,
    alwaysOnTop: true,
    alwaysOnTop: true,
    level: "floating", // macOSでウィジェットのように
    skipTaskbar: false, // タスクバーに表示（Windows）
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile("index.html");

  // クリップボード監視
  clipboardInterval = setInterval(() => {
    const currentText = clipboard.readText();
    if (currentText && currentText !== lastClipboard) {
      lastClipboard = currentText;

      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send("clipboard-updated", currentText);
      }
    }
  }, 1000);
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (clipboardInterval) clearInterval(clipboardInterval);
  if (process.platform !== "darwin") app.quit();
});
