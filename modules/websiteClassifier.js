document.getElementById('dropshipper').addEventListener('click', () => setStoreType('dropshipper', 'green'));
document.getElementById('supplier').addEventListener('click', () => setStoreType('supplier', 'blue'));
document.getElementById('other').addEventListener('click', removeStore);
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
            markAs('', 'black');
        } else  if (store.type === 'dropshipper') {
            markAs('dropshipper', 'green');
        } else if (store.type === 'supplier') {
            markAs('supplier', 'blue');
        }
    });
}

function setStoreType(type, color) {
    if (type === 'other') {
        removeStore();
    } else {
        saveStore(type);
        markAs(type, color);
    }
}

function markAs(type, color) {
    websiteType.innerText = type;
    websiteType.style.color = color;
}

function saveStore(type) {
    getKnownStores(stores => {
        var store = Array.from(stores).find(s => s.name === hostname);
        if (!store) {
            stores.push({ name: hostname, type: type });
        } else {
            store.isDropship = isDropship;
        }
        updateStores(stores);
    });
}

function removeStore() {
    getKnownStores(stores => {
        var index = stores.indexOf(s => s.name === hostname);
        stores = stores.splice(index, 1);
        updateStores(stores);
    })
}

function updateStores(stores) {
    chrome.storage.sync.set({ 'stores': JSON.stringify(stores) }, () =>{});
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