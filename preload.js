const {contextBridge,ipcRenderer } = require('electron')
const sysenv = process.env
contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping:()=>ipcRenderer.invoke('ping')
  // we can also expose variables, not just functions
})

window.addEventListener('DOMContentLoaded', async () => {
    
    const sysinfo = {
        'os':process.env.OS,
        'lang':process.env.LANG
    }
    const getVer = await ipcRenderer.invoke('getVer')
    document.getElementById('ver').innerText=`版本号：v${getVer}`
    document.getElementById("os").innerText= `系统：${sysinfo.os}`
    document.getElementById("lang").innerText= `语言：${sysinfo.lang}`
    setInterval(()=>{
        const cpuinfo = ipcRenderer.invoke('cpuinfo');
        cpuinfo.then(res=>{
            document.getElementById("cpuNum").innerText= `CPU数量：${res.length}`
            let str = "";
            res.forEach(cpu => {
                str+=cpu.id?`<h3>CPU ${cpu.id} 信息:</h3>`:"<h3>CPU信息:</h3>"
                str+=`<p>└──品牌: ${cpu.model}</p>`
                str+=`<p>└──速度: ${cpu.speed}</p>`
                str+=`<p>└──用户:${cpu.times.user} ms</p>`
                str+=`<p>└──系统: ${cpu.times.sys} ms</p>`
                str+=`<p>└──idle: ${cpu.times.idle} ms</p>`
                // str+=`<p>└──负载: ${cpu.load}</p>`
              });
            document.getElementById("cpuinfo").innerHTML=""
            document.getElementById("cpuinfo").innerHTML= str
        },1000)
    })
  })