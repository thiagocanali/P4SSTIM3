import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({plugins:[react(), {
  name: 'arcade-offline',
  apply: 'build',
  enforce: 'post',
  generateBundle(_options, bundle) {
    const assets = ['/index.html', '/favicon.svg', '/manifest.webmanifest', ...Object.keys(bundle).filter(name => name.startsWith('assets/')).map(name => '/' + name)];
    const cache = 'p4-offline-' + Object.keys(bundle).filter(name => name.startsWith('assets/')).sort().join('|');
    this.emitFile({type:'asset',fileName:'sw.js',source:`
const CACHE = ${JSON.stringify(cache)};
const ASSETS = ${JSON.stringify(assets)};
const absolute = path => new URL(path, self.location.origin).href;
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS.map(absolute))));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('p4-offline-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(caches.open(CACHE).then(cache => cache.match('/index.html')).then(response => response || fetch(request)));
  } else if (ASSETS.includes(new URL(request.url).pathname)) {
    event.respondWith(caches.open(CACHE).then(cache => cache.match(new URL(request.url).pathname)).then(response => response || fetch(request)));
  }
});
`});
  }
}]});
