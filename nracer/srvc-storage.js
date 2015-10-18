nracer.service("StorageService", function () {
  var StorageService = this;
  
  try {
    localStorage.nracer = 'awesome';
    StorageService.backend = localStorage;
  }
  
  catch (e) {
    StorageService.backend = {};
  }
  
  StorageService.has_key = function (key) {
    var value = StorageService.backend[key];
    if (value) {
      return true;
    }
    
    return false;
  };
  
  StorageService.get = function (key) {
    var value = StorageService.backend[key];
    if (value) {
      return JSON.parse(value);
    }
    
    return undefined;
  };
  
  StorageService.set = function (key, value) {
    StorageService.backend[key] = JSON.stringify(value);
  };
  
  StorageService.remove = function (key) {
    delete StorageService.backend[key];
  };
  
  return StorageService;
});
