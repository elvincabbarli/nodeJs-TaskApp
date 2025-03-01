import { Router } from "express";
import multer from "multer";
import {
  deleteUser,
  getUserById,
  getUsers,
  registerUser,
  updateUser,
  loginUser,
  getMyProfile,
  logOut,
  logOutAll,
  deletePersonalUser,
  updateMyUser,
  uploadUserProfilePicture,
  deleteUserAvatar,
  getUserPRofilePicture,
} from "../controllers/userController.js";
import { authToken } from "../middlewares/authMiddleWare.js";

const upload = multer({
  // dest: "images", qlobala yukleyende bunu silirik
  limits: {
    fileSize: 1000000, //** 1mb ölçü deməkdir bu */
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|PNG|JPG)$/)) {
      return cb(new Error("File must be JPG or PNG"));
    }

    cb(undefined, true);
  },
});
const router = Router();

router.post("/createUser", registerUser);
router.post("/login", loginUser);
router.post("/logout", authToken, logOut);
router.post("/logoutAll", authToken, logOutAll);
router.get("/users", authToken, getUsers);
router.get("/users/me", authToken, getMyProfile);
router.delete("/users/me/avatar", authToken, deleteUserAvatar);
router.post(
  "/users/avatar",
  authToken,
  upload.single("upload"),
  uploadUserProfilePicture,
  (error, req, res, next) => {
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    next();
  }
);
router.delete("/users/me", authToken, deletePersonalUser);
router.put("/users/me", authToken, updateMyUser);
router.get("/users/:id", getUserById);
router.get("/users/:id/avatar", getUserPRofilePicture);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;
