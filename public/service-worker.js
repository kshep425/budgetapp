var CACHE_NAME = "my-site-cache-v1";
var urlsToCache = [
    "/index.html",
    // "/assets/css/all.css",
    // "/assets/css/style.css",
    // "/assets/images/B-icon.png",
    // "/assets/images/BudgetApp.png",
    // "/assets/images/favicon.ico",
    // "/assets/js/index.js",
    // "/api/get_expenses",
    // "/api/add_expense"
];
self.addEventListener("install", function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log("Opened cache");
                return cache.addAll(urlsToCache);
            })
            .catch((err)=>{
                console.log(err);
            })
    );
});
self.addEventListener("fetch", function (event) {
    event.respondWith(
        fetch(event.request).catch(function () {
            return caches.match(event.request).then(function (response) {
                if (response) {
                    return response;
                } else if (event.request.headers.get("accept").includes("text/html")) {
                    return caches.match("/index.html");
                }
            });
        })
    );
});
