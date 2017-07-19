let resourceCache = {};
let loading = [];
let readyCallbacks = [];

// Load an image url or an array of image urls
export const load = (urlOrArr) => {
    if (urlOrArr instanceof Array) {
        urlOrArr.forEach(function(url) {
            _load(url);
        });
    }
    else {
        _load(urlOrArr);
    }
}

const _load = (url) => {
    if (resourceCache[url]) {
        return resourceCache[url];
    }
    else {
        var img = new Image();
        img.onload = function() {
            resourceCache[url] = img;

            if(isReady()) {
                readyCallbacks.forEach(function(func) { func(); });
            }
        };
        resourceCache[url] = false;
        img.src = url;
    }
}

export const get = (url) => {
    return resourceCache[url];
}

export const isReady = () => {
    var ready = true;
    for(var k in resourceCache) {
        if(resourceCache.hasOwnProperty(k) &&
           !resourceCache[k]) {
            ready = false;
        }
    }
    return ready;
}

export const onReady = (func) => {
    readyCallbacks.push(func);
}

window.resources = {
    load: load,
    get: get,
    onReady: onReady,
    isReady: isReady
};