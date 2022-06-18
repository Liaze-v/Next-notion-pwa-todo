const PREFIX = 'V1';
const assets = ["/", "/index.html"];


self.addEventListener('install', () => {
  self.skipWaiting();
  event.waitUntil((async() => {
    const cache = await caches.open(PREFIX);
    await Promise.all(
      [assets].map((path)=>{
      return cache.add(new Request(path));
    }));
  })()
  );
})
self.addEventListener('active', (event) => {
  clients.claim();
  event.waitUntil((async() => {
    const keys = await caches.keys();
    await Promise.all(
      keys.map((key)=>{
        if(!key.includes(PREFIX)){
          return caches.delete(key)
        }
      })
    );
  })())
})



self.addEventListener("fetch", (event) => {
  if(event.request.mode === 'navigate'){
    event.respondWith(
      (async () => {
        try{
        const preloadResponse =  await event.preloadResponse
        if(preloadResponse){
          return preloadResponse
        }

        return await fetch(event.request)
      } catch(e){

        return new Response('Bonjour les gens');
      }
    })())
  }else if (assets.includes(event.request.url)){
    event.respondWith(caches.match(event.request));
  }

});