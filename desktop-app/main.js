import { app, BrowserWindow, screen, Menu } from "electron";
import Store from "electron-store";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Manually define __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const store = new Store();
let win;

const createWindow = () => {
  // Get saved bounds and fullscreen status
  const savedBounds = store.get("windowBounds") || {};
  const savedFullScreen = store.get("isFullScreen");

  let { width, height, x, y } = savedBounds;

  if (!width || !height) {
    const { width: sw, height: sh } = screen.getPrimaryDisplay().workAreaSize;
    width = sw;
    height = sh;
    x = undefined;
    y = undefined;
  }

  // Platform-specific icon
  let iconPath;
  if (process.platform === "win32") {
    iconPath = path.join(__dirname, "assets", "image.ico");
  } else if (process.platform === "darwin") {
    iconPath = path.join(__dirname, "assets", "image.icns");
  } else {
    iconPath = path.join(__dirname, "assets", "image.png");
  }

  win = new BrowserWindow({
    width,
    height,
    x,
    y,
    icon: iconPath,
    webPreferences: {
      contextIsolation: true,
    },
  });

  win.loadURL("https://dhanapathrika.vercel.app/");

  // Apply saved fullscreen mode
  if (savedFullScreen) {
    win.setFullScreen(true);
  }

  // Save bounds and fullscreen status on close
  win.on("close", () => {
    store.set("windowBounds", win.getBounds());
    store.set("isFullScreen", win.isFullScreen());
  });

  // Menu: Navigation
  const menu = Menu.buildFromTemplate([
    {
      label: "← Back",
      accelerator: "CmdOrCtrl+Z",
      click: () => {
        if (win.webContents.canGoBack()) {
          win.webContents.goBack();
        }
      },
    },
    { type: "separator" },
    {
      label: "→ Forward",
      accelerator: "CmdOrCtrl+Y",
      click: () => {
        if (win.webContents.canGoForward()) {
          win.webContents.goForward();
        }
      },
    },
    { type: "separator" },
    {
      label: "⟳ Reload",
      accelerator: "CmdOrCtrl+R",
      click: () => {
        win.webContents.reload();
      },
    },
  ]);

  Menu.setApplicationMenu(menu);
};

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});