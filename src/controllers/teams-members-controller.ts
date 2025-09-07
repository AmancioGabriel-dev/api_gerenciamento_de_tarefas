import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { Request , Response , NextFunction } from "express";
import { z } from "zod"

class TeamsMembersController {
    async create(request: Request , response: Response , next: NextFunction){
        try {
            const bodySchema = z.object({
                user_email: z.string().email(),
                team_id: z.string().uuid()
            })

            const { user_email: email  , team_id: id  } = bodySchema.parse(request.body)

            const user = await prisma.user.findFirst({ where: { email } })

            if (!user) {
                throw new AppError("user not found" , 404)
            }

            const team = await prisma.team.findFirst({ where: { id }})

            if (!team) {
                throw new AppError("team not found" , 404)
            }

            await prisma.teamMember.create({
                data: {
                    user_id: user.id,
                    team_id: id
                }
            })

            return response.json({ message : `the user ${user.name} has been additioned to ${team.name}`})
        } catch (error) {
            next(error)
        }
    }

    // mostra os usuário de um único time , usar o id do time em questão
    async show(request: Request , response: Response , next: NextFunction){
        try {

            const id = z.object({
                id: z.string().uuid()
            }).parse(request.params)

            const team = await prisma.team.findFirst({ where: id })
            if (!team) {
                throw new AppError("team not found" , 404)
            }

            const team_members = await prisma.teamMember.findMany()

            return response.json(team_members)
            
            // quando terminar a primeira versão da api , trabalhar na exibição do show. Objetivo: aparecer o nome o usuário e o nome do time ao invés de aparecer o id do dois 
        } catch (error) {
            next(error)
        }
    }

    async delete(request: Request , response: Response , next: NextFunction){
        try {

            const id = z.object({
                id: z.string().uuid()
            }).parse(request.params)

            const team = await prisma.team.findFirst({ where: id })
            if (!team) {
                throw new AppError("team not found" , 404)
            }

            await prisma.teamMember.delete({ where: id})

            return response.json({ message : "user has been deleted" })
            
        } catch (error) {
            next(error)
        }
    }
}

export { TeamsMembersController }