nracer.service("StorageService", function ($q) {
  var StorageService = this;
  
  StorageService.backend = null;
  StorageService.async_backend = null;
  
  try {
    StorageService.async_backend = chrome.storage.sync;
  }
  
  catch (e) {
    try {
      localStorage.nracer = 'awesome';
      StorageService.backend = localStorage;
    }
    
    catch (e) {
      StorageService.backend = {};
    }
  }
  
  StorageService.get_storage = function (key) {
    var deferred = $q.defer();
    if (StorageService.async_backend) {
      StorageService.async_backend.get(key, function (obj) {
        if (obj) {
          deferred.resolve(obj);
        }
        
        else {
          deferred.resolve({});
        }
      });
    }
    
    else {
      deferred.resolve(StorageService.backend);
    }
    
    return deferred.promise;
  };
  
  StorageService.has_key = function (key) {
    var deferred = $q.defer();
    
    StorageService.get_storage(key).then(function (storage) {
      var value = storage[key];
      
      if (value) {
        deferred.resolve(true);
      }
      
      else {
        deferred.resolve(false);
      }
    });
    
    return deferred.promise;
  };
  
  StorageService.get = function (key) {
    var deferred = $q.defer();
    StorageService.get_storage(key).then(function (storage) {
      var value = storage[key];
      
      if (value) {
        deferred.resolve(JSON.parse(value));
      }
      
      else {
        deferred.resolve(undefined);
      }
    });
    
    return deferred.promise;
  };
  
  StorageService.set = function (key, value) {
    if (StorageService.async_backend) {
      var data = {};
      data[key] = JSON.stringify(value);
      StorageService.async_backend.set(data, function () { });
    }
    
    else {
      StorageService.backend[key] = JSON.stringify(value);
    }
  };
  
  StorageService.remove = function (key) {
    if (StorageService.async_backend) {
      StorageService.async_backend.remove(key, function () { });
    }
    
    else {
      delete StorageService.backend[key];
    }
  };
  
  return StorageService;
});
