import {updateBrowserAction, openInIINA, getOptions, options } from "./common.js";

updateBrowserAction();

let contextMenuId = chrome.contextMenus.create({
    title: "IINA",
    contexts: ['page', 'link', 'video', 'audio'],
    documentUrlPatterns: ['http://*/*', 'https://*/*', 'file://*/*']
});

[["page", "url"], ["link", "linkUrl"], ["video", "srcUrl"], ["audio", "srcUrl"]].forEach(([item, linkType]) => {
    getOptions((options) => {
        chrome.contextMenus.create({
            title: `Open this ${item} in IINA`,
            id: `open${item}iniina`,
            contexts: [item],
            parentId: contextMenuId,
            onclick: (info, tab) => {
                openInIINA(tab.id, info[linkType], {siteAuth: options.siteAuth});
            },
        });
        chrome.contextMenus.create({
            title: `Add this ${item} to IINA Playlist`,
            id: `add${item}iniina`,
            parentId: contextMenuId,
            contexts: [item],
            onclick: (info, tab) => {
                openInIINA(tab.id, info[linkType], {mode:'enqueue', siteAuth: options.siteAuth});
            },
        });
    });
});