// const information = document.getElementById('info')
// information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`
console.log("RENDERER LOADED")
const information = document.getElementById('info')
//information.innerText = `This app is using Chrome (v${window.versions.chrome()}), Node.js (v${window.versions.node()}), and Electron (v${window.versions.electron()})`
const func = async () => {
  const response = await window.versions.ping()
  console.log("func reached")
  console.log(response) // prints out 'pong'
}

func()


  console.log("window.api clause reached in renderer");
  window.api.onMessage((data) => {
    console.log("Message from Python:", data)

    const div = document.getElementById("messages")
    if (div) {
      div.innerText += "\n" + data
    }
  })

  window.api.onStatus((status) => {
    console.log("WebSocket status:", status)
  })

  window.api.onStatus((status) => {
    const statusEl = document.getElementById("backendStatus")

    if (!statusEl) return

    if (status === "connected") {
      statusEl.textContent = "Connected"
      statusEl.style.color = "green"
    } else {
      statusEl.textContent = "Disconnected"
      statusEl.style.color = "red"
    }
  })

