import { openInIINA, getOptions, options } from "./common.js";

Array.prototype.forEach.call(document.getElementsByClassName("menu-item"), (item) => {
    const mode = item.id.split("-")[1];
    getOptions((options) => {
        item.addEventListener("click", () => {
            chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
                if (tabs.length === 0) { return; }
                const tab = tabs[0];
                if (tab.id === chrome.tabs.TAB_ID_NONE) { return; }
                console.log(options,mode)
                openInIINA(tab.id, tab.url, {
                    mode,
                    newWindow: mode === "newWindow",
                    siteAuth: options.siteAuth
                });
            });
        });
    });
});