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

observeDOM(document, function(m) {
    if (m.addedNodes) {
        if (document.getElementsByClassName('am2-time-tracking--asana')[0] === undefined) {
            const append = document.getElementsByClassName('SingleTaskPaneToolbar-closeButton')[0];
            if (append) {
                append.insertAdjacentHTML(
                    'beforebegin',
                    '<a href="#" style="margin-right: 5px;" class="am2-time-tracking--asana">am2</a>'
                );
                var link = document.getElementsByClassName('am2-time-tracking--asana')[0];
                if (link) {
                    link.addEventListener('click', function() {
                        AM2AsanaAddTime();
                    });
                }
            }
        }
    }
});

function am2GetProjectID(asanaProjectID) {
    return new Promise(resolve => {
        chrome.storage.local.get('crmTokenKey', items => {
            return fetch(
                `https://oldcrm.am2studio.com/wp-json/crm/v2/asanaproject/?id=${asanaProjectID}`,
                {
                    method: 'GET',
                    credentials: 'include',
                    headers: new Headers({
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${items.crmTokenKey}`
                    })
                }
            )
                .then(response => response.json())
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    throw new Error(error.message);
                });
        });
    });
}

function AM2AsanaAddTime() {
    // Get Project Details First
    let asanaProjectID = '';
    let projectName = ' But could not fetch project name. Make sure its connected in CRM.';
    const asanaURL = window.location.href;
    const asanaProjectDescription = document
        .querySelector('.SingleTaskTitleInput-taskName .autogrowTextarea-shadow')
        .textContent.replace('|', '');

    const myTasksScreen = document.getElementsByClassName('SidebarTopNavLinks-myTasksButton')[0];
    if (myTasksScreen.classList.contains('is-selected')) {
        const project = document.querySelector('.ItemRow--highlighted .NavigationLink');
        if (project) {
            const projectLink = project.getAttribute('href').split('/');
            asanaProjectID = projectLink[4];
        }
    } else {
        const projectLink = asanaURL.split('/');
        asanaProjectID = projectLink[4];
    }

    // Create Element node
    const msgHolder = document.querySelector('.SingleTaskPaneBanners.SingleTaskPane-banners');
    const content = document.createElement('div');

    // Get Project ID
    am2GetProjectID(asanaProjectID)
        .then(result => {
            if (result.success) {
                console.log(result.project);
                chrome.storage.local.set({ project: result.project.id });
                projectName = ` For project: ${result.project.title}`;
            }

            content.innerHTML = `
            <div class="MessageBanner MessageBanner--am2 MessageBanner--medium TaskPrivacyBanner TaskMessageBanner">
                <span class="TaskPrivacyBanner-privacyMessage">
                    Started tracking time for ${asanaProjectDescription} task. ${projectName}.
                </span>
            </div>
            `;
            msgHolder.appendChild(content);
        })
        .catch(error => {
            throw new Error(error.message);
        });

    // All good? Start tracking time and append Message
    chrome.storage.local.set({ asana_url: asanaURL });
    chrome.storage.local.set({ comment: asanaProjectDescription });
    chrome.runtime.sendMessage({ type: 'startTimer' });
}
// API Example: https://app.asana.com/api/1.0/tasks/907797713896385
