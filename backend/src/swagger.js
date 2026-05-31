const swaggerJsdoc =
require("swagger-jsdoc");

module.exports =
swaggerJsdoc({

definition:{

openapi:"3.0.0",

info:{

title:
"Task Tracker API",

version:"1.0"

},

servers:[{

url:
"http://localhost:3000"

}]

},

apis:["./src/routes/*.js"]

});