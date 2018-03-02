chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        // var requestdata={"url":details.url,"data":details.requestBody};
        // sendMessageToContentScript({ cmd: 'test', value: JSON.stringify(requestdata) }, function(response) {
        //     console.log('来自content的回复：' + response);
        // });
        // return { cancel: details.url.indexOf("://www.evil.com/") != -1 };
    }, { urls: ["<all_urls>"] }, ["blocking", "requestBody"]);

function sendMessageToContentScript(message, callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, function(response) {
            if (callback) callback(response);
        });
    });
}