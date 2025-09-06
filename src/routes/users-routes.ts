import { UsersController } from "@/controllers/users-controller";
import { ensureAutheticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthozation } from "@/middlewares/verifyUserAuthorization";
import { Router } from "express";

const usersRoutes = Router()

export const usersController = new UsersController()

usersRoutes.post("/" , usersController.create)
usersRoutes.get("/" , ensureAutheticated , verifyUserAuthozation(["admin"]) , usersController.index)
usersRoutes.delete("/:id" , ensureAutheticated , verifyUserAuthozation(["admin"]) , usersController.delete)

export { usersRoutes }