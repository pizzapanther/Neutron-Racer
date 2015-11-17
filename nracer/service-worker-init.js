var chrome_app = false;

if (window.chrome && window.chrome.runtime && window.chrome.runtime.getManifest) {
  chrome_app = true;
}

if ('serviceWorker' in navigator && !chrome_app) {
  navigator.serviceWorker.register('/service-worker.js')
  
  .then(function (registration) {
    console.log('ServiceWorker Success: ',    registration.scope);
  })
  
  .catch (function(err) {
    console.log('ServiceWorker registration failed: ', err);
  });
}
