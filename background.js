

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(['container_numbers'], (result) => {
        console.log(`result: ${result}`)
    })
})