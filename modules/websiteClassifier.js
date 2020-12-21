const UNKNOWN_WEBSITE = { type: '', color: 'transparent'};
const DROPSHIPPER_WEBSITE = { type: 'dropshipper', color: 'green'};
const SUPPLIER_WEBSITE = { type: 'supplier', color: 'blue'};
const OTHER_WEBSITE = { type: 'other', color: 'red'};

document.getElementById('dropshipper').addEventListener('click', () => setStoreType(DROPSHIPPER_WEBSITE));
document.getElementById('supplier').addEventListener('click', () => setStoreType(SUPPLIER_WEBSITE));
document.getElementById('other').addEventListener('click', () => setStoreType(OTHER_WEBSITE));
document.getElementById('clear').addEventListener('click', () => removeStore());
var website = document.getElementById('website');
var websiteType = document.getElementById('websiteType');

var hostname;

export function setCurrentUrl(host) {
    hostname = host;
    website.innerText = hostname;
    checkCurrentStore();
}

function checkCurrentStore() {
    getKnownStores(stores => {
        var store = Array.from(stores).find(s => s.name === hostname);
        if (!store) {
            markAs(UNKNOWN_WEBSITE);
        } else if (store.type === 'dropshipper') {
            markAs(DROPSHIPPER_WEBSITE);
        } else if (store.type === 'supplier') {
            markAs(SUPPLIER_WEBSITE);
        } else if (store.type === 'other') {
            markAs(OTHER_WEBSITE);
        }
    });
}

function setStoreType(websiteClass) {
    saveStore(websiteClass.type);
    markAs(websiteClass);
}

function saveStore(type) {
    getKnownStores(stores => {
        var store = Array.from(stores).find(s => s.name === hostname);
        if (!store) {
            stores.push({ name: hostname, type: type });
        } else {
            store.type = type;
        }
        updateStores(stores);
    });
}

function removeStore() {
    getKnownStores(stores => {
        var index = stores.findIndex(s => s.name === hostname);
        if (index < 0) {
            return;
        }
        stores.splice(index, 1);
        updateStores(stores);
        markAs(UNKNOWN_WEBSITE);
    })
}

function markAs(websiteClass) {
    websiteType.innerText = websiteClass.type;
    websiteType.style.backgroundColor = websiteClass.color;
}

function updateStores(stores) {
    chrome.storage.sync.set({ 'stores': JSON.stringify(stores) }, () => { });
}

function getKnownStores(callback) {
    chrome.storage.sync.get(['stores'], function (value) {
        if (!value.stores) {
            callback([]);
        } else {
            callback(JSON.parse(value.stores));
        }
    });
}