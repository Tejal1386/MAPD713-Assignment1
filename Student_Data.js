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


// Create a new user
server.post('/sendPost', function (req, res, next) {
    
        console.log("sendPost: sending response...");

       
        
      // Make sure name is defined
      if (req.params.name === undefined ) {
        // If there are any errors, pass them to next in the correct format
        return next(new restify.InvalidArgumentError('name must be supplied'))
      }
      if (req.params.age === undefined ) {
        // If there are any errors, pass them to next in the correct format
        return next(new restify.InvalidArgumentError('age must be supplied'))
      }
      var newStudent = {
            name: req.params.name, 
            age: req.params.age
        }
    
      // Create the user using the persistence engine
      studentsSave.create( newStudent, function (error, student) {
    
        // If there are any errors, pass them to next in the correct format
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
    
        // Send the user if no issues
        res.send(201, student)
      })
    })
