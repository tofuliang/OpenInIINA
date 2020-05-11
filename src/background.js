import {updateBrowserAction, openInIINA, getOptions, options } from "./common.js";

updateBrowserAction();

[["page", "url"], ["link", "linkUrl"], ["video", "srcUrl"], ["audio", "srcUrl"]].forEach(([item, linkType]) => {
    getOptions((options) => {
        chrome.contextMenus.create({
            title: `Open this ${item} in IINA`,
            id: `open${item}iniina`,
            contexts: [item],
            onclick: (info, tab) => {
                openInIINA(tab.id, info[linkType], {siteAuth: options.siteAuth});
            },
        });
    });
});