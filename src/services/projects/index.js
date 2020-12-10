const express = require("express");
const fs = require("fs");
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
const StudentFilePath = path.join(__dirname, "../students/students.json");
const ProjectsFilePath = path.join(__dirname, "projects.json");
const ReviewsFilePath = path.join(__dirname, "reviews.json");
const ProjectPhotos = join(__dirname, "../../../public/images/projects");
// check student id
const checkStudent = async (id) => {
  const students = await readDB(StudentFilePath);
  const studentExsists = students.filter((student) => student.ID === id);
  return studentExsists.length > 0 ? false : true;
};
// get all projects
router.get("/", async (req, res, next) => {
  try {
    const projects = await readDB(ProjectsFilePath);
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
router.get("/:id", async (req, res, next) => {
  try {
    const projects = await readDB(ProjectsFilePath);
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
    check("studentID").exists().withMessage("Insert a student ID please!"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty() || (await checkStudent(req.body.studentID))) {
        const err = new Error();
        err.message = errors.errors.length > 0 || "Student ID not Correct";
        err.httpStatusCode = 400;
        next(err);
      } else {
        const projectsDB = await readDB(ProjectsFilePath);
        const newproject = {
          ...req.body,
          ID: uniqid(),
          createdAt: new Date(),
        };

        projectsDB.push(newproject);

        await writeDB(ProjectsFilePath, projectsDB);

        res.status(201).send({ id: newproject.ID });
      }
    } catch (error) {
      next(error);
    }
  }
);

//Delete project
router.delete("/:id", async (req, res, next) => {
  try {
    const projectsDB = await readDB(ProjectsFilePath);
    const newDb = projectsDB.filter((project) => project.ID !== req.params.id);
    await writeDB(ProjectsFilePath, newDb);
    res.status(204).send();
  } catch (error) {
    console.log(error);
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
    check("studentID").exists().withMessage("Insert a student ID please!"),
    check("liveUrl").exists(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty() || (await checkStudent(req.body.studentID))) {
        const err = new Error();
        err.message = errors.errors.length > 0 || "Student ID not Correct";
        err.httpStatusCode = 400;
        next(err);
      } else {
        const projectsDB = await readDB(ProjectsFilePath);
        const newDb = projectsDB.filter((project) => project.ID !== req.params.id);

        const modifiedproject = {
          ...req.body,
          ID: req.params.id,
          modifiedAt: new Date(),
        };

        newDb.push(modifiedproject);
        await writeDB(ProjectsFilePath, newDb);

        res.send({ id: modifiedproject.ID });
      }
    } catch (error) {
      next(error);
    }
  }
);

//Add Project Photos
router.post("/:id/uploadPhotos", upload.array("projectImage", 10), async (req, res, next) => {
  try {
    //saving the files to disk
    const arrayOfPromisis = req.files.map((image, key) => writeFile(join(ProjectPhotos, req.params.id + "(" + key + ")" + path.extname(image.originalname)), image.buffer));
    await Promise.all(arrayOfPromisis);

    //getting all the projects
    const projectsDB = await readDB(ProjectsFilePath);
    const newDb = projectsDB.filter((project) => project.ID !== req.params.id);
    const project = projectsDB.find((project) => project.ID === req.params.id);
    //adding image to the projects
    let modifiedproject = { ...project };
    modifiedproject.image = req.files.map((img, key) => `http://localhost:3001/images/projects/${req.params.id}(${key})${path.extname(img.originalname)}`);
    newDb.push(modifiedproject);
    await writeDB(ProjectsFilePath, newDb);
    res.send({ id: req.params.id });
  } catch (error) {
    next(error);
  }
});

// REVIEWS
//GET reviews
router.get("/:id/reviews", async (req, res, next) => {
  try {
    const reviews = await readDB(ReviewsFilePath);
    const filterReviews = reviews.filter((review) => review.projectID === req.params.id);
    res.send(filterReviews);
  } catch (error) {
    next(error);
  }
});
//POST reviews
router.post(
  "/:id/reviews",
  [
    check("name").isLength({ min: 4 }).withMessage("No way! Name too short!").exists().withMessage("Insert a name please!"),
    check("text").exists().withMessage("Insert a the comment please!"),
    check("projectID").exists.apply("Project ID missing"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const err = new Error();
        err.message = errors;
        err.httpStatusCode = 400;
        next(err);
      } else {
        const reviewsDB = await readDB(ReviewsFilePath);
        const newreview = {
          ...req.body,
          ID: uniqid(),
          createdAt: new Date(),
        };

        reviewsDB.push(newreview);

        await writeDB(ReviewsFilePath, reviewsDB);

        res.status(201).send({ id: newreview.ID });
      }
    } catch (error) {
      next(error);
    }
  }
);

//PUT reviews

router.put(
  "/:projid/reviews/:id",
  [
    check("name").isLength({ min: 4 }).withMessage("No way! Name too short!").exists().withMessage("Insert a name please!"),
    check("text").exists().withMessage("Insert a the comment please!"),
    check("projectID").exists.apply("Project ID missing"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const err = new Error();
        err.message = errors;
        err.httpStatusCode = 400;
        next(err);
      } else {
        const reviewsDB = await readDB(ReviewsFilePath);
        const newDb = reviewsDB.filter((review) => review.ID !== req.params.id);

        const modifiedReview = {
          ...req.body,
          ID: req.params.id,
          modifiedAt: new Date(),
        };

        newDb.push(modifiedReview);
        await writeDB(ReviewsFilePath, newDb);

        res.status(201).send({ id: newreview.ID });
      }
    } catch (error) {
      next(error);
    }
  }
);

//Delete reviews

router.delete("/:projid/reviews/:id/", async (req, res, next) => {
  try {
    const reviewsDB = await readDB(ReviewsFilePath);
    const newDb = reviewsDB.filter((review) => review.ID !== req.params.id);
    await writeDB(ReviewsFilePath, newDb);
    res.status(204).send();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
