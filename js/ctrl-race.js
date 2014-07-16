RaceApp.controller('RaceCtrl', function($scope, $rootScope, $location, $sce) {
  $scope.app_name = $rootScope.manifest.name;
  $scope.version = $rootScope.manifest.version;
  
  $scope.error = '';
  $scope.races = [];
  $scope.racers = [];
  $scope.tracks = 3;
  $scope.recalcs = 0;
  $scope.places = [];
  $scope.scores = [];
  
  $scope.reset_tracker = function () {
    for (var i=0; i < $scope.racers.length; i++) {
      var racer = $scope.racers[i];
      
      for (var j=0; j < $scope.tracks; j++) {
        racer['used_track_' + j] = 0;
      }
    }
  };
  
  $scope.reset_race_counts = function () {
    for (var i=0; i < $scope.racers.length; i++) {
      var racer = $scope.racers[i];
      
      for (var j=0; j < $scope.tracks; j++) {
        racer.races = 0;
        racer.places = {};
      }
    }
  };
  
  $scope.racers_index_list = function (races_per_car) {
    var ret = [];
    
    for (var i=0; i < $scope.racers.length; i++) {
      if ($scope.racers[i].races < races_per_car) {
        ret.push(i);
      }
    }
    
    return ret;
  };
  
  $scope.recalc = function (tracks, racers, count) {
    $scope.error = '';
    $scope.races = [];
    
    if (count) {
      $scope.recalcs += 1;
      if ($scope.recalcs > 100) {
        return null;
      }
    }
    
    else {
      $scope.recalcs = 0;
    }
    
    $scope.calc_races(tracks, racers);
  };
  
  $scope.calc_races = function (tracks, racers) {
    $scope.tracks = tracks;
    $scope.racers = racers;
    $scope.error = '';
    
    var j = 0;
    var k = 0;
    
    if ($scope.racers.length < $scope.tracks) {
      $scope.tracks = $scope.racers.length;
    }
    
    var races_per_car = $scope.tracks;
    if ($scope.tracks == 2) {
      races_per_car = 4;
    }
    
    while (1) {
      if ($scope.racers.length % $scope.tracks === 0) {
        break;
      }
      
      else if (($scope.racers.length % $scope.tracks) * races_per_car === $scope.tracks) {
        break;
      }
      
      $scope.racers.push({name: 'Dummy', vehicle: 'Dummy', dummy: true});
    }
    
    $scope.reset_tracker();
    $scope.reset_race_counts();
    
    for (var i=0; i < 11024; i++) {
      var race = [];
      
      var j_list = $scope.racers_index_list(races_per_car);
      var j_index = random_index(j_list);
      j = j_list[j_index];
      
      //j = 0;
      //var used = 0;
      var proposed_races = [];
      
      for (var x=0; x < 11024; x++) {
        if ($scope.didnt_use_track(j, race.length)) {
          race.push(j);
          //used += 1;
          j_list.splice(j_index, 1);
          
          if (race.length == $scope.tracks) {
            proposed_races.push(race);
            race = [];
          }
          
          //if (used === $scope.racers.length) {
          if (j_list.length === 0) {
            if (race.length > 0) {
              proposed_races.push(race);
            }
            break;
          }
        }
        
        j_index = random_index(j_list);
        j = j_list[j_index];
        
        //j += 1;
        //if (j == $scope.racers.length) {
        //  j = 0;
        //}
        
        if (x === 11023) {
          $scope.error = 'I failed at calculating the races. &#9785; <em>Loop 2</em>';
          $scope.recalc($scope.tracks, $scope.racers, true);
          return null;
        }
      }
      
      for (j in proposed_races) {
        var real = 0;
        for (k=0; k < proposed_races[j].length; k++) {
          var racer = $scope.racers[proposed_races[j][k]];
          if (racer.dummy) {}
          else {
            real += 1;
          }
        }
        
        if (real > 1) {
          $scope.races.push(proposed_races[j]);
          
          for (var t in $scope.races[$scope.races.length - 1]) {
            var r = $scope.races[$scope.races.length - 1][t];
            $scope.racers[r]['used_track_' + t] += 1;
            $scope.racers[r].races += 1;
          }
          
          if ($scope.tracks === 2 && $scope.races.length === 2) {
            $scope.reset_tracker();
          }
        }
      }
      
      if (i === 11023) {
        $scope.error = 'I failed at calculating the races. &#9785; <em>Loop 1</em>';
        
        $scope.recalc($scope.tracks, $scope.racers, true);
        return null;
      }
      
      var do_break = true;
      for (j=0; j < $scope.racers.length; j++) {
        if ($scope.racers[j].races < races_per_car) {
          do_break = false;
          break;
        }
      }
      
      if (do_break) {
        console.log(JSON.stringify($scope.races));
        $scope.initialize_places();
        $scope.show_race(0);
        break;
      }
    }
  };
  
  $scope.show_race = function (index) {
    $('.race').css('display', 'none');
    $('.results').css('display', 'none');
    setTimeout(function () { $('#race-' + index).css('display', 'block'); }, 100);
  };
  
  $scope.initialize_places = function () {
    $scope.places = [];
    var places = ['1st', '2nd', '3rd', '4th', '5th', '6th'];
    
    for (var k=0; k < $scope.tracks; k++) {
      $scope.places.push({name: places[k]});
    }
    
    for (var i=0; i < $scope.racers.length; i++) {
      var racer = $scope.racers[i];
      
      for (var j=0; j < $scope.races.length; j++) {
        racer.places['race' + j] = {value: null};
        //racer.places['race' + j] = {value: $scope.places[0]};
      }
    }
  };
  
  $scope.place_model = function (r, j) {
    return $scope.racers[r].places['race' + j];
  };
  
  $scope.didnt_use_track = function (r, track) {
    var racer = $scope.racers[r];
    if (racer['used_track_' + track] < 2) {
      return true;
    }
    
    return false;
  };
  
  $scope.racer = function (index) {
    return $scope.racers[index];
  };
  
  $scope.show_results = function () {
    $('.race').css('display', 'none');
    $('.results').css('display', 'block');
    
    $scope.scores = [];
    for (var i=0; i < $scope.racers.length; i++) {
      var racer = $scope.racers[i];
      if (racer.dummy) {}
      else {
        var score = {name: racer.name, vehicle: racer.vehicle, score: 0};
        
        for (var j=0; j < $scope.races.length; j++) {
          if (racer.places['race' + j].value) {
            if (racer.places['race' + j].value.name === '1st') {
              score.score += 9;
            }
            
            else if (racer.places['race' + j].value.name === '2nd') {
              score.score += 6;
            }
            
            else if (racer.places['race' + j].value.name === '3rd') {
              score.score += 3;
            }
            
            else if (racer.places['race' + j].value.name === '4th') {
              score.score += 1;
            }
          }
        }
        
        $scope.scores.push(score);
      }
    }
    
    $scope.scores.sort($scope.score_compare);
    var place = 1;
    var last_score = null;
    for (i=0; i < $scope.scores.length; i++) {
      if (last_score !== null && $scope.scores[i].score < last_score) {
        place += 1;
      }
      
      $scope.scores[i].place = place;
      last_score = $scope.scores[i].score;
    }
  };
  
  $scope.score_compare = function (a, b) {
    if (a.score < b.score)
      return 1;
      
    if (a.score > b.score)
      return -1;
      
    return 0;
  };
  
  $scope.run_tests = function (i) {
    $scope.tracks = 4;
    if (i === undefined) {
      i = 2;
    }
    
    $scope.racers = [];
    console.log('Racers: ' + i);
    for (var j=0; j < i; j++) {
      $scope.racers.push({name: 'P' + j, vehicle: 'V' + j});
    }
    
    $scope.recalc($scope.tracks, $scope.racers);
    
    i += 1;
    if (i <= 50) {
      setTimeout(function () { $scope.run_tests(i) }, 50);
    }
  };
  
  if ($rootScope.load_race === 'new') {
    $scope.calc_races($rootScope.new_tracks, $rootScope.new_racers);
  }
});
