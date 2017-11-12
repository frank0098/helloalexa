const express = require('express')
const app = express()
app.use(express.static(__dirname + '/public'));
var pg = require('pg');
var conString = "postgres://frank0098:test@localhost:5432/javadb";
var bodyParser = require('body-parser');
var cors = require('cors')
app.use(cors())



var client = new pg.Client(conString);
client.connect();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());




// app.get('/', function (req, res) {
// res.send("hello")
// })
app.get('/get_usage',function(request,response){
 var ret={"success":false,"message":""}
 client.query("select * from printingtable",function(err,res){
  if(err){
   ret.message=err;
   response.send(ret)
  }
  else{
   ret.success=true;
   ret.message=res.rows;
   response.send(ret)

  }


 })

})
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

   client.query("SELECT * FROM printingtable WHERE username = $1", [username],function(err,res){
    if(err){

     ret.message=err;
     response.send(ret);
     return;
    }
    else{
     if(res.rows.length==0){
      console.log("length 0")
      client.query("insert into printingtable (username,usage) values ($1,$2) returning username",[username,usage],
       function(err){
        if(err){
         ret.message=err;
         response.send(ret);
         return;
        }
        else{

         // done();
         ret.success=true;
         ret.message="new user created";
         response.send(ret);
         return;
        }

       })
     }
     else{
      var updated_usage=parseInt(usage)+parseInt(res.rows[0].usage);
      console.log("usage "+updated_usage)
      client.query("update printingtable set usage = $1 where username = $2",[updated_usage,username],function(err,result){
       console.log("here")
       if(err){
        ret.message=err;
        response.send(ret);
        return;
       }
       else{

        // done();
        ret.success=true;
        ret.message="updated usage"
        response.send(ret);
        return;
       }

      })

     }

    }



   });

})
app.listen(7000, function () {
  console.log('Example app listening on port 7000!')
})


// curl -d '{"username":"frank009","usage":3}' -H "Content-Type: application/json" http://10.108.62.232:7000/update_usage
