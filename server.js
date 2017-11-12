const express = require('express')
const app = express()
app.use(express.static(__dirname + '/public'));
var bodyParser = require('body-parser');
var cors = require('cors')
var sync = require('synchronize')
app.use(cors())
var Q = require('q');
const googlemap = require('@google/maps');

var restaurant = ["Hot N Juicy Crawfish, Connecticut Avenue Northwest, Washington, DC", "9th Street Northwest, Washington, DC", "Pearl Dive Oyster Palace, 14th Street Northwest, Washington, DC"];
var supermarket = ["Whole Foods Market, P Street Northwest, Washington, DC", "FRESHFARM Dupont Circle Market, 20th Street Northwest, Washington, DC"];
var home = "4115 Postgate Terrace, Aspen Hill, MD 20906";
var movie = ["AMC Loews Georgetown 14, K Street Northwest, Washington, DC","Landmark Theaters West End Cinema, M Street Northwest, Washington, DC"];
var hackathon = ""

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var googleMapsClient = googlemap.createClient({
  key: 'AIzaSyAG1sewpsgHrqBdghrvHBxkaGCse0QBLd4',
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
  var ret={"success":true,"message":"I am a real hacker"}
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


app.get('/find', function (req, resp) {
  //console.log(req);

  //var dst1 = ""
  var possibleSolution;
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
  for(var i = 0 ; i < restaurant.length ; i++){
    var restaurantCandidate = restaurant[i];
    var homeToResDuration;
    var result = googleMapsClient.directions({
        origin: home,
        destination: restaurantCandidate,
      }, function(err, response){
        var temp = {
          'dest' : response.query.destination,
          'duration' : parseInt(response.json.routes[0].legs[0].duration.text)
        };
        var restaurantCandidate1 = response.query.destination;
        //rescur.send("world");
         for(var j = 0 ; j < supermarket.length; j++){
           var supermarketCandidate = supermarket[j];
           console.log("supermarket");
           console.log(supermarketCandidate);
           googleMapsClient.directions({
               origin: restaurantCandidate1,
               destination: supermarketCandidate,
             }, function(err, response1){

                   var possibleSolution = [home, response1.query.origin, response1.query.destination];
                   console.log("solution update");
                   //console.log(totalTime);
                   console.log(possibleSolution);
                   solution[possibleSolution] = temp.duration + parseInt(response1.json.routes[0].legs[0].duration.text);
                   if(Object.keys(solution).length == supermarket.length * restaurant.length){
                     console.log("something");
                     console.log(solution);
                     var max = 200000;
                     var candidate;
                     for(key in solution){
                       //console.log("=============================")
                       var value = solution[key];
                     /* use key/value for intended purpose */
                       if(max > value){
                         max = value;
                         candidate = key;
                       }
                     }
                     console.log(candidate);
                     console.log("finish");
                     console.log(solution);
                     var answer = {'answer':candidate};
                     resp.send(answer);
                     console.log(answer)
                   }else{
                     console.log("finish one");
                     console.log(Object.keys(solution).length);
                     console.log(solution)
                   }
             });
           }
      });
    }
  // for(var i = 0 ; i < restaurant.length ; i++){
  //   var restaurantCandidate = restaurant[i];
  //   var homeToResDuration;
  //   var result = googleMapsClient.directions({
  //       origin: home,
  //       destination: restaurantCandidate,
  //     }).asPromise()
  //   .then((response) => {
  //     var temp = {
  //       'dest' : response.query.destination,
  //       'duration' : parseInt(response.json.routes[0].legs[0].duration.text)
  //     };
  //     balabala(temp, res, function(rescur){
  //       console.log("something");
  //       console.log(solution);
  //       var max = 200000;
  //       var candidate;
  //       for(key in solution){
  //         //console.log("=============================")
  //         var value = solution[key];
  //       /* use key/value for intended purpose */
  //         if(max > value){
  //           max = value;
  //           candidate = key;
  //         }
  //       }
  //       console.log(candidate);
  //       console.log("finish");
  //       var answer = {'answer':candidate}
  //       res.send("answer");
  //       console.log(answer)
  //     });
  //   })}
  //
  //
  //   res.send("done");
  //
  //
  //
  //
  //
  //
  // // for(var i = 0 ; i < restaurant.length ; i++){
  //   var restaurantCandidate = restaurant[i];
  //   var homeToResDuration;
  //   var result = googleMapsClient.directions({
  //       origin: home,
  //       destination: restaurantCandidate,
  //     }).asPromise()
  //   .then((response) => {
  //
  //         homeToResDuration = parseInt(response.json.routes[0].legs[0].duration.text);
  //         console.log(response.json.routes[0].legs[0].duration.text);
  //         //res.send(response.json);
  //         console.log(homeToResDuration);
  //         for(var j = 0 ; j < supermarket.length; j++){
  //           var supermarketCandidate = supermarket[j];
  //           console.log("supermarket");
  //           console.log(supermarketCandidate);
  //           googleMapsClient.directions({
  //               origin: restaurantCandidate,
  //               destination: supermarketCandidate,
  //             }).asPromise()
  //           .then((res) => {
  //                 possibleSolution = [home, restaurantCandidate, supermarketCandidate];
  //                 console.log("solution update");
  //                 //console.log(totalTime);
  //                 console.log(possibleSolution);
  //                 solution[possibleSolution] = homeToResDuration + parseInt(res.json.routes[0].legs[0].duration.text);
  //             });
  //           }
  //           //response.send(possibleSolution);
  //     });
  //
  for(key in solution){
    console.log("=============================")
    var value = solution[key];
  /* use key/value for intended purpose */
    console.log(key);
    console.log(value);
  }
  var res = googleMapsClient.geocode({
  address: 'Zaytinya, 9th Street Northwest, Washington, DC'
    }).asPromise()
  .then((response) => {
    console.log(response.json.results);
  });
    console.log(res.finally);
    // googleMapsClient.placesNearby({
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

  //  client.query("SELECT * FROM printingtable WHERE username = $1", [username],function(err,res){
  //   if(err){
   //
  //    ret.message=err;
  //    response.send(ret);
  //    return;
  //   }
  //   else{
  //    if(res.rows.length==0){
  //     console.log("length 0")
  //     client.query("insert into printingtable (username,usage) values ($1,$2) returning username",[username,usage],
  //      function(err){
  //       if(err){
  //        ret.message=err;
  //        response.send(ret);
  //        return;
  //       }
  //       else{
   //
  //        // done();
  //        ret.success=true;
  //        ret.message="new user created";
  //        response.send(ret);
  //        return;
  //       }
   //
  //      })
  //    }
  //    else{
  //     var updated_usage=parseInt(usage)+parseInt(res.rows[0].usage);
  //     console.log("usage "+updated_usage)
  //     client.query("update printingtable set usage = $1 where username = $2",[updated_usage,username],function(err,result){
  //      console.log("here")
  //      if(err){
  //       ret.message=err;
  //       response.send(ret);
  //       return;
  //      }
  //      else{
   //
  //       // done();
  //       ret.success=true;
  //       ret.message="updated usage"
  //       response.send(ret);
  //       return;
  //      }
   //
  //     })
   //
  //    }
   //
  //   }
   //
   //
   //
  //  });

})
app.listen(7000, function () {
  console.log('Example app listening on port 7000!')
})


// curl -d '{"username":"frank009","usage":3}' -H "Content-Type: application/json" http://10.108.62.232:7000/update_usage
