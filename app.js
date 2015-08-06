var express = require('express'),
    app = express(), 
    cons = require('consolidate'), 
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server;

app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname+"/views");
app.use(app.router);

var mongoClient = new MongoClient(new Server('localhost', 27017, { 'native_parser' : true} ));
var db = mongoClient.db('blogApp');

app.get('/', function(req, res){
	db.collection('posts').find().toArray(function(err, docs){				
		if(err) throw err;
		
		res.render('index', {"articles" : docs});
	}); 
});

app.get('/:title', function(req, res){
	var title = req.params.title;
	db.collection('posts').findOne({"title": title}, function(err, doc){
		if(err) throw err;

		res.render('post', {"article":doc});
	})
});

mongoClient.open(function(err, mongoclient) {
	if(err) throw err;
	
	app.listen(3000);
	console.log('Express server started on port 3000');
});