/*eslint-disable*/
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === 'startTimer') {
        chrome.storage.local.set({ AM2CRMStartTime: new Date().toJSON() });
    }
    if (request.type === 'getTimer') {
        chrome.storage.local.get('AM2CRMStartTime', items => {
            if (items.AM2CRMStartTime) {
                sendResponse(new Date() - new Date(items.AM2CRMStartTime));
            }
        });
        return true;
    }
    if (request.type === 'stopTimer') {
        chrome.storage.local.get('AM2CRMStartTime', items => {
            if (items.AM2CRMStartTime) {
                sendResponse(new Date() - new Date(items.AM2CRMStartTime));
                chrome.storage.local.remove('AM2CRMStartTime');
            }
        });
        return true;
    }
    return false;
});
