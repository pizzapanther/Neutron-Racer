nracer.service("RotationService", function () {
  var RotationService = this;
  
  RotationService.max_loops = parseInt((1024 * 1024) / 4);
  
  RotationService.calc_heats = function (race) {
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
    
    if (race.lanes == 2) {
      for (var a=1; a < 4; a++) {
        var ret = RotationService.calc_heats_2(race, racers, race.racers, a);
        if (ret != 'fail') {
          return RotationService.log_heats(ret);
        }
      }
    }
    
    return RotationService.log_heats(
      RotationService.calc_heats_plus(race, racers));
  };
  
  RotationService.log_heats = function (heats) {
    heats.forEach(function (element, index, array) {
      console.debug(JSON.stringify(element));
    });
    
    return heats;
  };
  
  RotationService.calc_heats_2 = function (race, racers, no_ghosts, attempt) {
    var heats = [];
    var ghost_heats = [];
    var groups = 2;
    
    if (no_ghosts.length > 4) {
      groups = Math.floor(no_ghosts.length / 2);
      
      if (no_ghosts.length % 2 == 1) {
        groups = groups + attempt;
      }
    }
    
    else if (no_ghosts.length == 3) {
      groups = 4;
    }
    
    for (var l=0; l < groups; l++) {
      var heat = [];
      
      for (var r=0; r < racers.length; r++) {
        heat.push({racer: racers[r].i, ghost: racers[r].ghost || false});
        
        if (heat.length == 2) {
          ghost_heats.push(heat);
          heat = [];
        }
      }
      
      RotationService.shift_racers(racers);
    }
    
    if (no_ghosts.length % 2 == 1) {
      var fill = null;
      var skip = [];
      
      for (var g=0; g < ghost_heats.length; g++) {
        for (var c=0; c < ghost_heats[g].length; c++) {
          if (ghost_heats[g][c].ghost) {
            if (fill) {
              ghost_heats[g][c] = fill;
              fill = null;
            }
            
            else {
              skip.push(g);
              if (c === 0) {
                fill = ghost_heats[g][1];
              }
              
              else {
                fill = ghost_heats[g][0];
              }
            }
          }
        }
      }
      
      for (g=0; g < ghost_heats.length; g++) {
        if (skip.indexOf(g) == -1) {
          heats.push(ghost_heats[g]);
        }
      }
    }
    
    else {
      heats = ghost_heats;
    }
    
    var counts = {};
    heats.forEach(function (element, index, array) {
      for (var e=0; e < element.length; e++) {
        if (counts[element[e].racer]) {
          counts[element[e].racer]++;
        }
        
        else {
          counts[element[e].racer] = 1;
        }
      }
    });
    
    var dataArray = [];
    for (var o in counts) {
      dataArray.push(counts[o]);
    }
    console.debug(JSON.stringify(dataArray));
    
    function isEqual (element, index, array) {
      var prev = index - 1;
      if (prev < 0) {
        prev = array.length - 1;
      }
      
      return element == array[prev];
    }
    
    if (!dataArray.every(isEqual)) {
      return 'fail';
    }
    
    if (counts['0'] > 2) {
      var ret = RotationService.mix_heats(racers.length, heats);
      if (ret == 'fail') {
        return ret;
      }
      
      RotationService.alt_2_lanes(heats);
    }
    
    else {
      var keys = [];
      for (var h=0; h < heats.length; h++) {
        keys.push(String(heats[h][0].racer) + String(heats[h][1].racer));
      }
      
      console.debug(keys);
    }
    
    return heats;
  };
  
  RotationService.alt_2_lanes = function (heats) {
    var keys = [];
    
    for (var h=0; h < heats.length; h++) {
      var key = String(heats[h][0].racer) + String(heats[h][1].racer);
      
      if (keys.indexOf(key) > -1) {
        var temp0 = heats[h][0];
        var temp1 = heats[h][1];
        
        heats[h][0] = temp1;
        heats[h][1] = temp0;
        
        key = String(heats[h][0].racer) + String(heats[h][1].racer);
      }
      
      keys.push(key);
    }
    
    console.debug(keys);
  };
  
  RotationService.calc_heats_plus = function (race, racers) {
    var heats = [];
    
    for (var l=0; l < race.lanes; l++) {
      var heat = [];
      
      for (var r=0; r < racers.length; r++) {
        heat.push({racer: racers[r].i, ghost: racers[r].ghost || false});
        
        if (heat.length == race.lanes) {
          heats.push(heat);
          heat = [];
        }
      }
      
      RotationService.shift_racers(racers);
    }
    
    var ret = RotationService.mix_heats(racers.length, heats);
    if (ret == 'fail') {
      return ret;
    }
    
    return heats;
  };
  
  RotationService.mix_heats = function (num_racers, heats) {
    RotationService.increment_heats(heats);
    
    for (var i=0; i <= RotationService.max_loops; i++) {
      if (RotationService.valid_heats(heats)) {
        break;
      }
      
      if (i == RotationService.max_loops) {
        return 'fail';
      }
      
      console.debug("Mix Loop");
      for (var l=1; l < heats[0].length; l++) {
        RotationService.random_mix(l, heats);
      }
    }
    
    return 'success';
  };
  
  RotationService.random_mix = function (lane, heats) {
    var racers = [];
    for (var h=0; h < heats.length; h++) {
      racers.push(heats[h][lane]);
    }
    
    racers = RotationService.shuffle_array(racers);
    
    for (var r=0; r < racers.length; r++) {
      heats[r][lane] = racers[r];
    }
  };
  
  RotationService.shuffle_array = function (array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    
    return array;
  };
  
  RotationService.valid_heats = function (heats) {
    for (var h=0; h < heats.length; h++) {
      var heat = heats[h];
      var racers = [];
      var ghosts = 0;
      
      for (var l=0; l < heat.length; l++) {
        if (racers.indexOf(heat[l].racer) > -1) {
          return false;
        }
        
        if (heat[l].ghost) {
          ghosts++;
        }
        
        racers.push(heat[l].racer);
      }
      
      if (racers.length == 3 && ghosts >= 2) {
        return false;
      }
      
      else if (racers.length == 4 && ghosts >= 2) {
        return false;
      }
      
      else if (racers.length == 5 && ghosts >= 3) {
        return false;
      }
      
      else if (racers.length == 6 && ghosts >= 4) {
        return false;
      }
    }
    
    return true;
  };
  
  RotationService.increment_heats = function (heats) {
    var orig = angular.copy(heats);
    for (var i=1; i < orig[0].length; i = i + 2) {
      for (var h=0; h < orig.length; h++) {
        var next = h + 1;
        if (next < orig.length) {
          heats[next][i] = orig[h][i];
        }
        
        else {
          heats[0][i] = orig[h][i];
        }
      }
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
