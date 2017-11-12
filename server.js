const express = require('express')
const app = express()
app.use(express.static(__dirname + '/public'));
var bodyParser = require('body-parser');
var cors = require('cors')
var sync = require('synchronize')
const http = require('http');
app.use(cors())
var Q = require('q');
const googlemap = require('@google/maps');
const WebSocket = require('ws');

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


var restaurant = ["Hot N Juicy Crawfish, Connecticut Avenue Northwest, Washington, DC", "9th Street Northwest, Washington, DC", "Pearl Dive Oyster Palace, 14th Street Northwest, Washington, DC"];
var supermarket = ["Whole Foods Market, P Street Northwest, Washington, DC", "FRESHFARM Dupont Circle Market, 20th Street Northwest, Washington, DC"];
var home = "The White House, Pennsylvania Avenue Northwest, Washington, DC";
var movie = ["AMC Loews Georgetown 14, K Street Northwest, Washington, DC","Landmark Theaters West End Cinema, M Street Northwest, Washington, DC"];
var hackathon = ""

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


var googleMapsClient = googlemap.createClient({
  key: 'AIzaSyA4B7GQ2Xt6IpYLHlWVMmAj3D-S6_VHbLw',
  Promise: Promise
});

var solution = {};
// var async = require('async');
//
// var square = function (num, doneCallback) {
//   console.log(num * num);
//   // Nothing went wrong, so callback with a null error.
//   return doneCallback(null);
// };
app.get('/test',function(request,response){
  var lst=[]

  var random = Math.floor(Math.random() * (restaurant.length-1))
  lst.push(restaurant[random])
  var random = Math.floor(Math.random() * (supermarket.length-1))
  lst.push(supermarket[random])
  var random = Math.floor(Math.random() * (movie.length-1))
  lst.push(movie[random])


  var ret={"success":true,"type":"locations","home":home,"locations":lst}

  wss.clients.forEach(function each(client) {
      client.send(JSON.stringify(ret));
  });

  response.send(ret)
})


function balabala(rescan,rescur, callback){
  //var deferred = Q.defer();
  var restaurantCandidate = rescan.dest;
  //rescur.send("world");
   for(var j = 0 ; j < supermarket.length; j++){
     var supermarketCandidate = supermarket[j];
     console.log("supermarket");
     console.log(supermarketCandidate);
     googleMapsClient.directions({
         origin: restaurantCandidate,
         destination: supermarketCandidate,
       }).asPromise()
     .then((res) => {
           var possibleSolution = [home, res.query.origin, res.query.destination];
           console.log("solution update");
           //console.log(totalTime);
           console.log(possibleSolution);
           solution[possibleSolution] = rescan.duration + parseInt(res.json.routes[0].legs[0].duration.text);
           if(Object.keys(solution).length == supermarket.length * restaurant.length){
             callback(rescur);
           }else{
             console.log("finish one");
             console.log(Object.keys(solution).length);
             console.log(solution)
           }
       });
     }
     console.log("before resutrn");
     //return deferred.promise;
}

app.get('/test',function(request,response){
  var ret={"success":true,"message":"I am a real hacker"}
  response.send(ret)
})

function identify(category){
  if(category === "restaurant"){
    return restaurant;
  }else if(category === "supermarket"){
    return supermarket;
  }else if(category === "movie"){
    return movie;
  }
}



app.get('/find', function (req, resp) {
  //console.log(req);

  //var dst1 = ""
  var possibleSolution;
  var query = {};
  // var totalTime = 20000000;
  // var items = {};
  // for(var i = 0 ; i < restaurant.length ; i++){
  //   var restaurantCandidate = restaurant[i];
  //   for(var j = 0; j < supermarket.length; j++){
  //     var supermarketCandidate = supermarket[j];
  //     var possibleSolution = [home, restaurantCandidate, supermarketCandidate];
  //     solution[possibleSolution] = 0;
  //   }
  // }
  // async.each(solution, function (sol, callback) {
  //   connection.getFileInfo(result, callback);
  // }, function (err) {
  //   console.log('All done');
  // // });

  // balabala(function(){
  //   console.log("something");
  //   console.log(solution);
  // })
//function(err, response);
  //res.send("hellow");
  var request_ = {'dst1': "restaurant", 'dst2' : "supermarket", 'dst3' : "movie"};
  var level = Object.keys(request_).length;
  var candidates = [];
  for(key in request_){
    candidates.push(identify(request_[key]));
  }
  console.log(candidates);
  var biglist = [];
  biglist.push(home);
  for(var i = 0 ; i < level ; i++){
    for(var j = 0;j < candidates[i].length ; j++){
      biglist.push(candidates[i][j]);
    }
  }
  for(var i = 0 ; i < biglist.length ; i++){
    for(var j = 0 ; j < biglist.length; j++){
      if(i != j && [biglist[i],biglist[j]] in query){

      }
    }
  }

  var allPaths = [];
  var visited = [];
  for (var i = 0; i < level; i++) {
    visited.push(false);
  }
  for(var i = 0 ; i < level; i++){
    var arr1 = candidates[i];
    console.log(arr1);
    for(var j = 0 ; j < arr1.length ; j++){
      for(var i1 = 0 ; i1 < level ; i1++){
        if(i1 !== i){
          var arr2 = candidates[i1];
          for(var k = 0 ; k < arr2.length ; k++){
            for(var i2 = 0 ; i2 < level; i2++){
              if(i !== i2 && i1 !== i2){
                var arr3 = candidates[i2];
                for(var m = 0 ; m < arr3.length ; m++){
                  var solution = [home, arr1[j], arr2[k],arr3[m]];
                  allPaths.push(solution)
                }
              }
            }

          }
        }
      }
    }
  }
  console.log("ALL PATHS");
  console.log(allPaths.length);
  //console.log(allPaths);
  soldict = {};
  allPaths.forEach(function(path){
    //var candidate = allPaths[k];
    var pos0 = path[0];
    var pos1 = path[1];
    var pos2 = path[2];
    var pos3 = path[3];
    //console.log("inside loop1");
    //console.log(pos0);
    ///console.log(pos1);
    var result = googleMapsClient.directions({
        origin: pos0,
        destination: pos1,
      }, function(err, response){
        var rank = k;
        var temp = {
          'dest' : pos2,
          'duration' : parseInt(response.json.routes[0].legs[0].duration.text)
        };
        //console.log("inside loop2");
        var restaurantCandidate1 = response.query.destination;
        //rescur.send("world");
        googleMapsClient.directions({
            origin: pos1,
            destination: pos2,
          }, function(err, response1){
            var temp1 = {
              'dest' : pos2,
              'duration' : parseInt(response1.json.routes[0].legs[0].duration.text)
            };
            //console.log("inside loop3");
            googleMapsClient.directions({
                origin: pos1,
                destination: pos2,
              }, function(err, response1){
                var temp2 = {
                  'dest' : pos2,
                  'duration' : parseInt(response1.json.routes[0].legs[0].duration.text)
                };
                console.log("inside loop4");
                var possibleSolution = pos0 + '#'+pos1+ '#'+pos2+ '#'+pos3;
                soldict[possibleSolution] = temp.duration + temp1.duration + temp2.duration;
                //console.log(possibleSolution);
                console.log(Object.keys(soldict).length);
                if(Object.keys(soldict).length === allPaths.length){
                  //console.log(soldict);
                  console.log("BINGO");
                  var maxcandidate;
                  var duration = 20000000;
                  for(key in soldict){
                    var value = soldict[key];
                    if(value < duration){
                      maxcandidate = key;
                      console.log(maxcandidate.split("#"));
                      duration = value;
                    }
                  }
                  //var sliceresult = (maxcandidate.split("#")).slice(0,1);
                  var locationsarray = maxcandidate.split("#");
                  locationsarray.splice(0,1);
                  //console.log(sliceresult);
                  console.log(locationsarray);
                  var result = {
                    "success":true,
                    "type":"locations",
                    "home":home,
                    "locations": locationsarray,
                    "duration": value

                  }
                  resp.send(result);
                }
              });
          });
      });
  })






  // for(var k = 0 ; k < allPaths.length ; k++){
  //   var candidate = allPaths[k];
  //   var pos0 = candidate[0];
  //   var pos1 = candidate[1];
  //   var pos2 = candidate[2];
  //   var pos3 = candidate[3];
  //   console.log("inside loop1");
  //   var result = googleMapsClient.directions({
  //       origin: pos0,
  //       destination: pos1,
  //     }, function(err, response){
  //       var rank = k;
  //       var temp = {
  //         'dest' : pos2,
  //         'duration' : parseInt(response.json.routes[0].legs[0].duration.text)
  //       };
  //       console.log("inside loop2");
  //       var restaurantCandidate1 = response.query.destination;
  //       //rescur.send("world");
  //       googleMapsClient.directions({
  //           origin: pos1,
  //           destination: pos2,
  //         }, function(err, response1){
  //           var temp1 = {
  //             'dest' : pos2,
  //             'duration' : parseInt(response1.json.routes[0].legs[0].duration.text)
  //           };
  //           console.log("inside loop3");
  //           googleMapsClient.directions({
  //               origin: pos1,
  //               destination: pos2,
  //             }, function(err, response1){
  //               var temp2 = {
  //                 'dest' : pos2,
  //                 'duration' : parseInt(response1.json.routes[0].legs[0].duration.text)
  //               };
  //               console.log("inside loop4");
  //               var possibleSolution = allPaths[rank];
  //               soldict[possibleSolution] = temp.duration + temp1.duration + temp2.duration;
  //               console.log(possibleSolution);
  //               console.log(Object.keys(soldict).length);
  //               if(Object.keys(soldict).length === allPaths.length){
  //                 console.log(soldict);
  //               }
  //             });
  //         });
  //       //  for(var j = 0 ; j < supermarket.length; j++){
  //       //    var supermarketCandidate = supermarket[j];
  //       //    console.log("supermarket");
  //       //    console.log(supermarketCandidate);
  //       //    googleMapsClient.directions({
  //       //        origin: pos2,
  //       //        destination: pos,
  //       //      }, function(err, response1){
  //        //
  //       //            var possibleSolution = [home, response1.query.origin, response1.query.destination];
  //       //            console.log("solution update");
  //       //            //console.log(totalTime);
  //       //            console.log(possibleSolution);
  //       //            solution[possibleSolution] = temp.duration + parseInt(response1.json.routes[0].legs[0].duration.text);
  //       //            if(Object.keys(solution).length == supermarket.length * restaurant.length){
  //       //              console.log("something");
  //       //              console.log(solution);
  //       //              var max = 200000;
  //       //              var candidate;
  //       //              for(key in solution){
  //       //                //console.log("=============================")
  //       //                var value = solution[key];
  //       //              /* use key/value for intended purpose */
  //       //                if(max > value){
  //       //                  max = value;
  //       //                  candidate = key;
  //       //                }
  //       //              }
  //       //              console.log(candidate);
  //       //              console.log("finish");
  //       //              console.log(solution);
  //       //              var answer = {'answer':candidate};
  //       //              resp.send(answer);
  //       //              console.log(answer)
  //       //            }else{
  //       //              console.log("finish one");
  //       //              console.log(Object.keys(solution).length);
  //       //              console.log(solution)
  //       //            }
  //       //      });
  //       //    }
  //     });
  // }





  // for(var i = 0 ; i < restaurant.length ; i++){
  //   var restaurantCandidate = restaurant[i];
  //   var homeToResDuration;
  //   var result = googleMapsClient.directions({
  //       origin: home,
  //       destination: restaurantCandidate,
  //     }, function(err, response){
  //       var temp = {
  //         'dest' : response.query.destination,
  //         'duration' : parseInt(response.json.routes[0].legs[0].duration.text)
  //       };
  //       var restaurantCandidate1 = response.query.destination;
  //       //rescur.send("world");
  //        for(var j = 0 ; j < supermarket.length; j++){
  //          var supermarketCandidate = supermarket[j];
  //          console.log("supermarket");
  //          console.log(supermarketCandidate);
  //          googleMapsClient.directions({
  //              origin: restaurantCandidate1,
  //              destination: supermarketCandidate,
  //            }, function(err, response1){
  //
  //                  var possibleSolution = [home, response1.query.origin, response1.query.destination];
  //                  console.log("solution update");
  //                  //console.log(totalTime);
  //                  console.log(possibleSolution);
  //                  solution[possibleSolution] = temp.duration + parseInt(response1.json.routes[0].legs[0].duration.text);
  //                  if(Object.keys(solution).length == supermarket.length * restaurant.length){
  //                    console.log("something");
  //                    console.log(solution);
  //                    var max = 200000;
  //                    var candidate;
  //                    for(key in solution){
  //                      //console.log("=============================")
  //                      var value = solution[key];
  //                    /* use key/value for intended purpose */
  //                      if(max > value){
  //                        max = value;
  //                        candidate = key;
  //                      }
  //                    }
  //                    console.log(candidate);
  //                    console.log("finish");
  //                    console.log(solution);
  //                    var answer = {'answer':candidate};
  //                    resp.send(answer);
  //                    console.log(answer)
  //                  }else{
  //                    console.log("finish one");
  //                    console.log(Object.keys(solution).length);
  //                    console.log(solution)
  //                  }
  //            });
  //          }
  //     });
  //   }
  // // for(var i = 0 ; i < restaurant.length ; i++){
  // //   var restaurantCandidate = restaurant[i];
  // //   var homeToResDuration;
  // //   var result = googleMapsClient.directions({
  // //       origin: home,
  // //       destination: restaurantCandidate,
  // //     }).asPromise()
  // //   .then((response) => {
  // //     var temp = {
  // //       'dest' : response.query.destination,
  // //       'duration' : parseInt(response.json.routes[0].legs[0].duration.text)
  // //     };
  // //     balabala(temp, res, function(rescur){
  // //       console.log("something");
  // //       console.log(solution);
  // //       var max = 200000;
  // //       var candidate;
  // //       for(key in solution){
  // //         //console.log("=============================")
  // //         var value = solution[key];
  // //       /* use key/value for intended purpose */
  // //         if(max > value){
  // //           max = value;
  // //           candidate = key;
  // //         }
  // //       }
  // //       console.log(candidate);
  // //       console.log("finish");
  // //       var answer = {'answer':candidate}
  // //       res.send("answer");
  // //       console.log(answer)
  // //     });
  // //   })}
  // //
  // //
  // //   res.send("done");
  // //
  // //
  // //
  // //
  // //
  // //
  // // // for(var i = 0 ; i < restaurant.length ; i++){
  // //   var restaurantCandidate = restaurant[i];
  // //   var homeToResDuration;
  // //   var result = googleMapsClient.directions({
  // //       origin: home,
  // //       destination: restaurantCandidate,
  // //     }).asPromise()
  // //   .then((response) => {
  // //
  // //         homeToResDuration = parseInt(response.json.routes[0].legs[0].duration.text);
  // //         console.log(response.json.routes[0].legs[0].duration.text);
  // //         //res.send(response.json);
  // //         console.log(homeToResDuration);
  // //         for(var j = 0 ; j < supermarket.length; j++){
  // //           var supermarketCandidate = supermarket[j];
  // //           console.log("supermarket");
  // //           console.log(supermarketCandidate);
  // //           googleMapsClient.directions({
  // //               origin: restaurantCandidate,
  // //               destination: supermarketCandidate,
  // //             }).asPromise()
  // //           .then((res) => {
  // //                 possibleSolution = [home, restaurantCandidate, supermarketCandidate];
  // //                 console.log("solution update");
  // //                 //console.log(totalTime);
  // //                 console.log(possibleSolution);
  // //                 solution[possibleSolution] = homeToResDuration + parseInt(res.json.routes[0].legs[0].duration.text);
  // //             });
  // //           }
  // //           //response.send(possibleSolution);
  // //     });
  // //
  // for(key in solution){
  //   console.log("=============================")
  //   var value = solution[key];
  // /* use key/value for intended purpose */
  //   console.log(key);
  //   console.log(value);
  // }
  // var res = googleMapsClient.geocode({
  // address: 'Zaytinya, 9th Street Northwest, Washington, DC'
  //   }).asPromise()
  // .then((response) => {
  //   console.log(response.json.results);
  // });
  //   console.log(res.finally);
  //   // googleMapsClient.placesNearby({
    //   language: 'en',
    //   location: [38.899928, -77.047187],
    //   radius: 500,
    //   minprice: 1,
    //   maxprice: 4,
    //   opennow: true,
    //   type: 'restaurant'
    // }, function(err, response) {
    //   if (!err) {
    //     for(var i = 0; i < response.json.results.length ; i++){
    //       console.log(response.json.results[i]);
    //     }
    //     //console.log(response.json.results);
    //     res.send(response.json);
    //   }
    // })
  // googleMapsClient.directions({
  //     origin: home,
  //     destination: dst1,
  //   }, function(err, response) {
  //     if (!err) {
  //       console.log(response.json.routes[0].legs[0].duration.text);
  //       res.send(response.json);
  //     }
  //   });
  //res.send("hello")
});
// app.get('/get_usage',function(request,response){
//  var ret={"success":false,"message":""}
//  // client.query("select * from printingtable",function(err,res){
//  //  if(err){
//  //   ret.message=err;
//  //   response.send(ret)
//  //  }
//  //  else{
//  //   ret.success=true;
//  //   ret.message=res.rows;
//  //   response.send(ret)
//  //
//  //  }
//  //
//  //
//  // })
//
// })

app.post('/query', function(request, resp){
  console.log(request.query);
  var soldict = {};
  var allPaths = [];
  if(request.query.locations.length === 3){

    var request_ = {'dst1': request.query.locations[0], 'dst2' : request.query.locations[1], 'dst3' : request.query.locations[2]};
    var level = Object.keys(request_).length;
    var candidates = [];
    for(key in request_){
      candidates.push(identify(request_[key]));
    }

    var visited = [];
    for (var i = 0; i < level; i++) {
      visited.push(false);
    }
    for(var i = 0 ; i < level; i++){
      var arr1 = candidates[i];
      console.log(arr1);
      for(var j = 0 ; j < arr1.length ; j++){
        for(var i1 = 0 ; i1 < level ; i1++){
          if(i1 !== i){
            var arr2 = candidates[i1];
            for(var k = 0 ; k < arr2.length ; k++){
              for(var i2 = 0 ; i2 < level; i2++){
                if(i !== i2 && i1 !== i2){
                  var arr3 = candidates[i2];
                  for(var m = 0 ; m < arr3.length ; m++){
                    var solution = [home, arr1[j], arr2[k],arr3[m]];
                    allPaths.push(solution)
                  }
                }
              }

            }
          }
        }
      }
    }
    console.log("ALL PATHS");
    console.log(allPaths.length);
    //console.log(allPaths);

    allPaths.forEach(function(path){
      //var candidate = allPaths[k];
      var pos0 = path[0];
      var pos1 = path[1];
      var pos2 = path[2];
      var pos3 = path[3];
      //console.log("inside loop1");
      //console.log(pos0);
      ///console.log(pos1);
      var result = googleMapsClient.directions({
          origin: pos0,
          destination: pos1,
        }, function(err, response){
          var rank = k;
          var temp = {
            'dest' : pos2,
            'duration' : parseInt(response.json.routes[0].legs[0].duration.text)
          };
          //console.log("inside loop2");
          var restaurantCandidate1 = response.query.destination;
          //rescur.send("world");
          googleMapsClient.directions({
              origin: pos1,
              destination: pos2,
            }, function(err, response1){
              var temp1 = {
                'dest' : pos2,
                'duration' : parseInt(response1.json.routes[0].legs[0].duration.text)
              };
              //console.log("inside loop3");
              googleMapsClient.directions({
                  origin: pos1,
                  destination: pos2,
                }, function(err, response1){
                  var temp2 = {
                    'dest' : pos2,
                    'duration' : parseInt(response1.json.routes[0].legs[0].duration.text)
                  };
                  console.log("inside loop4");
                  var possibleSolution = pos0 + '#'+pos1+ '#'+pos2+ '#'+pos3;
                  soldict[possibleSolution] = temp.duration + temp1.duration + temp2.duration;
                  //console.log(possibleSolution);
                  console.log(Object.keys(soldict).length);
                  if(Object.keys(soldict).length === allPaths.length/3){
                    //console.log(soldict);
                    console.log("BINGO");
                    var maxcandidate;
                    var duration = 20000000;
                    for(key in soldict){
                      var value = soldict[key];
                      if(value < duration){
                        maxcandidate = key;
                        console.log(maxcandidate.split("#"));
                        duration = value;
                      }
                    }
                    //var sliceresult = (maxcandidate.split("#")).slice(0,1);
                    var locationsarray = maxcandidate.split("#");
                    locationsarray.splice(0,1);
                    //console.log(sliceresult);
                    console.log(locationsarray);
                    var result = {
                      "success":true,
                      "type":"locations",
                      "home":home,
                      "locations": locationsarray,
                      "duration": value

                    }
                    wss.clients.forEach(function each(client) {
                        client.send(JSON.stringify(result));
                    });
                    resp.send(result);
                  }
                });
            });
        });
    })
  }else if(request.query.locations.length === 2){
    var request_ = {'dst1': request.query.locations[0], 'dst2' : request.query.locations[1]};
    var level = Object.keys(request_).length;
    var candidates = [];
    for(key in request_){
      candidates.push(identify(request_[key]));
    }
    var allPaths = [];
    for(var i = 0 ; i < level; i++){
      var arr1 = candidates[i];
      //console.log(arr1);
      for(var j = 0 ; j < arr1.length ; j++){
        for(var i1 = 0 ; i1 < level ; i1++){
          if(i1 !== i){
            var arr2 = candidates[i1];
            for(var k = 0 ; k < arr2.length ; k++){
              var solution = [home, arr1[j], arr2[k]];
              allPaths.push(solution);
            }
          }
        }
      }
    }
    console.log("ALL PATHS");
    console.log(allPaths.length);
    //console.log(allPaths);
    soldict = {};
    allPaths.forEach(function(path){
      //var candidate = allPaths[k];
      var pos0 = path[0];
      var pos1 = path[1];
      var pos2 = path[2];
      //console.log("inside loop1");
      //console.log(pos0);
      ///console.log(pos1);
      var result = googleMapsClient.directions({
          origin: pos0,
          destination: pos1,
        }, function(err, response){
          var rank = k;
          var temp = {
            'dest' : pos2,
            'duration' : parseInt(response.json.routes[0].legs[0].duration.text)
          };
          //console.log("inside loop2");
          var restaurantCandidate1 = response.query.destination;
          //rescur.send("world");
          googleMapsClient.directions({
              origin: pos1,
              destination: pos2,
            }, function(err, response1){
              var temp1 = {
                'dest' : pos2,
                'duration' : parseInt(response1.json.routes[0].legs[0].duration.text)
              };
              //console.log("inside loop3");
              var possibleSolution = pos0 + '#'+pos1+ '#'+pos2;
              soldict[possibleSolution] = temp.duration + temp1.duration;
              //console.log(possibleSolution);
              console.log(Object.keys(soldict).length);
              if(Object.keys(soldict).length === allPaths.length){
                //console.log(soldict);
                console.log("BINGO");
                var maxcandidate;
                var duration = 20000000;
                for(key in soldict){
                  var value = soldict[key];
                  if(value < duration){
                    maxcandidate = key;
                    console.log(maxcandidate.split("#"));
                    duration = value;
                  }
                }
                //var sliceresult = (maxcandidate.split("#")).slice(0,1);
                var locationsarray = maxcandidate.split("#");
                locationsarray.splice(0,1);
                //console.log(sliceresult);
                console.log(locationsarray);
                var result = {
                  "success":true,
                  "type":"locations",
                  "home": home,
                  "locations": locationsarray,
                  "duration": value

                }
                resp.send(result);
              }
            });
        });
      });
  }else if(request.query.locations.length === 1){

  }

});

app.post('/update_usage',function(request,response){
   // console.log(request.body);      // your JSON
   const results = [];
   var ret={"success":false,"message":""}
   if(!request || !request.body){
    ret.message="unknown err";
    response.send(ret);
    return;
   }
   var username=request.body.username;
   var usage=request.body.usage;
   if(!username || !usage || username=="" ||usage==""){
    ret.message="invalid json";
    response.send(ret);
    return;
   }
   var totalTime = 20000000;
   for(var i = 0 ; i < restaurant.length ; i++){
     var restaurantCandidate = restaurant[i];
     var homeToResDuration;
     googleMapsClient.directions({
         origin: home,
         destination: restaurantCandidate,
       }, function(err, response) {
         if (!err) {
           homeToResDuration = parseInt(response.json.routes[0].legs[0].duration.text);
           console.log(response.json.routes[0].legs[0].duration.text);
           //res.send(response.json);
           console.log(homeToResDuration)
         }
       });
     for(var j = 0 ; j < supermarket.length; j++){

     }
   }
 })


wss.on('connection', function connection(ws, req) {
  // You might use location.query.access_token to authenticate or share sessions
  // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  // ws.on('message', function incoming(message) {
  //   console.log('received: %s', message);
  // });

});
server.listen(7000, function listening() {
  console.log('Listening on %d', server.address().port);
});

// curl -d '{"username":"frank009","usage":3}' -H "Content-Type: application/json" http://10.108.62.232:7000/update_usage
