const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");
const { openDatabase } = require("./db");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true
    }
  });

  mainWindow.loadFile("index.html");
}

app.whenReady().then(async () => {
  const dataDir = path.join(app.getPath("userData"), "data");
  const dbPath = path.join(dataDir, "app.db");

  fs.mkdirSync(dataDir, { recursive: true });

  // Open encrypted DB + create schema
  try {
    global.db = await openDatabase(dbPath);
    console.log("Encrypted DB created/opened at:", dbPath);
  } catch (err) {
    console.error("Failed to open/create DB:", err);
    app.quit();
    return;
  }

  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
