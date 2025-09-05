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
                password: z.string()
            })

            const { name , email , password } = bodySchema.parse(request.body)

            const hashedPassword = await hash(password , 8)

            const userWithSameEmail = prisma.user.findFirst({ where: { email }})

            if(!userWithSameEmail) {
                throw new AppError("User with the same email already exists")
            }

            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password:hashedPassword
                }
            })

            const { password: _ , ...userWithoutPassword } = user

            return response.json(userWithoutPassword)
        } catch (error) {
            next(error)   
        }
    }

}

export { UsersController }