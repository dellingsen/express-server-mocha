var should = require('chai').should()
  , expect = require('chai').expect
  , assert = require('chai').assert
  , Joi = require('Joi')
  , async = require('async')
  , server = require('../app');

var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
  
var userSchema = Joi.object({
  _id: Joi.string().required(),
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  email: Joi.string(),
  username: Joi.string(),
  password: Joi.string()
}).unknown() // TODO: extra keys


describe('Users', function() {

var uid;
	
  it('should retrieve a list ALL users on /users GET', function(done) {
    chai.request(server)
      .get('/users')
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        var body = res.body
	    console.log(body);
        Joi.validate(body, Joi.array().items(userSchema), function(err, val) {
          if (err) throw err
        })
        done();    
	  });
    });

	
    it('should add a SINGLE user on /users POST', function(done) {
	  chai.request(server)
		.post('/users')
		.send({'firstname': 'Jon', 'lastname': 'Jones', 'email': 'jj@g.com', 'password': 'password', 'username': 'jj'})
		.end(function(err, res){
	      console.log('err: ' + err);
	      console.log('status: ' + res.status);
		  res.should.have.status(200);
		  res.should.be.json;
          var body = res.body
	      console.log('POST BODY:');
	      console.log(body);
		  res.body.should.be.a('object');
		  uid = res.body._id;
		  /*
		  res.body.SUCCESS.should.be.a('object');
		  res.body.SUCCESS.should.have.property('firstname');
		  res.body.SUCCESS.should.have.property('lastname');
		  res.body.SUCCESS.should.have.property('_id');
		  res.body.SUCCESS.name.should.equal('Jon');
		  res.body.SUCCESS.lastName.should.equal('Jones');
		  */
		  done();
	    });
    });
		
    it('should list a SINGLE user on /user/<id> GET', function(done) {
	  chai.request(server)
	  .get('/users/' + uid)
	  .end(function(err, res){
		 res.should.have.status(200);
		 if (err) throw err
		 var body = res.body
		 Joi.validate(body, userSchema, function(err, val) {
		   if (err) throw "output failed to validate"
		 })
	     done();
	  });
	});

    it('should delete a SINGLE user on /users/<userid> DELETE', function(done) {
	  chai.request(server)
	  .delete('/users/' + uid)
	  .end(function(err, res){
		   console.log("DELETE USER RESPONSE:");
		   console.log(res.body);
		   console.log(res.status);
		   res.should.have.status(200);
		   done();
	   });
   });
		

  it('Async Waterfall - POST/PUT/GET/DELETE /users endpoint', function(done) {
      async.waterfall([
	  
        // Create user
        function(next) {
		  chai.request(server)
          .post('/users')
	      .send({
              username: 'deme',
              firstname: 'Delete',
              lastname: 'Me',
              email: 'delete@me.com',
              password: 'pass'
            })
		  .end(function(err, res){
				 res.should.have.status(200);
				 next(err, res) 
		   });
        },

        // Update user
        function(r, next) {
		  chai.request(server)
          .put('/users/'+r.body._id)
          .send({
              email: 'steve@mocha.net'
            })
            .end(function(err,x) { next(err, r) })
        },

        // Verify user changes
        function(r, next) {
		  chai.request(server)
          .get('/users/'+r.body._id)
		  .end(function(err, res){
			 res.should.have.status(200);
			 if (err) throw err
             assert.equal(res.body.email, 'steve@mocha.net')
			 var body = res.body
			 Joi.validate(body, userSchema, function(err, val) {
			   if (err) throw "output failed to validate"
			 })
			 next(err, res) 
		  });
        },

        // Delete the user
        function(r, next) {
		  chai.request(server)
          .delete('/users/'+r.body._id)
		  .end(function(err, res){
			   res.should.have.status(200);
			   next(err, r) 
		   });
        },

        // Verify that the user doesn't exist
        function(res, next) {
		  chai.request(server)
          .get('/users/'+res.body._id)
		  .end(function(err, res){
			   // @TODO: check 404 response status from serice call
			   next(err, res);
		   });
        }

      ], function(err, r) {
        if (err) throw err
        done()
      })
    })
})

