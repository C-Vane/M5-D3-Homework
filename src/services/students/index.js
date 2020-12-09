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
// get all students

// fucnction to checkEmail if not used
const checkEmail = (email) => {
  const students = readFile("students.json");
  const emailExsists = students.filter((student) => student.email === email);
  return emailExsists.length > 0 ? true : false;
};
router.get("/", (req, res, next) => {
  try {
    const students = readFile("students.json");
    if (req.query && req.query.name) {
      const filteredstudents = students.filter((student) => student.hasOwnProperty("name") && student.name.toLowerCase() === req.query.name.toLowerCase());
      res.send(filteredstudents);
    } else {
      res.send(students);
    }
  } catch (error) {
    next(error);
  }
});
//get student by ID
router.get("/:id", (req, res, next) => {
  try {
    const students = readFile("students.json");
    const student = students.filter((student) => student.ID === req.params.id);
    if (student.length > 0) {
      res.send(student);
    } else {
      const err = new Error();
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (error) {
    next(error);
  }
});
// POST new student

router.post(
  "/",
  [
    check("name").isLength({ min: 4 }).withMessage("No way! Name too short!").exists().withMessage("Insert a name please!"),
    check("surname").isLength({ min: 4 }).withMessage("No way! Surname too short!").exists().withMessage("Insert a surname please!"),
    check("email").isEmail().withMessage("No way! Email not correct!").exists().withMessage("Insert an email please!"),
    check("dateofBirth").isDate().withMessage("No way! Date of Birth not correct!").exists().withMessage("Insert a date of Birth please!"),
  ],
  (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty() || checkEmail(req.body.email)) {
        const err = new Error();
        err.message = errors;
        err.httpStatusCode = 400;
        next(err);
      } else {
        const studentsDB = readFile("students.json");
        const newStudent = {
          ...req.body,
          ID: uniqid(),
          createdAt: new Date(),
        };

        studentsDB.push(newStudent);

        fs.writeFileSync(path.join(__dirname, "students.json"), JSON.stringify(studentsDB));

        res.status(201).send({ id: newStudent.ID });
      }
    } catch (error) {
      next(error);
    }
  }
);

//Delete student
router.delete("/:id", (req, res, next) => {
  try {
    const studentsDB = readFile("students.json");
    const newDb = studentsDB.filter((student) => student.ID !== req.params.id);
    fs.writeFileSync(path.join(__dirname, "students.json"), JSON.stringify(newDb));

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
//Edit student
router.put(
  "/:id",
  [
    check("name").isLength({ min: 4 }).withMessage("No way! Name too short!").exists().withMessage("Insert a name please!"),
    check("surname").isLength({ min: 4 }).withMessage("No way! Surname too short!").exists().withMessage("Insert a surname please!"),
    check("email").isEmail().withMessage("No way! Email not correct!").exists().withMessage("Insert an email please!"),
    check("dateofBirth").isDate().withMessage("No way! Date of Birth not correct!").exists().withMessage("Insert a date of Birth please!"),
  ],
  (req, res, next) => {
    try {
      const errors = validationResult(req);
      console.log(errors);
      if (!errors.isEmpty() && checkEmail(req.body.email)) {
        const err = new Error();
        err.message = errors;
        err.httpStatusCode = 400;
        next(err);
      } else {
        const studentsDB = readFile("students.json");
        const newDb = studentsDB.filter((student) => student.ID !== req.params.id);

        const modifiedStudent = {
          ...req.body,
          ID: req.params.id,
          modifiedAt: new Date(),
        };

        newDb.push(modifiedStudent);
        fs.writeFileSync(path.join(__dirname, "students.json"), JSON.stringify(newDb));

        res.send({ id: modifiedStudent.ID });
      }
    } catch (error) {
      next(error);
    }
  }
);
//GET Project by student ID
router.get("/:id/projects", (req, res, next) => {
  try {
    const projects = readFile("../projects/projects.json");
    const project = projects.filter((project) => project.studentID === req.params.id);
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
module.exports = router;
//Check if email is not used
router.post("/checkEmail", (req, res) => {
  try {
    const email = req.body.email;
    const studentsArray = readFile("students.json");
    const checkEmail = studentsArray.some((student) => student.email === email);
    checkEmail ? res.status(210).send(true) : res.send(false);
  } catch (error) {
    next(error);
  }
});
