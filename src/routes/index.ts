import { Router } from "express";
import { usersRoutes } from "./users-routes";
import { sessionsRoutes } from "./sessions-routes";
import { teamsRoutes } from "./teams-routes";
import { teamsMembersRoutes } from "./teams-members";
import { tasksRoutes } from "./task-routes";


export const routes = Router()

routes.use("/users" , usersRoutes)
routes.use("/sessions" , sessionsRoutes)
routes.use("/teams" , teamsRoutes) 
routes.use("/teams-members" , teamsMembersRoutes)
routes.use("/tasks" , tasksRoutes)