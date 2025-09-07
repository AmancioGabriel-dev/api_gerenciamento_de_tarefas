import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { Request , Response , NextFunction } from "express";
import z from "zod";

class TeamsController {
    async create(request: Request , response: Response , next: NextFunction){
        try {
            
            const bodySchema = z.object({
                name: z.string().trim(),
                description: z.string().trim()
            })

            const { name , description } = bodySchema.parse(request.body)

            const team = await prisma.team.create({
            data: {
                name,
                description
            }  
            })

            return response.json({ message: `the team ${name} has been created`})

        } catch (error) {
            next(error)
        }
    }

    async index(request: Request , response: Response , next: NextFunction){
        try {
            const teams = await prisma.team.findMany()

            return response.json(teams)
        } catch (error) {
            next(error)
        }
    }

    async delete(request: Request , response: Response , next: NextFunction){
        try {
            
            const id = z.object({
                id: z.string().uuid()
            }).parse(request.params)

            const team = await prisma.team.findFirst({ where : id })

            if (!team) {
                throw new AppError("team not found" , 404)
            }

            await prisma.team.delete({ where : id })

            return response.json({ message : "team has been deleted" })

        } catch (error) {
            next(error)
        }
    }
}

export { TeamsController }