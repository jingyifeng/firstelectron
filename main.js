const {app,BrowserWindow,ipcMain} = require("electron")
const path = require('path')
const os = require('os')
const createWindow = ()=>{
    const win = new BrowserWindow({
        width:800,
        height:600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
          }
    })
    win.loadFile('html/index.html')
}

app.whenReady().then(()=>{
    ipcMain.handle('ping', () => 'pong')
    ipcMain.handle('cpuinfo',() =>{
        let cpuinfo = os.cpus();
        return cpuinfo;
    })
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
      })
})

app.on('window-all-closed',()=>{
    if(process.platform !== 'darwin') app.quit()
})