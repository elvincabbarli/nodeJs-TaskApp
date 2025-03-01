import { Router } from "express";
import {
  createTask,
  deleteTask,
  getPersonalTasks,
  getTaskById,
  getTasks,
  updateTask,
} from "../controllers/taskController.js";

import { authToken } from "../middlewares/authMiddleWare.js";

const router = Router();

router.post("/createTask", authToken, createTask);
router.get("/getTasks", getTasks);
router.get("/getPersonalTasks", authToken, getPersonalTasks);
router.get("/getTask/:id", authToken, getTaskById);
router.put("/getTask/:id", authToken, updateTask);
router.delete("/getTask/:id", authToken, deleteTask);

export default router;
