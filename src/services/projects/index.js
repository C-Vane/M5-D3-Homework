const express = require("express");
const fs = require("fs");
const path = require("path");
const uniqid = require("uniqid");
const router = express.Router();
const { check, validationResult } = require("express-validator");

// function read file
const readFile = (fileName) => {
  const buffer = fs.readFileSync(path.join(__dirname, fileName));
  const fileContent = buffer.toString();
  return JSON.parse(fileContent);
};
// check student id
const checkStudent = (id) => {
  const students = readFile("../students/students.json");
  const studentExsists = students.filter((student) => student.ID === id);
  console.log(studentExsists);
  return studentExsists.length > 0 ? false : true;
};
// get all projects
router.get("/", (req, res, next) => {
  try {
    const projects = readFile("projects.json");
    if (req.query && req.query.name) {
      const filteredprojects = projects.filter((project) => project.hasOwnProperty("name") && project.name.toLowerCase().includes(req.query.name.toLowerCase()));
      res.send(filteredprojects);
    } else {
      res.send(projects);
    }
  } catch (error) {
    next(error);
  }
});
//get project by ID
router.get("/:id", (req, res, next) => {
  try {
    const projects = readFile("projects.json");
    const project = projects.filter((project) => project.ID === req.params.id);
    if (project.length > 0) {
      res.send(project);
    } else {
      const err = new Error();
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (error) {
    next(error);
  }
});

// POST new project

router.post(
  "/",
  [
    check("name").isLength({ min: 4 }).withMessage("No way! Name too short!").exists().withMessage("Insert a name please!"),
    check("description").isLength({ min: 10 }).withMessage("No way! description too short!").exists().withMessage("Insert a description please!"),
    check("repoUrl").isURL().withMessage("No way! Repo Not URL!").exists().withMessage("Insert the project repository URL please!"),
    check("creationDate").isDate().withMessage("No way! Creation Date not correct!").exists().withMessage("Insert a creation Date please!"),
    check("studentID").isLength({ min: 8 }).withMessage("No way! Student ID too short!").exists().withMessage("Insert a student ID please!"),
  ],
  (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty() || checkStudent(req.body.studentID)) {
        const err = new Error();
        err.message = errors;
        err.httpStatusCode = 400;
        next(err);
      } else {
        const projectsDB = readFile("projects.json");
        const newproject = {
          ...req.body,
          ID: uniqid(),
          createdAt: new Date(),
        };

        projectsDB.push(newproject);

        fs.writeFileSync(path.join(__dirname, "projects.json"), JSON.stringify(projectsDB));

        res.status(201).send({ id: newproject.ID });
      }
    } catch (error) {
      next(error);
    }
  }
);

//Delete project
router.delete("/:id", (req, res, next) => {
  try {
    const projectsDB = readFile("projects.json");
    const newDb = projectsDB.filter((project) => project.ID !== req.params.id);
    fs.writeFileSync(path.join(__dirname, "projects.json"), JSON.stringify(newDb));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
//Edit project
router.put(
  "/:id",
  [
    check("name").isLength({ min: 4 }).withMessage("No way! Name too short!").exists().withMessage("Insert a name please!"),
    check("description").isLength({ min: 10 }).withMessage("No way! description too short!").exists().withMessage("Insert a description please!"),
    check("repoUrl").isURL().withMessage("No way! Repo Not URL!").exists().withMessage("Insert the project repository URL please!"),
    check("creationDate").isDate().withMessage("No way! Creation Date not correct!").exists().withMessage("Insert a creation Date please!"),
    check("studentID").isLength({ min: 15 }).withMessage("No way! Student ID too short!").exists().withMessage("Insert a student ID please!"),
    check("liveUrl").exists(),
  ],
  (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty() || checkStudent(req.body.studentID)) {
        const err = new Error();
        err.message = errors;
        err.httpStatusCode = 400;
        next(err);
      } else {
        const projectsDB = readFile("projects.json");
        const newDb = projectsDB.filter((project) => project.ID !== req.params.id);

        const modifiedproject = {
          ...req.body,
          ID: req.params.id,
          modifiedAt: new Date(),
        };

        newDb.push(modifiedproject);
        fs.writeFileSync(path.join(__dirname, "projects.json"), JSON.stringify(newDb));

        res.send({ id: modifiedproject.ID });
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
