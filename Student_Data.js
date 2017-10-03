var SERVER_NAME = 'Student-api'
var PORT = 3000;
var HOST = '127.0.0.1';


//Read data from json file
var filename = 'Data_Storage.json';
var fs = require('fs');
var data = fs.readFileSync(filename);
var student_data_JSON = JSON.parse(data);


var getRequestCounter = 0;
var postRespnseCounter = 0;


var restify = require('restify')

  // Get a persistence engine for the users
  , studentsSave = require('save')('students')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  //console.log('Server %s listening at %s', server.name, server.url)
  console.log("Server is listening on: " + HOST + ":" + PORT);
  console.log("End Points :");
  console.log( HOST + ":" + PORT +"/sendGet   method: GET");
  console.log( HOST + ":" + PORT +"/sendPost   method: POST");
  console.log( HOST + ":" + PORT +"/sendDelete   method: DELETE");
  
  console.log('Resources:')
  console.log(' /students')
  console.log(' /students/:id')  
})

server
// Allow the use of POST
.use(restify.fullResponse())

// Maps req.body to req.params so there is no switching between them
.use(restify.bodyParser())


//------------------------------------------------------------------------------//
                       // Create a new student record
//------------------------------------------------------------------------------//
server.post('/sendPost', function (req, res, next) {
  
      console.log("sendPost: sending response...");
    
      //Request counter for sendPostrequest 
      postRespnseCounter++;
      
      console.log("Processed Request Counter -> sendGet : " + getRequestCounter + ", sendPost : " + postRespnseCounter);
        
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
          age: req.params.age,
          _id: req.params._id
    }
  
    // Create the user using the persistence engine
    studentsSave.create( newStudent, function (error, student) {
  
      //Writing data in JSON file

        student_data_JSON[req.params.name] = req.params.age;
      
        var write_data = JSON.stringify(student_data_JSON,null,2);

        fs.writeFile(filename,write_data,finished);

        function finished(err) {console.log('Data stored in json file');}

      // If there are any errors, pass them to next in the correct format
      if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
  
      // Send the user if no issues
      res.send(201, student)
    })
  })


//------------------------------------------------------------------------------//
                      // Get all student records in the system
//------------------------------------------------------------------------------//

        server.get('/sendGet', function (req, res, next) {
  
        console.log("sendGet: received request..");

        //Request counter for endpoint sendGet 
        getRequestCounter++;
        
        console.log("Processed Request Counter -> sendGet : " + getRequestCounter + ", sendPost : " + postRespnseCounter);

        // Find every entity within the given collection
        studentsSave.find({}, function (error, students) {

        console.log(student_data_JSON);

         res.send(student_data_JSON);

       })
    })

//------------------------------------------------------------------------------//
                      // Get a single user by their student id
//------------------------------------------------------------------------------//

      server.get('/Students/:id', function (req, res, next) {

        // Find a single user by their id within save
        studentsSave.findOne({ _id: req.params.id }, function (error, students) {
    
        getRequestCounter++;
          
        console.log("Processed Request Counter -> sendGet : " + getRequestCounter + ", sendPost : " + postRespnseCounter);
          
        // If there are any errors, pass them to next in the correct format
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
    
        if (students) {
          // Send the user if no issues
          res.send(students)
        } else {
          // Send 404 header if the user doesn't exist
          res.send(404)
        }
      })
    })




//------------------------------------------------------------------------------//
                      // Update a Student Record by their id
//------------------------------------------------------------------------------//

      server.put('/students/:id', function (req, res, next) {
      
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
              _id: req.params.id,
              name: req.params.name, 
              age: req.params.age
        }
        
          // Update the user with the persistence engine
          studentsSave.update(newStudent, function (error, student) {
      
          // If there are any errors, pass them to next in the correct format
          if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
      
          // Send a 200 OK response
          res.send(200)
          console.log("Update id:"+ req.params.id+ "received request..");
          
        })
      })
      
//------------------------------------------------------------------------------//
                       // Delete student record with the given id
//------------------------------------------------------------------------------//

server.del('/students/:id', function (req, res, next) {
  
    // Delete the user with the persistence engine
    studentsSave.delete(req.params.id, function (error, student) {
  
      console.log("Delete id:"+ req.params.id+ "received request..");
      
      // If there are any errors, pass them to next in the correct format
      if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
  
      // Send a 200 OK response
      res.send(200)
    })
  })
  
//------------------------------------------------------------------------------//
                      // Delete all student records in the system
//------------------------------------------------------------------------------//

server.del('/sendDelete', function (req, res, next) {
  
        console.log("sendDelete: received request..");

        studentsSave = require('save')('students')
        
        res.send("All Records Delete");
   
 })