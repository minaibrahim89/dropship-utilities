import { calculateAverage } from "./modules/prices.js";

chrome.tabs.query({
    currentWindow: true,//Filters tabs in current window
    status: "complete", //The Page is completely loaded
    active: true, // The tab or web page is browsed at this state,
    windowType: "normal", // Filters normal web pages, eliminates g-talk notifications etc
},
    function (tabs) {

        var tab = tabs[0];
        if (!tab) {
            return;
        }
        var selector = undefined;

        if (tab.url.startsWith("https://www.bing.com")) {
            selector = "Array.from(document.querySelectorAll('.pd-price')).map(e => e.innerText).filter(x => !!x)";
        } else if (tab.url.startsWith("https://www.google")) {
            selector = "[...new Set(Array.from(document.getElementById('center_col').getElementsByTagName('span')).map(s => /[€$]\s?[0-9,.]+[0-9]{2}$|[0-9,.]+[0-9]{2}\s?[€$]$/m.exec(s.innerText)).filter(x => !!x).map(m => m[0]))]"
        }

        if (!selector) {
            return;
        }

        chrome.tabs.executeScript(tab.id, {
            code: selector
        }, results => calculateAverage(results[0]));
    });
