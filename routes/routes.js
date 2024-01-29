var express = require("express");
var router = express.Router();
var UserController = require("../controllers/UserController");
var AdminAuth = require("../middleware/AdminAuth");

//Login
router.post('/user', UserController.create);
router.get("/user" ,UserController.index);
router.get("/user/:id", UserController.findUser);
router.get("/users/:email", UserController.findByEmail);
router.put("/user",AdminAuth,UserController.edit);
router.delete("/suer/:id",AdminAuth,UserController.remove);
router.post("/recoverpassword",UserController.recoverPassword);
router.post("/changepassword",UserController.changePassword);
router.post("/login",UserController.login);


module.exports = router;  