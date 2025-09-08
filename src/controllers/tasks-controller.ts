import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { Request , Response , NextFunction } from "express";
import { z } from "zod"

class TasksController {
    async create(request: Request , response: Response , next: NextFunction){
        try {
            
            const bodySchema = z.object({
                title: z.string().trim(),
                description: z.string().trim(),
                status: z.enum(["pending" , "in_progress" , "completed"]).default("pending"),
                priority: z.enum(["high" , "medium" , "low"]),
                assigned_to: z.string().uuid(),
                team_id: z.string().uuid(),
            })

            const { title , description , status , 
                priority , assigned_to , team_id } = bodySchema.parse(request.body)

            const user = await prisma.user.findFirst({ where: {id: assigned_to}})
            if(!user) {
                throw new AppError("user not found" , 404)
            }

            const team = await prisma.team.findFirst({ where: { id: team_id}})
            if(!team) {
                throw new AppError("team not found" , 404)
            }

            const task = await prisma.task.findFirst({ where: { title }})
            if(task) {
                throw new AppError("task already exists" , 409)
            }

            const teamMember = await prisma.teamMember.findFirst({ where: { user_id: assigned_to ,
                team_id: team_id
            }})
            if(!teamMember) {
                throw new AppError("user is not a member of the team" , 403)
            }

            await prisma.task.create({
                data:{
                    title,
                    description,
                    status,
                    priority,
                    assignedTo: assigned_to,
                    teamId: team_id
                }
            })

            return response.json({ message: `the task ${title} has been created`})

        } catch (error) {
            next(error)
        }
    }

    //mostra as todas as tarefas do time, usar o id do time 
    async index(request: Request , response: Response , next: NextFunction){
        try {
            const id = z.object({
                id: z.string().uuid()
            }).parse(request.params)

            const team = await prisma.team.findFirst({ where: id})
            if (!team) {
                throw new AppError("team not found" , 404)
            }

            const tasks = await prisma.task.findMany()

            return response.json(tasks)
        } catch (error) {
            next(error)
        }
    }

    async delete(request: Request , response: Response , next: NextFunction){
        try {
            const id = z.object({
                id: z.string().uuid()
            }).parse(request.params)

            const task = await prisma.task.findFirst({ where: id })

            if (!task) {
                throw new AppError("task not found" , 404)
            }

            await prisma.task.delete({ where: id })

            return response.json({ message: "task has been deleted"})
        } catch (error) {
            next(error)
        }
    }

    async update(request: Request , response: Response , next: NextFunction){
        try {
            const id = z.object({
                id: z.string().uuid()
            }).parse(request.params)

            const bodySchema = z.object({
                status: z.enum(["in_progress" , "completed"])
            })

            const { status } = bodySchema.parse(request.body)

            const task = await prisma.task.findFirst({ where: id })
            if (!task) {
                throw new AppError("task not found" , 404)
            }

            await prisma.task.update({
                where: {
                    id: task.id
                },
                data: {
                    status: status
                }
            })

            return response.json({ message: `message was changed for ${status}`})

        } catch (error) {
            next(error)
        }
    }
}

export { TasksController }