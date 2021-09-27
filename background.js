const color = '#3AA757'

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({color})
    console.log(`Default color is set to ${color}`)
})