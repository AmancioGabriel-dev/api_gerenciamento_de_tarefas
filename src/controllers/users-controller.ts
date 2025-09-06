import { prisma } from "@/database/prisma";
import { Response , Request , NextFunction } from "express";
import { z } from "zod"
import { hash } from "bcrypt"
import { AppError } from "@/utils/AppError";

class UsersController{
    async create(request: Request , response: Response , next: NextFunction){
        try {
            
            const bodySchema = z.object({
                name: z.string().min(3),
                email: z.string().email(),
                password: z.string(),
                role: z.enum(["admin", "member"]).optional()
            })

            const { name , email , password , role } = bodySchema.parse(request.body)

            const hashedPassword = await hash(password , 8)

            const userWithSameEmail = await prisma.user.findFirst({ where: { email }})

            if(userWithSameEmail) {
                throw new AppError("User with the same email already exists", 409)
            }

            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: role || "member"
                }
            })

            const { password: _ , ...userWithoutPassword } = user

            return response.json(userWithoutPassword)
        } catch (error) {
            next(error)   
        }
    }


    async index(request: Request , response: Response , next: NextFunction){
        try {
            
            const users = await prisma.user.findMany()

            return response.json(users)

        } catch (error) {
            next(error)
        }
    }

    async delete(request: Request, response: Response , next: NextFunction){
        try {
            const { id } = z.object({id: z.string().uuid()}).parse(request.params)

            await prisma.user.delete({where : { id }})

            return response.json({ message: "the user has been deleted"})

        } catch (error) {
            next(error)
        }
    }
}

export { UsersController }