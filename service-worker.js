const { response, request } = require("express");

const APP_PREFIX = 'Budget-Tracker';
const VERSION = 'version_1';
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
    './Develop/public/css/styles.css',
    './Develop/public/index.html',
    './Develop/public/js/index.js',    
    './Develop/public/js/idb.js',
    './Develop/public/icons'
];

self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function(e) {
            console.log('Installing cache: ' + CACHE_NAME)
            return caches.addAll(FILES_TO_CACHE)
        })
    )
});

self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(keyList) {
            let cacheKeeplist = keyList.filter(function (e) {
                return keyList.indexOf(APP_PREFIX);
            });
            cacheKeeplist.push(CACHE_NAME);

            return Promise.all(
                keyList.map(function(key, i) {
                    if (cacheKeeplist.indexOf(key) === -1) {
                        console.log('deleting cache: ' + keyList[i]);
                        return caches.delete(keyList[i]);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function(e) {
    console.log('fetch request: ' + e.request.url)
    e.respondWith(
        caches.match(e.request).then(function (e) {
            if (request) {
                console.log('responding with cache: ' + e.request.url)
                return request
            } else {
                console.log('file is not cached, fetching: ' + e.request.url)
                return fetch(e.request)
            }
        })
    )
});