nracer.service("RotationService", function () {
  var RotationService = this;
  
  RotationService.old = function () {
    for (var l=0; l < race.lanes; l++) {
      for (var r1=0; r1 < race.racers.length; r1 = r1 + 2) {
        var r2 = r1 + 1;
        var heat = [{racer: r1}, {racer: r2}];
        race.heats.push(heat);
      }
    }
  };
  
  RotationService.calc_heats = function (race) {
    var heats = [];
    var racers = angular.copy(race.racers);
    
    var remainder = racers.length % race.lanes;
    var empty_spots = racers.length - remainder;
    
    while (1) {
      var e = racers.length % race.lanes;
      if (e === 0) {
        break;
      }
      
      else {
        racers.push({ghost: true});
      }
    }
    
    for (var i=0; i < racers.length; i++) {
      racers[i].i = i;
    }
    
    for (var l=0; l < race.lanes; l++) {
      var heat = [];
      
      for (var r=0; r < racers.length; r++) {
        heat.push({racer: racers[r].i});
        
        if (heat.length == race.lanes) {
          heats.push(heat);
          heat = [];
        }
      }
      
      RotationService.shift_racers(racers);
    }
    
    heats.forEach(function (element, index, array) {
      console.log(JSON.stringify(element));
    });
    
    if (race.lanes != 2) {
      console.log('mixing');
      RotationService.mix_heats(heats);
    }
    
    heats.forEach(function (element, index, array) {
      console.log(JSON.stringify(element));
    });
    
    return heats;
  };
  
  RotationService.mix_heats = function (heats) {
    var orig = angular.copy(heats);
    for (var i=1; i < orig[0].length; i = i + 2) {
      console.log('mix', i);
      for (var h=0; h < orig.length; h++) {
        var next = h + 1;
        if (next < orig.length) {
          heats[next][i] = orig[h][i];
        }
        
        else {
          heats[0][i] = orig[h][i];
        }
      }
      
      //todo: remove race against self
    }
  };
  
  RotationService.shift_racers = function (racers) {
    racers.unshift(racers[racers.length - 1]);
    racers.pop();
  };
  
  RotationService.test = function (lanes, racers_num) {
    var race = {lanes: lanes, racers: []};
    
    for (var i=0; i < racers_num; i++) {
      num = i + 1;
      race.racers.push({num: 100 + num, name: 'Racer ' + num});
    }
    
    RotationService.calc_heats(race);
  };
  
  return RotationService;
});
