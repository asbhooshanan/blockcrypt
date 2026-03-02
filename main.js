// const { app, BrowserWindow } = require('electron')

// const createWindow = () => {
//   const win = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js')
//     }
//   })

//   win.loadFile('index.html')
// }

// app.whenReady().then(() => {
//   createWindow()

//   app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) {
//       createWindow()
//     }
//   })
// })

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
// })



// const { app, BrowserWindow } = require('electron/main')
// const path = require('node:path')

// const createWindow = () => {
//   const win = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js')
//     }
//   })

//   win.loadFile('index.html')
// }

// app.whenReady().then(() => {
//   createWindow()

//   app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) {
//       createWindow()
//     }
//   })
// })

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
// })

const { app, BrowserWindow, ipcMain } = require('electron/main')

const path = require('node:path')
const WebSocket = require('ws');

let ws = null;

function createWebSocketConnection() {
  return new Promise((resolve, reject) => {
    let wsTimeout;
    try {
      ws = new WebSocket('ws://127.0.0.1:8777');

      ws.on('open', function open() {
        console.log('WebSocket connection opened');
        clearTimeout(wsTimeout);
        attachStatusListener();
        resolve();
      });

      ws.on('error', function error(err) {
        console.error('WebSocket error:', err.message);
        clearTimeout(wsTimeout);
        reject(err);
      });

      ws.on('close', function close() {
        console.log('WebSocket connection closed');
      });

      // Increase timeout to 10 seconds and add detailed logging
      wsTimeout = setTimeout(() => {
        if (ws && ws.readyState !== WebSocket.OPEN) {
          console.warn('WebSocket connection timeout after 10s, terminating...');
          try { ws.terminate?.(); } catch { }
          reject(new Error('WebSocket connection timeout (10s)'));
        }
      }, 10000);
    } catch (error) {
      clearTimeout(wsTimeout);
      reject(error);
    }
  });
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.loadFile('index.html')
}
app.whenReady().then(async () => {
  ipcMain.handle('ping', () => 'pong')
  createWindow()

  try {
    await createWebSocketConnection()
  } catch (err) {
    console.error('Initial WS connection failed:', err.message)
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Renderer asks to connect
ipcMain.handle('ws-connect', async () => {
  try {
    await createWebSocketConnection()
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
})

ipcMain.handle('ws-send', (event, message) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(message)
    return { success: true }
  } else {
    return { success: false, error: 'WebSocket not connected' }
  }
})

ipcMain.handle('ws-disconnect', () => {
  if (ws) {
    ws.close()
    ws = null
  }
  return { success: true }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})