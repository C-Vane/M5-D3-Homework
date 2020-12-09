//Import external library
const express = require("express");
const listEndpoints = require("express-list-endpoints");
//Import cors
const cors = require("cors");
//Import routers
const projectsRouter = require("./services/projects");
const studentsRouter = require("./services/students");
//import error handler
const { notFoundHandler, unauthorizedHandler, forbiddenHandler, catchAllHandler } = require("./errorHandling");
//use server handling library
const server = express();
//set used port
const port = process.env.PORT || 3001;

//call diffrent routers for diffrent endpoints
server.use(cors());
server.use(express.json());
server.use("/projects", projectsRouter);
server.use("/students", studentsRouter);

//Call diffrent error handlers for diffrent errors
server.use(notFoundHandler);
server.use(unauthorizedHandler);
server.use(forbiddenHandler);
server.use(catchAllHandler);
//console log endpoints for debuging
console.log(listEndpoints(server));

//litsen to sent request on the set PORT
server.listen(port, () => {
  console.log("Server running on port " + port);
});
