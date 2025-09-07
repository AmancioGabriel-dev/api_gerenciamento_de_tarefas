import { TasksController } from "@/controllers/tasks-controller";
import { ensureAutheticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthozation } from "@/middlewares/verifyUserAuthorization";
import { Router } from "express";

const tasksRoutes = Router()

const tasksController = new TasksController()

tasksRoutes.post("/",
    ensureAutheticated,
    verifyUserAuthozation(["admin"]),
    tasksController.create)

tasksRoutes.get("/:id",
    ensureAutheticated,
    verifyUserAuthozation(["admin"]),
    tasksController.index
)

tasksRoutes.delete("/:id",
    ensureAutheticated,
    verifyUserAuthozation(["admin"]),
    tasksController.delete
)

tasksRoutes.patch("/:id",
    ensureAutheticated,
    verifyUserAuthozation(["admin"]),
    tasksController.update
)

export { tasksRoutes }