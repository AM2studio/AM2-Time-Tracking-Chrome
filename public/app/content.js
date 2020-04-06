/* eslint-disable */
const observeDOM = (function() {
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    return function(obj, callback) {
        if (!obj || !obj.nodeType === 1) return; // validation

        if (MutationObserver) {
            // define a new observer
            const obs = new MutationObserver((mutations, observer) => {
                if (mutations[0].addedNodes.length || mutations[0].removedNodes.length)
                    callback(mutations[0]);
            });
            // have the observer observe for changes in children
            obs.observe(obj, { childList: true, subtree: true });
        } else if (window.addEventListener) {
            obj.addEventListener('DOMNodeInserted', callback, false);
            obj.addEventListener('DOMNodeRemoved', callback, false);
        }
    };
})();
