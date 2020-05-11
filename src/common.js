
class Option {
    constructor(name, type, defaultValue) {
        this.name = name;
        this.type = type;
        this.defaultValue = defaultValue;
    }

    setValue(value) {
        switch (this.type) {
            case "radio":
                Array.prototype.forEach.call(document.getElementsByName(this.name), (el) => {
                    el.checked = el.value === value;
                });
                break;
            case "checkbox":
                break;
            case "textarea":
                document.querySelector(`textarea[name="${this.name}"]`).value = value;
                break;
        }
    }

    getValue() {
        switch (this.type) {
            case "radio":
                return document.querySelector(`input[name="${this.name}"]:checked`).value;
            case "checkbox":
                break;
            case "textarea":
                return document.querySelector(`textarea[name="${this.name}"]`).value;
        }
    }
}

export const options = [
    new Option("iconAction", "radio", "clickOnly"),
    new Option("iconActionOption", "radio", "direct"),
    new Option("siteAuth", "textarea", `{"site.com":"username:password"}`),
];

export function getOptions(callback) {
    const getDict = {};
    options.forEach((item) => {
        getDict[item.name] = item.defaultValue;
    })
    chrome.storage.sync.get(getDict, callback);
}

export function saveOptions() {
    const saveDict = {};
    options.forEach((item) => {
        saveDict[item.name] = item.getValue();
    })
    chrome.storage.sync.set(saveDict);
}

export function restoreOptions() {
    getOptions((items) => {
        options.forEach((option) => {
            option.setValue(items[option.name]);
        });
    });
}

export function openInIINA(tabId, url, options = {}) {
    try{
        const siteAuth = JSON.parse(options.siteAuth)
        Object.keys(siteAuth).forEach(function(elem, index) {
            if(url.indexOf(elem) !== -1 && url.indexOf(siteAuth[elem]) === -1){
                url = url.replace(elem,`${siteAuth[elem]}@${elem}`);
            }
        });
    }catch(e){
        console.log(e)
    }
    const baseURL = `iina://open?`;
    const params = [`url=${encodeURIComponent(url)}`];
    switch (options.mode) {
        case "fullScreen":
            params.push("full_screen=1"); break;
        case "pip":
            params.push("pip=1"); break;
        case "enqueue":
            params.push("enqueue=1"); break;
    }
    if (options.newWindow) {
        params.push("new_window=1");
    }
    const code = `
        var link = document.createElement('a');
        link.href='${baseURL}${params.join("&")}';
        document.body.appendChild(link);
        link.click();
        `;
    chrome.tabs.executeScript(tabId, { code });
}

export function updateBrowserAction() {
    getOptions((options) => {
        if (options.iconAction === "clickOnly") {
            chrome.browserAction.setPopup({ popup: "" });
            chrome.browserAction.onClicked.addListener(() => {
                // get active window
                chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
                    if (tabs.length === 0) { return; }
                    // TODO: filter url
                    const tab = tabs[0];
                    if (tab.id === chrome.tabs.TAB_ID_NONE) { return; }
                    openInIINA(tab.id, tab.url, {
                        mode: options.iconActionOption,
                        siteAuth: options.siteAuth
                    });
                });
            });
        } else {
            chrome.browserAction.setPopup({ popup: "popup.html" });
        }
    });
}
