const ASSETS_CACHE_NAME = 'assets'

// (1) On recense l'ensemble des assets
// dans une variable.
const assetsList = [
  "/"
];

// (2) Méthode permettant de mettre en
// cache un asset s'il n'est pas déjà
// en cache
const cacheAsset = (url) => {
  // On travaille dans le cache dédié aux
  // assets
  return caches.open(ASSETS_CACHE_NAME)
    .then(cache => {
      const request = new Request(url);

      // On regarde si l'asset est déjà
      // en cache (ex: déjà utilisé
      // dans le précédent Service Worker)
      return cache.match(request)
        .then(response => {
          if (!response) {
            // Si pas de cache existant
            // on récupère l'asset
            return fetch(request)
              .then(
                response => {
                  // Et on le met en cache
                  return cache.put(
                    request,
                    response.clone()
                  )
                }
              )
          }
        })
    })
}

self.addEventListener("install", event => {
  // (2) On considère qu'un Service Worker est
  // installé une fois que tous les assets
  // ont été mis en cache
  event.waitUntil(
    Promise.all(
      assetsList.map(url => cacheAsset(url))
    )
  )
});

// (3) Méthode permettant de retirer du
// cache tous les assets qui ne sont plus
// utilisés
const removeUnusedAssets = () => {
  return caches.open(ASSETS_CACHE_NAME)
    .then(cache => {
      // On récupère toutes les requêtes
      // stockées dans le cache
      return cache.keys().then(requests => {
        // On ne veut retirer que les
        // requêtes qui ne sont plus
        // dans `assetsList`
        const unusedRequests = requests
          .filter(request => {
            const requestUrl = new URL(request.url)
            return assetsList.indexOf(requestUrl.pathname) === -1
          })

        // Et on retire ces requêtes
        // une par une
        return Promise.all(
          unusedRequests
            .map(request => {
              return cache.delete(
                request
              )
            })
        )
      })
    })
}

self.addEventListener("activate", event => {
  // (3) Une fois qu'un Service Worker est
  // utilisé il faut penser à nettoyer le
  // cache pour qu'il ne grossisse pas
  // indéfiniment
  event.waitUntil(
    removeUnusedAssets()
  )
});