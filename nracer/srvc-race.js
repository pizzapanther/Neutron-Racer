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
    for (var l=0; l < race.lanes; l++) {
      for (var r1=0; r1 < race.racers.length; r1 = r1 + 2) {
        var r2 = r1 + 1;
        var heat = [{racer: r1}, {racer: r2}];
        race.heats.push(heat);
      }
    }
    
    race.calculated = true;
    
    RaceService.save();
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
          race.racers[racer].score += heat[i].points;
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
