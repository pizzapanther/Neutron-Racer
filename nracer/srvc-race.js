nracer.service("RaceService", function ($q, $timeout, StorageService, RotationService) {
  var RaceService = this;
  
  StorageService.get('races').then(function (races) {
    RaceService.races = races || {};
  });
  
  RaceService.ready = function (deferred) {
    deferred = deferred || $q.defer();
    
    if (RaceService.races) {
      deferred.resolve();
    }
    
    else {
      $timeout(function () {
        RaceService.ready(deferred);
      }, 10);
    }
    
    return deferred.promise;
  };
  
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
          calculated: false,
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
  
  RaceService.get_race = function (key) {
    return RaceService.races[key];
  };
  
  RaceService.calc_heats = function (race) {
    var ret = RotationService.calc_heats(race);
    
    if (ret == 'fail') {
      return 'fail';
    }
    
    race.heats = ret;
    race.calculated = true;
    
    RaceService.save();
    return 'success';
  };
  
  RaceService.calc_scores = function (race) {
    var completed_heats = 0;
    
    for (var r=0; r < race.racers.length; r++) {
      race.racers[r].score = 0;
    }
    
    for (var h=0; h < race.heats.length; h++) {
      var heat = race.heats[h];
      var scored = false;
      
      for (var i=0; i < heat.length; i++) {
        if (heat[i].points) {
          scored = true;
          var racer = heat[i].racer;
          if (race.racers[racer]) {
            race.racers[racer].score += heat[i].points;
          }
        }
      }
      
      if (scored) {
        completed_heats += 1;
      }
    }
    
    return completed_heats == race.heats.length;
  };
  
  
  return RaceService;
});
