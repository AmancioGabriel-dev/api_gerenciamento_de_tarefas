import { prisma } from "@/database/prisma";
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
}

export { TeamsController }