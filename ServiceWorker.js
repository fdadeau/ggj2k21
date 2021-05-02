"use strict";

/** 
    Source: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers
*/

// variable definitions 
var CACHE_NAME = 'appCache-v3';

var contentToCache = [
  './index.html',    
  './manifest.json',    
  './style.css', 
  './assets/logoGGJ.png', 
  './assets/title.png', 
  './assets/titreV2.png', 
  './icons/icon-72.png',
  './icons/icon-96.png',
  './icons/icon-120.png',
  './icons/icon-128.png',
  './icons/icon-144.png',
  './icons/icon-152.png',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-384.png',
  './icons/icon-512.png',
  './icons/icon-maskable.png',
  // assets
  './assets/dead.png',
  './assets/the-mapV5.jpg',
  './assets/marcheimperiale.png',
  './assets/tete.png',
  './assets/icon-thought.png',
  './assets/icon-play.png',
  './assets/icon-pick.png',
  './assets/icon-door.png',
  './assets/lampe2.png',
  './assets/photo1.png',
  './assets/photo2.png',
  './assets/photo3.png',
  './assets/photo4.png',
  './assets/zodiac-spritesheet.png',
  './guitar/assets/guitar-neck-v3.webp',
  './rat/assets/chiffres-sourpent.png',
  './rat/assets/deplacementssourpent.png',
  // mp3
  './guitar/assets/short-circuit.mp3',
  './guitar/notes/regulars/A3.mp3',
  './guitar/notes/regulars/A4.mp3',
  './guitar/notes/regulars/C3.mp3',
  './guitar/notes/regulars/C4.mp3',
  './guitar/notes/regulars/D3.mp3',
  './guitar/notes/regulars/D4.mp3',
  './guitar/notes/regulars/E3.mp3',
  './guitar/notes/regulars/E4.mp3',
  './guitar/notes/regulars/G3.mp3',
  './guitar/notes/regulars/G4.mp3',
  './radio/assets/noise.mp3',
  './radio/assets/1.mp3',
  './radio/assets/2.mp3',
  './radio/assets/3.mp3',
  './radio/assets/4.mp3',
  './radio/assets/red.mp3',
  './radio/assets/blue.mp3',
  './radio/assets/green.mp3',
  './radio/assets/yellow.mp3',
  './radio/assets/repeating.mp3',
  './lock/assets/alarm.mp3',
  // css
  './guitar/guitar.css',
  './water/water.css',
  './telescope/telescope.css',
  './radio/radio.css',
  './rat/rat.css',
  './lock/lock.css',
  './linky/linky.css',
  './detail/detail.css',
  './cistercian/cistercian.css',
  './zodiac/zodiac.css',
  './lockF/lockF.css',
  './lockZ/lockZ.css',
  './gobelet/gobelet.css',
  './nes/nes.css',
  // scripts
  './js/Character.js',
  './js/Game.js',
  './js/app.js',
  './guitar/guitar.js',
  './water/water.js',
  './telescope/telescope.js',
  './radio/radio.js',
  './rat/rat.js',
  './lock/lock.js',
  './linky/linky.js',
  './detail/detail.js',
  './cistercian/cistercian.js',
  './zodiac/zodiac.js',
  './lockF/lockF.js',
  './lockZ/lockZ.js',
  './gobelet/gobelet.js',
  './nes/nes.js',
  './js/soundjs.min.js'
];


// service worker installation
self.addEventListener('install', function(e) {
    console.log('[Service Worker] Install');
    e.waitUntil(caches.open(CACHE_NAME).then(function(cache) {
        console.log('[Service Worker] Caching application content & data');
        return cache.addAll(contentToCache);
    }));
});


// fecthing data
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

                      
self.addEventListener('activate', (e) => {
    e.waitUntil(
        // cleaning previous caches
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if(CACHE_NAME.indexOf(key) === -1) {
                    console.log("[Service Worker] Cleaning old cache");
                    return caches.delete(key);
                }
          }));
        })
    );
});