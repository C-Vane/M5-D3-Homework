const express = require("express");
const path = require("path");
const uniqid = require("uniqid");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const { readDB, writeDB } = require("../../lib/utilities");
const multer = require("multer");
const { writeFile } = require("fs-extra");
const { join } = require("path");
const upload = multer({});

// function read file
const StudentFilePath = path.join(__dirname, "students.json");
const ProjectsFilePath = path.join(__dirname, "../projects/projects.json");
const studentPhoto = join(__dirname, "../../../public/images/students");
// get all students

// fucnction to checkEmail if not used
const checkEmail = async (email, put) => {
  const students = await readDB(StudentFilePath);
  const emailExsists = students.filter((student) => student.email === email);

  return put ? (emailExsists.length > 1 ? true : false) : emailExsists.length > 0 ? true : false;
};
router.get("/", async (req, res, next) => {
  try {
    const students = await readDB(StudentFilePath);
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
router.get("/:id", async (req, res, next) => {
  try {
    const students = await readDB(StudentFilePath);
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
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty() || (await checkEmail(req.body.email))) {
        const err = new Error();
        err.message = errors.errors.length > 0 ? errors : "Email already used";
        err.httpStatusCode = 400;
        next(err);
      } else {
        const studentsDB = await readDB(StudentFilePath);
        const newStudent = {
          ...req.body,
          ID: uniqid(),
          createdAt: new Date(),
        };

        studentsDB.push(newStudent);

        await writeDB(StudentFilePath, studentsDB);

        res.status(201).send({ id: newStudent.ID });
      }
    } catch (error) {
      next(error);
    }
  }
);

//Delete student
router.delete("/:id", async (req, res, next) => {
  try {
    const studentsDB = await readDB(StudentFilePath);
    const newDb = studentsDB.filter((student) => student.ID !== req.params.id);
    writeDB(StudentFilePath, newDb);

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
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty() || (await checkEmail(req.body.email, true)) > 1) {
        const err = new Error();
        err.message = errors.errors.length > 0 ? errors : "Email already used";
        err.httpStatusCode = 400;
        next(err);
      } else {
        const studentsDB = await readDB(StudentFilePath);
        const newDb = studentsDB.filter((student) => student.ID !== req.params.id);

        const modifiedStudent = {
          ...req.body,
          ID: req.params.id,
          modifiedAt: new Date(),
        };

        newDb.push(modifiedStudent);
        await writeDB(StudentFilePath, newDb);

        res.send({ id: modifiedStudent.ID });
      }
    } catch (error) {
      next(error);
    }
  }
);
//GET Project by student ID
router.get("/:id/projects", async (req, res, next) => {
  try {
    const projects = await readDB(ProjectsFilePath);
    const project = projects.filter((project) => project.studentID === req.params.id);
    if (project.length > 0) {
      res.send(project);
    } else {
      const err = new Error();
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});
module.exports = router;
//Check if email is not used
router.post("/checkEmail", async (req, res, next) => {
  try {
    const email = req.body.email;
    const studentsArray = await readDB(StudentFilePath);
    const checkEmail = studentsArray.some((student) => student.email === email);
    checkEmail ? res.status(210).send(true) : res.send(false);
  } catch (error) {
    next(error);
  }
});
// Add Avatar To student

router.post("/:id/uploadPhoto", upload.single("studentProfile"), async (req, res, next) => {
  try {
    //saving file to disk
    await writeFile(join(studentPhoto, req.params.id + path.extname(req.file.originalname)), req.file.buffer);
    //getting all the students
    const studentsDB = await readDB(StudentFilePath);
    const newDb = studentsDB.filter((student) => student.ID !== req.params.id);
    const student = studentsDB.find((student) => student.ID === req.params.id);
    //adding image to the students
    console.log("Hello line 174", req.params.id, req.file);
    let modifiedStudent = { ...student };
    modifiedStudent.image = `http://localhost:3001/images/students/${req.params.id + path.extname(req.file.originalname)}`;
    newDb.push(modifiedStudent);
    await writeDB(StudentFilePath, newDb);
    res.send({ id: req.params.id });
  } catch (error) {
    next(error);
  }
});
