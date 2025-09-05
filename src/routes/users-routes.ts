import { UsersController } from "@/controllers/users-controller";
import { Router } from "express";

const usersRoutes = Router()

export const usersController = new UsersController()

usersRoutes.post("/" , usersController.create)

export { usersRoutes }