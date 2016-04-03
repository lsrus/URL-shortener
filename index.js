var express = require('express');
var app = express();
var mongo = require('mongodb').MongoClient;

var uniqueId = function(){
  var count = 0;
  return function(){
    count += 1;
    return count;
  }
}()
app.use('/new', function(req, res){
  mongo.connect(process.env.MONGOLAB_URI, function(err, db) {
    if(err) {
      res.send(err);
    } else {
        var id = uniqueId();
        db.urls.insert([{'uri': req.path,
                      'unique': id}], 
                      function(err, res){
                          db.close();
                          res.send({ 
                            'id': id,
                            'url': req.path.substring(1)
                          })
                      
                       });
    }   
    })               
});

app.listen(process.env.PORT || 8080)
