var express = require('express');
var app = express();
var mongo = require('mongodb').MongoClient;
var new_id;
var http = require('http');

mongo.connect(process.env.MONGOLAB_URI, function(err, db) {
  if(err) {
    res.send(err);
  } else {
    db.collection('urls').count({}, function(err, result){
      new_id = function(){
        result += 1;
        return result
      }
      db.close()
    })
  }
})

app.use('/new', function(req, res){

  var url =  req.path.substring(1)
  http.get(url, function(response){
  
    mongo.connect(process.env.MONGOLAB_URI, function(err, db) {
      if(err) {
        res.send('Sorry, there was an error connecting to the database');
      } else {
          var id = new_id();
          var url =  req.path.substring(1)
          db.collection('urls').insert([{'uri': url,
                        'unique': id}], 
                        function(err, result){
                            db.close();
                            res.send({ 
                              'id': id,
                              'url': url
                            })
                        
                         });
      }   
      })
  }).on('error', function(e) {
    res.send({'error' : 'Invalid URL'})
  })           
});

app.use('/:id', function(req, res){
  
  mongo.connect(process.env.MONGOLAB_URI, function(err, db){
    if(err){
      res.send('Sorry, there was an error connecting to the database');
    } else {
      db.collection('urls').find({unique: parseInt(req.params.id)}).toArray(function(err, result){
        if (result.length === 0){
          res.send('Sorry, no url found matching this code')
        } else {
          res.redirect(result[0].uri)
          db.close();
        }
        })
    }
  })
});

app.listen(process.env.PORT || 8080)
