document.getElementById('dropshipYes').addEventListener('click', setAsDropshipStore);
document.getElementById('dropshipNo').addEventListener('click', setAsNonDropshipStore);
document.getElementById('dropshipMaybe').addEventListener('click', setAsUnknownStore);
var isDropship = document.getElementById('isDropship');

var hostname;

export function setCurrentUrl(host) {
    hostname = host;
    checkCurrentStore();
}

function checkCurrentStore() {
    getKnownStores(stores => {
        var store = Array.from(stores).find(s => s.name === hostname);
        if (!store) {
            markAsUnknownStore();
        } else if (store.isDropship) {
            markAsDropshipStore();
        } else {
            markAsNonDropshipStore();
        }
    });
}

function setAsDropshipStore() {
    saveStore(true);
    markAsDropshipStore();
}


function setAsNonDropshipStore() {
    saveStore(false);
    markAsNonDropshipStore();
}

function setAsUnknownStore() {
    removeStore();
    markAsUnknownStore();
}

function markAsDropshipStore() {
    isDropship.innerText = 'yes';
    isDropship.style.color = 'green';
}

function markAsNonDropshipStore() {
    isDropship.innerText = 'no';
    isDropship.style.color = 'red';
}

function markAsUnknownStore() {
    isDropship.innerText = 'maybe';
    isDropship.style.color = 'orange';
}

function saveStore(isDropship) {
    getKnownStores(stores => {
        var store = Array.from(stores).find(s => s.name === hostname);
        if (!store) {
            stores.push({ name: hostname, isDropship: isDropship });
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