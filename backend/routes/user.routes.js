const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.Controllers");

router.post("/signup", UserController.createUser);
router.post("/login", UserController.loginUser);
router.post("/logout", UserController.logoutUser);
router.get("/users", UserController.getUsers);
router.put(
  "/profile/:id",
  UserController.uploadProfileImage,
  UserController.updateProfile
);
router.delete("/user/:id", UserController.deleteUser);

module.exports = router;
