# express-server-mocha
Follow these steps to create and install the necessary node modules for starting a node express server with the Mocha and Chai testing framework
#
Download and install MongoDB
#
Make sure the Mongo daemon is running:
#
MongoDB\Server\3.0\bin>mongod
#

After you have cloned the project, initialize and install the necessay node modules
#
npm init
#
npm install

#
Here is the package.json that will be installed
{
  "name": "nodeapp",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    
"start": "node ./bin/www"
  },
  "dependencies": {
    
"body-parser": "~1.13.2",
    
"cookie-parser": "~1.3.5",
    
"debug": "~2.2.0",
    
"chai": "^3.5.0",

"chai-http": "^3.0.0",
    
"cookie-parser": "~1.3.5",
    
"debug": "~2.2.0",
    
"express": "~4.13.1",
    
"joi": "^9.2.0",
    
"mocha": "^3.1.2",
   
"mongoose": "^4.3.1",
    
"morgan": "~1.6.1"
  },
  
"main": "app.js",
  
"author": "",
  
"license": "ISC",
  
"description": ""
}

Instead of using 'node app.js' to start the server, we're going to just type 'mocha':

This will tell the Mocha framework to look for a 'test' directory with Chai tests to execute. 
In our case, this will run the users_test.js and spin up the server and connect to the database
and hit all of our /user endoints that we have defined. 
It's a great way to quickly test your endpoints whenever you are making changes to your REST API.
