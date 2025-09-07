import { Router } from "express";
import { TeamsMembersController } from "@/controllers/teams-members-controller";
import { ensureAutheticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthozation } from "@/middlewares/verifyUserAuthorization";

const teamsMembersRoutes = Router()

const teamsMembersController = new TeamsMembersController()

teamsMembersRoutes.post("/", 
    ensureAutheticated, 
    verifyUserAuthozation(["admin"]),
    teamsMembersController.create)

teamsMembersRoutes.get("/show/:id",
    ensureAutheticated,
    verifyUserAuthozation(["admin"]),
    teamsMembersController.show)

teamsMembersRoutes.delete("/:id" ,
    ensureAutheticated,
    verifyUserAuthozation(["admin"]),
    teamsMembersController.delete
)

export { teamsMembersRoutes }