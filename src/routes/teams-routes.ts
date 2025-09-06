import { Router } from "express";

import { TeamsController } from "@/controllers/teams-controller";
import { ensureAutheticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthozation } from "@/middlewares/verifyUserAuthorization";

const teamsRoutes = Router()

const teamsController = new TeamsController()

teamsRoutes.post("/" , ensureAutheticated , verifyUserAuthozation(["admin"]) , teamsController.create)

export { teamsRoutes }