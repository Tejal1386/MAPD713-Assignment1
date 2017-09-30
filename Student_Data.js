var SERVER_NAME = 'Student-api'
var PORT = 3000;
var HOST = '127.0.0.1';

var restify = require('restify')

  // Get a persistence engine for the users
  , studentsSave = require('save')('students')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  //console.log('Server %s listening at %s', server.name, server.url)
  console.log("Server is listening on: " + HOST + ":" + PORT);
  
  
  console.log('Resources:')
  console.log(' /students')
  console.log(' /students/:id')  
})

server
// Allow the use of POST
.use(restify.fullResponse())

// Maps req.body to req.params so there is no switching between them
.use(restify.bodyParser())

