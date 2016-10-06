var mongo = require('mongodb').MongoClient,
	client = require('socket.io').listen(8080).sockets;


mongo.connect('mongodb://127.0.0.1/chat', function(err,db){
	if(err) throw err;

client.on('connection', function(socket){
	console.log('someone has connected');

	//create a collection and pass the same name as db
	var col = db.collection('message'), 
			sendStatus = function(s){
				socket.emit('status',s);
			};

	//wait for input
	socket.on('input', function(data){
		console.log(data);
		var name = data.name,
			message = data.message,
			whitespacePattern = /^\s*$/;

			if(whitespacePattern.test(name) || whitespacePattern.test(message)){
				//console.log('Invalid');
				sendStatus('Name and message is required.');
			}
			else{
				//insert data into collection 
				col.insert({name: name,  message: message}, function(){
				console.log('Inserted');

				sendStatus({
					message: "Message Sent",
					clear: true;
				});
		});
		}
	});
});
});