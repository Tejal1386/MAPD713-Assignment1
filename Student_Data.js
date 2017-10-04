var SERVER_NAME = 'Product-api'
var PORT = 3000;
var HOST = '127.0.0.1';


//Read data from json file
var filename = 'Data_Storage.json';
var fs = require('fs');
var data = fs.readFileSync(filename);
var product_data_JSON = JSON.parse(data);


var getRequestCounter = 0;
var postRespnseCounter = 0;


var restify = require('restify')

  // Get a persistence engine for the users
  , productsSave = require('save')('products')

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
  console.log(' /products')
  console.log(' /products/:id')  
})

server
// Allow the use of POST
.use(restify.fullResponse())

// Maps req.body to req.params so there is no switching between them
.use(restify.bodyParser())


//------------------------------------------------------------------------------//
                       // Create a new product record
//------------------------------------------------------------------------------//
server.post('/sendPost', function (req, res, next) {
  
      console.log("sendPost: sending response...");
    
      //Request counter for sendPostrequest 
      postRespnseCounter++;
      
      console.log("Processed Request Counter -> sendGet : " + getRequestCounter + ", sendPost : " + postRespnseCounter);
        
    // Make sure name is defined
    if (req.params.product === undefined ) {
      // If there are any errors, pass them to next in the correct format
      return next(new restify.InvalidArgumentError('name must be supplied'))
    }
    if (req.params.price === undefined ) {
      // If there are any errors, pass them to next in the correct format
      return next(new restify.InvalidArgumentError('age must be supplied'))
    }
    var newproduct = { 
          product: req.params.product, 
          price: req.params.price,
          _id: req.params._id
    }
  
    // Create the user using the persistence engine
    productsSave.create( newproduct, function (error, product) {
  
      //Writing data in JSON file

        product_data_JSON[req.params.product] = req.params.price;
      
        var write_data = JSON.stringify(product_data_JSON,null,2);

        fs.writeFile(filename,write_data,finished);

        function finished(err) {console.log('Data stored in json file');}

      // If there are any errors, pass them to next in the correct format
      if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
  
      // Send the user if no issues
      res.send(201, product)
    })
  })


//------------------------------------------------------------------------------//
                      // Get all product records in the system
//------------------------------------------------------------------------------//

        server.get('/sendGet', function (req, res, next) {
  
        console.log("sendGet: received request..");

        //Request counter for endpoint sendGet 
        getRequestCounter++;
        
        console.log("Processed Request Counter -> sendGet : " + getRequestCounter + ", sendPost : " + postRespnseCounter);

        // Find every entity within the given collection
        productsSave.find({}, function (error, products) {

         res.send(products);

       })
    })

//------------------------------------------------------------------------------//
                      // Get a single user by their product id
//------------------------------------------------------------------------------//

      server.get('/products/:id', function (req, res, next) {

        // Find a single user by their id within save
        productsSave.findOne({ _id: req.params.id }, function (error, products) {
    
        getRequestCounter++;
          
        console.log("Processed Request Counter -> sendGet : " + getRequestCounter + ", sendPost : " + postRespnseCounter);
          
        // If there are any errors, pass them to next in the correct format
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
    
        if (products) {
          // Send the user if no issues
          res.send(products)
        } else {
          // Send 404 header if the user doesn't exist
          res.send(404)
        }
      })
    })




//------------------------------------------------------------------------------//
                      // Update a product Record by their id
//------------------------------------------------------------------------------//

      server.put('/products/:id', function (req, res, next) {
      
        // Make sure name is defined
        if (req.params.product === undefined ) {
          // If there are any errors, pass them to next in the correct format
          return next(new restify.InvalidArgumentError('name must be supplied'))
        }
        if (req.params.price === undefined ) {
          // If there are any errors, pass them to next in the correct format
          return next(new restify.InvalidArgumentError('age must be supplied'))
        }
        
        var newproduct = {
              _id: req.params.id,
              product: req.params.product, 
              price: req.params.price
        }
        
          // Update the user with the persistence engine
          productsSave.update(newproduct, function (error, product) {
      
          // If there are any errors, pass them to next in the correct format
          if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
      
          // Send a 200 OK response
          res.send(200)
          console.log("Update id:"+ req.params.id+ "received request..");
          
        })
      })
      
//------------------------------------------------------------------------------//
                       // Delete product record with the given id
//------------------------------------------------------------------------------//

server.del('/products/:id', function (req, res, next) {
  
    // Delete the user with the persistence engine
    productsSave.delete(req.params.id, function (error, product) {
  
      console.log("Delete id:"+ req.params.id+ "received request..");
      
      // If there are any errors, pass them to next in the correct format
      if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
  
      // Send a 200 OK response
      res.send(200)
    })
  })
  
//------------------------------------------------------------------------------//
                      // Delete all product records in the system
//------------------------------------------------------------------------------//

server.del('/sendDelete', function (req, res, next) {
  
        console.log("sendDelete: received request..");

        productsSave = require('save')('products')
        
        res.send("All Records Delete");
   
 })