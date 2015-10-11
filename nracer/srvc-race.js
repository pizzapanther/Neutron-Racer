nracer.service("RaceService", function (StorageService) {
  var RaceService = this;
  
  RaceService.races = StorageService.get('races') || {};
  
  RaceService.new_race = function () {
    var d = new Date();
    
    while (1) {
      var key = 'Race' + Date.now();
      
      if (!RaceService.races[key]) {
        RaceService.races[key] = {
          date: d.toLocaleString(),
          name: '',
          lanes: 2,
          completed: false,
          heats: [],
          racers: [{}, {}],
          results: []
        };
        
        RaceService.save();
        return key;
      }
    }
  };
  
  RaceService.save = function () {
    StorageService.set('races', RaceService.races);
  };
  
  RaceService.remove = function (key) {
    delete RaceService.races[key];
    RaceService.save();
  };
  
  return RaceService;
});
